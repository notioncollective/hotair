
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/hotair')
  , http = require('http')
  , path = require('path')
  , nano = require('nano')
  , useragent = require('useragent')
  , cronJob = require('cron').CronJob;


// Cron Job to go grab new tweets every 5 minutes.
new cronJob('0 */12 * * * *', function(){
    console.log('CRON - fetching tweets.');
    routes.fetch_tweets();
}, null, true, "America/New_York");;

var app = express();
// var auth = express.basicAuth('notion', 'Madi50nW1'); 
var auth = express.basicAuth(function(username, password) {
  var valid_logins = {
    'notion': 'Madi50nW1',
    'privatebeta1': 'B!denVsRyan', // jason
    'privatebeta2': 'B!denVsRyan', // andy
    'privatebeta3': 'B!denVsRyan', // michael
    'privatebeta4': 'B!denVsRyan', // candice
    'privatebeta5': 'B!denVsRyan', // jon
  }
  
  if(typeof valid_logins[username]   === 'string' && valid_logins[username] === password) {
    console.log("basicAuth login ", username, password);
    return true;
  } else return false;
  
})


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('hotair'));
  app.use(express.session({secret: 'hotair'}));
  app.use(express.csrf());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public'), {maxAge:  86400000}));
});

// configure dev-specific settings
app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// configure production-specific settings
app.configure('production', function(){
});

// simple middleware, could be moved to separate file
function csrf(req, res, next) {
	console.log(req.session);
  res.locals.token = req.session._csrf;
  next();
}

// simple middleware for useragent detection
function agent(req, res, next) {
	if(!useragent.is(req.headers['user-agent']).chrome) {
		res.redirect('/notsupported');
	} else next();
}


app.get('/', routes.home);
app.get('/play', agent, auth, csrf, routes.play);
app.get('/survey', auth, routes.survey);
app.get('/privatebeta', auth, routes.privatebeta);
app.get('/notsupported', routes.notsupported);
// app.get('/reset', auth, agent, routes.reset);
app.get('/fetch_tweets', auth, routes.fetch_tweets);
app.get('/all', auth, agent, routes.all);
app.get('/democrats', auth, routes.democrats);
app.get('/republican', auth, routes.republican);
app.get('/load_tweets', auth, routes.load_tweets);
app.get('/highscores', auth, routes.highscores);
app.post('/highscore', auth, routes.highscore);
// app.get('/*', routes.notfound);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  console.log("env: ", app.get('env'));
});
