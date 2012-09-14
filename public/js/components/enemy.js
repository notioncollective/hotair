Crafty.c("Enemy", {
	init: function() {
		console.log("Enemy : init");
		this.addComponent("2D, DOM, Color, Collision, Text, Tweet, SpriteAnimation, balloonx2");
		this.color("#0F0");
		this.w = 120;
		this.h = 120;
		this.selected = false;
		this.hit = false;
		this.y = Crafty.DOM.window.height + this.h;
		this.x = this.w + Math.random()*(Crafty.DOM.window.width-this.w*2);
		this.dy = (Math.random()*.5)+.3; // speed
		this.scoreMultiplier = 1;
		
		this.TERMINAL_VELOCITY = 10; // for falling, max dy
		
		this
			.animate("hit", 0, 3, 4)		
			.animate("falling", 0, 0, 1)		
			.animate("selected", 0, 1, 3)		
			.animate("normal", 0, 2, 3)		
			.animate("normal", 30, -1)			

		this.startMovement();
	},
	doHit: function() {
		if(this.hit) return;
		this.hit = true;
		this
			.animate("hit", 30, 0)
			.startFalling();
		
		this.showTweetPerson();
		
		this.bind("UpdateScore", function(e) {
			this.showScore(e.dScore);
		});
		
		Crafty.trigger("EnemyHit", {tweet: this.tweet});
	},
	_setParty: function(party) {
		this.party = party;
	},
	setSpeed: function(speed) {
		console.log("speed: ", speed);
		// this.dy = ((Math.random()*.5)*speed)+.3; // speed
		this.dy = (speed); // speed
		console.log("this.dy: ", this.dy);
		return this;
	},
	startMovement: function() {
		this.bind("EnterFrame", this._risingCallback);
	},
	startFalling: function() {
		console.log("falling");
		this
			.unbind("EnterFrame", this._risingCallback)
			.bind("EnterFrame", this._fallingCallback);
		// this.animate("falling", 10, -1);
	},
	_fallingCallback: function(e) {
		// added test for isPlaying, otherwise this was causing errors on re-init
		if(typeof this.isPlaying === 'function' && !this.isPlaying('hit')) {
			this.animate("falling", 10, -1);
		}
		this.y += this.dy;
		if(this.dy < this.TERMINAL_VELOCITY) {
			this.dy = this.dy*1.1;
		}
		if(this.y > Crafty.DOM.window.height+20) {
			Crafty.trigger("DestroyEnemy", {enemy: this});
			this
				.unbind("EnterFrame")
				.unbind("UpdateScore")
				.destroy();
			console.log("++++++ DESTROYED ENEMY ENTITY");
		}
	},
	_risingCallback: function(e) {
			this.y -= this.dy;
			// if we decide to add horizontal movement
			// if(this.x > Crafty.DOM.window.width+20) {
				// this.x = -20;
			// } else if(this.x < -20) {
				// this.x = Crafty.DOM.window.width+20;
			// }
			if (this.y < 80-this.h-10) {
				if(this.hit) return;
				this.hit = true;
				// enemy off top of screen
				// this.showTweetPerson();
				this.bind("UpdateScore", function(e) {
					this.showScore(e.dScore, 20);
					Crafty.trigger("DestroyEnemy", {enemy: this});
				});
				this.bind("UpdateLives", function(e) {
					Crafty.trigger("DestroyEnemy", {enemy: this});
				});
				Crafty.trigger("EnemyOffScreen", {tweet: this.tweet, enemy: this});	
				// this.unbind("EnterFrame");
			}
	},
	showScore: function(score, offset) {
		if(!_.isNumber(offset)) offset = -40;
		console.log("******** showScore");
		var hit_score = Crafty.e("HitScore")
							.attr({
								x: this.x,
								y: this.y+offset
							})
							.setScore(score);							
	},
	showTweetPerson: function() {
		console.log("====== showTweetPerson: ", this.tweet.name);
		var tweet_person = Crafty.e('TweetPerson')
				.attr({
					x: this.x+20,
					y: this.y+70
				})
				.setTweetPersonParty(this.tweet.party);
		var yv = tweet_person.yv;
		var tweet_person_info = Crafty.e("TweetPersonInfo")
				.attr({
					tweet: this.tweet,
					x: this.x+90,
					y: this.y+100,
					yv: yv
				})
				.drawInfo();
	},
	select: function() {
		if(!this.selected) Crafty.audio.play("select", 1, .5);
		this.selected = true;
		// this.css("border", "solid 5px #ffffff");
		this.stop().animate("selected", 30, -1);
		Crafty.trigger('SelectTweet', {tweet: this.tweet.text});
	},
	unselect: function() {
		this.selected = false;
		// this.css("border", "none");
		this.stop().animate("normal", 30, -1);
	}
});