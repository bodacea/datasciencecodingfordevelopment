alist = [1,2,3,4]
for item in enumerate(alist):
	print(item)
for index, item in enumerate(alist):
	print(item)

iso3166 = {
    'SLE': 'Sierra Leone', \
    'NGA': 'Nigeria', \
    'LBR': 'Liberia' }
for code in iso3166:
	print('the code for {} is {}'.format(iso3166[code], code))

