Crafty.c("MessageDisplay", {
	init: function() {
		console.log("instantiate MessageDisplay");
		_.bindAll(this);
		this.addComponent("2D, DOM, HTML");
		this.w = 400;
		this.x = Crafty.DOM.window.width/2-this.w/2;
		this.y = Crafty.DOM.window.height/2;
		this.css("text-align", "center");
		this.css("padding", "20px");
		this._blinkCount = 3;
		this._flashDuration =  300;
		
		this._messageCallback = null;
		
		// this.bind("ShowMessage", function(e) {
			// this.flashMessage(e.text, e.callback);
		// });
		
		HA.m.subscribe(HA.e.SHOW_MESSAGE, this._handleShowMessageEvent);
		
	},
	
	_handleShowMessageEvent: function(e, text, callback, context) {
		console.log("_handleShowMessageEvent callback: ", callback);
		if(_.isFunction(callback)) {
			this._messageCallback = callback;
		} else {
			this._messageCallback = null;
		}
		this.flashMessage(text);
	},
	
	setMessage: function(text) {
		this.replace("<div class='message-display'>" + text + "</div>");
	},
	
	showMessage: function(text) {
		if(_.isString(text)) this.setMessage(text);
		$(this._element).show();

	},
	
	hideMessage: function() {
		$(this._element).hide();
	},
	
	flashMessage: function(text) {
		var that = this,
				blinkCount = that._blinkCount,
				callback = callback;
		
		// console.log("flashMessage callback: ", that._messageCallback);
		
		that.setMessage(text);
		
		function blinkOn() {
			if(blinkCount === 0) {
				// console.log("blinkOn callback: ", that._messageCallback);
				if(_.isFunction(that._messageCallback)) that._messageCallback();
				return;
			}
			that.showMessage()
			_.delay(blinkOff, that._flashDuration);
		}
		
		function blinkOff() {
			that.hideMessage();
			blinkCount -= 1;
			_.delay(blinkOn, that._flashDuration);
		}
		blinkOn();
	}
});