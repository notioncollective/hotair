Crafty.c("Enemy", {
	BALLOON_DURATION: 128,
	init: function() {
		console.log("Enemy : init");
		_.bindAll(this);
		this.addComponent("2D, DOM, Motion, Collision, Text, Tweet, SpriteAnimation, Party, Swipe, balloonx2");
		this.w = 120;
		this.h = 120;

		this.selected = false;
		this.marked = false;
		// this.hit = false;

		this.y = Crafty.viewport.height + this.h;
		this.x = this.w + Math.random()*(Crafty.viewport.width-this.w*2);
		this.vy = -200;
		this.scoreMultiplier = 1;


		// swipe config
		this.minTapDistance = this.w / 2;

		this.TERMINAL_VELOCITY = 10; // for falling, max dy

		this
			.reel("hit_d", 1000, 0, 4, 4)
			.reel("hit_r", 1000, 5, 4, 4)
			.reel("falling_d", 200, 0, 0, 2)
			.reel("falling_r", 200, 2, 0, 2)
			.reel("normal", 2000, 0, 2, 16);
			// .reel("normal", this.BALLOON_DURATION, -1)

		this.animate('normal', -1);

		// this.collision(new Crafty.polygon([
		// 	[20,40],
		// 	[this.w/4,10],
		// 	[this.w/2, 0],
		// 	[3*(this.w/4),10],
		// 	[this.w-20,40],
		// 	[this.w/2, this.h],
		// ]));

		this.checkHits('Dart');

		this.bind('HitOn', function(data) {
			console.log('HitOn', data);
			var dart = data[0].obj;

			if (this.marked) {
				dart.destroy();
				this.doHit(100);
			}
		});

		this.bind('Moved', this.onMove.bind(this));

		this.bind('Remove', this.onDestroy.bind(this));
	},

	/**
	 * This is called from the hit complete event handler
	 */
	doHit: function(dScore) {
		// if(this.hit) return;
		// this.hit = true;
		this.unselect();
		this
			.animate("hit_"+this.getParty(), 30, 0)
			.startFalling();
		if(typeof this.selection !== 'undefined') this.selection.destroy();

		this.showTweetPerson();

		// this.showScore(dScore);

		Crafty.trigger('EnemyHit', this);
	},

	setSpeed: function(speed) {
		console.log("speed: ", speed);
		this.vy = (speed * -100); // speed
		console.log("this.dy: ", this.dy);
		return this;
	},

	startFalling: function(e) {
		// added test for isPlaying, otherwise this was causing errors on re-init
		// if(typeof this.isPlaying === 'function' && !this.isPlaying('hit_r') && !this.isPlaying('hit_d')) {
			this.animate("falling_"+this.getParty(), 10, -1);
		// }
		this.vy = 100;
		this.ay = 50;

		if(this.y > Crafty.viewport.height+20) {
			this
				.unbind("EnterFrame")
				.destroy();
			console.log("++++++ DESTROYED ENEMY ENTITY", this, this.y);
		}
	},

	showScore: function(score, offset) {
		if(!_.isNumber(offset)) offset = -40;
		// console.log("******** showScore");
		var hit_score = Crafty.e("HitScore")
							.attr({
								x: this.x,
								y: this.y+offset
							})
							.setScore(score);
	},

	showTweetPerson: function() {
		var party = this.getParty();
		var tweet_person = Crafty.e('TweetPerson')
				.attr({
					x: this.x+20,
					y: this.y+70
				})
				.setTweetPersonParty(party);
		var yv = tweet_person.yv;
		var tweet_person_info = Crafty.e("TweetPersonInfo")
				.attr({
					tweet: this.tweet,
					parent_x: this.x,
					parent_y: this.y,
					parent_w: this.w,
					yv: yv
				})
				.setParty(party)
				.drawInfo();
	},

	showTweet: function() {
		// show the tweet beside the baloon
	},

	select: function() {
		console.log('enemy.select', this.getId());
		if(!this.selected) Crafty.audio.play("select", 1, .5);
		this.selected = true;
		this.selection = Crafty.e('EnemySelection')
						.attr({
							x:this.x,
							y:this.y,
							enemyParent: this
						});
		this.balloon_select_arrow = Crafty.e('EnemySelectionArrow')
						.attr({
						  x:this.x+((this.w/2)-30),
              y:this.y-70,
              enemyParent: this
            });

		HA.m.publish(HA.e.ENEMY_SELECTED, [this]);
	},

	unselect: function() {
		this.selected = false;
		if(typeof this.selection !== 'undefined') this.selection.destroy();
		if(typeof this.balloon_select_arrow !== 'undefined') this.balloon_select_arrow.destroy();
	},

	//
	// new API
	//

	// each enemy has a tweet which has a unique ID
	getId: function() {
		return this.tweet.id;
	},

	// On top, select this eneny
	onTap: function(e) {
		this.select();
	},

	onSwipeUp: function(e) {
		if (this.selected) {
			this.vy = -200;
			this.ay = -500;
			this.selected = false;
		}
	},

	onSwipeDown: function(e) {
		if (this.selected) {
			this.marked = true;
			Crafty.trigger('Fire', this);
			this.selected = false;
		}
	},

	onMove: function(e) {
		// top of screen
		if (this.y < 80-this.h-10) {
			console.log("enemy off screen", this.getParty());
			Crafty.trigger('EnemyPassed', this);
			this.destroy();

			// HA.m.subscribe(HA.e.ENEMY_OFF_SCREEN_COMPLETE, this._handleEnemyOffScreenComplete);
			// HA.m.publish(HA.e.ENEMY_OFF_SCREEN_START, [this]);
		}

		// text follows balloon
		if (this.text) {
			this.text.y = this.y;
		}
	},

	// clean up... may need to destroy entities created within this component?
	// - tweet text
	onDestroy: function(e) {
		this.unselect();
	}
});
