from sqlalchemy import Column, Integer, String, Date, ForeignKey, \
    Sequence, create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from collections import OrderedDict

Base = declarative_base()

class Album(Base):
    __tablename__ = 'albums'
    title = Column(String)
    date = Column(Date)
    venue = Column(String)
    archive_org_id = Column(String, primary_key=True)
    location = Column(String)
    source = Column(String)
    lineage = Column(String)
    taped_by = Column(String)
    transferred_by = Column(String)
    def to_dict(self):
        d = {}
        d['title'] = self.title
        d['venue'] = self.venue
        d['archive_org_id'] = self.archive_org_id
        return d

class Song(Base):
    __tablename__ = 'songs'
    id = Column(Integer, Sequence('some_id_seq'), primary_key=True)
    title = Column(String)
    length = Column(String)
    filename = Column(String)
    size = Column(Integer)
    album_id = Column(String, ForeignKey('albums.archive_org_id'))
    album = relationship('Album', backref=backref('songs'))
    def to_dict(self):
        d = {}
        d['title'] = self.title
        d['filename'] = self.filename
        d['album_id'] = self.album_id
        return d

class Image(Base):
    __tablename__ = 'images'
    filename = Column(String)
    id = Column(Integer, Sequence('some_id_seq'), primary_key=True)
    size = Column(Integer)
    album_id = Column(String, ForeignKey('albums.archive_org_id'))

def add_tables(base, engine):
    base.metadata.create_all(engine)

def connect():
    engine = create_engine('postgresql://ss@localhost/umphtest')
    Session = scoped_session(sessionmaker(bind=engine))
    return engine, Session