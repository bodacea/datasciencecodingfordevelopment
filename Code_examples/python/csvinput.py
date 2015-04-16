#!/usr/bin/python
""" Read in CSV file

Sara-Jayne Terp
2015
"""

import csv


csvfilename = '../../Data_examples/ebola-data-db-format.csv';
fin = open(csvfilename, "rb");
csvin = csv.reader(fin);

print("Headers:");
headers = csvin.next(); 

for header in headers:
	print(header);

for row in csvin: 
	print("New row:");
	for col in range(0,len(row)):
		print(row[col]);

fin.close();
