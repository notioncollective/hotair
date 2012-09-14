Crafty.scene("gameplay", function() {
	console.log("Scene: gameplay "+ this);
	Crafty.background('rgb(140, 208, 255)');
	
	$(document).off();
	
	Crafty.audio.play("whoosh");
	Crafty.audio.stop("start_music");
	Crafty.audio.play("game_music", -1, .8);
	
	// draw some clouds	
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}
	
	// Display Entities
	HA.tweetDisplay = Crafty.e("TweetDisplay");
	HA.tweetDisplay.show();
	var scoreDisplay = Crafty.e("ScoreDisplay");
	var livesDisplay = Crafty.e("LivesDisplay");
	var levelDisplay = Crafty.e("LevelDisplay");
	
	
	HA.game = Crafty.e("Game");
	HA.game.setParty(HA.party);
	
	
	//player entity
	var player = HA.player = Crafty.e("Player")
		.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.5, 
			x: (Crafty.viewport.width / 2), y: 50, w: 80, h: 80, score: 0})
		.origin("center")
		.color("#00F")
		.multiway(5, {RIGHT_ARROW: 0, LEFT_ARROW: 180});
	
	
	HA.game.createEnemyController();
	
	//load enemies
	// var numEnemies = Crafty.Twitter.tweets.length;
	// HA.enemies = enemyFactory = new Crafty.EnemyFactory(numEnemies);
	// console.log(enemyFactory.isProducing());
	// enemyFactory.startFactory(true);
	// console.log(enemyFactory.isProducing());
	
	console.log("End Scene Creation : gameplay");
	
}, function() {
	console.log("Scene: gameplay - uninit");
	Crafty.audio.stop("game_music");
	HA.game.enemyController.destroyAllEnemies();
	HA.game.destroy();
	HA.tweetDisplay.hide();
	HA.tweetDisplay.destroy();
	clearInterval(HA.enemyTimer);
});