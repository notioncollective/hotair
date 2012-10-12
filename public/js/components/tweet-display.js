Crafty.c("TweetDisplay", {
	init: function() {
		_.bindAll(this);
		this.addComponent("HTMLTemplate");
		this.setTemplate($("#TweetDisplayTemplate").html());
		this.textSelector = '#TweetDisplay .content';
		this.w = Crafty.DOM.window.width;
		this.z = 0;
		
		HA.m.subscribe(HA.e.ENEMY_SELECTED, this._handleEnemySelectedEvent);
		HA.m.subscribe(HA.e.PAUSE_GAME, this._hideTweetText);
		HA.m.subscribe(HA.e.RESUME_GAME, this._showTweetText);
		
	},
	_handleEnemySelectedEvent: function(e, enemy) {
		this.updateContent({text: enemy.tweet.text});
	},
	_hideTweetText: function(e) {
		$(this.textSelector).hide();
	},
	_showTweetText: function(e) {
		$(this.textSelector).show();
	}
});