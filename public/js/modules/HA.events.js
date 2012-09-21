/**
 * The events module returns a simple map of all game events.
 * @class events
 */
HA.events = function(ns, $, _, C) {
	
	var _events = {
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
		 * Set the party.
		 * @property {string} SET_PARTY
		 * @final
		 * @param {string} party
		 */
		SET_PARTY: "ha:player:set_party",
		
		/**
		 * Start a new game
		 * @property {string} START_NEW_GAME
		 * @final
		 */
		START_NEW_GAME: "ha:start_new_game",
		
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
		RESUME_GAME: "ha:resume_game"
	};
	
	return _events;
	
}(HA.namespace("HA.events"), jQuery, _, Crafty);