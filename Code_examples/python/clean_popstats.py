#!/usr/bin/python
# -*- coding: utf-8 -*-
""" clean_popstats: remove extra header rows and stars from UNHCR demographics data

Sara-Jayne Terp
2015
"""

import csv

csvinfile = '../../Data_examples/UNHCR_popstats/2009_2013_popstats_PSQ_POC.csv';
csvoutfile = 'cleaned_popstats.csv';
fin = open(csvinfile, "rb");
fout = open(csvoutfile, "wb");
csvin = csv.reader(fin);
csvout = csv.writer(fout, quoting=csv.QUOTE_NONNUMERIC);

print("Headers:");
for i in range(0,6):
	header = csvin.next();
	print("Header {}".format(",".join(header)))
csvout.writerow(header);

for row in csvin:
	print("Data {}".format(",".join(row)))
	cleanedrow = ['' if value == '*'  else value for value in row]
	csvout.writerow(cleanedrow);

fin.close();
fout.close();