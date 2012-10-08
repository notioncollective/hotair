/**
 * The scene manager is currently just a wrapper for Crafty's scene implementation.
 * @class sceneManager
 */
HA.sceneManager = HA.sm = function(ns, $, _, C) {
	
	var _currentScene = null,
		_fullScreenKeyEnabled = false,
		_fullScreenMode = false,
		_currentSceneInitFn = function(){};
	
	
	function _init() {
	  HA.m.subscribe(HA.events.LOAD_SCENE, _handleLoadSceneEvent);
	  
	  // detect fullscreen mode
  	if(screenfull) _fullScreenMode = screenfull.isFullscreen;
		else throw new Error("screenfull library is not loaded");
	}
	
	function _handleLoadSceneEvent(e, scene) {
		_loadScene(scene);
	}
	
	// uses "screenfull" library
	function _enterFullScreenMode() {
		if(screenfull) {
			screenfull.request();
			_fullScreenMode = true;
		} else throw new Error("screenfull library is not loaded");
		return _fullScreenMode;		
	}
	
	// uses "screenfull" library
	function _leaveFullScreenMode() {
		if(screenfull) {
			screenfull.exit();
			_fullScreenMode = false;
		} else throw new Error("screenfull library is not loaded");
		return _fullScreenMode;		
	}
	function _toggleFullScreenMode() {
		console.log("_toggleFullScreenMode", _fullScreenMode, !_fullScreenMode);
		if(_fullScreenMode) _leaveFullScreenMode();
		else _enterFullScreenMode();
		return _fullScreenMode;
	}
	
	function _unbindSceneKeyEvents() {
	  
	}
	
	function _bindSceneKeyEvents(fn) {
	  // only allow passing functions or undefined
	  if(!_.isFunction(fn) && !_.isUndefined(fn))
	   throw new Error("Must be passed a function or nothing.");
	  
	  if(fn) _currentSceneInitFn = fn;
	  
    _currentSceneInitFn.call();	  
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
	
	ns.fullScreenKeyEnabled = function(bool) {
		console.log("HA.sm.fullScreenKeyEnabled ", bool);
		if(typeof bool !== 'undefined' && typeof bool !== 'boolean')
			throw new Error("fullScreenEnabled should only be passed a boolean (or nothing)");

		// if the value is different than the current setting
		if(_fullScreenKeyEnabled !== bool) {
					if(bool) $('#FullScreenPrompt').show(); // if yes
					else $('#FullScreenPrompt').hide(); // if no
					_fullScreenKeyEnabled = bool;		
		}
		return _fullScreenKeyEnabled;
	};
	
	ns.init = _init;
	
	
	
	return ns;
	
}(HA.namespace("HA.sceneManager"), jQuery, _, Crafty);