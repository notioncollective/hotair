Crafty.c("TweetDisplay", {
	init: function() {
		_.bindAll(this);
		this.addComponent("HTMLTemplate");
		this.setTemplate($("#TweetDisplayTemplate").html());
		this.mainSelector ='#TweetDisplay';
		this.textSelector = '#TweetDisplay .content';
		this.arrowSelector = "#TweetDisplayArrow";
		this.columnSelector = "#TweetDisplayColumn";
		this.footerSelector = "#TweetDisplayFooter";
		this.enemy = null;

		// console.log($('#TweetDisplayColumnTemplate').html());

		// this.tweetDisplayColumn = Crafty.e('HTMLTemplate').attr({
			// w:140,
			// h:Crafty.viewport.height,
			// y:0,
			// x:-64,
			// z:-999
		// });
		// this.tweetDisplayColumn.setTemplate($('#TweetDisplayColumnTemplate').html())

		this.w = Crafty.viewport.width;
		this.z = 999;
		HA.m.subscribe(HA.e.ENEMY_SELECTED, this._handleEnemySelectedEvent);
		HA.m.subscribe(HA.e.PAUSE_GAME, this._hideTweetText);
		HA.m.subscribe(HA.e.RESUME_GAME, this._showTweetText);

		// this.bind('EnterFrame', function(){
			// if(this.enemy) {
				// var enemy_progress = (Crafty.viewport.height-this.enemy.y)/Crafty.viewport.height;
				// console.log("enemy balloon y: ", this.enemy.y);
				// console.log("enemy balloon progress: ", enemy_progress);
				// console.log("window height: ", Crafty.viewport.height);
				// $(this.arrowSelector).css('top', (60-66*enemy_progress)+'px');
			// }
		// });

	},
	_handleEnemySelectedEvent: function(e, enemy) {
		this.enemy = enemy;
		this.updateContent({text: enemy.tweet.text});
		// this.tweetDisplayColumn.updateContent();
//
		// this.tweetDisplayColumn.x = Math.ceil(enemy.x)-10;
		// console.log("tweetDisplayColumn", this.tweetDisplayColumn)
		// $(this.columnSelector).css('background-position', '-'+this.tweetDisplayColumn.x+'px 0px');
		// $(this.footerSelector).css('background-position', '-'+this.tweetDisplayColumn.x+'px bottom');
		// $(this.mainSelector).css('background-position', (enemy.x-14)+'px 0px');

		// column
		// $(this.columnSelector).show();
		// $(this.columnSelector).css('left', enemy.x-10);
		// $(this.columnSelector).css('background-position', '-'+(enemy.x+6)+'px 0px');

		// column
		// $(this.arrowSelector).show();
		// $(this.arrowSelector).css('left', enemy.x+28);
		// $(this.mainSelector).css('background-position', (enemy.x-14)+'px 0px');
	},
	_hideTweetText: function(e) {
		$(this.textSelector).hide();
	},
	_showTweetText: function(e) {
		$(this.textSelector).show();
	},
});