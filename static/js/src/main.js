var RandomPlaylist = require('./RandomPlaylist.js');
var $ = require('jquery');

var player = window.p = new RandomPlaylist(); //remove window!

var $playPause = $('#play-pause'),
	$next = $('#next'),
	$prev = $('#prev'),
	$vol = $('#volume input'),
	$trackPos = $('#track-position input'),
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
 * Push successful changes in the model back to the UI
 */
player.on('tuneLoad', function(tune, tuneIdx) {
	tuneIdx === 0 ? $prev.addClass('disabled') : $prev.removeClass('disabled');
	$currentTune.find('.title').text(tune.title);
});

player.on('play', function() {
	$playPause.removeClass('paused').addClass('playing');
	$playPause.text('playing...'); //remove
});

player.on('pause', function() {
	$playPause.removeClass('playing').addClass('paused');
	$playPause.text('paused...'); //remove
});

player.on('timeUpdate', function(tune) {
	//Set track position max...
	$trackPos.attr('max', Math.floor(tune.audio.duration));
	$trackPos.val(tune.audio.currentTime);
});