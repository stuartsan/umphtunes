/**
 * DOM interaction goes here.
 */

var fmtTime = require('./helpers').formatTime;

/**
 * Attaches a playlist to a playlist UI.
 */
exports.attachPlaylist = function(playlist, opts) {
	var $playPause = opts.playPause,
		$next = opts.next,
		$prev = opts.prev,
		$vol = opts.vol,
		$trackPos = opts.trackPos,
		$trackCurTime = opts.trackCurTime,
		$trackEndTime = opts.trackEndTime,
		$currentTune = opts.currentTune;

	/**
	 * Update models via UI interaction
	 */
	$playPause.on('click', function() {
		playlist.isPlaying ? playlist.pause() : playlist.play();
	});

	$next.on('click', playlist.next.bind(playlist));
	$prev.on('click', playlist.prev.bind(playlist));

	$vol.on('input', function(e) {
		playlist.setVol(e.target.value);
	});

	$trackPos.on('input', function(e) {
		playlist.seek(e.target.value);
	});

	/**
	 * Push successful model changes back to UI
	 */
	playlist.on('tuneLoad', function(tune, tuneIdx) {
		tuneIdx === 0 ? $prev.addClass('disabled') : $prev.removeClass('disabled');
		$currentTune.find('.title .val').text(tune.title);
		$currentTune.find('.show .val').text(tune.album_title);
		$trackCurTime.text(fmtTime(0));
		$vol.val(playlist.getVol());
	});

	playlist.on('play', function() {
		$playPause.removeClass('paused').addClass('playing');
	});

	playlist.on('pause', function() {
		$playPause.removeClass('playing').addClass('paused');
	});

	playlist.on('timeUpdate', function(tune) {
		$trackCurTime.text(fmtTime(tune.audio.currentTime));
		$trackPos.attr('max', Math.floor(tune.audio.duration));
		$trackPos.val(tune.audio.currentTime);
		$trackEndTime.text(fmtTime(Math.floor(tune.audio.duration)));
	});	
};