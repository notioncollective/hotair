/**
 * Handles gameplay, including levels, game pause/unpause, and initializing other HA modules.
 * @class game
 */

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
		HA.enemyController.init();
		HA.sceneManager.init();
		// TODO decide where twitter module needs to be initialized
		// HA.twitter.init();
		
		// Load the first scene
		C.init();
		HA.sceneManager.loadScene("loading");
	};
	
	/**
    Pause gameplay (hooks into `Crafty.pause()`).
		@private
    @method _pauseGame
   */
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
	
	/**
    Handles the "resume game" selection from the pause screen.
		@private
    @method _handleResumeGame
		@param {Object} e Event object.
   */
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
	
	/**
    Handles the "new game" event from the pause screen.
		@private
    @method _handleNewGame
		@param {Object} e Event object.
   */
	var _handleNewGame = function(e) {
		e.preventDefault();
		console.log("New game!");
		_unPauseGame();
		HA.enemyController.stopProducing();
		C.scene("start");
		return false;		
	};
	
	/**
    UnPause gameplay (hooks into `Crafty.pause()`).
		@private
    @method _unPauseGame
   */
	var _unPauseGame = function() {
		if(C.isPaused()) {
				C.pause();
	    	_hidePauseScreenDisplay();					
	    	C.audio.play('pause');
	    	C.audio.mute();
	    	C.trigger("UnPause");	
		}		
	};
	
	/**
    Toggle pause/unpause (hooks into `Crafty.pause()`).
		@private
    @method _togglePause
   */	
	var _togglePause = function() {
		if(C.isPaused()) {
			_unPauseGame();
		} else {
			_pauseGame();
		}
	};

	/**
    Initialize `HA.enemyController` module.
		@private
    @method _createEnemyController
   */	
	var _createEnemyController = function() {
		HA.enemyController.loadEnemySet(0, _getNumEnemiesPerLevel());
		HA.enemyController.setSpeed(_getSpeed());
		console.log(HA.enemyController.isProducing());
		HA.enemyController.startProducing(true);
		console.log(HA.enemyController.isProducing());
	};

	/**
    Handle enemy hit event.
		@private
    @method _handleEnemyHit
		@param {Object} e Event object.
   */	
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

	/**
    Handle event when an enemy goes offscreen.
		@private
    @method _handleEnemyOffScreen
		@param {Object} e Event object.
   */	
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
	
	/**
    Handle level complete event.
		@private
    @method _handleLevelComplete
		@param {Object} e Event object.
   */
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

	/**
    Handle next level event.
		@private
    @method _handleNextLevel
		@param {Object} e Event object.
   */	
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
	
	/**
    Save score to high scores in database.
		@private
    @method _saveScore
   */
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
	
	/**
    Initializer.
		@public
    @method init
   */
	ns.init = _init;
	
	/**
    Pause gameplay.
		@public
    @method pauseGame
   */
	ns.pauseGame = _pauseGame;
	
	/**
    UnPause gameplay.
		@public
    @method unPauseGame
   */
	ns.unPauseGame = _unPauseGame;
	
	/**
    UnPause gameplay.
		@public
    @method getParty
   */
	ns.getParty = function() { return _party; };

	/**
    UnPause gameplay.
		@public
    @method setParty
		@param {String} p String representing party affiliation ('r' or 'd')
   */
	ns.setParty = function(p) {
		if(p == 'r' || p == 'd') {
			_party = p;
		} else {
			throw "Party must be a string containing either 'r' or 'd'";
		}
	};

	return ns;
	
}(HA.namespace("HA.game"), jQuery, _, Crafty);