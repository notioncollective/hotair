/**
 * Provides a basic Mediator for global event aggregation.  Based on jQuery TinyPubSub.
 * @class mediator
 */
HA.mediator = function(ns, $, _, C) {
	
	var o = $({}), // empty jQuery object to manage events
			_events = {}, // stores events
			_options = {},
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
		
		_.extend(_options, options, _defaults);
	}

	ns.init = _init;

  /**
    Subscribe a handler to an event 
    @method subscribe
   */
  ns.subscribe = function() {
    o.on.apply(o, arguments);
  };

  /**
   * Unsubscribe a handler from an event
   * @method unsubscribe
   */
  ns.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  /**
   * Publish an event
   * @method publish
   */
  ns.publish = function() {
    o.trigger.apply(o, arguments);
  };
  
	ns.events = _events;
	
	return ns;
	
}(HA.namespace("HA.mediator"), jQuery, _, Crafty);