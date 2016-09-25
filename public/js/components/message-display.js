Crafty.c("MessageDisplay", {
	init: function() {
		console.log("instantiate MessageDisplay");
		_.bindAll(this);
		this.addComponent('HTMLTemplate');
		this.setTemplate($("#MessageDisplayTemplate").html());
		this.x = 0;
		this.y = 0;
		this.w = Crafty.viewport._width;
		this.h = Crafty.viewport._height;
		this.css("display", "none");
		this.showMessage(" ");
		this._blinkCount = 3;
		this._flashDuration =  300;
		this._messageCallback = null;
		
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
		this.updateContent({message: text});
		// this.replace("<div class='message-display'>" + text + "</div>");
	},
	
	showMessage: function(text) {
		if(_.isString(text)) this.setMessage(text);
		$("#MessageDisplay").show();
		$(this._element).show();
	},
	
	hideMessage: function() {
		$("#MessageDisplay").hide();
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