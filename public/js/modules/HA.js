/**
 * All modules related to the HotAir Game are contained within the HA root namespace.
 * @class HA
 */
HA = {};

HA = function(ns, $, _) {
	var NAMESPACE_STR = "HA";
	
	/**
	 * Get the CSRF token from the meta tag.
	 * @private
	 * @method _getCsrfToken
	 * @return {string} The CSRF token.
	 */
	function _getCsrfToken() {
		var token = $("meta[name='csrf-token']").attr("content");
		return token;
	}	
	
	// http://www.zachleat.com/web/yui-code-review-yahoonamespace/
	/**
	 * Create a sub-namespace on the HA root object.
	 * @method namespace
	 * @param {String} ns_str String for the new sub-namespace
	 */
	ns.namespace = function(ns_str) {
	    var a=arguments, o=null, i, j, d;
	    for (i=0; i<a.length; i=i+1) {
	        d=a[i].split(".");
	        o=ns;

	        // YAHOO is implied, so it is ignored if it is included
	        for (j=(d[0] == NAMESPACE_STR) ? 1 : 0; j<d.length; j=j+1) {
	            o[d[j]]=o[d[j]] || {};
	            o=o[d[j]];
	        }
	    }

	    return o;
	};
	
	ns.init = function() {
		// set up CSRF token
		$.ajaxSetup({
			beforeSend: function(xhr) {
				var token = _getCsrfToken();
				xhr.setRequestHeader('X-CSRF-Token', token);
			}
		});	
	};
	
	ns.getCsrfToken = _getCsrfToken;
	
	return ns;
	
}(HA || {}, jQuery, _);