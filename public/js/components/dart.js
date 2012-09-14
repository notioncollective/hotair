Crafty.c("Dart", {
	init: function() {
		this.addComponent("2D, DOM, Color, Collision, "+HA.party+"_dartx2");
		
		this.w = 40;
		this.h = 40;
		this.dy = 1;
		this.ay = .2;
		
		this.color("rgb(0, 0, 0)");
		this.onHit("Enemy", function(e) {
			e[0].obj.doHit();
			this.destroy();
		});
		
		this.bind("EnterFrame", function() {
			this.y += this.dy;
			this.dy = this.dy+this.ay;
		});
	}
});