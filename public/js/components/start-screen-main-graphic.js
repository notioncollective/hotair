Crafty.c('StartScreenMainGraphic', {
	init: function() {
		this.addComponent('2D, DOM, Oscillate, startscreen_basket');
		this.oscillate({speed: 50, y_amp: 10});
	},
	
	enterScreen: function() {
		
	},
	leaveScreen: function() {
		
	}
});