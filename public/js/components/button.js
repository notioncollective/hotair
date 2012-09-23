/**
 * Handles gameplay, including levels, game pause/unpause, and initializing other HA modules.
 * @class Button
 */
Crafty.c("Button", {
	score: 0,
	init: function() {
		console.log("Button: init()");
		this.addComponent("2D, DOM, Color, Text, Mouse");
		this.w = 400;
		this.h = 30;
		this.callback = null; //
		this.x = Crafty.DOM.window.width/2 - this.w/2;
		this.y = Crafty.DOM.window.height/2 - this.h/2;
		this.css({"text-align": "center"});
		this.css({"padding": "20px"});
		this.bind("Click", function(e) {
			// draw new score
			if(this.callback !== null) {
				this.callback();
			}
		});
	}
});