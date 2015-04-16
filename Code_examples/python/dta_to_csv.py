"""dta_to_csv: Convert Stata format file into csv

Sara-Jayne Terp
2015
"""

import pandas as pd
import csv

datafile = raw_input("Stata filename (.dat file) >")
summaryfile = datafile[:-4] + "_summary.csv";
fsummary = open(summaryfile, "wb");
csvsummary = csv.writer(fsummary, quoting=csv.QUOTE_NONNUMERIC);

csvsummary.writerow(['Variable name', 'Example value', 'Unique values']);
df = pd.read_stata(datafile)
df.to_csv(datafile[:-4]+'.csv')
for k in df.keys():
	print("{}, {}, {}".format(k, df[k][1], df[k].unique()))
	csvsummary.writerow([k, df[k][1], df[k].unique()]);

df.describe()
fsummary.close()
