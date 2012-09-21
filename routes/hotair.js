/*
function(doc) {
//"id_str": "242300291976949760",
  emit(doc._id, parseInt(doc.id_str));
}
*/


var cradle = require('cradle'),
	Twit = require('twit'),
	_ = require('lodash'),
	Q = require('q');



var conn = new(cradle.Connection)(),
	db = conn.database('hotair'),
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
			console.log(err);
			return false;
		}
		
		// twitter response with since_id seems to return the since_id, so remove it to avoid duplication in db
		// if(reply.length > 0 && reply[0].id === _since_id) {
		// 			reply = reply.slice(1);
		// 		}
		
		// add extra info
		_.each(reply, function(tweet) {
			tweet.party = params.slug;
			tweet.twitter_list_screen_name = params.owner_screen_name;
			tweet.twitter_list_slug = params.slug;
			console.log("tweet.id", tweet.id);
		});
		
		// save to db
		db.save(reply, function(err, resp) {
			console.log('saved tweets');
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

function _getSinceId() {
	console.log("_getSinceId", _since_id);
	var dfd = Q.defer();
	if(!_.isNull(_since_id)) {
		dfd.resolve();
		return dfd.promise;
	}
	db.view('hotair/since_id', { group: false }, function(err, resp) {
		if(err) {
			console.log(err);
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
  res.render('home', { title: 'Hot Air' });
};

exports.play = function(req, res) {
	res.render('Play', { title: 'Hot Air' });
}

exports.reset = function(rew, res) {
	console.log("reset");
	db.all(function(err, res) {
		console.log(res);
		_.each(res, function(doc, key) {
			console.log("key", key);
			console.log("doc", doc);
			if(doc.key.indexOf("_design/") !== -1) return;
				
			db.remove(doc.key, doc.value.rev, function (err, res) {
				console.log(doc.key+"removed");
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
				log(err);
			})
			.then(function(value) {
				_getTweets(_params_d)
			}, function(err) {
				log(err);
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
	db.view('hotair/all', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
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
			i = 0, // counts the number of lists recieved
			merged = {
				"total_rows": 0, // new response object
				"rows": []
			},
			merge = function(err, resp) {
				if(resp) {
					i++;
					merged.total_rows += resp['total_rows'];
					merged.rows.concat(resp['rows']);
					if(i == 2) { //if both lists have been merged in
						_.shuffle(merged.rows); // shuffle rows
						res.send(merged); // send response
					}					
				}
			};
			
	db.view('hotair/democrats', {startKey: parseInt(startkey), limit: Math.floor(limit/2)}, merge);
	db.view('hotair/republican', {startKey: parseInt(startkey), limit: Math.floor(limit/2)}, merge);
	
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
	db.view('hotair/democrats', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
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
	db.view('hotair/republican', {startkey: parseInt(startkey), limit: limit}, function(err, resp) {
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

/*
 * Save a highscore
 * POST
 */
exports.highscore = function(req, res) {
	var data = req.body,
		respBody = {};
	db.save(data, function(db_err, db_res) {
		if (db_err) {
			respBody.error = db_err;
		} else {
			respBody.success = true;
		}
		res.send(JSON.stringify(respBody));
	});
};

/*
 * Retrieve tweets
 * POST
 */

exports.register = function(req, res) {
  var data = req.body;

  // Check if username is in use
  db.get(data.username, function(err, doc) {
    if(doc) {
      res.render('add', {flash: 'Username is in use'});

    // Check if confirm password does not match
    } else if(data.password != data.confirm_password) {
      res.render('add', {flash: 'Password does not match'});

    // Create user in database
    } else {
      delete data.confirm_password;
      db.save(data.username, data,
        function(db_err, db_res) {
          res.render('add', {flash: 'User created'});
        });
    }
  });
};
