var RandomPlaylist = require('./RandomPlaylist.js'),
	$ = require('jquery'),
	dom = require('./dom');
	
var playlist = new RandomPlaylist();

var domRefs = {
	playPause: $('#play-pause'),
	next: $('#next'),
	prev: $('#prev'),
	vol: $('#volume input'),
	trackPos: $('#track-position input'),
	trackCurTime: $('#track-position .current'),
	trackEndTime: $('#track-position .end'),
	currentTune: $('#current-tune')
};

dom.attachPlaylist(playlist, domRefs);