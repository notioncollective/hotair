Crafty.c("TweetDisplay", {
	init: function() {
		this.addComponent("2D, DOM, Color, HTML, Text");
		
		// this.w = Crafty.DOM.window.width;
		// this.h = 100;
		// this.x = 0;
		// this.y = Crafty.DOM.window.height - 100;
		// this.css("text-align", "center");
		// this.css("padding", "20px");
		// this.color("#CCCCCC");
		
		this.bind("SelectTweet", function(e) {
			$("#TweetDisplay .content").html(e.tweet);
		});
	},
	show: function() {
		$("#TweetDisplay").fadeIn();
	},
	hide: function() {
		$("#TweetDisplay").hide();
	}
});