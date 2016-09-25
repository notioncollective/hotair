Crafty.c("PauseDisplay", {
	init: function() {
		console.log("pause display added");
		this.addComponent('HTMLTemplate');
		this.setTemplate($("#PauseDisplayTemplate").html());
		this.x = 0;
		this.y = 0;
		this.z = 1000;
		this.w = Crafty.viewport.width;
		this.h = Crafty.viewport.height;
		this.updateContent();
	},
	/**
	 *
	 */
	showPauseScreenDisplay: function() {
		$("#PauseDisplay").show();
	},
	hidePauseScreenDisplay: function() {
		$("#PauseDisplay").hide();
	}
});
