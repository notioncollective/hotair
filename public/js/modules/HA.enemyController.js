/**
 * The enemyController is responsible for handling the generation of enemy balloons, and the user interaction.
 * @class enemyController
 */
HA.enemyController = function(ns, $, _, C) {

	// C.bind("Pause", function(e) {
		// _stopProducing();
	// });
	// C.bind("UnPause", function(e) {
		// _startProducing();
	// });
	
	C.bind("KeyDown", function(e) {
		_selectEnemy(e);
	});
	C.bind("DestroyEnemy", function(e) {
		_destroyEnemy(e);
	});
	C.bind("GameOver", function(e) {
		_stopProducing();
	});
	
	// Private Scoped Members
	var _producing = false, _curEnemy = 0, _numEnemies = 0, _numEnemiesLeft = null, _timer = null, _interval = 5000, _speed = 1, _selectedEnemy = null, _tweets = [], _enemies = [];

	function _init() {
		HA.m.subscribe(HA.events.START_NEW_GAME, _handleStartNewGameEvent);
		HA.m.subscribe(HA.events.PAUSE_GAME, _handlePauseGameEvent);
		HA.m.subscribe(HA.events.UNPAUSE_GAME, _handleUnPauseGameEvent);
	}

	/**** EVENT HANDLERS *****/

	function _handleStartNewGameEvent(e) {
		_loadEnemySet(0, 2);
		_startProducing(true);
	}
	
	function _handlePauseGameEvent(e) {
		_stopProducing();
	}
	
	function _handleUnPauseGameEvent(e) {
		_startProducing();
	}
	
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
		console.log("startProducing");
		if(firstGo)
			_produceEnemy();
		_producing = true;
		_timer = setInterval(_produceEnemy, _interval);
	}
	
	function _stopProducing() {
		console.log("stopProducing");
		_producing = false;
		clearInterval(_timer);
	}

	function _produceEnemy() {
		var tweet;
		if(_curEnemy < _numEnemies) {
			if( tweet = _tweets[_curEnemy]) {
				console.log("tweet: ", tweet);
				_enemies.push(C.e("Enemy").setTweet(tweet).setSpeed(_speed));
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
		console.log("_produceEnemy");
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

	var _destroyEnemy = function(e) {
		var index = _.indexOf(_enemies, e.enemy);
		console.log("Removing Visible Enemy: " + e.enemy);
		if(index !== -1) {
			// game.VisibleEnemies[index].doHit();

			// _enemies.splice(index, 1);
			// if(_enemies[0] !== undefined) {
			// _selectedEnemy = 0;
			// _enemies[0].select();
			// }

			console.log("000000000 _selectedEnemy: ", _selectedEnemy);

			if(_enemies[_selectedEnemy] === e.enemy) {
				console.log("000000000 selected enemy destroyed");
				_enemies.splice(index, 1);
				if(_enemies[0] !== undefined) {
					_selectedEnemy = 0;
					_enemies[0].select();
				}
			} else {
				_enemies.splice(index, 1);
				console.log("000000000 unselected enemy destroyed");
			}
			_numEnemiesLeft -= 1;
			console.log(_enemies.length);
			e.enemy.destroy();
		}
		if(_numEnemiesLeft === 0) {
			// last enemy is gone, player isn't dead... go to next level!
			C.trigger("LevelComplete");
		}
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
	ns.destroyAllEnemies = function() {
		_.each(_enemies, function(enemy) {
			enemy.destroy();
		});
	};
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
