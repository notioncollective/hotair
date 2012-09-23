/**
 * Handles gameplay, including levels, game pause/unpause, and initializing other HA modules.
 * @class game
 */

HA.game = function(ns, $, _, C) {

	var _options = {},
			_defaults = {},
			_scoreIncrement = 100,
			_level = 0,
			_party,
			_perfectLevel,
			_numEnemiesPerLevel = 2,
			_partySelectMenu;

	// private methods
	function _init(options) {
		options = options || {};
		_.extend(_options, _defaults, options);

		HA.player.init();
		HA.mediator.init();
		HA.enemyController.init();
		HA.sceneManager.init();
		
		// TODO decide where twitter module needs to be initialized
		HA.twitter.init({
			test : true
		});

		// Set up initial event subscriptions
		HA.m.subscribe(HA.events.GAME_LOADED, _handleGameLoadedEvent);
		HA.m.subscribe(HA.events.START_NEW_GAME, _handleStartNewGameEvent);
		HA.m.subscribe(HA.events.GAME_OVER, _handleGameOverEvent);
		HA.m.subscribe(HA.events.PAUSE_GAME, _handlePauseGameEvent);
		HA.m.subscribe(HA.events.RESUME_GAME, _handleResumeGameEvent);
		HA.m.subscribe(HA.events.LEVEL_COMPLETE, _handleLevelCompleteEvent);
		HA.m.subscribe(HA.events.NEXT_LEVEL, _handleNextLevelEvent);
		
		HA.m.subscribe(HA.e.ENEMY_HIT_START, _handleEnemyHitStartEvent);
		HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_START, _handleEnemyOffScreenStartEvent);
		// HA.m.subscribe(HA.e.ENEMY_DESTROYED, _handleEnemyDestroyedEvent);

		// Initialize Crafty
		C.init();
		// Load the first scene
		HA.m.publish(HA.events.LOAD_SCENE, ["loading"]);

	};
	
	
	/***** EVENT HANDLERS *****/

	/**
	 * Handles GAME_LOADED event, after Crafty assets are loaded.
	 * @private
	 * @method _handleGameLoadedEvent
	 * @param {object} e
	 */
	function _handleGameLoadedEvent(e) {
		console.log("_handleGameLoaded");
		HA.sceneManager.loadScene("start");
	}

	/**
	 * Handles START_NEW_GAME event.
	 * @private
	 * @method _handleStartNewGameEvent
	 * @param {object} e
	 */
	function _handleStartNewGameEvent(e) {
		_setLevel(1);
	}
	
	/**
	 * Handles GAME_OVER event.
	 * @private
	 * @method _handleGameOverEvent
	 * @param {object} e
	 */
	function _handleGameOverEvent(e) {
		// TODO: Possibly perform extra cleanup here, maybe clear out the mediator?
		HA.m.publish(HA.e.LOAD_SCENE, "gameover");
	}


	/**
	 Pause gameplay (hooks into `Crafty.pause()`).
	 @private
	 @method _handlePauseGameEvent
	 */
	function _handlePauseGameEvent(e) {
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
			$(document).on('click', "#pause-resume", _handleResumeGameEvent);
			$(document).on('click', "#pause-end-game", _handleNewGameEvent);
		}
	};

	/**
	 Handles the "resume game" selection from the pause screen.
	 @private
	 @method _handleResumeGame
	 @param {Object} e Event object.
	 */
	function _handleResumeGameEvent(e) {
		e.preventDefault();
		console.log("Resume game!");

		// TODO: change to new event management system
		$(document).off('click', "#pause-resume", _handleResumeGameEvent);
		$(document).off('click', "#pause-end-game", _handleResumeGameEvent);
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
	function _handleNewGameEvent(e) {
		e.preventDefault();
		console.log("New game!");
		_unPauseGame();
		HA.enemyController.stopProducing();
		C.scene("start");
		return false;
	};

	/**
	 Handle enemy hit start event.  Here is where we calculate the score/life updates.
	 @private
	 @method _handleEnemyHitStartEvent
	 @param {object} e Event object.
	 @param {object} enemy The related enemy entity.
	 */
	function _handleEnemyHitStartEvent(e, enemy) {
		if(enemy.hit) return;
		console.log("Enemy: ", enemy);
		console.log("Game: handleEnemyHitStart", enemy.tweet.party, HA.player.getParty());
		var scoreInc = _getScoreIncrement();
		if(enemy.tweet.party == HA.player.getParty()) {
			// _decrementScore();
			scoreInc = -scoreInc;
			HA.player.addToScore(scoreInc);
			C.audio.play('hit_bad');
			HA.player.decrementLives();
			_perfectLevel = false;
		} else {
			// _incrementScore();
			HA.player.addToScore(scoreInc);
			C.audio.play('hit_good');
		}
		HA.m.publish(HA.e.ENEMY_HIT_COMPLETE, [enemy, scoreInc]);
	};

	/**
	 Handle event when an enemy goes offscreen.
	 @private
	 @method _handleEnemyOffStartScreen
	 @param {Object} e Event object.
	 @param {object} enemy The related enemy entity.
	 */
	function _handleEnemyOffScreenStartEvent(e, enemy) {
		console.log("Game: handleEnemyOffScreenStart", enemy.hit);
		// if(enemy.hit) return;
		var scoreInc = _getScoreIncrement(), whoops = false;
		if(enemy.getParty() != HA.player.getParty()) {
			if(HA.player.getScore() > 0) {
				scoreInc = -scoreInc;
				HA.player.addToScore(scoreInc);
			} else {
				HA.player.decrementLives();
			}
			_perfectLevel = false;
			C.audio.play('hit_bad');
			whoops = true;
		}
		HA.m.publish(HA.e.ENEMY_OFF_SCREEN_COMPLETE, [enemy, scoreInc, whoops]);
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
	 * Show the pause screen display
	 * @private
	 * @method _showPauseScreenDisplay
	 */
	function _showPauseScreenDisplay() {
		console.log("PauseScreenDisplay: showPauseScreenDisplay");
		$("#PauseDisplay").show();
	}

	/**
	 * Hide the pause screen display
	 * @private
	 * @method _hidePauseScreenDisplay
	 */
	function _hidePauseScreenDisplay() {
		console.log("PauseScreenDisplay: hidePauseScreenDisplay");
		$("#PauseDisplay").hide();
	}

	/**
	 Handle level complete event.
	 @private
	 @method _handleLevelComplete
	 @param {Object} e Event object.
	 */
	_handleLevelCompleteEvent = function(e) {
		console.log("handleLevelComplete");
		if(_perfectLevel) {
			// perfect level, add a life!
			C.audio.play("addLife");
			HA.player.incrementLives();
			HA.m.publish(HA.e.SHOW_MESSAGE, ["Perfect Level!", function() { _incrementLevel(); } ]);
			
			C.trigger("ShowMessage", {
				text : "Perfect Level!",
				callback : function() {
					_incrementLevel();
				}
			});
		} else {
			_incrementLevel();
		}
	};
	
	/**
	 Handle next level event.
	 @private
	 @method _handleNextLevelEvent
	 @param {Object} e Event object.
	 */
	var _handleNextLevelEvent = function(e) {
		console.log("handleNextLevel");
		C.audio.play("whoosh");
		var numEnemiesPerLevel = _getNumEnemiesPerLevel();
		var start = (_getLevel() - 1) * 2 * numEnemiesPerLevel;
		// _setIncrement(100 * _getScoreMultiplier());
		HA.enemyController.loadEnemySet(start, numEnemiesPerLevel);
		HA.enemyController.setSpeed(_getLevel() / 1.5);
		HA.enemyController.startProducing(true);
	};
	
	
	function _incrementLevel() {
		_level += 1;
		_perfectLevel = true;
		HA.m.publish(HA.e.NEXT_LEVEL, [_level]);
		HA.m.publish(HA.e.SHOW_MESSAGE, ["Level "+_level]);
		// Crafty.trigger("NextLevel", {level: this._level});
	}
	
	function _setLevel(level) {
		_level = level;
		// Crafty.trigger("ShowMessage", {text: "Level "+e.level});
		HA.m.publish(HA.e.SHOW_MESSAGE, ["Level "+level]);
		// Crafty.trigger("SetLevel", {level: level});
	}
	
	function _getSpeed() {
		return _level;
	}
	
	function _getScoreMultiplier() {
		return _level;
	}
	
	function _getScoreIncrement() {
		return _level*_scoreIncrement;
	}
	
	function _getLevel() {
		return _level;
	}
	
	function _getNumEnemiesPerLevel() {
		return _numEnemiesPerLevel;
	}
	
	/**
	 Save score to high scores in database.
	 @private
	 @method _saveScore
	 */
	var _saveScore = function() {
		$.ajax({
			url : "/highscore",
			type : "post",
			contentType : "application/json",
			data : JSON.stringify({
				user : "XXX",
				score : _getScore(),
				party : _party
			}),
			success : function(resp) {
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
	ns.pauseGame = _handlePauseGameEvent;

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
	ns.getParty = function() {
		return _party;
	};
	
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
