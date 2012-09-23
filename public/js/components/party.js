Crafty.c("Party", {
	_REPUBLICAN: 'r',
	_DEMOCRAT: 'd',
	_TOKEN: '%p',
	_party: undefined,
	_partySpriteTemplate: undefined,
	// _setPartyEvent: HA.e.SET_PARTY,
	
	init: function() {
		// _.bindAll(this);
	},
	
	setPartySpriteTemplate: function(template) {
		if(_.isString(template)) {
			if(template.search(this._TOKEN) > 0)
				console.log("WARNING: If party sprite template doesn't contain '"+this._TOKEN+"', party will not be substituted.");				
				
			this._partySpriteTemplate = template;
			this._addSpriteComponent();		
			
		} else { throw "PartySprite emplate must be a string"}
		return this;
	},

	
	// respondToSetPartyEvent: function(bool) {
	// 	console.log("Respond to set party event!", this);
	// 	if(bool || _.isUndefined(bool)) {
	// 		HA.m.subscribe(this._setPartyEvent, this._handleSetPartyEvent);
	// 	} else {
	// 		HA.m.unsubscribe(this._setPartyEvent);
	// 	}
	// 	return this;
	// },
	
	setParty: function(party) {
		console.log("setParty!!!!");
		if(party === this._DEMOCRAT || party === this._REPUBLICAN ) {
			this._party = party;
			this._addSpriteComponent();
		} else { throw "Party must be set to either 'd' or 'r'"; }
		return this;
	},
	
	// _handleSetPartyEvent: function(e, party) { this.setParty(party); },
	_addSpriteComponent: function() {
		if(!_.isUndefined(this._party) && !_.isUndefined(this._partySpriteTemplate)) {
			this.addComponent(this._partySpriteTemplate.replace(this._TOKEN, this._party));
		}
	},
	
	getParty: function() {
		return this._party;
	}
});