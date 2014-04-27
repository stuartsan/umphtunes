exports.formatTime = function(seconds) {
	var date = new Date(0);
	date.setSeconds(seconds);
	var mins = date.getMinutes();
	var secs = date.getSeconds();	
	return [mins < 10 ? '0' + mins : mins, ':', 
			secs < 10 ? '0' + secs : secs].join('');
};