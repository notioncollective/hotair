Crafty.c("Party", {
	_REPUBLICAN: 'r',
	_DEMOCRAT: 'd',
	_party: undefined,
	_partySpriteTemplate: undefined,
	
	setPartySpriteTemplate: function(template) {
		if(_.isString(template)) {
			if()
		} else { throw "PartySprite emplate must be a string"}
		return this;
	}
	
	setParty: function(party) {
		if(party === this._DEMOCRAT || party === this._REPUBLICAN ) {
			this._party = party;
			if(!_.isUndefined(this._partySpriteTemplate)) {
				// subs in the current party for the template token
				this.addComponent(this._partySpriteTemplate.replace(/\%p/g, this._party));
			}
			this.addComponent(this._party+'_dartx2');
		} else { throw "Party must be set to either 'd' or 'r'"; }
		return this;
	},
	
	getParty: function() {
		return this._party;
	}
});