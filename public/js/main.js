$(document).ready(function() {
	HA.init();
	
	if (Modernizr.touch){
   	window.location = "/notsupported";
   	return;
	}
	HA.game.init();
	
});