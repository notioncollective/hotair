$(document).ready(function() {
	
	//HotAir namespace
	HA = {
		scoreUnit: 100,
		party: null,
		game: null,
		player: null
	};
	
	
	Crafty.init();
	// Crafty.canvas.init();
	
	// Extenstions to Crafty namespace for Hot Air
	Crafty.extend({
		Twitter: {
			user: 'tweetcongress',
			d_list: 'democrats',
			r_list: 'republican',
			d: [],
			r: [],
			page: 0,
			tweets: [],		// Array of tweets in format { raw, party, text, name, img }, where raw = raw twitter response object
			init: function() {
				this.load(this.user, this.d_list, 10, this.page, {party:"d"});
				this.load(this.user, this.r_list, 10, this.page, {party:"r"});
			},
			load: function(u,l,c,p,o) {
				console.log("Crafty.Twitter.load()");
				var self = this;
				var uri='https://api.twitter.com/1/lists/statuses.json?owner_screen_name='+u+'&slug='+l+'&per_page='+c+'&page='+p+'&callback=?';
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
					Crafty.scene("gameplay");
					return;
				}
			}
		}
	});
	
	// SPRITES
	Crafty
		.sprite(20, 'img/20.png', {
			d_emblem: [0, 0],
			r_emblem: [1, 0],
			d_dart: [2, 0],
			r_dart: [3, 0]
		})
		.sprite(40, 'img/40.png', {
			minus_one_cloud: [0, 0],
			plus_one_cloud: [1, 0],
			r_parachute: [2, 0],
			d_parachute: [3, 0],
			r_avatar: [4, 0],
			d_avatar: [5, 0],
		})
		.sprite(60, 'img/60.png', {
			balloon: [0,0],
		});
	
	console.log("Window width: "+Crafty.DOM.window.width);
	console.log("Window height: "+Crafty.DOM.window.height);
	
	/***** COMPONENT DEFINITIONS *****/
	Crafty.c("Game", {
		init: function() {
			this.addComponent("Keyboard");
			
			this.bind("GameOver", function(e) {
				console.log("GAME OVER!!");
				Crafty.scene("loading");
			});
		}
	});
	
	Crafty.c("TweetDisplay", {
		init: function() {
			this.addComponent("2D, DOM, Color, Text");
			this.w = Crafty.DOM.window.width;
			this.h = 100;
			this.x = 0;
			this.y = Crafty.DOM.window.height - 100;
			this.css("text-align", "center");
			this.css("padding", "20px");
			this.color("#CCCCCC");
			
			this.bind("SelectTweet", function(e) {
				this.text(e.tweet);
			})
		}
	});
	
	Crafty.c("Player", {
		init: function() {
			this.addComponent("2D, DOM, Color, Multiway, Keyboard, Mouse, d_avatar");
			this.score = 0;
			this.lives = 3;
			
			this.bind("UpdateScore", function(e) {				
				this.score += e.ds;
				Crafty.trigger('UpdateScoreView', {score: this.score});
				console.log("Player Component : Updating Player Score: "+this.score); // update score on player
			});
			
			this.bind("UpdateLives", function(e) {
				this.lives += e.dl;
				if(this.lives == 0) {
					Crafty.trigger('GameOver');
				}
				Crafty.trigger('UpdateLivesView', {lives: this.lives});
				console.log("Player Component : Updating Player Lives: "+this.lives);
			});
			
			this.bind("KeyDown", function(e) {
				if (e.keyCode === Crafty.keys.SPACE) {
					console.log("Player : Space Pressed");
					this.dropDart();
				}
			});
			this.bind("EnterFrame", function(e) {
				if(this.x >= Crafty.DOM.window.width-50) {
					this.x = Crafty.DOM.window.width-50;
				}
				if(this.x <= 50) {
					this.x = 50;
				}
			});
		},
		setParty: function(party) {
			console.log("Player : setParty("+party+")");
			this.party = party;
			HA.party = party;
		},
		dropDart: function() {
			console.log("Player : dropDart()");
			Crafty.e("Dart")
				.attr({x: this.x, y: this.y, dy: 4});
		}
	});
	
	Crafty.c("Score", {
		score: 0,
		init: function() {
			console.log("Score: init()");
			this.addComponent("2D, DOM, Color, Text");
			this.x = Crafty.DOM.window.width-440;
			this.y = 0;
			this.w = 400;
			this.h = 30;
			this.text("0");
			this.css({"text-align": "right"});
			this.css({"padding": "20px"});
			this.bind("UpdateScoreView", function(e) {
				// draw new score
				this.text(e.score);
				console.log("Score Component : Updating Score View: "+e.score);
			});
		}
	});
	
	Crafty.c("Lives", {
		lives: 3,
		init: function() {
			console.log("Lives: init()");
			this.addComponent("2D, DOM, Color, Text");
			this.x = 40;
			this.y = 0;
			this.w = 400;
			this.h = 30;
			this.text("3");
			this.css({"text-align": "left"});
			this.css({"padding": "20px"});
			this.bind("UpdateLivesView", function(e) {
				// draw new score
				this.text(e.lives);
				console.log("Lives Component : Updating Lives View: "+e.lives);
			});
		}
	});
	
	Crafty.c("Cloud", {
		init: function() {
			console.log("Cloud : init()");
			this.addComponent("2D, DOM, Color");
			
			this.xv = Math.random()*.5;
			this.yv = 0;
			this.x = Math.random()*Crafty.DOM.window.width;
			this.y = Math.random()*Crafty.DOM.window.height;
			
			this.w = 100;
			this.h = 60;
			this.color("#EEE");
			
			this.bind("EnterFrame", function(e) {
				// console.log(Crafty.frame());
				this.x += this.xv;
				this.y += this.yv;
				
				if(this.x > Crafty.DOM.window.width+this.w) {
					this.x = -this.w;
					this.y = Math.random()*Crafty.DOM.window.height;
				} else if(this.x < -this.w) {
					this.x = Crafty.DOM.window.width+this.w;
					this.y = Math.random()*Crafty.DOM.window.height;
				}
				if(this.y > Crafty.DOM.window.height+this.h) {
					this.y = -this.h;
				} else if (this.y < -this.h) {
					this.y = Crafty.DOM.window.height+this.h;
				}
			});
		}
	});
	
	Crafty.c("Enemy", {
		init: function() {
			console.log("Enemy : init");
			this.addComponent("2D, DOM, Color, Collision, Text, Tweet, SpriteAnimation, balloon");
			this.color("#0F0");
			this.w = 60;
			this.h = 60;
			this.selected = false;
			this.y = Crafty.DOM.window.height + this.h;
			this.x = Math.random()*Crafty.DOM.window.width;
			this.dy = (Math.random()*.5)+.3; // speed
			this.scoreMultiplier = 1;
			
			this
				.animate("selected", 0, 0, 0)		
				.animate("normal", 1, 0, 1)					
				.animate("normal", 1, -1);					
		},
		doHit: function() {
			console.log("Enemy : Dart Hit "+this.tweet.user.name);
			console.log("Enemy : Dart Hit "+this.tweet.text);
			var dScore = 0;
			if(this.tweet.party == 'd') {
				this.color("rgb(108,124,250)");
			} else {
				this.color("rgb(254,25,12)");
			}
			// this.color("#F00");
			console.log("this.tweet.party: "+this.tweet.party);
			console.log("HA.party: "+HA.party);
			if (this.tweet.party == HA.party) {
				dScore = -this.scoreMultiplier*HA.scoreUnit;
				if(this.score + dScore < 0) {
					
				}
				Crafty.trigger('UpdateLives', {dl: -1});
			} else {
				dScore = this.scoreMultiplier*HA.scoreUnit;
			}
			Crafty.trigger('UpdateScore', {ds: dScore});	// Dispatch UpdateScore event
			Crafty.trigger("DestroyEnemy", {enemy: this});
			this.destroy();
		},
		_setParty: function(party) {
			this.party = party;
		},
		startMovement: function() {
			this.bind("EnterFrame", function(e) {
				// console.log(Crafty.frame());
				//this.x += this.xs;
				// if(this.selected) {
					// this.animate("selected", 1, -1);
				// } else {
					// this.animate("normal", 1, -1);
				// }
				this.y -= this.dy;
				if(this.x > Crafty.DOM.window.width+20) {
					this.x = -20;
				} else if(this.x < -20) {
					this.x = Crafty.DOM.window.width+20;
				}
				if(this.y > Crafty.DOM.window.height+20) {
					//this.unbind("EnterFrame");
				} else if (this.y < -this.h-10) {
					this.unbind("EnterFrame");
					Crafty.trigger("DestroyEnemy", {enemy: this});
					this.destroy();
					if (this.tweet.party == HA.party) {
						var dScore = -this.scoreMultiplier*HA.scoreUnit;
						if(this.score + dScore < 0) {
							
						}
						Crafty.trigger('UpdateLives', {dl: -1});
					}
					// this.destroy();
				}
			});
		},
		select: function() {
			this.selected = true;
			// this.css("border", "solid 5px #ffffff");
			this.stop().animate("selected", 1, -1);
			Crafty.trigger('SelectTweet', {tweet: this.tweet.text});
		},
		unselect: function() {
			this.selected = false;
			// this.css("border", "none");
			this.stop().animate("normal", 1, -1);
		}
	});
	
	Crafty.c("Tweet", {
		setTweet: function(tweet) {
			this.tweet = tweet;
			return this;
		}
	});
	
	Crafty.c("Dart", {
		init: function() {
			this.addComponent("2D, DOM, Color, Collision, d_dart");
			
			this.w = 20;
			this.h = 20;
			this.dy = 1;
			this.ay = .2;
			
			this.color("rgb(0, 0, 0)");
			this.onHit("Enemy", function(e) {
				console.log("Dart.collision() : Dart Hit Enemy");
				//console.log(e[0].obj.doHit());
				e[0].obj.doHit();
				this.destroy();
			});
			
			this.bind("EnterFrame", function() {
				this.y += this.dy;
				this.dy = this.dy+this.ay;
			});
		}
	});
	
	
	
	/*****************************/
	/***** SCENE DEFINITIONS *****/
	/*****************************/
	
	
	Crafty.scene("loading", function() {
		console.log("loading...");
		Crafty.load([
			"img/20.png",
			"img/40.png",
			"img/60.png"],
			Crafty.Twitter.init()
		)
	});
	
	Crafty.scene("start", function() {
		console.log("start");
		Crafty.background('rgb(140, 208, 255)');

		// test
		for(i=0;i<50;i++) {
			var randX = Math.random()*Crafty.DOM.window.width;
			var randY = Math.random()*Crafty.DOM.window.height;
			Crafty.e("Ball");
		}
	});
	
	
	Crafty.scene("gameplay", function() {
		console.log("Scene: gameplay");
		Crafty.background('rgb(140, 208, 255)');
		var j = 0;
		for (;j<10;j++) {
			Crafty.e("Cloud");
		}
		
		var game = HA.game = Crafty.e("Game, Keyboard");
		
		game.Enemies = [];
		game.VisibleEnemies = [];
		
		var tweetDisplay = Crafty.e("TweetDisplay");
		
		//player entity
		var player = HA.player = Crafty.e("Player")
			.attr({move: {left: false, right: false, up: false, down: false}, xspeed: 0, yspeed: 0, decay: 0.9, 
				x: Crafty.viewport.width / 2, y: 0, w: 40, h: 40, score: 0})
			.origin("center")
			.color("#00F")
			.multiway(5, {RIGHT_ARROW: 0, LEFT_ARROW: 180})
			.setParty('d');
		
		//load enemies
		var numEnemies = Crafty.Twitter.tweets.length;
		for(i=0;i<numEnemies;i++) {
			var tweet = null;
			// console.log(Crafty.Twitter.tweets[i].text);
			if(tweet = Crafty.Twitter.tweets[i]) {
				console.log(tweet);
				game.Enemies.push(Crafty.e("Enemy").setTweet(tweet));
			}
		}
		
		//select enemies
		game.Enemies[0].select();
		game.selectedEnemy = 0;
		
		game.bind("KeyDown", function(e) {
			if (game.VisibleEnemies[game.selectedEnemy] == undefined) {
				console.log("Selected Enemy isn't Visible!");
				return;
			}
			if (e.keyCode === Crafty.keys.DOWN_ARROW) {
				console.log("KeyDown: DOWN");
				console.log("VisibleEnemies length: "+game.VisibleEnemies.length);
				console.log("Selected Enemy: "+game.selectedEnemy);
				game.VisibleEnemies[game.selectedEnemy].unselect();
				if (game.selectedEnemy < game.VisibleEnemies.length-1) {
					game.selectedEnemy++;
				} else {
					game.selectedEnemy = 0;
				}
				game.VisibleEnemies[game.selectedEnemy].select();
				console.log("game.selectedEnemy: "+game.selectedEnemy);
			} else if(e.keyCode === Crafty.keys.UP_ARROW) {
				console.log("KeyDown: UP");
				console.log("VisibleEnemies length: "+game.VisibleEnemies.length);
				console.log("Selected Enemy: "+game.selectedEnemy);
				game.VisibleEnemies[game.selectedEnemy].unselect();
				if (game.selectedEnemy > 0) {
					game.selectedEnemy--;
				} else {
					game.selectedEnemy = game.VisibleEnemies.length-1;
				}
				game.VisibleEnemies[game.selectedEnemy].select();
				console.log("game.selectedEnemy: "+game.selectedEnemy);
			}
		});
		
		game.bind("DestroyEnemy", function(e) {
			var index = _.indexOf(game.VisibleEnemies, e.enemy);
			console.log("Removing Visible Enemy: "+index);
			if(index != -1) {
				// game.VisibleEnemies[index].doHit();
				game.VisibleEnemies.splice(index, 1);
				game.selectedEnemy = 0;
				console.log(game.VisibleEnemies.length);
				// e.enemy.destroy();
			}
		});
		
		//start enemy movements
		var eCount = 0;
		var enemyFactory = setInterval(function() {			
			if (eCount < numEnemies) {
				// console.log(eCount);
				game.Enemies[eCount].startMovement();
				game.VisibleEnemies.push(game.Enemies[eCount]);
				// console.log("Index: "+_.indexOf(game.VisibleEnemies, game.Enemies[eCount]));
				// game.Enemies[eCount].text(""+_.indexOf(game.VisibleEnemies, game.Enemies[eCount]));
			} else {
				this.clearInterval();
			}
			eCount += 1;
		}, 5000);
		
		//load score display
		var score = Crafty.e("Score");
		
		var lives = Crafty.e("Lives");
		
		console.log("End Scene Creation : gameplay");
		
	});
	
	// initiate start scene
	Crafty.scene("loading");
})

