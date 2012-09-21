/**
 * The enemyController is responsible for handling the generation of enemy balloons, and the user interaction.
 * @class enemyController 
 */
HA.enemyController = function(ns, $, _, C) {
	
	
  C.bind("Pause", function(e) {
    ns.stopProducing();
  });
  C.bind("UnPause", function(e) {
    ns.startProducing();
  });
  C.bind("KeyDown", function(e) {
    _selectEnemy(e);
  });
  C.bind("DestroyEnemy", function(e) {
    _destroyEnemy(e);
  });
  C.bind("GameOver", function(e) {
    ns.stopProducing();
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
    
  
  
  var _produceEnemy = function() {
    var tweet;
    if (_curEnemy < _numEnemies) {
      if(tweet = _tweets[_curEnemy]) {
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
  };
  
  var _selectEnemy = function(e) {
    // if (_enemies[_selectedEnemy] == undefined) {
      // console.log("Selected Enemy doesn't exist!");
      // return;
    // }
    // set selected enemy
    _setSelectedEnemy();
    
    
    if (e.keyCode === C.keys.DOWN_ARROW) {
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
    } else if(e.keyCode === C.keys.UP_ARROW) {
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
      C.trigger("LevelComplete");
    }
  }
  
  
  
  // Public interface
  
  /**
   * Start producing enemies.  Sets _timer interval.
   * @method startProducing
   * @param {boolean} firstGo If true, indicates that the _produceEnemy method should be invoked immediately.
   */
  ns.startProducing = function(firstGo) {
    console.log("startProducing");
    if(firstGo) _produceEnemy();
    _producing = true;
    _timer = setInterval(_produceEnemy, _interval);
  };
  
  /**
   * Stop producing enemies.  Clears _timer interval.
   * @method stopProducing
   */
  ns.stopProducing = function() {
    console.log("stopProducing");
    _producing = false;
    clearInterval(_timer);
  };
  
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
  ns.setSpeed = function(speed) {
    console.log("setSpeed");
    _speed = speed;
  };
  
  /**
   * Load an set of tweets from the Twitter module.
   * @method loadEnemySet
   * @param {number} start
   * @param {number} count
   */
  ns.loadEnemySet = function(start, count) {
    _tweets = HA.Twitter.getTweetSet(start, count);
    _curEnemy = 0;
    _numEnemies = _numEnemiesLeft = _tweets.length;
  };
	
	return ns;
	
}(HA.namespace("HA.enemyController"), jQuery, _, Crafty);