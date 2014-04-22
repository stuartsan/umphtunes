# Download identifiers for all items in archive.org's UmphreysMcGee collection

import urllib2
import json
import pickle

# Archive.org exposes an API returning JSON so we can grab the identifiers
url = """http://archive.org/advancedsearch.php?q=UmphreysMcGee&fl%5B%5D=identifier&rows=3000&page=1&output=json&save=yes#raw"""
response_raw = urllib2.urlopen(url)
response_string = response_raw.read()
response_parsed = json.loads(response_string)

# Then just write them to a file
with open('archive_org_identifiers.txt', 'w') as f:
    ids = [item['identifier'] for item in response_parsed['response']['docs']]
    pickle.dump(ids, f)