
// couchdb connection credentials
var nano_url = process.env.NODE_ENV === 'production' ? 'https://hotair_user:manifest_destiny@nodejitsudb198990392151.iriscouch.com:6984' : 'http://127.0.0.1:5984';
console.log("Connecting to couchdb");

var nano = require('nano')(nano_url)
	, Twit = require('twit')
	, _ = require('lodash')
	, Q = require('q')
	, useragent = require('useragent')
	, querystring = require('querystring')
	, nodemailer = require("nodemailer")
	, hash = require("node_hash")
	, uuid = require("node-uuid");
  
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

function _sendEmail(data, callback, context) {
	console.log("sending email");
	if(
			!_.isString(data.from_name)
			|| !_.isString(data.from_email)
			|| !_.isString(data.message)
	) { callback.apply(context, [["All form fields are required."]])}
	
	var from_name = data.from_name,
			from_email = data.from_email,
			message = data.message,
			smtp = nodemailer.createTransport(
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
				text: "",
				html: ""
			},
			context = context || this,
			text = "",
			html = "";
	
	_.each(data, function(value, key) {
		options.text += key+":\n"+value+"\n-----\n";
		options.html += '<p><b>'+key+'</b></p>'+'<p>'+value+'</p><hr/>';
	});
		
	smtp.sendMail(options, function(err, res){ callback.apply(context, [err, res]); });
}

function _checkHighScore(score, interval) {
	if(!_.isNumber(score) || !_.isString(interval)) throw new Error("Illegal arguments in _checkHighScore");
	
	console.log("_checkHighScore", score, interval);
	var deferred = Q.defer(),
			today = Date.parse(new Date().toDateString()),
			scores_view = 'highscores',
			params = {
				reduce: true,
				group: false,
				descending: true
			};
			
	switch(interval) {
		case 'all-time':
			params.endkey = [score+1];
			break;
		case 'daily':
			scores_view = 'highscores_by_day';
			params.endkey = [parseInt(today),score+1];
			break
	}
	
	function handle_db_response(err, body) {
		console.log("handle_db_response");
		if(err) {
			console.error("error checking score");			
			deferred.reject(err);
		}
		console.log("check high scores resp body", body);
		if(body && body.rows) {
			var value = (body.rows.length < 1) ? 0 : body.rows[0].value;
			deferred.resolve(value);				
		} else deferred.reject("unable to parse db response");
	};
	
	
	db.view('hotair', scores_view, _.clone(params), handle_db_response);	
	
	return deferred.promise;
}

function _getHighScores(interval) {
	if(!_.isString(interval)) throw new Error("must pass interval to _getHighScores");

	console.log("_getHighScores: ", interval);

	var q = Q.defer(),
			cumscore_q = Q.defer(),
			highscores_q = Q.defer(),
			today = Date.parse(new Date().toDateString()),
			scores_view = 'highscores',
			stats_view = 'cumscore',
			highscores_params = {
				limit: 5,
				descending: true,
				reduce: false
			},
			stats_params = {},
			response = {
				"stats" : {
					"d" : 0,
					"r" : 0
				},
				"highscores": []
			};
	
	switch(interval) {
		case 'all-time':
			stats_params.group_level = 1;
			break;
		case 'daily':
			scores_view = 'highscores_by_day';
			stats_params.group = true;
			stats_params.keys = [["d",parseInt(today)],["r",parseInt(today)]];
			highscores_params.endkey = [parseInt(today)];
			break;
		default:
			throw new Error("Invalid high score interval");
			break;
	}
	
	// deferred functions	
	function handle_cumscore(err, body) {
		console.log("handle_cumscore");
		if(err) {
			console.error("error getting cumscores from couchdb");			
			cumscore_q.reject(err);
		}
		if(body && body.rows) {
			_.each(body.rows, function(obj){
				response.stats[obj.key[0]] = obj.value;
			});
			cumscore_q.resolve(body.rows);
		}
		return cumscore_q.promise;
	};
	
	function handle_highscores(err, body) {
		console.log("handle_highscores");
		if(err) {
			console.error("error getting highscores from couchdb");
			highscores_q.reject(err);
		}
	  if(body && body.rows) {
			response.highscores = _.map(body.rows, function(obj) {
				return obj.value;
			});
			highscores_q.resolve(body.rows);
			db.view('hotair', stats_view, _.clone(stats_params), handle_cumscore);
		}
		return highscores_q.promise;
	}	
		
	Q.when(highscores_q.promise, function(data){
		console.log("highscores resolved", data);
	});
		
	Q.when(cumscore_q.promise, function(data){
		console.log("cumscores resolved", data);
	});
	
	Q.allResolved(cumscore_q.promise, highscores_q.promise)
	.then(function(promises) {
		console.log("all resolved");
		q.resolve(response);
	});
	
	// couchdb calls
	console.log("stats_params", stats_params);
	db.view('hotair', scores_view, _.clone(highscores_params), handle_highscores);
	// db.view('hotair', stats_view, _.clone(stats_params), handle_cumscore);

	
	return q.promise;
}

