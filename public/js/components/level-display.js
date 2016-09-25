Crafty.c("LevelDisplay", {
	init: function() {
		_.bindAll(this);
		this.addComponent("2D, DOM, Color, Text");
		this.w = 200;
		this.x = Crafty.viewport.width/2-this.w/2;
		this.y = Crafty.viewport.height/2;
		this.css("text-align", "center");
		this.css("padding", "20px");

		this.bind("SetLevel", function(e) {
			this.text("Level "+e.level);
			this.flashLevel();
		});



		// this.bind("NextLevel", function(e) {
			// this.text("Level "+e.level);
			// this.flashLevel();
		// });
	},
	flashLevel: function() {
		console.log("flashLevel");
		$(this._element).show();
		$(this._element).fadeOut(4000);
	}
});