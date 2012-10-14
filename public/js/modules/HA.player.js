/**
 * The player module.
 * @class player
 */
HA.player = function(ns, $, _, C) {
	
	var _score = 0,
		_party = null,
		_lives = 3,
		_name = null;
	
	function _init() {
		HA.m.subscribe(HA.events.SET_PARTY, _handleSetPartyEvent);
	}
	
	/**** EVENT HANDLERS ****/
	function _handleSetPartyEvent(e, party) {
		_setParty(party);
	}
	
	function _getScore() {
		return _score;
	}
	
	function _setScore(score) {
		_score = score;
		HA.m.publish(HA.e.UPDATE_SCORE, [_score]);
	}
	
	function _addToScore(points) {
		// console.log("HA.player._addToScore", points);
		_score = _score + points;
		if(_score < 0) {
			_score = 0;
		}
		HA.m.publish(HA.e.UPDATE_SCORE, [_score]);
	}
	
	
	function _getParty() {
		return _party;
	}
	
	function _setParty(party) {
		_party = party;
	}
	
	function _getLives() {
		return _lives;
	}
	
	function _setLives(lives) {
		_lives = lives;
		HA.m.publish(HA.e.UPDATE_LIVES, [_lives]);
	}
	
	function _incrementLives() {
		_lives = _lives+1;
		HA.m.publish(HA.e.UPDATE_LIVES, [_lives]);
	}
	
	function _decrementLives() {
		_lives = _lives-1;
		HA.m.publish(HA.e.UPDATE_LIVES, [_lives]);
		if(_lives <= 0) {
			HA.m.publish(HA.e.GAME_OVER);
		}
	}
	
	function _getName() {
		return _name;
	}
	
	function _setName(name) {
		_name = name;
	}
	
	ns.init = _init;
	
	/**
	 * Get the score.
	 * @method getScore
	 * @return {number}
	 */
	ns.getScore = _getScore;
	
	/**
	 * Set the score.
	 * @method setScore
	 * @param {number} score
	 */
	ns.setScore = _setScore;
	
	/**
	 * Add an amount to the score.
	 * @method addToScore
	 * @param {number} points
	 */
	ns.addToScore = _addToScore;
	
	/**
	 * Get the player's party.
	 * @method getParty
	 * @return {string}
	 */
	ns.getParty = _getParty;
	
	/**
	 * Set the player's party.
	 * @method setParty
	 * @param {string} party
	 */
	ns.setParty = _setParty;
	
	/**
	 * Get the number of lives left.
	 * @method getLives
	 * @return {number}
	 */
	ns.getLives = _getLives;
	
	/**
	 * Set the number of lives left.
	 * @method setLives
	 * @return {number}
	 */
	ns.setLives = _setLives;
	
	/**
	 * Add a life to the player.
	 * @method incrementLives
	 */
	ns.incrementLives = _incrementLives;
	
	/**
	 * Remove a life from the player.
	 * @method decrementLives
	 */
	ns.decrementLives = _decrementLives;
	
	/**
	 * Get the player's name.
	 * @method getName
	 * @return {string}
	 */
	ns.getName = _getName;
	
	/**
	 * Set the player's name.
	 * @method setName
	 * @param {string} name The player's name.
	 */
	ns.setName = _setName;
	
	return ns;
	
}(HA.namespace("HA.player"), jQuery, _, Crafty);