Crafty.c("HitScore", {
	init: function() {
		console.log("HitScore : init()");
		this.addComponent("2D, DOM, SpriteAnimation, SpriteFont, cloud_scorex2");

		this._score_w = 16;

		this.xv = 0;
		this.yv = Math.random()*.5+.5;

		this.w = 100;
		this.h = 106;

		this.score = 0;

		this
			.animate("up", 0, 0, 5)
			.animate("down", 0, 1, 5);

		this.bind("EnterFrame", function(e) {

			// move up/down
			if(this.score < 0) {
				this.y += this.yv;
				this.score_text.y += this.yv;
			} else if (this.score > 0) {
				this.y -= this.yv;
				this.score_text.y -= this.yv;
			}

			// destroy once out of screen
			if(this.y > Crafty.viewport.height+this.h) {
				this.score_text.destroy();
				this.destroy();
			} else if (this.y < -this.h) {
				this.score_text.destroy();
				this.destroy();
			}

		});

	},
	setScore: function(score) {
		this.score = score;
		var score_str = (score > 0) ? "+"+this.score.toString() : this.score.toString();

		// set up score text
		this.score_text = Crafty.e("2D, DOM, SpriteText")
				.registerFont("BlueScore", this._score_w, HA.game.cacheBuster('../../img/fonts/blue_score_16x16.png'))
				.registerFont("GreyScore", this._score_w, HA.game.cacheBuster('../../img/fonts/grey_score_16x16.png'))
				.align("center")
				.attr({
					x:this.x+16,y:this.y+46,
					w: this._score_w*score_str.length,
					h:this._score_w,
					z:0
				})
				.text('');

		// determine font/animation based on sign of score
		if(this.score > 0) {
			this.animate("up", 15, 0);
			this.score_text
				.registerFont('BlueScore')
				.text(score_str);
		} else {
			this.animate("down", 15, 0);
			this.score_text
				.registerFont('GreyScore')
				.text(score_str);
		}
	}
});