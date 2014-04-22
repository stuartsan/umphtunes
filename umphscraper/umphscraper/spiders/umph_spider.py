import pickle
from scrapy.spider import Spider
from scrapy.selector import Selector
from scrapy.http import Request
from umphscraper.items import Show

ARCHIVE_ORG_URL = "https://archive.org"
ARCHIVE_ORG_DOMAIN = "archive.org"

def ext_str(lst):
	"""Extracts string from 0 or 1 item list"""
	return lst.extract()[0] if len(lst) else ""

class UmphSpider(Spider):
    name = "umphspider"
    allowed_domains = [ARCHIVE_ORG_DOMAIN]

    def __init__(self):
        with open("archive_org_identifiers.txt") as f:
            identifiers = pickle.load(f)
        print identifiers
        self.start_urls = [ARCHIVE_ORG_URL + "/details/" + url for url in identifiers]

    def parse(self, response):
        sel = Selector(response)
        item = Show()
        # Extract url for xml file containing data about files attached to show
        files_xml_url = ext_str(sel.xpath("//*[@id='ff5']//tbody//tr//a[contains(@href, 'files.xml')]/@href"))
        # And url for xml file containing show metadata
        meta_xml_url = ext_str(sel.xpath("//*[@id='ff5']//tbody//tr//a[contains(@href, 'meta.xml')]/@href"))
        request = Request(ARCHIVE_ORG_URL+files_xml_url,
        				  callback=self.parse_files)
        # Pass some stuff through to subsequent parse fns
        request.meta['item'] = item
        request.meta['meta_xml_url'] = meta_xml_url
        return request

    def parse_files(self, response):
    	sel = Selector(response)
    	# Collect our passed through items
    	item = response.meta['item']
    	meta_xml_url = response.meta['meta_xml_url']
    	# Grab the tracks of format == MP3. Includes VBR and others
    	tracks_sel = sel.xpath('//file[format[text()[contains(., "MP3")]]]')
    	tracks = []
    	for track in tracks_sel:
    		t = {}
    		t['title'] = ext_str(track.xpath('title/text()'))
    		t['filename'] = ext_str(track.xpath('@name'))
    		t['size'] = ext_str(track.xpath('size/text()'))
    		t['length'] = ext_str(track.xpath('length/text()'))
    		tracks.append(t)
    	item['tracks'] = tracks
    	# Selection includes full versions and thumbs
    	images_sel = sel.xpath('//file[format[text()[contains(., "JPEG")]]]')
    	images = []
    	for image in images_sel:
    		i = {}
    		i['size'] = ext_str(image.xpath('size/text()'))
    		i['filename'] = ext_str(image.xpath('@name'))
    		images.append(i)
    	item['images'] = images
    	# Fire off request to get show's meta info
    	request = Request(ARCHIVE_ORG_URL+meta_xml_url,
        				  callback=self.parse_meta)
    	request.meta['item'] = item
    	return request

    def parse_meta(self, response):
    	sel = Selector(response)
    	item = response.meta['item']
        item['id'] = ext_str(sel.xpath('//metadata/identifier/text()'))
    	item['title'] = ext_str(sel.xpath('//metadata/title/text()'))
    	item['date'] = ext_str(sel.xpath('//metadata/date/text()'))
    	item['venue'] = ext_str(sel.xpath('//metadata/venue/text()'))
    	item['location'] = ext_str(sel.xpath('//metadata/coverage/text()'))
    	item['taped_by'] = ext_str(sel.xpath('//metadata/taper/text()'))
    	item['transferred_by'] = ext_str(sel.xpath('//metadata/transferer/text()'))
    	item['source'] = ext_str(sel.xpath('//metadata/source/text()'))
    	item['lineage'] = ext_str(sel.xpath('//metadata/lineage/text()'))
    	# Finally return the item itself
    	return item