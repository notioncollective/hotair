Crafty.c("TweetDisplay", {
	init: function() {
		_.bindAll(this);
		this.addComponent("HTMLTemplate");
		this.setTemplate($("#TweetDisplayTemplate").html());
		this.w = Crafty.DOM.window.width;
		this.z = 100;
		
		HA.m.subscribe(HA.e.ENEMY_SELECTED, this._handleEnemySelectedEvent);
	},
	_handleEnemySelectedEvent: function(e, enemy) {
		this.updateContent({text: enemy.tweet.text});
	}
});