/*
 * GET home page.
 */

exports.home = function(req, res){
	console.log("session: ", req.session);
  _getSinceId();
  // res.render('home', { title: 'Hot Air', slug: 'home' });
  res.render('play', { title: 'Hot Air', slug: 'play' });
};

exports.play = function(req, res) {
	// res.render('play', { title: 'Hot Air', slug: 'play' });
	res.redirect('/');
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

exports.newsletter = function(req, res) {
	res.render('newsletter', {title: "Sign up for the Hot Air newsletter!", slug: "newsletter"})
}


exports.notsupported = function(req, res) {
	// if(useragent.is(req.headers['user-agent']).chrome 
		// || (useragent.is(req.headers['user-agent']).safari && !useragent.is(req.headers['user-agent']).mobile_safari)
		// || useragent.is(req.headers['user-agent']).firefox) res.redirect('/');
	res.render('notsupported', { title: 'Hot Air - Master the (arcade) game of #politics.', slug: 'notsupported'});
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
	var numPerSet = parseInt(req.query.numPerSet) || 10,
			limit = req.query.limit || 100,
			params = {
				limit: Math.floor(limit/2)+1,
				descending: true
			},
			i = 0, // counts the number of lists recieved
			a = [],
			b = [],
			aLen,
			bLen,
			smallerSetLen,
			lastRow,
			minKey,
			numSets,
			temp,
			merged = { // new response object
				"total_rows": 0, 
				"rows": [],
			},
			shuffled = {
				"total_rows": 0,
				"rows": []
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
						lastRow = _.last(a);
						minKey = lastRow.key;
						a.pop();
						aLen = a.length;
					}
					if(i == 2) { //if both lists have been merged in
						b = resp.rows;
						lastRow = _.last(b);
						minKey = lastRow.key < minKey ? lastRow.key : minKey;
						b.pop();
						bLen = b.length;
						smallerSetLen = aLen < bLen ? aLen : bLen;
						
						for(var j=0; j<smallerSetLen; j+=1) {
							merged.rows.push(a[j]);
							merged.rows.push(b[j]);
						}
						
						numSets = Math.floor(merged.rows.length/numPerSet);
						
						console.log(aLen, bLen, numSets, numPerSet, merged.rows.length);
						
						for(var k=0; k<numSets; k+=1) {
							temp = _.shuffle(merged.rows.slice(k*numPerSet, k*numPerSet+numPerSet));
							
							// insert an array into another array
							var args = [k*numPerSet, numPerSet].concat(temp);
							Array.prototype.splice.apply(merged.rows, args);
						}
						
						merged.nextStartkey = minKey;
						res.send(merged); // send response
					}
				}
			};
			
	if(req.query.startkey) {
		params.startkey = req.query.startkey;
	}

	// query database
	db.view('hotair', 'democrats', params, merge);
	db.view('hotair', 'republican', params, merge);
	
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

exports.check_highscore = function(req, res) {
	console.log("check_highscore");
	var allowed = ['all-time', 'daily'],
			interval = _.indexOf(allowed, req.params.interval) >= 0 ? req.params.interval : undefined;
	if(interval && req.params.score) {
		_checkHighScore(parseInt(req.params.score), interval)
			.then(function(n) { res.send(JSON.stringify(n)); })
			.fail(function(error) { console.error(error); })		
	}	else if(req.params.score) {
		var deferred = Q.defer(),
				promises = [],
				all_checks = {};
		_.each(allowed, function(value){
			promises.push(_checkHighScore(parseInt(req.params.score), value));
			Q.when(promises[promises.length-1], function(n){
				all_checks[value] = n;
			})
		})
		
		Q.allResolved(promises)
		.then(function(){
			res.send(JSON.stringify(all_checks));
		});		
	}
}

/**
 * Get a list of highscores
 */
