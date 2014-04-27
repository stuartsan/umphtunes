module.exports = Tune;

function Tune(opts) {
	var self = this;

	this.title = opts.title || 'Unknown Title';
	this.album = opts.album || 'Unknown Album ID';
	this.album_title = opts.album_title || 'Unknown Album';
	this.venue = opts.venue || 'Unknown Venue';

	this.audio = new Audio();
	this.audio.src = opts.url;
	this.audio.preload = opts.preload ? 'auto' : 'none';

	this.audio.onload = function() {
		console.log('loaded');
	};
	this.audio.onloadstart = function() {
		console.log('load start');
	};
	this.audio.onloadeddata = function() {
		console.log('loaded data');
	};
	this.audio.oncanplaythrough = function() {
		console.log('can play through! in theory!');
	};
	// this.audio.ontimeupdate = function() {
	// 	if ( self.audio.buffered.end && self.audio.buffered.end(0) - self.audio.currentTime < 5) {
	// 	  	console.log('whooooah we are running out of buffered song...')
	// 	}
	// }
}

Tune.prototype = {
	constructor: Tune,

	play: function() {
		this.audio.play();
		return this;
	},

	pause: function() {
		this.audio.pause();
		return this;
	},

	reset: function() {
		if (this.audio.currentTime) this.audio.currentTime = 0;
		return this;
	},

	seek: function(second) {
		if (second > this.audio.duration) {
			second = this.audio.duration;
		}
		if (second < 0) {
			second = 0;
		}
		this.audio.currentTime = second;	
	},

	download: function() {
		this.audio.preload = 'auto';
		return this;
	},

	setVol: function(n) {
		this.audio.volume = n / 100;
		return this;
	}
};