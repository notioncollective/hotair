Crafty.c("EnemySelection", {
	init: function() {
		this.addComponent("2D, DOM, SpriteAnimation, balloonx2");
		this
			.animate("selected", 0, 1, 3)		
			.animate("selected", 30, -1);
			
		this.bind('EnterFrame', this._enterFrame);         
	},
	// setParent: function(obj) {
		// console.log("EnemySelection :: Set parent", obj);
		// this.parent = obj;
		// this.x = this.parent.x;
		// this.y = this.parent.y;
		// this.w = this.parent.w;
		// this.h = this.parent.h;
	// },
	_enterFrame: function() {
		if(typeof this.enemyParent !== 'undefined') {
			this.x = this.enemyParent.x;
			this.y = this.enemyParent.y;
		}
	}
});