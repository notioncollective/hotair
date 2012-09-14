
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/hotair')
  , http = require('http')
  , path = require('path')
  , cradle = require('cradle')
  , cronJob = require('cron').CronJob;


// new cronJob('*/20 * * * * *', function(){
    // console.log('You will see this message every 10 seconds.');
    // routes.load_tweets();
// }, null, true, "America/New_York");;

var app = express();



// var conn = new(cradle.Connection)();
// var db = conn.database('users');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.home);
app.get('/reset', routes.reset);
app.get('/load_tweets', routes.load_tweets);
app.get('/all', routes.all);
app.get('/democrats', routes.democrats);
app.get('/republican', routes.republican);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
