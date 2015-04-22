#!/usr/bin/env python
"""utilities.py: datafile checking and format conversions
"""

import csv
import gdal
import json
import numpy as np
import os
import shapefile
from gdalconst import * 
from osgeo import osr, gdal
from random import randint
import matplotlib.pyplot as plt
import pandas


""" Do basic checks on any input csv file

Parameters:
fin - file containing csv format data
"""
def check_csvfile(fin):

    csvin = csv.reader(fin);
    headers = csvin.next();
    rowlens = {}
    coltxt = {}
    for row in csvin:
        rlen = len(row);
        rowlens.setdefault(rlen,0);
        rowlens[rlen] += 1;
        for col,data in enumerate(row): 
            if data != "":
                coltxt.setdefault(col,0);
                coltxt[col] += 1;

    print(rowlens);
    print(coltxt);

    fin.close();
    return();


"""Convert dataset into geotiff file

See http://gis.stackexchange.com/questions/62343/how-can-i-convert-a-ascii-file-to-geotiff-using-python

Example:

"""
def array_to_geotiff(data, xllcorner, yllcorner, cellsize, datatype, outfile):

    nbands = 1;
    xsize = len(data);
    yzise = len(data[0]);
    xtlcorner = xllcorner + xsize * cellsize;
    ytlcorner = yllcorner;
    raster = np.array(data);  #FIXIT: is this conversion needed?

    #Create output file
    #Geotransform g is an array, with: 
    #g[0] /* top left x */
    #g[1] /* w-e pixel resolution */
    #g[2] /* rotation, 0 if image is "north up" */
    #g[3] /* top left y */
    #g[4] /* rotation, 0 if image is "north up" */
    #g[5] /* n-s pixel resolution */ 
    driver = gdal.GetDriverByName("GTiff");
    dst_ds = driver.Create(outfile, xsize, ysize, nbands, gdal.GDT_Byte );
    dst_ds.SetGeoTransform( [ xtlcorner, cellsize, 0, ytlcorner, 0, cellsize ] );

    # set map projections
    srs = osr.SpatialReference();
    srs.SetWellKnownGeogCS("WGS84");
    dst_ds.SetProjection( srs.ExportToWkt() );

    # write data to output file
    dst_ds.GetRasterBand(1).WriteArray(raster);

    return();


""" Check geotiff file

Example use:
infile = "../../big_data/trees/Simard_Pinto_3DGlobalVeg_JGR.tif";
check_geotiff(infile);
"""
def check_geotiff(infile, print_line=False):
    dataset = gdal.Open(infile, GA_ReadOnly);
    cols = dataset.RasterXSize;
    rows = dataset.RasterYSize;
    nbands = dataset.RasterCount;
    driver = dataset.GetDriver().LongName;
    print("{} size: {}x{}x{}".format(driver, str(rows), str(cols), str(nbands)));
    geotransform = dataset.GetGeoTransform();
    print(geotransform);
    bx = -32768; #arbitrary big and small numbers
    bn = 32768;
    for b in range(1,nbands+1):
        band = dataset.GetRasterBand(b);
        bandtype = gdal.GetDataTypeName(band.DataType);
        print("Band {} type {}".format(b, bandtype));
        #test first line of data
        scanline = band.ReadRaster( 0, 0, band.XSize, 1,band.XSize, 1, band.DataType);
        if print_line: 
            print(scanline);
        #Get data ranges, histogram
        data = band.ReadAsArray(0,0,band.XSize, band.YSize).astype(np.float);
        mx = np.amax(data);
        mn = np.amin(data);
        bx = max(bx, mx);
        bn = min(bn, mn);
        print("range {};{}".format(mn,mx));
        hist = np.histogram(data, bins=range(int(mn)-1,int(mx)+1)); #Fails for 0/1 values
        #plt.hist(data, bins=range(int(mn),int(mx)));
        #plt.show();
    print("All bands max {} min {}".format(bx, bn));
    return(hist)


def plot_hist(inhist, method="matplotlib"):
    hist = inhist[0];
    bins = inhist[1];
    if method == "matplotlib":
        width = 0.7 * (bins[1] - bins[0])
        center = (bins[:-1] + bins[1:]) / 2
        plt.bar(center, hist, align='center', width=width)
        plt.show()
    else:
        pandas.DataFrame({'x':bins[1:],'y':hist}).plot(x='x',kind='bar');
    return()


""" convert shapefile to geojson
    
parameters:
string infile: name of shapefile (.shp)

Useful function from Martin Laloux, 
found on http://geospatialpython.com/2013/07/shapefile-to-geojson.html
"""
def shp_to_geojson(infile):
    
    # read the shapefile
    reader = shapefile.Reader(infile);
    fields = reader.fields[1:];
    field_names = [field[0] for field in fields];
    buffer = [];
    for sr in reader.shapeRecords():
        atr = dict(zip(field_names, sr.record));
        geom = sr.shape.__geo_interface__
        buffer.append(dict(type="Feature", geometry=geom, properties=atr));

    # write the GeoJSON file
    outfile = infile[:-3]+"json";
    geojson = open(outfile, "w");
    geojson.write(json.dumps({"type": "FeatureCollection",\
                             "features": buffer}, indent=2) + "\n");
    geojson.close()
    return();


""" Generate test data for landscape (10x10 grid) visualisations
"""
def generate_landscape_test():
    fout = open("landscape_test.csv", "wb");
    csvout = csv.writer(fout, quoting=csv.QUOTE_NONNUMERIC);

    csvout.writerow(["x","y","value","valuetype","landscapeid"])
    for x in range(0,9):
        for y in range(0,9):
            value = randint(0,9);
            csvout.writerow([str(x),str(y),value, "biomass", "1"]);

    fout.close();
    return();

