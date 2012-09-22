/**
 * The scene manager is currently just a wrapper for Crafty's scene implementation.
 * @class sceneManager
 */
HA.sceneManager = function(ns, $, _, C) {
	
	var _currentScene = null;
	
	
	function _init() {
	  HA.m.subscribe(HA.events.LOAD_SCENE, _handleLoadSceneEvent);
	}
	
	function _handleLoadSceneEvent(e, scene) {
		_loadScene(scene);
	}
	
	/**
   * See public loadScene method
   * @method _loadScene
   * @private 
   */
	function _loadScene(scene) {
	  C.scene(scene);
	} 
	
	/**
	 * Wrapper for Crafty's scene method.  Loads a previously defined scene.
	 * @method loadScene
	 * @param {string} scene The ID of the scene to be loaded. 
	 */
	ns.loadScene = _loadScene;
	
	ns.init = _init;
	return ns;
	
}(HA.namespace("HA.sceneManager"), jQuery, _, Crafty);