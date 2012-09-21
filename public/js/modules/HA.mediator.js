// HA.mediator namespace
HA.namespace("HA.mediator");
HA.mediator = function(ns, $, _, C) {
	
	var o = $({}), // empty jQuery object to manage events
			_events = {} // stores events
			// defaults
			_defaults = {
				// EXAMPLE
				// events: {
				// 	eventname: 'HA/eventname',
				// }
			};
			
	var _init = function(options) {
		
		// force options obj
		options = options || {};
				
		// grab the events definition
		if('events' in options) {
			_.extend(_events, options['events']);
			delete options['events'];
		}
		
		_.extend(_options, options);
	}

  ns.subscribe = function() {
    o.on.apply(o, arguments);
  };

  ns.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  ns.publish = function() {
    o.trigger.apply(o, arguments);
  };
  
	ns.events = _events;
	
	return ns;
	
}(HA.mediator, jQuery, _, Crafty);