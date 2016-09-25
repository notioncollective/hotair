Crafty.c("TweetPersonInfo", {
	init: function() {
		this.addComponent("2D, DOM, HTML, Party");
		this.xv = 0;
		this.w = 500;
		this.h = 100;
		// vy is set on creation within enemy

		this.bind("EnterFrame", function(e) {
			this.y += this.yv;
			// this.text("hi");
			// destroy once out of screen
			if(this.y > Crafty.viewport.height+this.h) {
				console.log("DESTROYED TWEET PERSON INFO");
				this.destroy();
			} else if (this.y < -this.h) {
				this.destroy();
			}

		});

	},

	drawInfo: function() {
		var party_txt = this.getParty() == 'r' ? "(R)" : "(D)";
		this.append("<div class='tweet-info-name'><span>"+this.tweet.name+" "+party_txt+"</span></div>"); //<a href='http://www.craftyjs.com'>Crafty.js</a>");
		this.append("<div class='tweet-info-screenname'>&#64;"+this.tweet.screen_name+"</div>");
		var width = $(".tweet-info-name span").width();
		if(Crafty.viewport.width-(this.parent_x+90) < width+20) {
			this.x = this.parent_x-480;
			$(this._element).css("text-align", "right");
		} else {
			this.x = this.parent_x+90;
		}
		this.y = this.parent_y+100;
		console.log("drawInfo()", Crafty.viewport.width, this.parent_x, this.parent_w, width);
	}
});