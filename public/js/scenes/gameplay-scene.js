Crafty.scene("gameplay", function() {
	console.log("Scene: gameplay "+ this);
	HA.sm.fullScreenKeyEnabled(false);

	// TEMPORARY!
	Crafty.audio.mute();

	Crafty.audio.play("whoosh");
	Crafty.audio.play("game_music", -1, .8);

	// draw some clouds
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}

	var messageDisplay = Crafty.e("MessageDisplay");
	messageDisplay.showMessage("Loading...");

	var gameStarted = false;

	HA.m.subscribe(HA.e.TWEETS_LOADED, function() {
		if(gameStarted) return;
		var player = Crafty.e("Player")
			// .setPartySpriteTemplate('%p_avatarx2')
			.setParty(HA.player.getParty())
			.attr({ x: (Crafty.viewport.width / 2), y: 50, w: 80, h: 80})
			.origin("center")
			.oscillate({speed: 75, y_amp: 5});
		// Display Entities
		var tweetDisplay = Crafty.e("TweetDisplay");
		var scoreDisplay = Crafty.e("ScoreDisplay");
		var livesDisplay = Crafty.e("LivesDisplay");
		HA.m.publish(HA.events.START_NEW_GAME);
		gameStarted = true;
	});

	// HA.twitter.loadTweets({ startkey: 0, limit: 100, numPerSet: HA.game.getNumEnemiesPerLevel() });
	HA.twitter.loadTweets({ limit: 400, numPerSet: HA.game.getNumEnemiesPerLevel() }, true);


}, function() {
	console.log("Scene: gameplay - uninit");
	Crafty.audio.stop("game_music");

	HA.m.unsubscribe(HA.e.TWEETS_LOADED);
});