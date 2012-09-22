// HA.twitter namespace
HA.twitter = function(ns, $, _, C) {
	
	// PRIVATE
	var _options = {},
			_defaults = {
				protocol: 'http://',
				domain: 'localhost:3000',
				load_tweets_endpoint: '/load_tweets',
				tweet_limit: 100
			},
			_tweets = [];
	
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
		_loadTweets({ startKey: 0, limit: _options.tweet_limit });
		
		// var test = "test" in _options ? true : false;
		// if(test === false) {
		// 	console.log("test is null");
		// 	_load(_options.user, _options.d_list, 10, _page, {party:"d"});
		// 	_load(_options.user, _options.r_list, 10, _page, {party:"r"});
		// } else if(test === true) {
		// 	console.log("loading test data");
		// 	_handleLoad(REPUBLICANS_SAMPLE, {party: "r"});
		// 	_handleLoad(DEMOCRATS_SAMPLE, {party: "d"});
		// }
	}
	
	/**
    Load twitter data.
		@private
    @method _loadTweets
		@param {Object} params A map of querystring parameters for the request. Common parameters are `startKey` and `limit`.
   */
	// TODO: refactor this function! many arguments aren't even used!
	function _loadTweets(params) {
		var uri = _options.protocol;
				uri += _options.domain;
				uri += _options.load_tweets_endpoint;
		params = params || {};		
		
		// ping the server for twitter data
		$.getJSON(uri, params)
			.done(_handleLoadTweets)
			.fail(function(){ throw "Error loading tweet data."; });
		
		// var uri='http://'+_options.uri+'/'+l+'?callback=?';
		// console.log(uri);
		// $.getJSON('http://'++, function(r) {
		// 	console.log("Twitter loaded");
		// 	// maybe change to use the "apply" method to manage scoping
		// 	_handleLoad(r, o, that);
		// });
	}
	
	
	/**
    Load twitter data.
		@private
    @method _load
		@param {String} u endpoint uri _(not currently used!)_.
		@param {String} l Twitter list name.
		@param {String} c callback _(not currently used!)_.
		@param {Number} p page?? _(not currently used!)_
		@param {Object} o options (currently used to set party -- `{party: 'r'}`)
   */
	// function _loadTwitterList(list) {
	// 	var uri = _options.protocol;
	// 	uri += _options.domain;
	// 	uri += list
	// 	$.getJSON()
	// }


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
			_tweets = _tweets.concat(data.rows);
		}
		HA.m.publish(HA.e.TWEETS_LOADED);
	}
		
	/**
    Load twitter data.
		@private
    @method _load
		@param {Object} r JSON response
		@param {Object} o options (currently used to set party -- `{party: 'r'}`)
		@param {Object} that Scoping variable _(shouldn't be necessary with module pattern)_
   */
	// r = response, o = extra data (party, so far), that = HA.twitter

	// function _handleLoad(r, o, that) {
	// 	console.log("Handling Load : "+o.party);
	// 	
	// 	_options[o.party] = _.map(r, function(tweet) {
	// 		return {id: tweet.key, name: tweet.value.name, screen_name: tweet.value.screen_name, party: tweet.value.party, text: tweet.value.text};
	// 	});
	// 	if(_options.d.length > 0 && _options.r.length > 0) {
	// 		// merge the two arrays
	// 		_tweets = _.shuffle(_options.d.concat(_options.r));
	// 		// self.callback(self.all);
	// 		// Crafty.scene("gameplay");
	// 		// Crafty.scene("start");
	// 		return;
	// 	}
	// }
	
	/**
    See public method `getTweetSet'
		@private
    @method _getTweetSet
   */	
	function _getTweetSet(start, count) {
		var end = start+count,
				set = _tweets.slice(start, end);
		// TODO: logic is needed to load new tweets when nearing the end
		// 	r = _options.r.slice(start, end),
		// 	d = _options.d.slice(start, end);
		// var set = _.shuffle(r.concat(d));
		// console.log("getTweetSet", set);
		return set;
	}
		
	/**
    Initializer.
		@public
    @method init
   */
	ns.init = _init;
	
	/**
    Grabs a set of tweets based on the passed variables.
		@public
    @method getTweetSet
		@param {Number} start Start index for each list
		@param {Number} count Total responses desired from each list
   */
	ns.getTweetSet = _getTweetSet;
			
	return ns;
	
}(HA.namespace("HA.twitter"), jQuery, _, Crafty);