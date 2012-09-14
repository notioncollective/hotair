Crafty.c("TweetPersonInfo", {
	init: function() {
		this.addComponent("2D, DOM, HTML");
		this.xv = 0;
		this.w = 500;
		this.h = 100;
		// vy is set on creation within enemy

		this.bind("EnterFrame", function(e) {
			this.y += this.yv;
			// this.text("hi");
			// destroy once out of screen
			if(this.y > Crafty.DOM.window.height+this.h) {
				console.log("DESTROYED TWEET PERSON INFO");
				this.destroy();
			} else if (this.y < -this.h) {
				this.destroy();
			}

		});

	},
	
	drawInfo: function() {
		var party = this.tweet.party == "r" ? "(R)" : "(D)";
		console.log("drawInfo()", this.tweet.name);
		this.append("<div class='tweet-info-name'>"+this.tweet.name+" "+party+"</div>"); //<a href='http://www.craftyjs.com'>Crafty.js</a>");
		this.append("<div class='tweet-info-screenname'>&#64;"+this.tweet.screen_name+"</div>");
		// console.log(this);
	}
});