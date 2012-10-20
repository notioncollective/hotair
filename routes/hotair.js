
// couchdb connection credentials
var nano_url = process.env.NODE_ENV === 'production' ? 'https://hotair_user:manifest_destiny@nodejitsudb198990392151.iriscouch.com:6984' : 'http://127.0.0.1:5984';
console.log("Connecting to couchdb");

var nano = require('nano')(nano_url)
	, Twit = require('twit')
	, _ = require('lodash')
	, Q = require('q')
	, useragent = require('useragent')
	, querystring = require('querystring')
	, nodemailer = require("nodemailer");
  
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



function _buildTweetUrl(score) {
	var hotAirTwitter = "hotairgame",
			tweet_url = "https://twitter.com/share?",
			params = {
				url:"http://hotairgame.com/",
				text: "Test your political meddle with @"+hotAirTwitter+"!"		
			};

			
	if(_.isObject(score) && score.type === 'score') {
		params.url = "http://hotairgame.com/score/"+score._id;
		params.text = "I just got a #score of "+score.score+" on @"+hotAirTwitter+"!";		
	}
			
	tweet_url = tweet_url+querystring.stringify(params);

	console.log("tweet url: ", tweet_url);
	return tweet_url;
}

function _buildFacebookUrl(score) {
	var facebook_url = "http://www.facebook.com/dialog/feed?",
			params = {
				name: "Test your political meddle with Hot Air!",
				app_id: "155380987937796",
				link: "http://hotairgame.com/",
				caption: "Play the game",
				description: "Hot Air is a web-based arcade game that uses congressional Twitter data to test your ability to understand the Democrat-vs-Republican divide.",
				picture: "http://hotairgame.com/img/share_img.png",
				redirect_uri: "http://hotairgame.com/"
			};
			
	if(_.isObject(score) && score.type === 'score') {
		params.name = "I just scored "+score.score+" points playing Hot Air!";
		params.link = "http://hotairgame.com/score/"+score._id;
		params.caption = "Hot Air score page";
		params.picture = "http://hotairgame.com/img/" + score.party + "_share_img.png";
		params.redirect_uri = "http://hotairgame.com/score/"+score._id;
	}
	
	facebook_url = facebook_url+querystring.stringify(params);

	console.log("facebook url: ", facebook_url);
	return facebook_url;
}

function _sendEmail(from_name, from_email, email_body, callback, context) {
	console.log("sending email");
	var smtp = nodemailer.createTransport(
				"SMTP",
				{
					service: "Gmail",
					auth: {
						user: 'hotair@notioncollective.com',
						pass: 'Madi50nW1'
					}
				}
			),
			options = {
				from: from_name+' <'+from_email+'>',
				to: "Hot Air <hotair@notioncollective.com>",
				subject: "Hot Air contact form submission",
				text: email_body,
				html: '<p>'+email_body+'<p>'
			},
			context = context || this;
			
		
	smtp.sendMail(options, function(err, res){ callback.apply(context, [err, res]); });
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
			if(!_.isString(db_res.type) || db_res.type !== 'score') res.send(404, 'Sorry, we cannot find that!');
			// otherwise render template
			else res.render('score', {
				data: db_res,
				title: "Score!",
				slug: 'score',
			});
		});		
	} else res.redirect('/'); // redirect if no id

}

/* GET */
exports.contact = function(req, res) {
	res.render('contact', {title: "Drop us a line!", slug: "contact"});
}

/* POST */
exports.contact_send = function(req, res) {
	console.log("send email: ", req.body );
	_sendEmail(
			req.body.from_name,
			req.body.from_email,
			req.body.email_body,
			function(em_err, em_res){
				console.log("send email response ",em_err,em_res);
				if(em_err) res.send({"errors":["There was an error sending the email"]});
				else res.send(JSON.stringify(em_res));
			}
	);
}

/*
 * Handles share actions for the following endpoints
 * 
 * /share/score/{service}/{score id}
 * redirect to a share action for the selected service for a specific score
 * 
 * /share/{service}
 * redirect to a general share action for the selected service
 * 
 * /share
 * render the share page
 * 
 * Available share services:
 * - facebook
 * - twitter
 * 
 * GET
 */
exports.share = function(req, res) {
	if(req.params.service) {
		switch(req.params.service) {
			case "twitter":
				// twitter score share
				if(req.params.action && req.params.action === 'score') {
					// get score data then build share url
					db.get(req.params.id, function(err, data) {
						if(err) res.send(404, "Not found!");
						else res.redirect(_buildTweetUrl(data));
					});
				// otherwise, generic twitter share
				} else res.redirect(_buildTweetUrl());
				break;
			case "facebook":
				// facebook score share
				if(req.params.action && req.params.action === 'score') {
					// get score data then build share url
					db.get(req.params.id, function(err, data) {
						if(err) res.send(404, "Not found!");
						else res.redirect(_buildFacebookUrl(data));
					});
				// otherwise, generic facebook share
				} else res.redirect(_buildFacebookUrl());
				break;
			default:
				res.send(404, "Not found!");
				break;
		}
	// otherwise, render generic share page
	} else res.render('share', {
				title: "Share hot air!",
				slug: 'share',
		});
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
	db.insert(data, function(err, body, header) {
		if (err) {
			console.error("Error saving high score", err)
			respBody.error = err;
		} else {
			respBody = body;
		}
		res.send(respBody);
	});
};

/**
 * Save a data point to the db and to google analytics
 * @param {Object} req
 * @param {Object} res
 */
exports.data = function(req, res) {
	var data = req.body,
		respBody = {};
	console.log("data: ", data);
	// db.save(data, function(db_err, db_res) {
	db.insert(data, function(db_err, db_res) {
		if (db_err) {
			console.error("Error saving data", db_err)
			respBody.error = db_err;
		} else {
			respBody.success = true;
		}
		res.send(respBody);
	});
}

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
