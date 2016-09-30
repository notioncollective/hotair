Crafty.c("Score", {
	_score: {
		d: 0,
		r: 0
	},
	_increment: 1,

	init: function() {
		console.log("Score: init()");
		Crafty.bind('UpdateScore', this._handleUpdateScore.bind(this));
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
			// set by party, probably more common case
			this._score[party] = score;
		} else {
			// replace entire score object
			this._score = score;
		}
		console.log('score set', score, party);
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
	},

	_handleUpdateScore(data) {
		console.log('_handleUpdateScore', data);
		this.setScore(data.scoreInc, data.party);
	}
});