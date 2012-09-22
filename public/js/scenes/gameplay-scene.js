Crafty.scene("gameplay", function() {
	console.log("Scene: gameplay "+ this);
	
	$(document).off();
	
	Crafty.audio.play("whoosh");
	Crafty.audio.play("game_music", -1, .8);
	
	// draw some clouds	
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}
	
	// Display Entities
	var tweetDisplay = Crafty.e("TweetDisplay");
	tweetDisplay.show();
	var scoreDisplay = Crafty.e("ScoreDisplay");
	var livesDisplay = Crafty.e("LivesDisplay");
	// var levelDisplay = Crafty.e("LevelDisplay");
	var messageDisplay = Crafty.e("MessageDisplay");
	
	messageDisplay.bind("NextLevel", function(e) {
		Crafty.trigger("ShowMessage", {text: "Level "+e.level});
	});
	messageDisplay.bind("SetLevel", function(e) {
		Crafty.trigger("ShowMessage", {text: "Level "+e.level});
	});
	
	
	//HA.game = Crafty.e("Game");
	// HA.game.setParty(HA.party);
	
	
	//player entity
	var player = Crafty.e("Player")
		.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.5, 
			x: (Crafty.viewport.width / 2), y: 50, w: 80, h: 80})
		.origin("center")
		.color("#00F")
		.multiway(5, {RIGHT_ARROW: 0, LEFT_ARROW: 180});
	
	// HA.game.createEnemyController();
	
	HA.m.publish(HA.events.START_NEW_GAME);
	
}, function() {
	console.log("Scene: gameplay - uninit");
	Crafty.audio.stop("game_music");
	HA.game.enemyController.destroyAllEnemies();
	HA.game.enemyController.stopProducing();
	HA.game.destroy();
	HA.tweetDisplay.hide();
	HA.tweetDisplay.destroy();
	clearInterval(HA.enemyTimer);
});