/*
function(doc) {
//"id_str": "242300291976949760",
  emit(doc._id, parseInt(doc.id_str));
}
*/


// var cradle = require('cradle'),
// var nano = require('nano')(app.get('couchdb host')+':'+app.get('couchdb port')),
var nano_url = process.env.NODE_ENV === 'production' ? 'http://nodejitsudb198990392151.iriscouch.com:5984' : 'http://127.0.0.1:5984';
console.log("Connecting to couchdb: ", nano_url);
var nano = require('nano')(nano_url),
	Twit = require('twit'),
	_ = require('lodash'),
	Q = require('q'),
	useragent = require('useragent');
  



// var conn = new(cradle.Connection)(),
	// db = conn.database('hotair'),
var	db = nano.use('hotair'),
	T = new Twit({
 	   consumer_key:         '5uH2QAOgqIVQfe2typ5w'
	  , consumer_secret:      'PAjuPDFxLq3VCjup47nBLX0qiVT5fSyl0efUFHO47D4'
	  , access_token:         '121874224-PHWTBdicu45w3n3EI69oT84RUGoXhKN0Vw7nJVvU'
	  , access_token_secret:  'AOaSNcoio81jhpwoX5VeuBeRpkWVqFWtJwxTApkDWs'
	}),
	_since_id = null,
	_params_r = { owner_screen_name: 'tweetcongress', per_page: 100, slug: "republican" },
	_params_d = { owner_screen_name: 'tweetcongress', per_page: 100, slug: "democrats" };
	
function _getTweets(params) {
	console.log("_getTweets");
	if(!_.isNull(_since_id)) params.since_id = _since_id;
	
	T.get('lists/statuses', params, function(err, reply) {
		
		// if there's an error, return false
		if(err) {
			console.error("Error getting tweets from Twitter API", err);
			return false;
		}
		
		// twitter response with since_id seems to return the since_id, so remove it to avoid duplication in db
		// if(reply.length > 0 && reply[0].id === _since_id) {
		// 			reply = reply.slice(1);
		// 		}
		
		// add extra info
		_.each(reply, function(tweet) {
			tweet.type = "tweet";
			tweet.party = params.slug;
			tweet.twitter_list_screen_name = params.owner_screen_name;
			tweet.twitter_list_slug = params.slug;
			tweet._id = "" + tweet.id;
			// console.log("Fetched tweet from API. ID:", tweet.id);
		});
		
		// console.log(reply);
		
		// save to db
		// db.save(reply, function(err, resp) {
		db.bulk({ "docs": reply }, {}, function(err, resp) {
			if(err) {
				console.error("Error saving tweets to db", err);
			} else {
				console.log('saved tweets');	
			}
		});
		
		// update _since_id based on response
		/*console.log(params.slug, reply);
		var max = _.max(reply, function(tweet){ console.log(tweet.id); return tweet.id; });
		console.log("max: ", max.id);
		if(max.id) _since_id = max.id;
		console.log("_since_id: ", _since_id);
		*/
	});
}
/**
 * Get the id of the last tweet stored. Stores the value of this
 * in the private variable `_since_id`
 * @method _getSinceId
 * @return {Object} promise object for ajax call to hotair/since_id
 */
function _getSinceId() {
	console.log("_getSinceId", _since_id);
	
	var dfd = Q.defer(); // set up promise object
	
	// 
	if(!_.isNull(_since_id)) {
		dfd.resolve();
		return dfd.promise;
	}
	db.view('hotair', 'since_id', function(err, resp) {
		if(err) {
			console.error("Error retrieving since_id", err);
			dfd.reject(new Error(err));
			return;
		}
		console.log("since_id resp", resp);
		if(resp.length > 0 && resp[0].value.max) {
			var max = resp[0].value.max;
			console.log("max: ", max);
			_since_id = max;
		}
		dfd.resolve(resp);
	});
	return dfd.promise;
}


/*
 * GET home page.
 */

exports.home = function(req, res){
  _getSinceId();
  res.render('home', { title: 'Hot Air', slug: 'home' });
};

exports.play = function(req, res) {
	res.render('play', { title: 'Hot Air', slug: 'play' });
}

exports.survey = function(req, res) {
  res.render('survey', { title: 'Hot Air survey (private alpha)', slug: 'survey' });
}

exports.privatealpha = function(req, res) {
  res.render('privatealpha', { title: 'Hot Air (private alpha)', slug: 'privatealpha' });
}

