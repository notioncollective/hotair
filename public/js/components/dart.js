/**
 * Dart component. Sets color based on player party.
 * @class this
 */

Crafty.c("Dart", {
	_party: null,
	/**
	 Initialize dart component
	 @private
	 @method init
	 @param {Object} e Event object.
	 */
	init: function() {
		this.addComponent("2D, DOM, Color, Collision, Motion, Party");

		this.setPartySpriteTemplate('%p_dartx2');

		this.w = 40;
		this.h = 40;

		// this.collision(new Crafty.polygon([
		// 	[15, 10],
		// 	[this.w-15, 10],
		// 	[this.w-15, this.h-10],
		// 	[15, this.h-10]
		// ]));

		/**
		 * Trigger the ENEMY_HIT event.
		 */
		// this.onHit("Enemy", function(e) {
		// 	console.log('hit enemy!', e[0].obj);

		// 	var enemy = e[0].obj;
		// 	if(enemy.y+enemy.h/3 < this.y) return;
		// 	enemy.registerHitCompleteEvent();
		// 	HA.m.publish(HA.e.ENEMY_HIT_START, [e[0].obj]);
		// 	this.destroy();
		// });

		this.bind('Moved', this.onMove);

	},
	fireAtTarget: function(enemy) {
		this.target = enemy;
		console.log('fireAtTarget', enemy);
		var bx = enemy.x + enemy.w/2;
		var by = enemy.y + enemy.h/2;
		var dx = this.x + this.w/2;
		var dy = this.y + this.h/2;

		this.ay = 500;
		this.vy = 200;

		var roots = HA.quadratic(
			(.5*this.ay), // a
			(this.vy-enemy.vy), // b
			(dy - by) // c
		);

		var t = Math.max(roots[0], roots[1]);
		var vx = (bx-dx)/t;

		this.vx = vx; // (sign(vx)) * Math.min(Math.abs(vx), params.thisMaxXV);
	},
	onMove: function(e) {
		var vel = this.velocity();
		var origin = new Crafty.math.Vector2D(0, 0);
		this.rotation = (vel.angleTo(origin) + Math.PI / 2) * (180 / Math.PI);
	}
});