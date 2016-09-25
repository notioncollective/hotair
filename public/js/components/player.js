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

		this.bind('Fire', this._handleFireEvent);
	},

	dropDart: function(enemy) {
		console.log("Player : dropDart()");
		Crafty.audio.play('drop');
		Crafty.e("Dart")
			.attr({
				x: this.x+(this.w/4),
				y: this.y
			})
			.setParty(this.getParty())
			.fireAtTarget(enemy);
	},

	_handleFireEvent: function(enemy) {
		this.dropDart(enemy);
	}
});