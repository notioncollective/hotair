// namespace object
HA = function(ns, $, _, C) {
	var NAMESPACE_STR = "HA";
	
	// http://www.zachleat.com/web/yui-code-review-yahoonamespace/
	ns.namespace = function() {
	    var a=arguments, o=null, i, j, d;
	    for (i=0; i<a .length; i=i+1) {
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
	
	return ns;
	
}(HA || {}, jQuery, _, Crafty);