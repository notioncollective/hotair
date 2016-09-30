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
		HA.m.subscribe(HA.e.ENEMY_SELECTED, _handleEnemySelectedEvent);

		// With new gameplay, these could probably be combined?
		C.bind('EnemyPassed', _removeEnemy);
		C.bind('EnemyHit', _removeEnemy);

		// _bindKeyboardEvents();
	}

	/**** EVENT HANDLERS *****/

	// function _bindKeyboardEvents() {
	// 	_unbindKeyboardEvents();
	// 	C.bind("KeyDown", _selectEnemy);
	// }

	// function _unbindKeyboardEvents() {
	// 	C.unbind("KeyDown", _selectEnemy);
	// }

	function _handleStartNewGameEvent(e) {
		// _bindKeyboardEvents();
	}

	function _handlePauseGameEvent(e) {
		_stopProducing();
		// _unbindKeyboardEvents();
	}

	function _handleResumeGameEvent(e) {
		console.log("HA.enemyController _handleResumeGameEvent");
		_startProducing();
		// _bindKeyboardEvents();
	}

	function _handleEndGameEvent(e) {
		_stopProducing();
		// _unbindKeyboardEvents();
		_removeAllEnemies();
	}

	/**
	 * Handle GAME_OVER event.  Stops production, destroys all enemies, clears out _enemies array.
	 * @private _handleGameOverEvent
	 */
	function _handleGameOverEvent(e) {
		_stopProducing();
		// _unbindKeyboardEvents();
		_removeAllEnemies();
	}

	// When an enemy is selected, unselect the rest and update the local reference to the selected enemy
	function _handleEnemySelectedEvent(e, selectedEnemy) {
		console.log('HA.enemyController _handleEnemySelectedEvent');
		_enemies.forEach(function(enemy) {
			if (enemy.getId() !== selectedEnemy.getId()) {
				enemy.unselect();
			}
		});
		_setSelectedEnemy();
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

	/**
	 * Being generating balloons at timed interval
	 * @param  {Boolean} firstGo
	 */
	function _startProducing(firstGo) {
		_producing = true;
		clearInterval(_timer);
		_timer = setInterval(_produceEnemy, _interval);
		if(firstGo) _produceEnemy();
		console.log("startProducing", _timer);
	}

	/**
	 * Stop generating balloons at timed interval
	 */
	function _stopProducing() {
		console.log("stopProducing", _timer);
		_producing = false;
		clearInterval(_timer);
	}

	/**
	 * Produce a single balloon and add it to the list of enemies.
	 */
	function _produceEnemy() {
		console.log("_produceEnemy", _timer);
		var tweet;
		if(_curEnemy < _numEnemies) {
			if( tweet = _tweets[_curEnemy]) {
				console.log("tweet: ", tweet);
				console.log("party: ", tweet.value.party);
				_enemies.push(C.e("Enemy").setTweet(tweet).setSpeed(_speed).setParty(tweet.value.party));
			}
			if(_curEnemy === 0 || _enemies.length === 1) {
				// if this is the only enemy, select it
				_selectedEnemy = 0;
				_enemies[0].select();
			}
		} else {
			_producing = false;
			clearInterval(_timer);
		}
		_curEnemy += 1;
	}

	/**
	 * Select the next enemy on the screen, vertically below
	 */
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

	/**
	 * Select the previous enemy on the screen, vertically above
	 */
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

	/**
	 * Unselect all enemies - used when selecting a single enemy
	 */
	function _unselectAllEnemies() {
		_.each(_enemies, function(enemy) {
			enemy.unselect();
		});
	}

	/**
	 * Store a reference to the currently selected enemy
	 */
	function _setSelectedEnemy() {
		var selected = _.find(_enemies, function(enemy, index) {
			if(enemy.selected)
				_selectedEnemy = index;
			return enemy.selected;
		});
	}

	/**
	 * Remove an enemy from our list of enemies. If the enemy being removed is selected,
	 * select the next enemy.
	 * @param  {Object} enemy A reference to the enemy instance to be removed.
	 */
	function _removeEnemy(enemy) {
		console.log('_removeEnemy', enemy);
		var index = _.indexOf(_enemies, enemy);
		if(index !== -1) {
			enemy.unselect();
			if(_enemies[_selectedEnemy] === enemy) {
				// If the enemy to remove is selected, select the new 0 index enemy.
				_enemies.splice(index, 1);
				if(_enemies[0] !== undefined) {
					_selectedEnemy = 0;
					_enemies[0].select();
				}
			} else {
				// The enemy isn't selected, so don't worry about selecting another enemy
				_enemies.splice(index, 1);
			}

			// _destroyEnemy(enemy);
			_numEnemiesLeft -= 1;
			if(_numEnemiesLeft === 0) {
				// last enemy is gone, player isn't dead... go to next level!
				HA.m.publish(HA.e.LEVEL_COMPLETE);
				// C.trigger("LevelComplete");
			}
		}
	}

	/**
	 * Destroy enemy
	 * @param  {Object} enemy A reference to the enemy instance to be removed.
	 */
	function _destroyEnemy(enemy) {
		console.log("_destroyEnemy: ",enemy);
		if(enemy.hasOwnProperty("destroy") || _.has(enemy, "destroy")) {
			enemy.destroy();
		}
	}

	function _removeAllEnemies() {
		// _.each(_enemies, function(enemy) {
			// enemy.unbindAllMediatorEvents();
			// enemy.destroy();
		// });
		_destroyAllEnemies();
		_enemies = [];
	}

	function _destroyAllEnemies() {
		_.each(_enemies, function(enemy) {
			_destroyEnemy(enemy);
			// enemy.unbindAllMediatorEvents();
			// enemy.destroy();
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