exports.alphacomplete = function(req, res) {
  res.render('alphacomplete', { title: 'Hot Air private alpha testing expired! :(', slug: 'privatealpha' });
}


exports.notsupported = function(req, res) {
	if(useragent.is(req.headers['user-agent']).chrome || useragent.is(req.headers['user-agent']).safari) res.redirect('/');
	res.render('notsupported', { title: 'Console not supported!', slug: 'notsupported'});
}


exports.reset = function(rew, res) {
	console.log("reset");
	
	db.view('hotair', 'all', {limit: 50000}, function(err, resp) {
		console.log(resp);
	  resp.rows.forEach(function(tweet) {
	  	db.destroy(tweet.value.id, tweet.value.rev, function (err, res) {
				console.log(tweet.value.id+" removed");
			});
	  });
	});
	res.send("reseting db");
};

/*
* This action hits the twitter API
*/
exports.fetch_tweets = function(req, res) {
	console.log("fetch_tweets");
	
	
	// Check if database is populated, if so use since_id
	
	_getSinceId()
		.then(function(value) {
			_getTweets(_params_r)
		}, function(err) {
			console.log("Error fetching republican tweets", err);
		})
		.then(function(value) {
			_getTweets(_params_d)
		}, function(err) {
			console.error("Error fetching democratic tweets", err);
		})
		.fail(function(err) {
			console.error("getSinceId() failed", error);
		});
	
	// _getTweets(_params_r);
	// _getTweets(_params_d);
	
	if(!res) return;
	res.send("loading tweets");
	
	// db.save('_design/tweets', {
	// 		all: {
	// 			map: function (doc) {
	//  				if (doc.user && doc.text) emit(doc.user.name, doc.text);
	// 			}
	// 		}
	// 	});
	
	// var data = req.body;
	
	// db.view('tweets/all', function(err, resp) {
	//    	console.log("resp", resp);
	// 	var out = [];
	//     if(resp) {
	// 		resp.forEach(function(row) {
	// 	   	  out.push(row);	
	// 	   	});
	// 	}
	//    	console.log("out", out);
	// 	res.send(out);
	// });
}

exports.all = function(req, res) {
	var startkey = req.query.startkey || 0,
		limit = req.query.limit || 100;
	console.log("startkey: ", typeof startkey);
	db.view('hotair', 'all', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
	   	// console.log("resp", resp);
		var out = [];
	    if(resp) {
			res.send(resp);
			return;
			resp.forEach(function(row) {
		   	  out.push(row);	
		   	});
		}
	   	console.log("out", out);
		res.send(out);
	});
}

/**
  Loads merged tweets (both dem + republican).
	@param {Number} startkey Start index
	@param {Number} limit Number of responses to retrieve. If this is an odd number it will be reduced by 1.
*/
exports.load_tweets = function(req, res) {
	var startkey = req.query.startkey || 0,
			limit = req.query.limit || 100,
			numPerSet = req.query.numPerSet || 10,
			i = 0, // counts the number of lists recieved
			a = [],
			b = [],
			aLen,
			bLen,
			smallerSetLen,
			numSets,
			merged = { // new response object
				"total_rows": 0, 
				"rows": [],
			},
			// handle merging data
			merge = function(err, resp) {
				if(err) {
					console.error("Error loading tweets from db", err);
				}
				if(resp) {
					i++;
					merged.total_rows += resp.total_rows;
					// merged.rows = merged.rows.concat(resp.rows);
					if(i == 1) {
						a = resp.rows;
						aLen = a.length;
					}
					if(i == 2) { //if both lists have been merged in
						b = resp.rows;
						bLen = b.length;
						
						smallerSetLen = aLen < bLen ? aLen : bLen;
						
						for(var j=0; j<smallerSetLen; j+=1) {
							merged.rows.push(a[j]);
							merged.rows.push(b[j]);
						}
						
						numSets = Math.floor(smallerSetLen/numPerSet);
						
						for(var k=0; k<numSets; k+=1) {
							var temp = merged.rows.slice(k, numPerSet);
							temp = _.shuffle(temp);
							
							// insert an array into another array
							var args = [k, numPerSet].concat(temp);
							Array.prototype.splice.apply(merged.rows, args);
						}
						
						res.send(merged); // send response
					}					
				}
			};

	// query database
	db.view('hotair', 'democrats', {startKey: parseInt(startkey), limit: Math.floor(limit/2), descending: true}, merge);
	db.view('hotair', 'republican', {startKey: parseInt(startkey), limit: Math.floor(limit/2), descending: true}, merge);
	
}

