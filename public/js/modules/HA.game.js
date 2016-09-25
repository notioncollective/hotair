/**
 * Handles gameplay, including levels, game pause/unpause, and initializing other HA modules.
 * @class game
 */

HA.game = function(ns, $, _, C) {

	var _options = {},
			_defaults = {},
			_scoreIncrement = 100,
			_level = 0,
			_timer,
			_party,
			_perfectLevel = true,
			_numEnemiesPerLevel = 10,
			_partySelectMenu,
			_pauseDisplay,
			_pauseMenu,
			_state = 0,
			_highScores,
			_scoreObj,
			_cacheBuster,
			_gameHitCount = 0,
			_muted = false;

	// private methods
	function _init(options) {
		options = options || {};
		_.extend(_options, _defaults, options);

		HA.player.init();
		HA.mediator.init();
		HA.enemyController.init();
		HA.sceneManager.init();

		// High scores are now loaded on demand.
		// _fetchHighScores();

		// The init method no longer performs the fetch, so it's not necessary here.
		HA.twitter.init();

		// Set up initial event subscriptions
		HA.m.subscribe(HA.events.GAME_LOADED, _handleGameLoadedEvent);
		HA.m.subscribe(HA.events.START_NEW_GAME, _handleStartNewGameEvent);
		HA.m.subscribe(HA.events.GAME_OVER, _handleGameOverEvent);
		HA.m.subscribe(HA.events.PAUSE_GAME, _handlePauseGameEvent);
		HA.m.subscribe(HA.events.RESUME_GAME, _handleResumeGameEvent);
		HA.m.subscribe(HA.events.END_GAME, _handleEndGameEvent);
		HA.m.subscribe(HA.events.LEVEL_COMPLETE, _handleLevelCompleteEvent);
		HA.m.subscribe(HA.events.INCREMENT_LEVEL, _handleIncrementLevelEvent);
		HA.m.subscribe(HA.events.START_LEVEL, _handleStartLevelEvent);
		HA.m.subscribe(HA.e.SAVE_SCORE, _handleSaveScoreEvent);

		// For window blur, when changing browser windows or application
		C.bind("Pause", function(e) {
			console.log("C.bind('Pause')");
			if(_state !== 1) return;
			C.audio.pause("game_music");
			if(HA.enemyController.isProducing()) HA.enemyController.stopProducing();
		});
		C.bind("Unpause", function(e) {
			console.log("C.bind('Unpause')");
			if(_state !== 1) return;
			if(!C.isPaused()) return;
			C.audio.unpause("game_music");
			if(!HA.enemyController.isProducing()) HA.enemyController.startProducing();
		});


		// using jQuery here, wasn't sure of the Crafty equiv
		$(window).on('resize orientationChanged', function(e) {
		  // console.log("Change viewport size!", e);
      HA.m.publish(HA.events.RESIZE_VIEWPORT, [C.DOM.window.width, C.DOM.window.height]);
    });

		HA.m.subscribe(HA.e.ENEMY_HIT_START, _handleEnemyHitStartEvent);
		HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_START, _handleEnemyOffScreenStartEvent);

		// Initialize Crafty
		C.init();
		C.settings.modify("autoPause", true);

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
		// HA.sceneManager.loadScene("gameover");
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
		_perfectLevel = true;
		HA.player.setScore(0);
		HA.player.setLives(3);
		C.settings.modify("autoPause", true);
		_bindGameplayKeyboardEvents();
		_state = 1;
		_gameHitCount = 0;
		_initNewGame();
		HA.m.publish(HA.e.START_LEVEL, [_level]);
	}

	function _initNewGame() {
		var token = HA.getCsrfToken();
		$.ajax({
			url : "/start",
			type : "post",
			contentType : "application/json",
			data : JSON.stringify({
				party: HA.player.getParty()
			}),
			success : function(resp) {
				if(resp.success) {
					console.log("Game Started!");
				} else {
					console.error("error starting game");
				}
			}
		});
	}

	/**
	 * Handles GAME_OVER event.
	 * @private
	 * @method _handleGameOverEvent
	 * @param {object} e
	 */
	function _handleGameOverEvent(e) {
		console.log("HA.game handleGameoverEvent");
		// TODO: Possibly perform extra cleanup here, maybe clear out the mediator?
		_unbindGameplayKeyboardEvents();

		// _saveScore();
		// _pauseDisplay.destroy();
		// _pauseMenu.destroy();
		HA.m.publish(HA.e.LOAD_SCENE, "gameover");
		_state = 2;
	}


	/**
	 Handle a PAUSE_GAME event.
	 @private
	 @method _handlePauseGameEvent
	 */
	function _handlePauseGameEvent(e) {
		console.log("Pause game!");
		if(!C.isPaused()) {
			// remove event bindings from Gameplay
			_unbindGameplayKeyboardEvents();

			_createPauseDisplay();

			// Pause the music, but leave other sounds alone.
			C.audio.pause("game_music");
			C.audio.play('pause');

			// Do the actual frame pause on following frame.
			Crafty.bind("EnterFrame", _doPause);

		}
	};


	/**
	 * Perform the actual pause of the draw loop via Crafty.pause();
	 * Also displays the PauseDisplay and pause menu entities.
	 * @private
	 * @method _doPause();
	 */
	function _doPause() {
		Crafty.unbind("EnterFrame", _doPause);
		_pauseDisplay.showPauseScreenDisplay();
    _createPauseMenu();
		C.settings.modify("autoPause", false);
		C.pause();
	}

	function _createCloseMenu() {
		closeMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "CloseListNav"});

		closeMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				HA.m.publish(HA.e.RESUME_GAME);
			}
		});
		closeMenuNav.renderListNav();
	}


	function _createPauseDisplay() {
			// Create the pause display entity
			_pauseDisplay = C.e("PauseDisplay");
	}

	function _createPauseMenu() {

			console.log("create pause menu");
			// Create the pause nav entity
			_pauseMenu = C.e("ListNav")
				.attr({wrappingId: "PauseNav"});

			_pauseMenu.addListItem({
				text: "Resume",
				callback: function(arg) {
					console.log("Resume", this );
					HA.m.publish(HA.e.RESUME_GAME);
					this.destroy();
				}
			});

			_pauseMenu.addListItem({
				text: "Instructions",
				callback: function(arg) {
					HA.game.closeModals();
					HA.game.openModal("InstructionsDisplay");
					this.destroy();
					_createCloseMenu();
				},
				args: ["Instructions!"]
			});

			_pauseMenu.addListItem({
        text: "Share",
        callback: function(arg) {
          window.open('/share', '_blank');
        }
      });

			_pauseMenu.addListItem({
				text: "End Game",
				callback: function(arg) {
					console.log("End Game...");
					HA.m.publish(HA.e.END_GAME);
				}
			});

			_pauseMenu.addListItem({
				text: function() {
					var mute = HA.game.isMuted() ? "-mute" : "";
					var icon = "<i id='icon-snd' class='icon icon-snd" + mute +"'></i>";
					return icon;
				},
				// text: "Test",
				callback: function() {
					if(HA.game.isMuted()) {
						HA.game.unmute();
						$('#icon-snd').removeClass('icon-snd-mute').addClass('icon-snd');
					} else {
						HA.game.mute();
						$('#icon-snd').removeClass('icon-snd').addClass('icon-snd-mute');
					}
				}
			})

      _pauseMenu.renderListNav();
	}

	/**
	 Handles the "resume game" selection from the pause screen.
	 @private
	 @method _handleResumeGame
	 @param {Object} e Event object.
	 */
	function _handleResumeGameEvent(e) {
		e.preventDefault();
		console.log("Resume game!");
		if(C.isPaused()) {
			C.audio.unpause("game_music");
			_pauseDisplay.destroy();
			_pauseMenu.destroy();
			Crafty.unbind("EnterFrame", _doPause);
			_bindGameplayKeyboardEvents();
			C.pause();
			C.audio.play('pause');
			C.settings.modify("autoPause", true);
		}
		return false;
	};

	/**
	 Handles the "end game" event from the pause screen.
	 @private
	 @method _handleEndGame
	 @param {Object} e Event object.
	 */
	function _handleEndGameEvent(e) {
		e.preventDefault();
		console.log("End game!");
		if(C.isPaused()) {
			_state = 0;
			_pauseDisplay.destroy();
			_pauseMenu.destroy();
			C.unbind("EnterFrame", _doPause);
			C.pause();
			C.audio.play('pause');
			C.settings.modify("autoPause", true);
			HA.sceneManager.loadScene("start");
		}
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
		var scoreInc = _getScoreIncrement(),
				data = {
					type: "hit",
					tweet_id: enemy.tweet.id,
					tweet_screen_name: enemy.tweet.screen_name,
					tweet_party: enemy.tweet.party,
					player_party: HA.player.getParty()
				};
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

		_gameHitCount += 1;
		_saveData(data);

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
	 Handle level complete event.
	 @private
	 @method _handleLevelCompleteEvent
	 @param {Object} e Event object.
	 */
	function _handleLevelCompleteEvent(e) {
		console.log("handleLevelComplete");
		if(_perfectLevel) {
			// perfect level, add a life!
			C.audio.play("addLife");
			HA.player.incrementLives();
			HA.m.publish(HA.e.SHOW_MESSAGE, ["Perfect Level!", function() {
				HA.m.publish(HA.e.INCREMENT_LEVEL);
			}]);
		} else {
			HA.m.publish(HA.e.INCREMENT_LEVEL);
		}
	};

	/**
	 * Handle increment level event.
	 * @private
	 * @method _handleIncrementLevelEvent
	 * @param {Object} e Event object
	 */
	function _handleIncrementLevelEvent(e) {
		console.log("_handleIncrementLevelEvent");
		_incrementLevel();
	}

	/**
	 Handle start level event.
	 @private
	 @method _handleStartLevelEvent
	 @param {Object} e Event object.
	 */
	function _handleStartLevelEvent(e) {
		console.log("handleNextLevel");
		C.audio.play("whoosh");
		var numEnemiesPerLevel = _getNumEnemiesPerLevel();
		var start = (_getLevel() - 1) * 2 * numEnemiesPerLevel;
		// _setIncrement(100 * _getScoreMultiplier());
		HA.enemyController.loadEnemySet(start, numEnemiesPerLevel);
		HA.enemyController.setSpeed(_getLevel() / 1.5);
		if(!HA.enemyController.isProducing()) HA.enemyController.startProducing(true);
	};


	function _handleSaveScoreEvent(e, initials, score) {
		_saveScore(initials, score, HA.player.getParty());
	}

	/**
	 * The actual function that is handles the gameplay keyboard events
	 * @private
	 * @method _gameplayKeyboardEventHandler
	 */
	function _gameplayKeyboardEventHandler(e) {
		if(e.keyCode == Crafty.keys['ENTER']) {
			if(!Crafty.isPaused()) {
				HA.m.publish(HA.events.PAUSE_GAME);
			}
		}
	}

	/**
	 * Bind the ENTER and ESC keys to the pause and full screen functionality.
	 * @private
	 * @method _bindGameplayKeyboardEvents
	 */
	function _bindGameplayKeyboardEvents() {
		_unbindGameplayKeyboardEvents();
    console.log("Bind game keyboard events");
		$(document).on("keydown", _gameplayKeyboardEventHandler);
	}

	/**
	 * Unbind the ENTER and ESC keys to the pause and full screen functionality.
	 * @private
	 * @method _unbindGameplayKeyboardEvents
	 */
	function _unbindGameplayKeyboardEvents() {
	  console.log("Unbind game keyboard events");
		$(document).off("keydown");
	}

	/**
	 * Increment the level.
	 * @private
	 * @method _incrementLevel
	 */
	function _incrementLevel() {
		_level += 1;
		_perfectLevel = true;
		HA.m.publish(HA.e.START_LEVEL, [_level]);
		HA.m.publish(HA.e.SHOW_MESSAGE, ["Level "+_level]);
		console.log("_incrementLevel", _level);
	}

	/**
	 * Set the game to a specific level directly.
	 * @private
	 * @method _setLevel
	 * @param {number} level The level to set the game to.
	 */
	function _setLevel(level) {
		_level = level;
		HA.m.publish(HA.e.SHOW_MESSAGE, ["Level "+level]);
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
	function _saveScore(initials, score, party) {
		console.log("save score", initials, score, party);
		var token = HA.getCsrfToken();
		$.ajax({
			url : "/highscore",
			type : "post",
			contentType : "application/json",
			data : JSON.stringify({
				type: "score",
				user : initials,
				score : score,
				party : party,
				hits: _gameHitCount
			}),
			success : function(resp) {
				// var resp = JSON.parse(resp);
				if(resp.ok) {
					console.log("saved score", resp);
					HA.m.publish(HA.e.SCORE_SAVED_TO_DB, [resp]);
				} else {
					console.error("error saving score!", resp);
				}
			}
		});
	};

	function _saveData(data) {
		console.log("SAVING DATA: ", data);
		var token = HA.getCsrfToken();
		$.ajax({
			url : "/data",
			type : "post",
			contentType : "application/json",
			data : JSON.stringify(data),
			success : function(resp) {
				console.log("DATA SAVED: ", resp);
			}
		});
		_gaq.push(['_trackEvent', 'Gameplay', 'EnemyHit', data.tweet_party]);
	}

	/**
	 * Fetch the highscores from the server.
	 */
	function _fetchHighScores(callback, context) {
		$.getJSON('/highscores', function(resp) {
			console.log("highscores fetched", resp);
			_highScores = resp.highscores;
			if(callback && _.isFunction(callback)) {
				context = context || this;
				callback.call(context);
			}
		});
	}

	function _mute() {
		Crafty.audio.mute();
		_muted = true;
	}

	function _unmute() {
		Crafty.audio.unmute();
		_muted = false;
	}

	function _isMuted() {
		return _muted;
	}

	// public methods

	/**
	 Initializer.
	 @public
	 @method init
	 */
	ns.init = _init;

	/**
	 Close all modals
	 @public
	 @method closeModals
	 */
	ns.closeModals = function() {
		$(".modal").hide();
	}

	/**
	 Open a modals
	 @public
	 @method openModal
	 * @param id {string} the id of the modal template in the DOM
	 */
	ns.openModal = function(id) {
		$("#"+id).show();
	}

	/**
	 Unpause gameplay.
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

	/**
	 * Check to see if a value is a highscore.
	 * @param {Object} score
	 * @return {boolean} True if the score is equal to or greater than the minimum highscore
	 */
	ns.isHighScore = function(score) {
		if(score > 0) {
			var scores = _.pluck(_highScores, "score"),
					min = _.min(scores),
					isHigh = (score > min || scores.length < 5);

			console.log("Min score", min);
			console.log("Scores length", scores.length);
			console.log("Is high score?", isHigh);
		// if there aren't yet 5 highscores, or yours is higheryou're in luck!
			return isHigh;

		} else return false;
	}

	ns.fetchHighScores = _fetchHighScores;

	ns.getHighScores = function() {
		return _highScores;
	}

	ns.getNumEnemiesPerLevel = _getNumEnemiesPerLevel;

	ns.cacheBuster = function(path) {
		_cacheBuster = _cacheBuster || Date.now();
		if(_.isString(path)) {
			return path+'?_='+_cacheBuster;
		} else return _cacheBuster;
	}

	ns.isMuted = _isMuted;

	ns.mute = _mute;

	ns.unmute = _unmute;

	return ns;

}(HA.namespace("HA.game"), jQuery, _, Crafty);
