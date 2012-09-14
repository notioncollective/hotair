Crafty.c("Game", {
	_party: null,
	_enemies: [],
	init: function() {
		this.addComponent("Keyboard, PauseDisplay, Score, Lives, Levels");
		
		// set initial lives to 3
		this.setLives(3);
		this.setIncrement(100*this.getScoreMultiplier());
		
		this.bind("GameOver", function(e) {
			console.log("GAME OVER!!");
			this.saveScore();
			Crafty.scene("start");
		});
		
		// Pause handler
		this.bind('KeyDown', function(e) {
		    if(e.key == Crafty.keys['ENTER']) {
				if(!Crafty.isPaused()) {
					this.pauseGame();
				}
		    }
		    if(e.key == Crafty.keys['ESC']) {
				console.log("Full scrn");
				if(screenfull) {
					screenfull.toggle();
				}
		    }
	    });

	    this.bind('EnemyHit', function(e) {
	    	this.handleEnemyHit(e);
	    });
	    
	    this.bind('EnemyOffScreen', function(e) {
	    	this.handleEnemyOffScreen(e);
	    });
	    
	    this.bind('LevelComplete', function(e) {
	    	this.handleLevelComplete(e);
	    });
	    
	    this.bind('NextLevel', function(e) {
	    	this.handleNextLevel(e);
	    });
	},
	
	Game: function(party) {
		this.setParty(party);
	},
	
	setParty: function(party) {
		this._party = party;
	},
	
	// togglePause: function() {
	// 	console.log("pause");
	//       	Crafty.pause();
	// 	if(Crafty.isPaused()) {
	//     	this.showPauseScreenDisplay();
	//     	Crafty.audio.play('pause');
	//     	Crafty.audio.mute();
	//     	Crafty.trigger("Pause");
	// 	} else {
	//     	this.hidePauseScreenDisplay();					
	//     	Crafty.audio.play('pause');
	//     	Crafty.audio.mute();
	//     	Crafty.trigger("UnPause");
	// 	}
	// },
	
	pauseGame: function() {
		console.log("Pause game!");
		if(!Crafty.isPaused()) {
			Crafty.pause();
			var partySelectMenu = new Crafty.ListNav($('#PauseDisplay li'));
			
	    	this.showPauseScreenDisplay();
	    	Crafty.audio.play('pause');
	    	Crafty.audio.mute();
	    	Crafty.trigger("Pause");
			partySelectMenu.init();
			
			// ugh, sorry this is MESSY
			// need to figure out a better way to structure
			// the pausescreen stuff
			
			var that = this;
			
			var _resume_game = function(e) {
				e.preventDefault();
				console.log("Resume game!");
				$(document).off('click', "#pause-resume", _resume_game);
				$(document).off('click', "#pause-end-game", _new_game);
				partySelectMenu.destroy();
				self.unPauseGame();
				return false;
			}
			
			var _new_game = function(e) {
				e.preventDefault();
				console.log("New game!");
				that.unPauseGame();
				that.enemyController.stopProducing()
				Crafty.scene("start");
				return false;
			}
			
			// event handlers
			$(document).on('click', "#pause-resume", _resume_game);
			$(document).on('click', "#pause-end-game", _new_game);
		}
	},
	
	unPauseGame: function() {
		if(Crafty.isPaused()) {
			Crafty.pause();
	    	this.hidePauseScreenDisplay();					
	    	Crafty.audio.play('pause');
	    	Crafty.audio.mute();
	    	Crafty.trigger("UnPause");	
		}		
	},
	
	togglePause: function() {
		if(Crafty.isPaused()) {
			this.unPauseGame();
		} else {
			this.pauseGame();
		}
	},
	
	createEnemyController: function() {
		// var numEnemies = Crafty.Twitter.tweets.length;
		this.enemyController = new Crafty.EnemyController();
		this.enemyController.loadEnemySet(0, this.getNumEnemiesPerLevel());
		this.enemyController.setSpeed(this.getSpeed());
		console.log(this.enemyController.isProducing());
		this.enemyController.startProducing(true);
		console.log(this.enemyController.isProducing());
	},
	
	handleEnemyHit: function(e) {
		console.log("Game: handleEnemyHit");
		if (e.tweet.party == this._party) {
			this.decrementScore();
			Crafty.audio.play('hit_bad');
			this.removeLife();
			this._perfectLevel = false;
		} else {
			this.incrementScore();
			Crafty.audio.play('hit_good');
		}
	},
	
	handleEnemyOffScreen: function(e) {
		console.log("Game: handleEnemyOffScreen");
		if (e.tweet.party != this._party) {
			if(this.getScore() > 0) {
				this.decrementScore();
			} else {
				this.removeLife();
			}
			this._perfectLevel = false;
			Crafty.audio.play('hit_bad');
		} else {
			Crafty.trigger("DestroyEnemy", {enemy: e.enemy});
		}
	},
	
	handleLevelComplete: function(e) {
		console.log("handleLevelComplete");
		var that = this;
		if(this._perfectLevel) {
			// perfect level, add a life!
			Crafty.audio.play("addLife");
			this.addLife();
			Crafty.trigger("ShowMessage", {text: "Perfect Level!", callback: function() {
				that.incrementLevel();		
			}});
		} else {
			this.incrementLevel();
		}
	},
	
	handleNextLevel: function(e) {
		console.log("handleNextLevel");
		Crafty.audio.play("whoosh");
		var numEnemiesPerLevel = this.getNumEnemiesPerLevel();
		var start = (this.getLevel()-1)*2*numEnemiesPerLevel;
		this.setIncrement(100*this.getScoreMultiplier());
		this.enemyController.loadEnemySet(start, numEnemiesPerLevel);
		this.enemyController.setSpeed(this.getLevel()/1.5);
		this.enemyController.startProducing(true);
	},
	
	saveScore: function() {
		$.ajax({
			url: "/highscore",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({user: "XXX", score: this.getScore(), party: this._party}),
			success: function(resp) {
				console.log("saved high score: ", resp);
			}
		});
	}
});