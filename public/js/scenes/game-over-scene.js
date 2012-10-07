Crafty.scene("gameover", function() {
	console.log("Scene: gameover");
	
	var isHighscore = false, // hard coded for the moment 
		gameOverDisplay, gameOverMenu, highScoreForm;
	
	gameOverDisplay = Crafty.e("GameOverDisplay");
	gameOverDisplay.showGameOverDisplay();
	
	if(isHighscore) {
		createHighScoreForm();
	} else {
		createGameOverMenu();		
	}
	
	function createHighScoreForm() {
		
		
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
		
		gameOverMenu.renderListNav();
	}
	
	
	
	
// 	
	// $("#GameOverDisplay").show();
	// var $gameOverMenu = $("#GameOverDisplay li");
	// var gameOverMenu = new Crafty.ListNav($gameOverMenu);
	// gameOverMenu.init();
	
	// event handlers
	// $(document).on('click', "#gameover-start", function(e) {
		// e.preventDefault();
		// Crafty.scene("start");
		// return false;
	// });
// 	
	// $(document).on('keydown', "#gameover-name", function(e) {
// 		
	// });
// 	
	// $(document).on('click', "#gameover-again", function(e) {
		// e.preventDefault();
		// // that.enemyController.stopProducing();
		// // that.enemyController.destroyAllEnemies();
		// Crafty.scene("gameplay");
		// return false;
	// });
// 	
// 	
	// $(document).on("click", "#SaveHighscore", function(e) {
		// var name = $('#gameover-name').val();
		// HA.game.saveScore(name);
		// $("#NewHighscore").hide();
		// $("#GameOverOptions").show();
	// });
	//
	
	// var demY = Crafty.DOM.window.height/2;
	// var dem = Crafty.e("Button").text("Play Again").attr({
			// y: demY,
			// callback: function() {
				// Crafty.scene("start");
			// }
		// });
}, function() {
	$("#GameOverDisplay").hide();
});
