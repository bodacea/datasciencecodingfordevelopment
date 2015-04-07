#!/usr/bin/python
""" Read in CSV file

Sara-Jayne Terp
2015
"""

import csv

csvfilename = '../data/ebola-data-db-format.csv';
fin = open(csvfilename, "rb");
csvin = csv.reader(fin);

headers = csvin.next(); 

#Find all the rows about Liberia
for row in csvin: 
	if row[1]  == "Liberia":
		print("Liberiaaa!");
		for col in range(0,len(row)):
			print(row[col]);

fin.close();
