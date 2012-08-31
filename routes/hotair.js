var cradle = require('cradle');
var Twit = require('twit');
var _ = require('lodash');

var conn = new(cradle.Connection)();
var db = conn.database('tweets');

/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('home', { title: 'Hot Air' });
};

/*
* This action should see if the last update to the tweets db was more than x minutes ago, and load new tweets from twitter if so.
* Otherwise, tweets can be served from the db.
*/
exports.tweets = function(req, res) {
	var T = new Twit({
	    consumer_key:         '5uH2QAOgqIVQfe2typ5w'
	  , consumer_secret:      'PAjuPDFxLq3VCjup47nBLX0qiVT5fSyl0efUFHO47D4'
	  , access_token:         '121874224-PHWTBdicu45w3n3EI69oT84RUGoXhKN0Vw7nJVvU'
	  , access_token_secret:  'AOaSNcoio81jhpwoX5VeuBeRpkWVqFWtJwxTApkDWs'
	});
	
	T.get('lists/statuses', { owner_screen_name: 'tweetcongress', per_page: 10, page: 1, include_rts: 1, slug: "republican" }, function(err, reply) {
		console.log(err);
		if(err) {
			console.log(err);
			return false;
		}
		db.save(reply, function(err, resp) {
			console.log('saved');
		});
		console.log(reply);
	});
	
	
	
	var data = req.body;
	
	db.view('tweets/list', function(err, resp) {
	   	console.log("resp", resp);
		var out = [];
	    if(resp) {
			resp.forEach(function(row) {
		   	  out.push(row);	
		   	});
		}
	   	console.log("out", out);
		res.send(out);
	});
}

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

exports.list = function(req, res) {
  var list = [];
  db.view('admin/test', function(err, resp) {
   	console.log("resp", resp);
    if(resp) {
		resp.forEach(function(row) {
	   	  list.push(row);	
	   	});
	}
   	console.log("List", list);
	res.render('list', {list: list});
   });
  
};