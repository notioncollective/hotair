$(document).ready(function() {
	
	//HotAir namespace
	HA = {
		scoreUnit: 100,
		enemyInterval: 5000,
		party: "d",
		game: null,
		player: null,
		score: 0,
		level: 1
	};
	
	console.log("Window width: "+Crafty.DOM.window.width);
	console.log("Window height: "+Crafty.DOM.window.height);
	
	Crafty.init();
	Crafty.scene("loading");

	// HA.startScreen = new Crafty.StartScreen();
	// HA.startScreen.init();
	
});