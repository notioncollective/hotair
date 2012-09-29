var PSD = PSD || (function(ns) {
	ns.namespace = function () {
	    var a = arguments,
	        o = null,
	        i, j, d;
	    for (i = 0; i < a.length; i = i + 1) {
	        d = ("" + a[i]).split(".");
	        o = PSD;
	        for (j = (d[0] == "PSD") ? 1 : 0; j < d.length; j = j + 1) {
	            o[d[j]] = o[d[j]] || {};
	            o = o[d[j]];
	        }
	    }
	    return o;
	};
	return ns;
}({}));



