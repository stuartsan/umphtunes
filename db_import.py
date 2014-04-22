import models
import json


def main():
    engine, Session = models.connect()
    session = Session()
    add_albums = []
    add_songs = []
    with open('umphscraper/data.json', 'r') as f:
        read = f.read()
        data = json.loads(read)
    for album in data:
        if not album['tracks']:
            continue
        add_albums.append(
            models.Album(
                title=album['title'],
                lineage=album['lineage'],
                venue=album['venue'],
                transferred_by=album['transferred_by'],
                taped_by=album['taped_by'],
                date=(album['date'] or None),
                source=album['source'],
                archive_org_id=album['id']
            )
        )
        for song in album['tracks']:
            add_songs.append(
                models.Song(
                    title=song['title'],
                    length=song['length'],
                    filename=song['filename'],
                    size=(song['size'] or 0),
                    album_id=album['id']
                )
            )
    session.add_all(add_albums + add_songs)
    session.commit()
    session.close()

if __name__ == '__main__':
    main()