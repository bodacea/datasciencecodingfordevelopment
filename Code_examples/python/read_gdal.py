import gdal 
import numpy as np

dataset = gdal.Open(infile, GA_ReadOnly);
cols = dataset.RasterXSize;
rows = dataset.RasterYSize;
nbands = dataset.RasterCount;
driver = dataset.GetDriver().LongName;
geotransform = dataset.GetGeoTransform();
for b in range(1,nbands+1):
    band = dataset.GetRasterBand(b);
    bandtype = gdal.GetDataTypeName(band.DataType);
    banddata = band.ReadAsArray(0,0,band.XSize, band.YSize).astype(np.float);
