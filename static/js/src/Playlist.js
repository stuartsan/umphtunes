var ARCHIVE_ORG_URL = require('./constants').ARCHIVE_ORG_URL;
var events = require('events');
module.exports = Playlist;
/**
 * Generic playlist constructor, inherits from Node EventEmitter
 * @constructor
 */
function Playlist() {
	events.EventEmitter.call(this);
	this.tunes = [];
	this.currentTune = null;
	this.currentIndex = 0;
	this.isPlaying = false;
	this.loop = false;
}

Playlist.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Playlist,
		enumerable: false
	}
});

/**
 * @param {(Object | Array)} tunes One or multiple tune objects
 * @returns {Array} All tune objects in playlist
 */
Playlist.prototype.addTunes =  function(tunes) {
	if (tunes === undefined) return;
	this.tunes = this.tunes.concat(tunes);
	return this.tunes;
};

/**
 * @param {Number} index
 */
Playlist.prototype.setCurrent = function(index) {
	index = index || 0;
	var self = this;
	var vol = 100;
	if (this.currentTune) {
		vol = this.getVol();
		this.currentTune.pause().reset().setVol(100);
		this.currentTune.audio.onended = null;
		this.currentTune.audio.ontimeupdate = null;
	}		
	
	this.currentTune = this.tunes[index];
	this.currentIndex = index;
	this.setVol(vol);
	this.currentTune.audio.onended = function() {
		self.next();
	};
	this.currentTune.audio.ontimeupdate = function() {
		self.emit('timeUpdate', self.currentTune);
	};
	this.emit('tuneLoad', this.currentTune, this.currentIndex);
	this.currentTune.download();
	this.isPlaying && this.play();
};

/**
 * @returns {Object} Current tune
 */
Playlist.prototype.getCurrent = function() {
	return this.currentTune;
};

/**
 * @returns {Number} Current tune index
 */
Playlist.prototype.getCurrentIndex = function() {
	return this.currentIndex;
};

Playlist.prototype.play = function() {
	this.currentTune.play();
	this.isPlaying = true;
	this.emit('play');
};

Playlist.prototype.pause = function() {
	this.currentTune.pause();
	this.isPlaying = false;
	this.emit('pause');
};

Playlist.prototype.seek = function(second) {
	this.currentTune.seek(second);
};

Playlist.prototype.next = function() {
	var cur = this.getCurrentIndex();
	if (cur === this.tunes.length - 1) {
		this.loop && this.setCurrent(0);
	}
	else {
		this.setCurrent(cur + 1);
	}
};

Playlist.prototype.prev = function() {
	var cur = this.getCurrentIndex();
	if (cur === 0) {
		this.loop && this.setCurrent(this.tunes.length - 1);
	}
	else {
		this.setCurrent(cur - 1);
	}
};

Playlist.prototype.setVol = function(n) {
	if (n > 100) n = 100;
	if (n < 0) n = 0;
	this.currentTune.setVol(n);
};

Playlist.prototype.getVol = function() {
	return this.currentTune.audio.volume * 100;
};