/**
  Loads tweets from democrats
	@param {Number} startkey Start index
	@param {Number} limit Number of responses to retrieve
 */
exports.democrats = function(req, res) {
	var startkey = req.query.startkey || 0,
		limit = req.query.limit || 100;
	console.log("startkey: ", typeof startkey);
	db.view('hotair', 'democrats', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
	   	// console.log("resp", resp);
		var out = [];
	  if(resp) {
			res.send(resp);
			return;
			// resp.forEach(function(row) {
			// 		   	  out.push(row);	
			// 		   	});
		}
		// 	   	console.log("out", out);
		// res.send(out);
	});
}

// TODO: change to 'republicans'
exports.republican = function(req, res) {
	var startkey = req.query.startkey || 0,
		limit = req.query.limit || 100;
	console.log("startkey: ", typeof startkey);
	db.view('hotair', 'republican', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
	   	// console.log("resp", resp);
		var out = [];
	  if(resp) {
			res.send(resp);
			return;
			// resp.forEach(function(row) {
			// 		   	  out.push(row);	
			// 		   	});
		}
		// 	   	console.log("out", out);
		// res.send(out);
	});
}

/**
 * Get a list of highscores
 */
exports.highscores = function(req, res) {
	
	var data = {
				'stats': {
					'r': null, // number
					'd': null // number
				},
				'highscores': null // array
		},
		checkData = function() {
			return (_.isNumber(data.stats.r) 
							&& _.isNumber(data.stats.d)
							&& _.isArray(data.highscores));
		},
		handle_cumscore_r = function(err, resp) {
			if(err) console.error("Error loading republican cumulateive score from db", err);
			if(resp && resp.rows) {
				data.stats.r = resp.rows.length > 0 ? parseInt(resp.rows[0].value) : 0;
			}
			if(checkData()) res.send(JSON.stringify(data));
		},
		handle_cumscore_d = function(err, resp) {
			if(err) console.error("Error loading democrat cumulateive score from db", err);
			if(resp && resp.rows) {
				data.stats.d =  resp.rows.length > 0 ? parseInt(resp.rows[0].value) : 0;
			}
			if(checkData()) res.send(JSON.stringify(data));			
		},
		handle_highscores = function(err, resp) {
			if(err) console.error("Error loading highscores from db", err);
		  if(resp && resp.rows) {
		  	data.highscores = [];
				resp.rows.forEach(function(row) {
		   	  data.highscores.push(row.value);	
		   	});
			}
			if(checkData()) res.send(JSON.stringify(data));			
		}
	
	db.view('hotair', 'cumscore_r', {limit: 5, descending: true}, handle_cumscore_r);
	db.view('hotair', 'cumscore_d', {limit: 5, descending: true}, handle_cumscore_d);
	db.view('hotair', 'highscores', {limit: 5, descending: true}, handle_highscores);
}

exports.score = function(req, res) {
	if(req.params.id) {
		db.get(req.params.id, function(db_err, db_res) {
			// error check
			if(db_err) {
				console.error("Error loading high score", db_err);
				res.send(404, 'Sorry, we cannot find that!');
			}
			// 404 if it's the wrong doc type
			if(db_res.type !== 'score') res.send(404, 'Sorry, we cannot find that!');
			// otherwise render template
			else res.render('score', { data: db_res, title: "Score!", slug: 'score'});
		});		
	} else res.redirect('/'); // redirect if no id

}

/*
 * Save a highscore
 * POST
 */
exports.highscore = function(req, res) {
	var data = req.body,
		respBody = {};
	console.log("highscore: ", data);
	// db.save(data, function(db_err, db_res) {
	db.insert(data, function(db_err, db_res) {
		if (db_err) {
			console.error("Error saving high score", db_err)
			respBody.error = db_err;
		} else {
			respBody.success = true;
		}
		res.send(JSON.stringify(respBody));
	});
};

exports.notfound = function(req, res) {
	res.send(404, "Page not found!");
}


// exports.register = function(req, res) {
  // var data = req.body;
// 
  // // Check if username is in use
  // db.get(data.username, function(err, doc) {
    // if(doc) {
      // res.render('add', {flash: 'Username is in use'});
// 
    // // Check if confirm password does not match
    // } else if(data.password != data.confirm_password) {
      // res.render('add', {flash: 'Password does not match'});
// 
    // // Create user in database
    // } else {
      // delete data.confirm_password;
      // db.save(data.username, data,
        // function(db_err, db_res) {
          // res.render('add', {flash: 'User created'});
        // });
    // }
  // });
// };
