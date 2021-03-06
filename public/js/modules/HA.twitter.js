/**
 * The twitter module grabs twitted data from the server endpoint and stores it in memory.
 * @class twitter
 */
HA.twitter = function(ns, $, _, C) {
	
	// PRIVATE
	var _options = {},
			_defaults = {
				// protocol: 'http://', // should need this
				// domain: 'localhost:3000', // shouldn't need this
				load_tweets_endpoint: '/load_tweets',
				tweet_limit: 100,
				test: false
			},
			_tweets = [],
			_nextStartkey,
			_loaded = false;
	
	/**
    See public documentation for `init`
		@private
    @method _init
		@param {Object} options A map of options for initialization
   */		
	function _init(options) {
		// force options obj
		options = options || {};
		_.extend(_options, options, _defaults);
	}
	
	/**
    Load twitter data.
		@private
    @method _loadTweets
		@param {Object} params A map of querystring parameters for the request. Common parameters are `startKey` and `limit`.
		@param {boolean} reset If true, reset _nextStartkey so that the most recent tweets are loaded
   */
	function _loadTweets(params, reset) {
		var uri = _options.load_tweets_endpoint;
		params = params || {};
		
		if(reset) _nextStartkey = null;
		
		if(_nextStartkey) params.startkey = _nextStartkey;
		
		// ping the server for twitter data
		$.getJSON(uri, params)
			.done(_handleLoadTweets)
			.fail(function(){
				console.log("Error loading tweets!");
				HA.m.publish(HA.e.TWEETS_LOAD_ERROR);
				throw new Error("Error loading tweet data.");
			});
	}
	
	
	/**
    Handle loaded twitter data
		@private
    @method _handleLoadTweets
		@param {Object} data JSON response
		@param {String} textStatus Text status (standard jQuery)
		@param {Object} jqHXR jqHXR jQuery HXR context
   */
	function _handleLoadTweets(data, textStatus, jqHXR) {
		if(data && data.rows && _.isArray(data.rows)) {
			_tweets = data.rows;
			// _tweets = _tweets.concat(data.rows);
			_nextStartkey = data.nextStartkey;
		}
		HA.m.publish(HA.e.TWEETS_LOADED);
		_loaded = true;
	}
		
	/**
    See public method 'getTweetSet'
		@private
    @method _getTweetSet
   */	
	function _getTweetSet(start, count) {
		var end = start+count,
				set = _tweets.slice(start, end);
		console.log("TWEET SET: ", set);
		
		// if(set.length < count) {
			// _loadTweets
		// } else {
// 			
		// }
		return set;
	}
		
	/**
    Initializer.
		@public
    @method init
   */
	ns.init = _init;
	
	
	ns.loadTweets = _loadTweets;
	
	/**
    Grabs a set of tweets based on the passed variables.
		@public
    @method getTweetSet
		@param {Number} start Start index for each list
		@param {Number} count Total responses desired from each list
   */
	ns.getTweetSet = _getTweetSet;
	
	/**
	 * Determine if the tweets have been loaded.
	 * @public
	 * @method isLoaded
	 * @return {boolean}
	 */
	ns.isLoaded = function() {
		return _loaded;
	}
			
	return ns;
	
}(HA.namespace("HA.twitter"), jQuery, _, Crafty);