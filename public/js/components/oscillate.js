Crafty.c("Oscillate", {
	_defaults: {
		x_amp: 0,
		y_amp: 0,
		speed: 5,
		_angle: 0,
		_orig_x: undefined,
		_orig_y: undefined		
	},
	osc: {},
	
	oscillate: function(options) {
		this.osc = _.extend(this.osc, this._defaults, options);
		this.osc._orig_x = this.x;
		this.osc._orig_y = this.y;
		
		this.bind("EnterFrame", function(e) {
			
			if(this.osc.x_amp > 0) {
				var dx = Math.floor(Math.sin(this.osc._angle)*this.osc.x_amp);
				this.x = this.osc._orig_x + dx; 
			}			
			if(this.osc.y_amp > 0) {
				var dy = Math.floor(Math.cos(this.osc._angle)*this.osc.y_amp);
				this.y = this.osc._orig_y + dy;
			}
			
			this.osc._angle = (this.osc._angle >= 360) ? 0 : (this.osc._angle + (this.osc.speed / 1000));
		});
	}
	
});