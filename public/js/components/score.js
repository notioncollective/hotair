Crafty.c("Score", {
	_score: {
		d: 0,
		r: 0
	},
	_increment: 1,

	init: function() {
		console.log("Score: init()");
	},

	/**
	 * Constructor-like
	 * Allow the score increment to be set.
	 */
	Score: function(inc) {
		this._increment = inc;
	},

	getScore: function(party) {
		if (party) {
			return this._score[party];
		}
		return this._score;
	},

	/**
	 * Set the score
	 */
	setScore: function(score, party) {
		if (party) {
			this._score[party] = score;
		}
		this._score = score;
	},

	/**
	 * Increase score by increment
	 */
	incrementScore: function(party) {
		this._score[party] += this._increment;
	},

	/**
	 * Set the increment
	 */
	setIncrement: function(inc) {
		this._increment = inc;
	}
});