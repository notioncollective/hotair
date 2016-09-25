Crafty.c("GameOverDisplay", {
	init: function() {
		console.log("gameover display added");
		this.addComponent('HTMLTemplate');
		this.setTemplate($("#GameOverDisplayTemplate").html());
		this.x = 0;
		this.y = 0;
		this.w = Crafty.viewport.width;
		this.h = Crafty.viewport.height;
		this.updateContent();
	},
	/**
	 *
	 */
	showGameOverDisplay: function() {
		$("#GameOverDisplay").show();
	},

	hideGameOverDisplay: function() {
		$("#GameOverDisplay").hide();
	}
});
