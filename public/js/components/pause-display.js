Crafty.c("PauseDisplay", {
	init: function() {
		this.addComponent('2D', 'DOM');
		// this.template = _.template($("#PauseDisplay").html());
	},
	/**
	 * 
	 */
	showPauseScreenDisplay: function() {
		console.log("PauseScreenDisplay: showPauseScreenDisplay");
		$("#PauseDisplay").show();
	},
	hidePauseScreenDisplay: function() {
		console.log("PauseScreenDisplay: hidePauseScreenDisplay");
		$("#PauseDisplay").hide();
	}
});