exports.highscores = function(req, res) {
	// console.log("req.params.interval",req.params.interval);
	var allowed = ['all-time', 'daily'],
			interval = _.indexOf(allowed, req.params.interval) >= 0 ? req.params.interval : undefined;
	// console.log("interval",interval);
	if(interval) {
		_getHighScores(interval)
			.then(function(data) { res.send(JSON.stringify(data)); })
			.fail(function(error) { console.error(error); })
	} else {
		var deferred = Q.defer(),
				promises = [],
				all_scores = {};
		_.each(allowed, function(value){
			promises.push(_getHighScores(value));
			Q.when(promises[promises.length-1], function(data){
				all_scores[value] = data;
			})
		})
		
		Q.allResolved(promises)
		.then(function(){
			res.send(500, JSON.stringify(all_scores));
		});
	}

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
	var data = {
		type: "email",
		from_name: req.body.from_name,
		from_email: req.body.from_email,
		message: req.body.email_body,
		timestamp: Date.now(),
		ip: req.ip
	},
	send_callback = function(em_err, em_res){
				console.log("send email response ",em_err,em_res);
				if(em_err) res.send({"errors":["There was an error sending the email"]});
				else res.send(JSON.stringify(em_res));
	};
	
	// insert the email
	db.insert(data, function(err, body, header) {
		if (err) {
			console.error("Error inserting email into database", err)
			_sendEmail(data, send_callback);
		} else {
			console.log("email data successfully inserted");
			data.record_id = body.id;
			_sendEmail(data, send_callback);
		}
	});
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
	if(!req.params.service) {
		res.render('share', {
				title: "Share hot air!",
				slug: 'share',
		});
	} else {
		var doc = {
			type: "share",
			ip: req.ip,
			timestamp: Date.now(),
			service: req.params.service
		},
		// callback for the share data db insert
		share_insert = function(err, body, header) {
			if(err) console.error('error saving share data', err);
			else console.log('saved share data to db');
		};

		switch(req.params.service) {
			case "twitter":
				// twitter score share
				if(req.params.action && req.params.action === 'score') {
					// get score data then build share url
					db.get(req.params.id, function(err, data) {
						if(err) res.send(404, "Not found!");
						else {
							doc.score_id = req.params.id;
							// insert doc for share
							db.insert(doc, share_insert);
							// redirect no matter what
							res.redirect(_buildTweetUrl(data));	
						}
					});
				// otherwise, generic twitter share
				} else {
					db.insert(doc, share_insert);
					res.redirect(_buildTweetUrl())
				};
				break;
			case "facebook":
				// facebook score share
				if(req.params.action && req.params.action === 'score') {
					// get score data then build share url
					db.get(req.params.id, function(err, data) {
						if(err) res.send(404, "Not found!");
						else {
							doc.score_id = req.params.id;
							// insert doc for share
							db.insert(doc, share_insert);
							// redirect no matter what
							res.redirect(_buildFacebookUrl(data));	
						}
					});
				// otherwise, generic facebook share
				} else {
					res.redirect(_buildFacebookUrl());
				}
				break;
			default:
				res.send(404, "Not found!");
				break;
		}
	// otherwise, render generic share page
	}
}

/*
 * Save a highscore
 * POST
 */
exports.highscore = function(req, res) {
	var data = req.body,
		respBody = {},
		sess = req.session;
	console.log("highscore: ", data);
	console.log("session: ", sess);
	
	// make sure there is an active game in this session, and that the hit count matches the expected (in session's game object)
	if(!sess.game || (data.hits !== sess.game.hitCount+1 && data.hits !== sess.game.hitCount)) {
		res.send({"error": "Error saving score."});
		return;
	}
	
	// add timestamp, IP address, and user_token
	data.timestamp = Date.now();
	data.user_token = sess.user_token;
	data.ip = req.ip;
	
	db.insert(data, function(err, body, header) {
		if (err) {
			console.error("Error saving high score", err)
			respBody.error = err;
		} else {
			respBody = body;
		}
		delete sess.game;
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
		respBody = {},
		sess = req.session;
	
	// add IP address and user_token
	data.user_token = sess.user_token;
	data.ip = req.ip;
	data.timestamp = Date.now();
	
	// if this is a "hit", add to session game.
	if(data.type === "hit") {
		sess.game.hitCount += 1;
	}
	
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


/**
 * Create a new game object in the db
 * @param {Object} req
 * @param {Object} res
 */
exports.startGame = function(req, res) {
	var 
		sess = req.session,
		data = req.body,
		game_id = uuid.v1(),
		data = {
			_id: game_id,
			type: "game",
			timestamp: Date.now(),
			party: data.party,
			user_token: sess.user_token,
			ip: req.ip
		},
		respBody = {};
	sess.game = {"_id":game_id, hitCount: 0};
	db.insert(data, function(db_err, db_res) {
		if (db_err) {
			console.error("Error saving data", db_err)
			respBody.error = true;
		} else {
			respBody.success = true;
		}
		res.send(respBody);
	});
}

/**
 * Submit an error report
 * @param {Object} req
 * @param {Object} res
 */
exports.submitErrorReport = function(req, res) {
	var data = req.body,
		id = data.id,
		userMessage = data.userMessage,
		rev,
		respBody = {};
		
	// get the revision number, then insert the message
	db.get(id, { revs_info: true }, function(db_err, db_res) {
	  if (db_err) {
	  	console.log(db_err);
	  	return;
	  }
	  rev = db_res._rev;
		db.insert({_rev: rev, userMessage: userMessage}, id, function(db_err, db_res) {
			if (db_err) {
				console.error("Error saving data", db_err)
				respBody.error = true;
			} else {
				console.log(db_res);
				respBody.success = true;
			}
			res.send(respBody);
		});
	});
	
	
}

exports.errorTest = function(req, res) {
	var error = {
		message: "It's an error.",
		_id: uuid.v1(),
		type: "error"
	};
	
	db.insert(error, function(db_err, db_res) {
		if(db_err) {
			console.log(db_err);
		} else {
			console.log(db_res);
			res.send(500, error);			
		}
	});
}

// exports.notfound = function(req, res) {
	// res.send(404, "Page not found!");
// }



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
