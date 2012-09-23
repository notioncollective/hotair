Crafty.c("Player", {
	init: function() {
		this.addComponent("2D, DOM, Color, Multiway, Keyboard, Mouse, Score, Party");				
		this.setPartySpriteTemplate('%p_avatarx2');
		
		// if(HA.party == 'r') { this.addComponent("r_avatarx2"); }
		// else { this.addComponent("d_avatarx2"); }
		
		this.bind("KeyDown", function(e) {
			if (e.keyCode === Crafty.keys.SPACE || e.keyCode === Crafty.keys.A) {
				console.log("Player : Space Pressed");
				this.dropDart();
			}
		});
		
		this.angle = 0; // this is used for creating the floating sin wave
		
		this.bind("EnterFrame", function(e) {
			if(this.x >= Crafty.DOM.window.width-80) {
				this.x = Crafty.DOM.window.width-80;
			}
			if(this.x <= 0) {
				this.x = 0;
			}
			
			this.y += (Math.sin(this.angle)/2);
			this.angle = (this.angle >= 360) ? 0 : this.angle +.1;
		});
		// this.multiway(1, {RIGHT_ARROW: 0, LEFT_ARROW: 180});
	},
	dropDart: function() {
		console.log("Player : dropDart()");
		Crafty.audio.play('drop');
		Crafty.e("Dart")
			.setParty(this.getParty())
			.attr({x: this.x+(this.w/4), y: this.y, dy: 4});
	}
});