Crafty.c("ScoreDisplay", {
	SCORE_DIGITS: 6,
	init: function() {
		_.bindAll(this);
		console.log("ScoreDisplay: init()");
		this.addComponent("2D, DOM, Color, Text");
		this.w = 180;
		this.h = 30;
		this.x = Crafty.viewport.width-this.w-40;
		this.y = Crafty.viewport.height-this.h;
		this.text(this.formatScore('0'));
		this.css({"text-align": "right"});

		this.updateScoreBackground();

		HA.m.subscribe(HA.e.UPDATE_SCORE, this._handleUpdateScoreEvent);
	},

	_handleUpdateScoreEvent: function(e, score) {
		this.text(this.formatScore(score));
	},

	updateScoreBackground: function() {
		var y = Crafty.viewport.height-80,
			w = this.w,
			sprite_w = 80;

		var x = this.x;//  + w % sprite_w;
		var tile_count = Math.ceil(w / sprite_w);

		for(var i=tile_count; i > 0; i-- ) {
			if(i == tile_count) {
				Crafty.e('2D, DOM, score_cloud_left')
					.attr({x:x, y:y, z:-1});
			} else {
				// pick a random middle cloud sprite index
				rand_cloud = Crafty.math.randomInt(1, 8);
				Crafty.e('2D, DOM, score_cloud_'+rand_cloud)
					.attr({x:x, y:y, z:-1});
			}
			x += sprite_w;
		}
	},
	formatScore: function(score) {
		var score = score+'' || '0'; // score as string
		var d = this.SCORE_DIGITS - score.length; // digits left
		while(d--) { score = '0'+score; } // add 0 digits
		return score;
	}
});