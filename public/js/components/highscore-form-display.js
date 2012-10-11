Crafty.c("HighScoreFormDisplay", {
	init: function() {
		console.log("high score form display added");
		this.addComponent('HTMLTemplate');
		this.setTemplate($("#HighScoreFormDisplayTemplate").html());
		this.x = 0;
		this.y = 0;
		this.w = Crafty.DOM.window.width;
		this.h = Crafty.DOM.window.height;
	},
	/**
	 * 
	 */
	showHighScoreFormDisplay: function() {
		$("#HighScoreFormDisplay").show();
	},
	
	hideHighScoreFormDisplay: function() {
		$("#HighScoreFormDisplay").hide();
	}
});
