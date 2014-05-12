from models import Album, Song, Image, connect
from  sqlalchemy.sql.expression import func
from flask import Flask, render_template, jsonify, url_for

app = Flask(__name__, static_url_path='')

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/random')
def get_random_tunes():
    engine, Session = connect()
    session = Session()
    # Get some random albums
    songs = session.query(Song).order_by(func.random()).limit(10).all()
    res = {"data": [song.to_dict() for song in songs]}
    res = {"data":[]}
    for song in songs:
        s = song.to_dict()
        s['album_title'] = song.album.title
        s['venue'] = song.album.venue
        res['data'].append(s)
    session.close()
    return jsonify(res)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

#Search for song titles containing some string
# search_for = "africa"
# y = session.query(Song.title).filter(Song.title.match(search_for)).all()
# print y
