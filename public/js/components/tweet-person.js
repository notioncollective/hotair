Crafty.c("TweetPerson", {
	init: function() {
		this.addComponent("2D, DOM, SpriteAnimation, parachutex2");
		this. xv = 0;
		this.yv = Math.random()*.5+.5;

		this.w = 80;
		this.h = 80;
		
		this.party = null;

		// set up animation states
		this
			.animate("r", 0, 0, 7)		
			.animate("d", 0, 1, 7);

		// this.angle = 0;

		this.bind("EnterFrame", function(e) {
			
			this.y += this.yv;

			// destroy once out of screen
			if(this.y > Crafty.DOM.window.height+this.h) {
				this.destroy();
			} else if (this.y < -this.h) {
				this.destroy();
			}
			
			// this.x += (Math.sin(this.angle)/2);
			// this.angle = (this.angle >= 360) ? 0 : this.angle +.05;

		});

	},
	
	// set party to 'r' or 'd'
	setTweetPersonParty: function(party) {
		this.party = party;
		this.animate(party, 15, -1);
		return this;
	}
});