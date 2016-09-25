Crafty.c("StartScreenBalloon", {
	init: function() {
		console.log("Cloud : init()");
		this.addComponent("2D, DOM, Color, startscreen_balloon_d");

		// balloons are placed randomly withi a circle
		this.center = [Crafty.viewport.width/2, -50],
		this.max_radius = Crafty.viewport.height/5;

		this.init_angle = Math.random()*(2*Math.PI)
		this.radius = Math.random()*this.max_radius;
		this.xv =( Math.random()-.5)*.5;
		this.yv = (Math.random()-.5)*.5;
		this.x = this.center[0] + this.radius * Math.cos(this.init_angle); // x = r * cos angle
		this.y = this.center[1] + this.radius * Math.sin(this.init_angle); // y = r * sin angle
		this.z = -98;

		this.w = 100;
		this.h = 100;
		// this.color("#EEE");


		this.bind("EnterFrame", function(e) {
			// var angle = Math.atan2((this.center[1] + this.y), (this.center[0] + this.x)),
					// r = (this.center[1] + this.y) / Math.sin(angle);

			var trans_x = this.x - this.center[0], // translated x
					trans_y = this.y - this.center[1], // translatd y
					r = Math.sqrt(Math.pow(trans_x,2)+Math.pow(trans_y,2)); // x^2 + y^2 = r^2

			console.log("radius", r);

			if(r > this.max_radius) {
				this.xv = this.xv*-1;
				this.yv = this.yv*-1;
			}

			this.x += this.xv;
			this.y += this.yv;

			// if(this.x > Crafty.viewport.width+this.w) {
				// this.x = -this.w;
				// this.y = Math.random()*Crafty.viewport.height;
			// } else if(this.x < -this.w) {
				// this.x = Crafty.viewport.width+this.w;
				// this.y = Math.random()*Crafty.viewport.height;
			// }
			// if(this.y > Crafty.viewport.height+this.h) {
				// this.y = -this.h;
			// } else if (this.y < -this.h) {
				// this.y = Crafty.viewport.height+this.h;
			// }
		});
	}
});