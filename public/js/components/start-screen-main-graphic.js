Crafty.c('StartScreenMainGraphic', {
	init: function() {
		this.addComponent('2D, DOM, startscreen_basket');
		
		
		// add motion
		this.angle = 0; // this is used for creating the floating sin wave		
		this.bind("EnterFrame", function(e) {
			this.y += (Math.sin(this.angle)/3);
			this.angle = (this.angle >= 360) ? 0 : this.angle +.05;
		});
	},
	
	enterScreen: function() {
		
	},
	leaveScreen: function() {
		
	}
});