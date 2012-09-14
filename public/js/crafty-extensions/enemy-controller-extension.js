Crafty.extend({
	EnemyController: function() {
		// Event Handlers
		Crafty.bind("Pause", function(e) {
			_stopProducing();
		});
		Crafty.bind("UnPause", function(e) {
			_startProducing();
		});
		Crafty.bind("KeyDown", function(e) {
			_selectEnemy(e);
		});
		Crafty.bind("DestroyEnemy", function(e) {
			_destroyEnemy(e);
		});
		Crafty.bind("GameOver", function(e) {
			_stopProducing();
		});
		
		// Private Scoped Members
		var _producing = false,
			_curEnemy = 0,
			_numEnemies = 0,
			_numEnemiesLeft = null,
			_timer = null,
			_interval = 5000,
			_speed = 1,
			_selectedEnemy = null,
			_tweets = [],
			_enemies = [];
		
		var _startProducing = function(firstGo) {
			console.log("_startProducing");
			if(firstGo) _produceEnemy();
			_producing = true;
			_timer = setInterval(_produceEnemy, _interval);
		}
		
		var _stopProducing = function() {
			console.log("_stopProducing");
			_producing = false;
			clearInterval(_timer);
		}
		
		var _produceEnemy = function() {
			var tweet;
			if (_curEnemy < _numEnemies) {
				if(tweet = _tweets[_curEnemy]) {
					console.log("tweet: ", tweet);
					_enemies.push(Crafty.e("Enemy").setTweet(tweet).setSpeed(_speed));
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
		};
		
		var _selectEnemy = function(e) {
			// if (_enemies[_selectedEnemy] == undefined) {
				// console.log("Selected Enemy doesn't exist!");
				// return;
			// }
			// set selected enemy
			_setSelectedEnemy();
			
			
			if (e.keyCode === Crafty.keys.DOWN_ARROW) {
				// console.log("KeyDown: DOWN");
				//console.log("Selected Enemy: "+game.selectedEnemy);
				// _enemies[_selectedEnemy].unselect();
				// if (_selectedEnemy < _enemies.length-1) {
					// _selectedEnemy++;
				// } else {
					// _selectedEnemy = 0;
				// }
				// _enemies[_selectedEnemy].select();
				_selectNextEnemy();
				// console.log("game.selectedEnemy: "+game.selectedEnemy);
			} else if(e.keyCode === Crafty.keys.UP_ARROW) {
				// console.log("KeyDown: UP");
				// console.log("VisibleEnemies length: "+game.Enemies.length);
				// console.log("Selected Enemy: "+game.selectedEnemy);
				// _enemies[_selectedEnemy].unselect();
				// if (_selectedEnemy > 0) {
					// _selectedEnemy--;
				// } else {
					// _selectedEnemy = _enemies.length-1;
				// }
				// _enemies[_selectedEnemy].select();
				_selectPreviousEnemy();
				console.log("game.selectedEnemy: "+_selectedEnemy);
			}
		}
		
		function _selectNextEnemy() {
			_setSelectedEnemy();
			if (_selectedEnemy < _enemies.length-1) {
				_selectedEnemy++;
			} else {
				_selectedEnemy = 0;
			}
			_unselectAllEnemies();
			_enemies[_selectedEnemy].select();
		}
		
		
		function _selectPreviousEnemy() {
			_setSelectedEnemy();
			if (_selectedEnemy > 0) {
				_selectedEnemy--;
			} else {
				_selectedEnemy = _enemies.length-1;
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
				if(enemy.selected) _selectedEnemy = index;
				return enemy.selected;
			});
		}
		
		var _destroyEnemy = function(e) {
			var index = _.indexOf(_enemies, e.enemy);
			console.log("Removing Visible Enemy: "+e.enemy);
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
				Crafty.trigger("LevelComplete");
			}
		}
		
		
		var _loadEnemySet = function(start, count) {
			console.log("_loadEnemySet", start, count);
			_tweets = Crafty.Twitter.getTweetSet(start, count);
			_curEnemy = 0;
			_numEnemies = _numEnemiesLeft = _tweets.length;
		}
		
		// Public interface
		return {
			startProducing: function(firstGo) {
				console.log("startFactory");
				_startProducing(firstGo);
			},
			stopProducing: function() {
				console.log("stopFactory");
				_stopProducing();
			},
			destroyAllEnemies: function() {
				_.each(_enemies, function(enemy) {
					enemy.destroy();
				});
			},
			isProducing: function() {
				console.log("isProducing");
				return _producing;
			},
			setSpeed: function(speed) {
				console.log("setSpeed");
				// _interval = 10000/speed;
				_speed = speed;
				// _stopProducing();
				// _startProducing();
			},
			loadEnemySet: function(start, count) {
				_loadEnemySet(start, count);
			}
		}
	}
});
