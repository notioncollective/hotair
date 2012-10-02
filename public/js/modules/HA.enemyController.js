/**
 * The enemyController is responsible for handling the generation of enemy balloons, and the user interaction.
 * @class enemyController
 */
HA.enemyController = function(ns, $, _, C) {


	
	
	// Private Scoped Members
	var _producing = false, _curEnemy = 0, _numEnemies = 0, _numEnemiesLeft = null, _timer = null, _interval = 5000, _speed = 1, _selectedEnemy = null, _tweets = [], _enemies = [];

	function _init() {
		HA.m.subscribe(HA.events.START_NEW_GAME, _handleStartNewGameEvent);
		HA.m.subscribe(HA.events.GAME_OVER, _handleGameOverEvent);
		HA.m.subscribe(HA.events.PAUSE_GAME, _handlePauseGameEvent);
		HA.m.subscribe(HA.events.RESUME_GAME, _handleResumeGameEvent);
		HA.m.subscribe(HA.events.END_GAME, _handleEndGameEvent);
		// HA.m.subscribe(HA.e.ENEMY_HIT_START, _handleEnemyHitStartEvent);
		HA.m.subscribe(HA.e.ENEMY_HIT_COMPLETE, _handleEnemyHitCompleteEvent);
		// HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_START, _handleEnemyOffScreenStartEvent);
		HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_COMPLETE, _handleEnemyOffScreenCompleteEvent);
		HA.m.subscribe(HA.e.ENEMY_DESTROYED, _handleEnemyDestroyedEvent);
		
		_bindKeyboardEvents();
	}

	/**** EVENT HANDLERS *****/
	
	function _bindKeyboardEvents() {
		_unbindKeyboardEvents();
		C.bind("KeyDown", _selectEnemy);
	}
	
	function _unbindKeyboardEvents() {
		C.unbind("KeyDown", _selectEnemy);		
	}

	function _handleStartNewGameEvent(e) {
		_loadEnemySet(0, 4);
		_startProducing(true);
		_bindKeyboardEvents();
	}

	function _handlePauseGameEvent(e) {
		_stopProducing();
		_unbindKeyboardEvents();
	}

	function _handleResumeGameEvent(e) {
		console.log("HA.enemyController _handleResumeGameEvent");
		_startProducing();
		_bindKeyboardEvents();
	}
	
	function _handleEndGameEvent(e) {
		_stopProducing();
		_unbindKeyboardEvents();
		_removeAllEnemies();
	}
	
	/**
	 * Handle GAME_OVER event.  Stops production, destroys all enemies, clears out _enemies array.
	 * @private _handleGameOverEvent
	 */
	function _handleGameOverEvent(e) {
		_stopProducing();
		_unbindKeyboardEvents();
		_removeAllEnemies();
	}
	
	function _handleEnemyHitStartEvent(e, enemy) {
		console.log('HA.enemyController _handleEnemyHitStartEvent');
		
	}
	
	function _handleEnemyHitCompleteEvent(e, enemy) {
		console.log('HA.enemyController _handleEnemyHitCompleteEvent');
		_removeEnemy(enemy);
	}
	
	function _handleEnemyOffScreenCompleteEvent(e, enemy) {
		console.log('HA.enemyController _handleEnemyOffScreenEvent');
		_removeEnemy(enemy);
	}
	
	function _handleEnemyDestroyedEvent(e, enemy) {
		console.log('HA.enemyController _handleEnemyDestroyedEvent');
	}

	/***** PRIVATE METHODS *****/

	function _loadEnemySet(start, count) {
		_tweets = HA.twitter.getTweetSet(start, count);
		_curEnemy = 0;
		_numEnemies = _numEnemiesLeft = _tweets.length;
	}

	function _setSpeed(speed) {
		console.log("setSpeed");
		_speed = speed;
	}

	function _startProducing(firstGo) {
		console.log("startProducing", _timer);
		_producing = true;
		clearInterval(_timer);
		_timer = setInterval(_produceEnemy, _interval);
		if(firstGo) _produceEnemy();
	}

	function _stopProducing() {
		console.log("stopProducing", _timer);
		_producing = false;
		clearInterval(_timer);
	}

	function _produceEnemy() {
		console.log("_produceEnemy", _timer);
		var tweet;
		if(_curEnemy < _numEnemies) {
			if( tweet = _tweets[_curEnemy]) {
				console.log("tweet: ", tweet);
				_enemies.push(C.e("Enemy").setTweet(tweet).setSpeed(_speed).setParty(tweet.value.party));
			}
			if(_curEnemy === 0 || _enemies.length === 1) {
				//select the first enemy
				_selectedEnemy = 0;
				_enemies[0].select();
			}
		} else {
			_producing = false;
			clearInterval(_timer);
		}
		_curEnemy += 1;
	}

	function _selectEnemy(e) {
		_setSelectedEnemy();

		if(e.keyCode === C.keys.DOWN_ARROW) {
			_selectNextEnemy();
		} else if(e.keyCode === C.keys.UP_ARROW) {
			_selectPreviousEnemy();
			console.log("game.selectedEnemy: " + _selectedEnemy);
		}
	}

	function _selectNextEnemy() {
		_setSelectedEnemy();
		if(_selectedEnemy < _enemies.length - 1) {
			_selectedEnemy++;
		} else {
			_selectedEnemy = 0;
		}
		_unselectAllEnemies();
		_enemies[_selectedEnemy].select();
	}

	function _selectPreviousEnemy() {
		_setSelectedEnemy();
		if(_selectedEnemy > 0) {
			_selectedEnemy--;
		} else {
			_selectedEnemy = _enemies.length - 1;
		}
		_unselectAllEnemies();
		_enemies[_selectedEnemy].select();
	}

	function _unselectAllEnemies() {
		_.each(_enemies, function(enemy) {
			enemy.unselect();
		});
	}

	function _setSelectedEnemy() {
		var selected = _.find(_enemies, function(enemy, index) {
			if(enemy.selected)
				_selectedEnemy = index;
			return enemy.selected;
		});
	}
	
	function _removeEnemy(enemy) {
		var index = _.indexOf(_enemies, enemy);
		console.log("Removing Visible Enemy: " + enemy);
		if(index !== -1) {
			
			if(_enemies[_selectedEnemy] === enemy) {
				// If the enemy to remove is selected, select the new 0 index enemy.
				console.log("000000000 selected enemy destroyed");
				_enemies.splice(index, 1);
				if(_enemies[0] !== undefined) {
					_selectedEnemy = 0;
					_enemies[0].select();
				}
			} else {
				// The enemy isn't selected, so don't worry about selecting another enemy
				_enemies.splice(index, 1);
				console.log("000000000 unselected enemy destroyed");
			}
			_numEnemiesLeft -= 1;
			if(_numEnemiesLeft === 0) {
				// last enemy is gone, player isn't dead... go to next level!
				HA.m.publish(HA.e.LEVEL_COMPLETE);
				// C.trigger("LevelComplete");
			}
		}
	}

	function _destroyEnemy(enemy) {
		if(_.has(enemy, "destroy")) {
			enemy.unbindAllMediatorEvents();
			enemy.destroy();
		}
	}
	
	function _removeAllEnemies() {
		_.each(_enemies, function(enemy) {
			enemy.unbindAllMediatorEvents();
			enemy.destroy();
		});
		_enemies = [];
	}
	
	function _destroyAllEnemies() {
		_.each(_enemies, function(enemy) {
			enemy.unbindAllMediatorEvents();
			enemy.destroy();
		});
	}
	
	// Public interface

	/**
	 * Initialize the module.
	 * @method init
	 */
	ns.init = _init;

	/**
	 * Start producing enemies.  Sets _timer interval.
	 * @method startProducing
	 * @param {boolean} firstGo If true, indicates that the _produceEnemy method should be invoked immediately.
	 */
	ns.startProducing = _startProducing;
	/**
	 * Stop producing enemies.  Clears _timer interval.
	 * @method stopProducing
	 */
	ns.stopProducing = _stopProducing;
	/**
	 * Destroys all of the existing enemy entities.
	 * @method destroyAllEnemies
	 */
	ns.destroyAllEnemies = _removeAllEnemies;
	/**
	 * Determine whether or not the enemy controller is currently producing.
	 * @method isProducing
	 */
	ns.isProducing = function() {
		return _producing;
	};
	/**
	 * Set the speed at which the enemies move.
	 * @method setSpeed
	 * @param {number} speed The y velocity.
	 */
	ns.setSpeed = _setSpeed;
	/**
	 * Load an set of tweets from the Twitter module.
	 * @method loadEnemySet
	 * @param {number} start
	 * @param {number} count
	 */
	ns.loadEnemySet = _loadEnemySet;
	return ns;

}(HA.namespace("HA.enemyController"), jQuery, _, Crafty);
