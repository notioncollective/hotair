Crafty.c("Score", {
	_score: 0,
	_increment: 100,
	init: function() {
		console.log("Score: init()");
		// this.bind("UpdateScore", function(e) {
			// this.setScore(e.score);
			// console.log("Score Component : Updating Score: "+e.score);
		// });
		
	},
	/**
	 * Constructor-like
	 * Allow the score increment to be set.
	 * @triggers UpdateScore
	 */
	Score: function(inc) {
		this._increment = inc;
	},
	getScore: function() {
		return this._score;
	},
	
	/**
	 * Set the score
	 * @triggers UpdateScore
	 */
	setScore: function(score) {
		this._score = score;
	},
	
	/**
	 * Increase score by increment
	 * @triggers UpdateScore
	 */
	incrementScore: function() {
		this._score += this._increment;
		Crafty.trigger("UpdateScore", {score: this._score, dScore: this._increment});
	},
	/**
	 * Reduce score by increment.
	 * @triggers UpdateScore
	 */
	decrementScore: function() {
		console.log("Score: decrementScore");
		this._score -= this._increment;
		if(this._score < 0) {
			this._score = 0;
		}
		Crafty.trigger("UpdateScore", {score: this._score, dScore: -this._increment});
	},
	
	/**
	 * Set the increment
	 */
	setIncrement: function(inc) {
		this._increment = inc;
	}
});