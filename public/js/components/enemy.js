Crafty.c("Enemy", {
	init: function() {
		console.log("Enemy : init");
		_.bindAll(this);
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
	
	/**
	 * This is called from within the dart's hit event handler.  Must be registered after hit so that only 
	 * balloons that have been hit will be subscribed to the hit complete event.
	 */
	registerHitCompleteEvent: function() {
		HA.m.subscribe(HA.e.ENEMY_HIT_COMPLETE, this._handleHitCompleteEvent);		
	},
	
	_handleHitCompleteEvent: function(e, enemy, dScore) {
		this.doHit(dScore);
	},
	
	_handleEnemyOffScreenComplete: function(e, enemy, dScore, whoops) {
		console.log("Enemy: _handleEnemyOffScreenComplete", enemy, dScore);
		if(whoops) {
			this.showScore(dScore, 0);
		}
		HA.m.unsubscribe(HA.e.ENEMY_OFF_SCREEN_COMPLETE, this._handleEnemyOffScreenComplete);
		this.destroy();
	},
	
	doHit: function(dScore) {
		if(this.hit) return;
		this.hit = true;
		this
			.animate("hit", 30, 0)
			.startFalling();
		
		this.showTweetPerson();
		this.showScore(dScore);
		// this.bind("UpdateScore", function(e) {
			// this.showScore(e.dScore);
		// });
		
		// HA.m.publish(HA.e.ENEMY_HIT, [this]);
			
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
			this
				.unbind("EnterFrame")
				.unbind("UpdateScore")
				.destroy();
			// HA.m.publish(HA.e.ENEMY_DESTROYED, [this]);
			//Crafty.trigger("DestroyEnemy", {enemy: this});
			console.log("++++++ DESTROYED ENEMY ENTITY");
		}
	},
	_risingCallback: function(e) {
			this.y -= this.dy;
			if (this.y < 80-this.h-10) {
				console.log("enemy off screen");
				if(this.hit) return;
				this.hit = true;
				this.unbind("EnterFrame");
				
				HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_COMPLETE, this._handleEnemyOffScreenComplete);
				
				HA.m.publish(HA.e.ENEMY_OFF_SCREEN_START, [this]);
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