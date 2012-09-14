Crafty.c("Lives", {
	_lives: 3,
	init: function() {
		
	},
	Lives: function(lives) {
		this.setLives(lives);
		Crafty.trigger('UpdateLives', {lives: this._lives});
	},
	removeLife: function() {
		this._lives--;
		Crafty.trigger('UpdateLives', {lives: this._lives});
		if(this._lives === 0) {
			Crafty.trigger('GameOver');
		}
	},
	addLife: function() {
		this._lives+=1;
		Crafty.trigger('UpdateLives', {lives: this._lives});
	},
	setLives: function(lives) {
		this._lives = lives;
		Crafty.trigger('UpdateLives', {lives: this._lives});
	}
});