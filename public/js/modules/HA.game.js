// HA.game namespace
HA.game = function(ns, $, _, C) {
	
	var _options = {},
			_defaults = {},
			_level = 0,
			_party,
			_perfectLevel,
			_partySelectMenu;
	
	// private methods		
	var _init = function(options) {
		_.extend(_options, _defaults, options);
		
		HA.player.init();
		HA.mediator.init();
		_createEnemyController();
		HA.sceneManager.init();
		// TODO decide where twitter module needs to be initialized
		// HA.twitter.init();
	};
	
	var _pauseGame = function() {
		console.log("Pause game!");
		if(!C.isPaused()) {
			C.pause();
			_partySelectMenu = new C.ListNav($('#PauseDisplay li'));
			
	    _showPauseScreenDisplay();
	    C.audio.play('pause');
	    C.audio.mute();
	    C.trigger("Pause");
			_partySelectMenu.init();
			
			// event handlers
			// TODO: change to new event management system
			$(document).on('click', "#pause-resume", _handleResumeGame);
			$(document).on('click', "#pause-end-game", _handleNewGame);
		}
	};
	
	var _handleResumeGame = function(e) {
		e.preventDefault();
		console.log("Resume game!");
		
		// TODO: change to new event management system
		$(document).off('click', "#pause-resume", _handleResumeGame);
		$(document).off('click', "#pause-end-game", _handleNewGame);
		_partySelectMenu.destroy();
		_unPauseGame();
		return false;	
	};
	
	var _handleNewGame = function(e) {
		e.preventDefault();
		console.log("New game!");
		_unPauseGame();
		HA.enemyController.stopProducing();
		C.scene("start");
		return false;		
	};
	
	var _unPauseGame = function() {
		if(C.isPaused()) {
				C.pause();
	    	_hidePauseScreenDisplay();					
	    	C.audio.play('pause');
	    	C.audio.mute();
	    	C.trigger("UnPause");	
		}		
	};
	
	var _togglePause = function() {
		if(C.isPaused()) {
			_unPauseGame();
		} else {
			_pauseGame();
		}
	};
	
	var _createEnemyController = function() {
		HA.enemyController.init();
		HA.enemyController.loadEnemySet(0, _getNumEnemiesPerLevel());
		HA.enemyController.setSpeed(_getSpeed());
		console.log(HA.enemyController.isProducing());
		HA.enemyController.startProducing(true);
		console.log(HA.enemyController.isProducing());
	};
	
	var _handleEnemyHit = function(e) {
		console.log("Game: handleEnemyHit");
		if (e.tweet.party == _party) {
			_decrementScore();
			C.audio.play('hit_bad');
			_removeLife();
			_perfectLevel = false;
		} else {
			_incrementScore();
			C.audio.play('hit_good');
		}
	};
	
	var _handleEnemyOffScreen = function(e) {
		console.log("Game: handleEnemyOffScreen");
		if (e.tweet.party != _party) {
			if(_getScore() > 0) {
				_decrementScore();
			} else {
				_removeLife();
			}
			_perfectLevel = false;
			C.audio.play('hit_bad');
		} else {
			C.trigger("DestroyEnemy", {enemy: e.enemy});
		}
	};
	
	_handleLevelComplete = function(e) {
		console.log("handleLevelComplete");
		if(_perfectLevel) {
			// perfect level, add a life!
			C.audio.play("addLife");
			_addLife();
			C.trigger("ShowMessage", {text: "Perfect Level!", callback: function() {
				_incrementLevel();		
			}});
		} else {
			_incrementLevel();
		}
	};
	
	var _handleNextLevel = function(e) {
		console.log("handleNextLevel");
		C.audio.play("whoosh");
		var numEnemiesPerLevel = _getNumEnemiesPerLevel();
		var start = (_getLevel()-1)*2*numEnemiesPerLevel;
		_setIncrement(100*_getScoreMultiplier());
		HA.enemyController.loadEnemySet(start, numEnemiesPerLevel);
		HA.enemyController.setSpeed(this.getLevel()/1.5);
		HA.enemyController.startProducing(true);
	};
	
	var _saveScore = function() {
		$.ajax({
			url: "/highscore",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({user: "XXX", score: _getScore(), party: _party}),
			success: function(resp) {
				console.log("saved high score: ", resp);
			}
		});
	};
	
	// public methods
	ns.init = _init;
	ns.pauseGame = _pauseGame;
	ns.unPauseGame = _unPauseGame;
	ns.getParty = function() { return _party; };
	ns.setParty = function(p) {
		if(p == 'r' || p == 'd') {
			_party = p;
		} else {
			throw "Party must be a string containing either 'r' or 'd'";
		}
	};
	

	return ns;
	
}(HA.namespace("HA.game"), jQuery, _, Crafty);