$(document).ready(function() {
	
	if (Modernizr.touch){
   	window.location = "/notsupported";
   	return;
	}
	
	HA.game.init();
	
});