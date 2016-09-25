Crafty.c("Cloud", {
	init: function() {
		console.log("Cloud : init()");
		var cloud_num = Crafty.math.randomInt(0, 4);
		this.addComponent("2D, DOM, Color, cloud"+cloud_num);

		this.xv = Math.random()*.5;
		this.yv = 0;
		this.x = Math.random()*Crafty.viewport.width;
		this.y = Math.random()*Crafty.viewport.height;
		this.z = -99;

		this.w = 100;
		this.h = 100;
		// this.color("#EEE");


		this.bind("EnterFrame", function(e) {
			// console.log(Crafty.frame());
			this.x += this.xv;
			this.y += this.yv;

			if(this.x > Crafty.viewport.width+this.w) {
				this.x = -this.w;
				this.y = Math.random()*Crafty.viewport.height;
			} else if(this.x < -this.w) {
				this.x = Crafty.viewport.width+this.w;
				this.y = Math.random()*Crafty.viewport.height;
			}
			if(this.y > Crafty.viewport.height+this.h) {
				this.y = -this.h;
			} else if (this.y < -this.h) {
				this.y = Crafty.viewport.height+this.h;
			}
		});
	}
});