Crafty.scene("gameover", function() {
	console.log("Scene: gameover");
	HA.sm.fullScreenKeyEnabled(false);
	
	var 
		score = 2300,
		// score = HA.player.getScore(),
		isHighscore = HA.game.isHighScore(score), // hard coded for the moment 
		gameOverDisplay, 
		gameOverMenu, 
		highScoreForm;
	
	gameOverDisplay = Crafty.e("GameOverDisplay");
	gameOverDisplay.showGameOverDisplay();
	
	if(isHighscore) {
		createHighScoreForm();
	} else {
		createGameOverMenu();		
	}
	
	function createHighScoreForm() {
		highScoreFormMenu = Crafty.e("ListNav")
			.attr({wrappingId: "HighScoreFormNav"});
			
		highScoreFormMenu.addListItem({
			text: 'Ok!',
			callback: function() {
				var initials = $("#gameover-name").val() || "N/A"; 
				HA.m.publish(HA.e.SAVE_SCORE, [initials, score]);
				highScoreForm.destroy();
				createGameOverMenu();
				this.destroy();
			}
		});
		
		highScoreFormMenu.renderListNav();

		highScoreForm = Crafty.e("HighScoreFormDisplay");
		highScoreForm.updateContent({score:score});
		highScoreForm.showHighScoreFormDisplay();
		$("#gameover-name").focus();
	}
	
	
	function createGameOverMenu() {
		gameOverMenu = Crafty.e("ListNav")
			.attr({wrappingId: "GameOverNav"});
				
		gameOverMenu.addListItem({
			text: "Start Screen",
			callback: function(arg) {
				HA.m.publish(HA.events.LOAD_SCENE, ["start"]);
				this.destroy();
			}
		});
		
		gameOverMenu.addListItem({
			text: "Play Again!",
			callback: function(arg) {
				HA.m.publish(HA.events.LOAD_SCENE, ["gameplay"]);
				this.destroy();
			}
		});
		
	  gameOverMenu.addListItem({
      text: "Give us Feedback!",
      callback: function(arg) {
        window.open('/survey', '_blank');
      }
    });
		
		gameOverMenu.renderListNav();
	}
	
	
	
}, function() {
	$("#GameOverDisplay").hide();
});
