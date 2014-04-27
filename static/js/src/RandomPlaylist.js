var Playlist = require('./Playlist.js');
var Tune = require('./Tune.js');
var $ = require('jquery');
var ARCHIVE_ORG_URL = require('./constants.js').ARCHIVE_ORG_URL;
module.exports = RandomPlaylist;

/**
 * Playlist of random tunes periodically loaded from the server
 * @constructor
 */
function RandomPlaylist(){
	Playlist.call(this);
	this.init();
}


RandomPlaylist.prototype = Object.create(Playlist.prototype);
RandomPlaylist.prototype.constructor = RandomPlaylist;

/**
 * Hit the server and add some random tunes to playlist
 */
RandomPlaylist.prototype.loadTunes = function(callback) {
	var self = this;
	$.ajax({
		url: '/random',
		dataType: 'json',
		success: function(res) {
			var randomTunes = res.data.map(function(tune) {
				return new Tune({
					url: [ARCHIVE_ORG_URL, tune.album_id, tune.filename].join('/'),
					title: tune.title,
					album: tune.album_id,
					album_title: tune.album_title.replace(/^umphrey'?s mcgee ?/i, '')
				});
			});
			self.addTunes(randomTunes);
			callback && callback();
		}
	});
};

/**
 * Initialize playlist: load random tunes and set current tune index to 0
 */
RandomPlaylist.prototype.init = function() {
	this.loadTunes(this.setCurrent.bind(this));
};

/**
 * When current tune is set, make sure there are a suitable number of
 * upcoming tracks. If not, grab more.
 */
RandomPlaylist.prototype.setCurrent = function(index) {
	Playlist.prototype.setCurrent.call(this, index);
	if (this.tunes.length - this.getCurrentIndex() < 6) {
		this.loadTunes();
	}
};
