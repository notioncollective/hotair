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
		
		// this.bind("ShowMessage", function(e) {
			// this.flashMessage(e.text, e.callback);
		// });
		
		HA.m.subscribe(HA.e.SHOW_MESSAGE, this._handleShowMessageEvent);
		
	},
	
	_handleShowMessageEvent: function(e, text, callback) {
		this.flashMessage(text, callback);
	},
	
	flashMessage: function(text, callback) {
		var that = this,
			blinkCount = that._blinkCount;
		
		this.replace("<div class='message-display'>" + text + "</div>");
		
		function blinkOn() {
			if(blinkCount === 0) {
				if(_.isFunction(callback)) callback();
				return;
			}
			$(that._element).show();
			_.delay(blinkOff, that._flashDuration);
		}
		
		function blinkOff() {
			$(that._element).hide();
			blinkCount -= 1;
			_.delay(blinkOn, that._flashDuration);
		}
		blinkOn();
	}
});