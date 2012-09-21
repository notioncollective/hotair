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
	
	var _load = function(u,l,c,p,o) {
		console.log("HA.twitter._load()");
		var that = this,
				uri='http://localhost:3000/'+l+'?callback=?';
		console.log(uri);
		$.getJSON(uri, function(r) {
			console.log("Twitter loaded");
			// maybe change to use the "apply" method to manage scoping
			that._handleLoad(r, o, that);
	});
		
	// r = response, o = extra data (party, so far), self = Crafty.Twitter
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
	
	
	var _getTweetSet = function(start, count) {
		var end = start+count,
			r = _r.slice(start, end),
			d = _d.slice(start, end);
		var set = _.shuffle(r.concat(d));
		console.log("getTweetSet", set);
		return set;
	};
		
	// PUBLIC	
	ns.init = _init;
	ns.getTweetSet = _getTweetSet;
			
	return ns;
	
}(HA.namespace("HA.twitter"), jQuery, _, Crafty);