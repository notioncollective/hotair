Crafty.c("Levels", {
	_level: 1,
	_perfectLevel: true,
	_numEnemiesPerLevel: 2,
	init: function() {
		this.bind("NextLevel", this.nextLevel);
		Crafty.trigger("SetLevel", {level: this._level});
	},
	incrementLevel: function() {
		this._level += 1;
		this._perfectLevel = true;
		Crafty.trigger("NextLevel", {level: this._level});
	},
	setLevel: function(level) {
		this._level = level;
		Crafty.trigger("SetLevel", {level: level});
	},
	getSpeed: function() {
		return this._level;
	},
	getScoreMultiplier: function() {
		return this._level;
	},
	getLevel: function() {
		return this._level;
	},
	getNumEnemiesPerLevel: function() {
		return this._numEnemiesPerLevel;
	}
})
