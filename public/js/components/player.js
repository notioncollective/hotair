Crafty.c("Player", {
	init: function() {
		this.addComponent("2D, DOM, Score, Party, Oscillate");

		this.setPartySpriteTemplate('%p_avatarx2');

		this.bind("KeyDown", function(e) {
			if(Crafty.isPaused()) return;
			if (e.keyCode === Crafty.keys.SPACE || e.keyCode === Crafty.keys.A) {
				console.log("Player : Space Pressed");
				this.dropDart();
			}
		});

		this.bind("EnterFrame", function(e) {
			if(this.x > Crafty.DOM.window.width) {
				this.x = -40;
			}
			if(this.x < -40) {
				this.x = Crafty.DOM.window.width;
			}
		});
	},
	dropDart: function() {
		console.log("Player : dropDart()");
		Crafty.audio.play('drop');
		Crafty.e("Dart")
			.setParty(this.getParty())
			.attr({x: this.x+(this.w/4), y: this.y, dy: 4});
	}
});