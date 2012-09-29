#include "lib/underscore.js"
#include "PSD.jsx"

PSD.utils = (function(ns, _) {
	var _fullPath,
			_dirPath,
			_scriptName;
	function _init() {
		_getScriptFSInfo()
	};
	function _getScriptFSInfo() {
		var parts = [];
		
		_fullPath = $.fileName;
		// $.writeln(_fullPath);
		parts = _fullPath.split('/');
		_scriptName = parts.pop();
		// $.writeln(_scriptName);
		_dirPath = parts.join('/');
		// $.writeln(_dirPath);
		
		return _fullPath;
	}
	function _setFSLocation(path) {
		if(typeof _dirPath !== 'string') _getScriptFSInfo();
		Folder.current = path || _dirPath;
	};
	
	ns.init = _init;
	ns.setFSLocation = _setFSLocation;
	
	return ns;
	
}(PSD.namespace("utils"), _))


// extend the Number obj
Number.prototype.digits = function(n) {
	var str = this + '',
		diff = n - str.length;
		
	if(diff < 0) throw new Error("Number is longer than requested digits");
	if(diff < n) while(diff--){ str = '0'+str; }
	return str;
}