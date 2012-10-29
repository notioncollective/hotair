Crafty.scene("gameover", function() {
	console.log("Scene: gameover");
	
		// draw some clouds	
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}
	
	var 
		// score = 2300,
		score = HA.player.getScore(),
		noInitials = "???",
		// isHighscore = HA.game.isHighScore(score), // hard coded for the moment 
		gameOverDisplay, 
		gameOverMenu, 
		highScoreForm,
		messageDisplay = Crafty.e("MessageDisplay");

	
	gameOverDisplay = Crafty.e("GameOverDisplay");
	gameOverDisplay.showGameOverDisplay();
	
	HA.m.subscribe(HA.e.SCORE_SAVED_TO_DB, handleScoreSavedEvent);
	HA.m.subscribe(HA.e.SAVE_SCORE, handleSavingScoreEvent)
	
	// the check endpoint tells you how many scores are higher
	// than yours for each score interval
	
	if(score > 0) {
		$.getJSON('/highscores/check/'+score, function(resp) {
			console.log("highscore check returned fetched", resp);
			
			// goes through the highscore types in order and
			// checks to see if you have one
			var resp = resp,
					score_checks = ['all-time', 'daily'],
					showHighScoreForm,
					isHigh;
							
			showHighScoreForm = _.any(score_checks, function(interval) {
				console.log("checking score against interval", interval, score, resp[interval]);
				isHigh = (!_.isUndefined(resp[interval]) && resp[interval] < 5);
				if(isHigh) createHighScoreForm(interval);
				return isHigh;
			});
			
			console.log("showHighScoreForm", showHighScoreForm);
			
			if(!showHighScoreForm && score > 0) {
				HA.m.publish(HA.e.SAVE_SCORE, [noInitials, score]);
				createGameOverMenu();
			}
		});
	} else createGameOverMenu();
	
	// HA.game.fetchHighScores(function() {
			// console.log("Fetched high scores");
			// if(HA.game.isHighScore(score)) {
				// console.log("High score! ", score);
				// createHighScoreForm();
			// } else {
				// console.log("Not high score");
				// if(score > 0) HA.m.publish(HA.e.SAVE_SCORE, [noInitials, score]);
				// createGameOverMenu();		
			// }
	// }, this)

	function createHighScoreForm(interval) {
		highScoreFormMenu = Crafty.e("ListNav")
			.attr({wrappingId: "HighScoreFormNav"});
			
		highScoreFormMenu.addListItem({
			text: 'Ok!',
			callback: function() {
				var initials = $("#gameover-name").val() || noInitials; 
				HA.m.publish(HA.e.SAVE_SCORE, [initials, score]);
				highScoreForm.destroy();
				createGameOverMenu();
				messageDisplay.flashMessage("Saving score of "+score);
				this.destroy();
			}
		});
		
		highScoreFormMenu.renderListNav();

		highScoreForm = Crafty.e("HighScoreFormDisplay");
		highScoreForm.updateContent({score:score, type:interval});
		highScoreForm.showHighScoreFormDisplay();
		$("#gameover-name").focus();
	}
	
	
	function createGameOverMenu() {
		gameOverMenu = Crafty.e("ListNav")
			.attr({wrappingId: "GameOverNav"});
				
		gameOverMenu.addListItem({
			text: "Play Again!",
			callback: function(arg) {
				HA.m.publish(HA.events.LOAD_SCENE, ["gameplay"]);
				this.destroy();
			}
		});
		
		gameOverMenu.addListItem({
			text: "Start Screen",
			callback: function(arg) {
				HA.m.publish(HA.events.LOAD_SCENE, ["start"]);
				this.destroy();
			}
		});
		
		
		gameOverMenu.renderListNav();
	}
	
	function handleScoreSavedEvent(e, resp) {
		console.log("Handle score saved in gameover scene", resp);
	  gameOverMenu.addListItem({
      text: "Share",
      callback: function(arg) {
        window.open('/score/'+resp.id, '_blank');
      }
    });
		gameOverMenu.renderListNav();    
   }

	function handleSavingScoreEvent(e, initials, score) {
			// messageDisplay.flashMessage("Saving score of "+score);
	}
	
}, function() {
	$("#GameOverDisplay").hide();
});
