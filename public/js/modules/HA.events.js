/**
 * The events module returns a simple map of all game events.
 * @class events
 */
HA.events = HA.e = function(ns, $, _, C) {
	
	var _events = {
		
		/********************************/
		/**		GAME EVENTS
		/********************************/
		
		/**
		 * Game assets have loaded.
		 * @property {string} GAME_LOADED
		 * @final
		 */
		GAME_LOADED: "ha:loaded",
		
		/**
		 * Load a new scene.
		 * @property {string} LOAD_SCENE 
		 * @final
		 * @param {string} scene
		 */
		LOAD_SCENE: "ha:load_scene",
		
		/**
		 * Start a new game
		 * @property {string} START_NEW_GAME
		 * @final
		 */
		START_NEW_GAME: "ha:start_new_game",
		
		/**
		 * Game over.
		 * @property {string} GAME_OVER
		 * @final
		 */
		GAME_OVER: "ha:game_over",
		
		/**
		 * Pause the game
		 * @property {string} PAUSE_GAME
		 * @final
		 */
		PAUSE_GAME: "ha:pause_game",
		
		/**
		 * Resume the game
		 * @property {string} RESUME_GAME
		 * @final
		 */
		RESUME_GAME: "ha:resume_game",
		
		/**
		 * Update the score
		 * @property {string} UPDATE_SCORE
		 * @final
		 * @param {string} score The new score.
		 */
		UPDATE_SCORE: "ha:update_score",
		
		/**
		 * Update the lives
		 * @property {string} UPDATE_LIVES
		 * @final
		 * @param {string} lives
		 */
		UPDATE_LIVES: "ha:update_lives",
		
		/**
		 * Show a message
		 * @property {string} SHOW_MESSAGE
		 * @final
		 * @param {string} message The message to display.
		 * @param {function} callback An optional callback.
		 */
		SHOW_MESSAGE: "ha:show_message",
		
		/**
		 * A level has been completed.
		 * @property {string} LEVEL_COMPLETE
		 * @final 
		 */
		LEVEL_COMPLETE: "ha:level_complete",
		
		/**
		 * Go to the next level.
		 * @property {string} NEXT_LEVEL
		 * @final
		 */
		NEXT_LEVEL: "ha:next_level",
		
		/**
		 * Tweets loaded into twitter module
		 * @property {string} TWEETS_LOADED
		 * @final
		 */
		TWEETS_LOADED: "ha:tweets_loaded",
		
		
		/********************************/
		/**		PLAYER EVENTS
		/********************************/
		
		/**
		 * Set the party.
		 * @property {string} SET_PARTY
		 * @final
		 * @param {string} party
		 */
		SET_PARTY: "ha:player:set_party",
		
		
		/********************************/
		/**		ENEMY EVENTS
		/********************************/
		
		/**
		 * An enemy has been hit by a dart.
		 * @property {string} ENEMY_HIT_START
		 * @final
		 * @param {object} enemy The related enemy entity.  
		 */
		ENEMY_HIT_START: "ha:enemy:hit_start",
		
		/**
		 * The enemy hit info has been calculated.
		 * @property {string} ENEMY_HIT_COMPLETE
		 * @final
		 * @param {object} enemy The related enemy entity.  
		 */
		ENEMY_HIT_COMPLETE: "ha:enemy:hit_complete",

		/**
		 * An enemy has gone off the screen.
		 * @property {string} ENEMY_OFF_SCREEN_START
		 * @final
		 * @param {object} enemy The related enemy entity. 
		 */
		ENEMY_OFF_SCREEN_START: "ha:enemy:off_screen_start",

		/**
		 * Calculations related to enemy off screen have completed.
		 * @property {string} ENEMY_OFF_SCREEN_COMPLETE
		 * @final
		 * @param {object} enemy The related enemy entity. 
		 */
		ENEMY_OFF_SCREEN_COMPLETE: "ha:enemy:off_screen_complete",
		
		/**
		 * An enemy has been destroyed.
		 * @property {string} ENEMY_DESTROYED
		 * @final
		 * @param {object} enemy The related enemy entity.  
		 */
		ENEMY_DESTROYED: "ha:enemy:destroyed"
	};
	
	return _events;
	
}(HA.namespace("HA.events"), jQuery, _, Crafty);