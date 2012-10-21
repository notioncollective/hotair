$(document).ready(function() {
	// disable console.log
	window.console = {
		log: function() {}
	}
	
	HA.init();
	
	if (Modernizr.touch){
   	window.location = "/notsupported";
   	return;
	}
	
	HA.game.init();
	
});