Crafty.c('StartScreenMainGraphic', {
	init: function() {
		this.addComponent('2D, DOM, startscreen_basket');
		this.w = this.h = 800;
		this.reposition();
		this.angle = 0;
		this.amplitude = .8;
		this.speed = 50;
		
		this.bind("EnterFrame", this.handleEnterFrame);
		
	},
	
	handleEnterFrame: function() {
		var dy = Math.sin(this.angle)*this.amplitude;
		this.y = this.y + dy; 
		this.angle = (this.angle >= 2*Math.PI) ? 0 : (this.angle + (this.speed / 1000));		
	},
	
	reposition: function() {
		// console.log("Reposition start screen main graphic");
		this.x = (Crafty.DOM.window.width/2) - (this.w/2);
		this.y = (Crafty.DOM.window.height/15) - (this.h/2);	
	}
});