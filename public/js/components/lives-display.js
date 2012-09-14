Crafty.c("LivesDisplay", {
	_lives: 3,
	init: function(party) {
		console.log("Lives: init()");
		this.addComponent("2D, DOM, Color, Text");
		this.x = 60;
		this.y = Crafty.DOM.window.height-30;
		this.w = 150;
		this.h = 30;
		this.text("3");
		this.css({"text-align": "left"});
		// this.css({"padding": "20px"});
		
		this.updateLivesBackground();
		
		this.bind("UpdateLives", function(e) {
			console.log("Lives Component : Updating Lives: "+e.lives);
			// draw new score
			this.updateLivesDisplay(e.lives);
			// this.text(e.lives);
		});
	},
	updateLivesDisplay: function(lives) {
		this.text('x '+lives);
	},
	updateLivesBackground: function() {
		console.log("updateLivesBackground");
		var y = Crafty.DOM.window.height-80,
			w = this.w,
			sprite_w = 80;
		
		var x = 0; //this.x;//  + w % sprite_w;
		var tile_count = Math.ceil(w / sprite_w);
		
		for(var i=tile_count; i > 0; i-- ) {
			if(i == 1) {
				Crafty.e('2D, DOM, score_cloud_right')
					.attr({x:x, y:y, z:-1});
			} else {
				// pick a random middle cloud sprite index
				rand_cloud = Crafty.math.randomInt(1, 8);
				Crafty.e('2D, DOM, score_cloud_'+rand_cloud)
					.attr({x:x, y:y, z:-1});
			}
			x += sprite_w;
		}
		
		Crafty.e('2D, DOM, '+HA.party+'_emblemx2')
			.attr({x:10, y:y+28});
	},	
});