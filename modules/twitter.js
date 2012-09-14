var Twit = require('twit');

exports.HotairTwitter = function(Twit) {
	var user = 'tweetcongress';
	d_list: 'democrats',
	r_list: 'republican',
	d: [],
	r: [],
	page: 0,
	tweets: [],		// Array of tweets in format { raw, party, text, name, img }, where raw = raw twitter response object
	var T = new Twit({
	    consumer_key:         '5uH2QAOgqIVQfe2typ5w'
	  , consumer_secret:      'PAjuPDFxLq3VCjup47nBLX0qiVT5fSyl0efUFHO47D4'
	  , access_token:         '121874224-PHWTBdicu45w3n3EI69oT84RUGoXhKN0Vw7nJVvU'
	  , access_token_secret:  'AOaSNcoio81jhpwoX5VeuBeRpkWVqFWtJwxTApkDWs'
	});
	
	return {
		
		init: function(test) {			
			if(test === undefined) {
				console.log("test is null");
				this.load(this.user, this.d_list, 10, this.page, {party:"d"});
				this.load(this.user, this.r_list, 10, this.page, {party:"r"});
			} else if(test === true) {
				console.log("loading test data");
				// REPUBLICANS_SAMPLE = REPUBLICANS_SAMPLE.slice(0,1); 
				// DEMOCRATS_SAMPLE = DEMOCRATS_SAMPLE.slice(0,1); 
				this.handleLoad(REPUBLICANS_SAMPLE, {party: "r"}, this);
				this.handleLoad(DEMOCRATS_SAMPLE, {party: "d"}, this);
			}
		},
		load: function(u,l,c,p,o) {
			console.log("Crafty.Twitter.load()");
			var self = this;
			var uri='https://api.twitter.com/1/lists/statuses.json?owner_screen_name='+u+'&slug='+l+'&per_page='+c+'&page='+p+'&include_rts=1&callback=?';
			console.log(uri);
			$.getJSON(uri, function(r) {
				console.log("Twitter loaded");
				self.handleLoad(r, o, self);
			});
		},
		// r = response, o = extra data (party, so far), self = Crafty.Twitter
		handleLoad: function(r, o, self) {
			console.log("Handling Load : "+o.party);
			$.each(r, function(index, value) {
				value.party = o.party;
				// self.tweets.push({raw: value, party: o.party, text: value.text, name: value.user.name, img: value.user.profile_image_url});
			});

			self[o.party] = r;
			if(self.d.length > 0 && self.r.length > 0) {
				// merge the two arrays
				self.tweets = _.shuffle(self.d.concat(self.r));
				// self.callback(self.all);
				// Crafty.scene("gameplay");
				Crafty.scene("start");
				return;
			}
		},
		getTweetSet: function(start, count) {
			var end = start+count,
				r = this.r.slice(start, end),
				d = this.d.slice(start, end);
			var set = _.shuffle(r.concat(d));
			console.log("getTweetSet", set);
			return set;
		}
	}
};

