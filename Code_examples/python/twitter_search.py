#!/usr/bin/env python
""" Simple Twitter tools

Expects to find a file, ../../../secrets.txt, with a row containing twitter,overcognition,keys 
where keys is from Twitter: 
consumer_key,consumer_secret,oauth_token,oauth_token_secret

Lots learnt from http://nbviewer.ipython.org/github/chdoig/Mining-the-Social-Web-2nd-Edition/blob/master/ipynb/Chapter%201%20-%20Mining%20Twitter.ipynb

Sara-Jayne Terp
2014
"""

import twitter #https://pypi.python.org/pypi/twitter
import yweather  #Yahoo weather feed
import csv


#Set up twitter search API for queries
def get_twitterapi(secfile = "../../../secrets.csv"):
	fin = open(secfile, "rb");
	csvin = csv.reader(fin);

	for row in csvin: 
		if row[0].lower() == "twitterapi" and row[1].lower() == "overcognition":
			secrets = row[2].split(",");
			CONSUMER_KEY = secrets[0];
			CONSUMER_SECRET = secrets[1];
			OAUTH_TOKEN = secrets[2];
			OAUTH_TOKEN_SECRET = secrets[3];
			break;
	fin.close();

	auth = twitter.oauth.OAuth(OAUTH_TOKEN, OAUTH_TOKEN_SECRET,CONSUMER_KEY, CONSUMER_SECRET);
	twitter_api = twitter.Twitter(auth=auth);

	return(twitter_api)

""" get trends

See https://dev.twitter.com/docs/api/1.1/get/trends/place for twitter api call
See https://dev.twitter.com/overview/api/places for call parameters
See ? for list of place codes (woeids). Example country woeids are: 

World 1
USA 23424977
UK  23424975
Kenya 23424863
Tanzania 23424973 - not supported by twitter
Yemen 23425002 - not supported by twitter

See https://blog.twitter.com/2010/woeids-twitters-trends and 
https://developer.yahoo.com/geo/geoplanet/guide/concepts.html for more about woeids

Woeid lookup here: http://woeid.rosselliot.co.nz/lookup/tanzania
OR can do this from python using yweather: http://stackoverflow.com/questions/22927307/how-to-find-woeid-where-on-earth-id-of-a-country
Note about twitter availability: https://moebiuscurve.wordpress.com/2014/10/08/twitter-woeid-available-trends/
Question about which geolocations Twitter uses for this search: http://stackoverflow.com/questions/28944536/geolocation-information-for-twitter-api-trends-available
"""
def get_trend(ta, woeid=1):
	place_trends = ta.trends.place(_id=woeid)
	return(place_trends)


""" Get Where On Earth id for a named place (e.g. Australia)
"""
def get_woeid(placename):
	client = yweather.Client()
	client.fetch_woeid(placename)
	return(woeid)


""" Try this thing out
"""

ta = get_twitterapi();

mytimeline = ta.statuses.home_timeline();
fematimeline = ta.statuses.user_timeline(screen_name="fema");

""" Other things you can do:
ta.statuses.update(status="I just posted from Python!");
ta.direct_messages.new(user=myfriendsname, text=mytextmessage);

See https://pypi.python.org/pypi/twitter for more suggestions
Twitter library documentation is at http://mike.verdone.ca/twitter/
"""

