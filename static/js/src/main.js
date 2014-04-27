var RandomPlaylist = require('./RandomPlaylist.js'),
	$ = require('jquery'),
	fmtTime = require('./helpers').formatTime,
	player = new RandomPlaylist();


/**
 * All DOM manipulation/interaction encapsulated below. This is like the "viewtroller".
 */

var $playPause = $('#play-pause'),
	$next = $('#next'),
	$prev = $('#prev'),
	$vol = $('#volume input'),
	$trackPos = $('#track-position input'),
	$trackCurTime = $('#track-position .current'),
	$trackEndTime = $('#track-position .end'),
	$currentTune = $('#current-tune');

/**
 * Update models via UI interaction
 */
$playPause.on('click', function() {
	player.isPlaying ? player.pause() : player.play();
});

$next.on('click', player.next.bind(player));
$prev.on('click', player.prev.bind(player));

$vol.on('input', function(e) {
	player.setVol(e.target.value);
});

$trackPos.on('input', function(e) {
	player.seek(e.target.value);
});

/**
 * Push successful model changes back to UI
 */
player.on('tuneLoad', function(tune, tuneIdx) {
	tuneIdx === 0 ? $prev.addClass('disabled') : $prev.removeClass('disabled');
	$currentTune.find('.title .val').text(tune.title);
	$currentTune.find('.show .val').text(tune.album_title);
	$trackCurTime.text(fmtTime(0));
	$vol.val(player.getVol());
});

player.on('play', function() {
	$playPause.removeClass('paused').addClass('playing');
});

player.on('pause', function() {
	$playPause.removeClass('playing').addClass('paused');
});

player.on('timeUpdate', function(tune) {
	$trackCurTime.text(fmtTime(tune.audio.currentTime));
	$trackPos.attr('max', Math.floor(tune.audio.duration));
	$trackPos.val(tune.audio.currentTime);
	$trackEndTime.text(fmtTime(Math.floor(tune.audio.duration)));
});