Crafty.c("EnemySelectionArrow", {
	init: function() {
		console.log("EnemySelectionArrow init()");
		this.addComponent("2D, DOM, SpriteAnimation, Oscillate, balloon_select_arrow");
		this.w = 60;
		this.h = 60;
		// this.y = 80;
		this.z = -1;
		this
			.reel("select_arrow", 1000, 0, 0, 4)
			.animate("select_arrow", -1);

    this.bind('EnterFrame', this._enterFrame);
	},

	 _enterFrame: function() {
    if(typeof this.enemyParent !== 'undefined') {
      this.y = this.enemyParent.y-70;
    }
  }

});