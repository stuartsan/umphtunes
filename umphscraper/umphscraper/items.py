from scrapy.item import Item, Field

class Show(Item):
    title = Field()
    date = Field()
    venue = Field()
    id = Field()
    location = Field()
    source = Field()
    lineage = Field()
    taped_by = Field()
    transferred_by = Field()
    tracks = Field()
    images = Field()