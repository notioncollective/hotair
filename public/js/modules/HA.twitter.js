// HA.twitter namespace
HA.twitter = function(ns, $, _, C) {
	
	// PRIVATE
	var _options = {},
			_defaults = {
				user: 'tweetcongress',
				d_list: 'democrats',
				r_list: 'republican',
			},
			_d = [],
			_r = [],
			_page = 0,
			_tweets = [];
	
	/**
    See public documentation for `init`
		@private
    @method _init
   */		
	var _init = function(options) {
			console.log("test is null");
			_load(_options.user, _options.d_list, 10, _page, {party:"d"});
			_load(_options.user, _options.r_list, 10, _page, {party:"r"});
		} else if(test === true) {
			console.log("loading test data");
			// REPUBLICANS_SAMPLE = REPUBLICANS_SAMPLE.slice(0,1); 
			// DEMOCRATS_SAMPLE = DEMOCRATS_SAMPLE.slice(0,1); 
			_handleLoad(REPUBLICANS_SAMPLE, {party: "r"}, this);
			_handleLoad(DEMOCRATS_SAMPLE, {party: "d"}, this);
		}
	};
	
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
	// TODO: refactor this function! many arguments aren't even used!
	var _load = function(u,l,c,p,o) {
		console.log("HA.twitter._load()");
		var that = this,
				uri='http://localhost:3000/'+l+'?callback=?';
		console.log(uri);
		$.getJSON(uri, function(r) {
			console.log("Twitter loaded");
			// maybe change to use the "apply" method to manage scoping
			_handleLoad(r, o, that);
	});
		
	/**
    Load twitter data.
		@private
    @method _load
		@param {Object} r JSON response
		@param {Object} o options (currently used to set party -- `{party: 'r'}`)
		@param {Object} that Scoping variable _(shouldn't be necessary with module pattern)_
   */
	// r = response, o = extra data (party, so far), that = HA.twitter
	_handleLoad: function(r, o, that) {
		console.log("Handling Load : "+o.party);
		// $.each(r, function(index, value) {
			// // value.party = o.party;
			// // self.tweets.push({raw: value, party: o.party, text: value.text, name: value.user.name, img: value.user.profile_image_url});
		// });
		
		that[o.party] = _.map(r, function(tweet) {
			return {id: tweet.key, name: tweet.value.name, screen_name: tweet.value.screen_name, party: tweet.value.party, text: tweet.value.text};
		});
		if(that.d.length > 0 && that.r.length > 0) {
			// merge the two arrays
			that.tweets = _.shuffle(that.d.concat(that.r));
			// self.callback(self.all);
			// Crafty.scene("gameplay");
			Crafty.scene("start");
			return;
		}
	},
	
	/**
    See public method `getTweetSet'
		@private
    @method _getTweetSet
   */	
	// TODO: the passed variables should pull from the aggregate list, not separately from each list
	var _getTweetSet = function(start, count) {
		var end = start+count,
			r = _r.slice(start, end),
			d = _d.slice(start, end);
		var set = _.shuffle(r.concat(d));
		console.log("getTweetSet", set);
		return set;
	};
		
	// PUBLIC	
	/**
    Initializer.
		@public
    @method init
   */
	ns.init = _init;
	/**
    Grabs a set of tweets based on the passed variables. Currently the `start` and `count` apply to each list (republican/democrat) independantly, the result count will be 2x the `count` value.
		@public
    @method getTweetSet
		@param {Number} start Start index for each list
		@param {Number} count Total responses desired from each list
   */
	ns.getTweetSet = _getTweetSet;
			
	return ns;
	
}(HA.namespace("HA.twitter"), jQuery, _, Crafty);