Crafty.c("ListNav", {
	init: function() {
		this.addComponent("2D, DOM, HTML, Keyboard");
		this.w = Crafty.DOM.window.width;
		this.h = Crafty.DOM.window.height;
		
		this.listNavItems = [];
		this.selectedItem = 0;
		
		/**
		 *  Configuration
		 *
		 * The following set of params can be overridden upon instantiating an entity. 
		 */
		this.selectedClass = "selected";
		this.wrappingClass = "list-nav";
		this.wrappingId = "";
		this.selectSnd = "select";
		this.chooseSelectionSnd = "choose";
		this.chooseSelectionKeys = [Crafty.keys.SPACE, Crafty.keys.A];
		
		this.bind("KeyDown", function(e) {
			console.log("selecting...", e.key);
			if (e.key === Crafty.keys.LEFT_ARROW) {
				this.selectPrevItem();
			} else if(e.key === Crafty.keys.RIGHT_ARROW) {
				this.selectNextItem();				
			} else if(_.indexOf(this.chooseSelectionKeys, e.key) !== -1) {
				this.chooseSelectedListItem();
			}
		});
		
		// TODO: rebind to click events
		// this.bind("Click", function(e) {
			 			
		// });
		
	},
	
	setTemplate: function(templateString) {
		this.template = _.template(templateString);
	},
	
	/**
	 * Add a list nav item object in the form: 
	 * 
	 * { text: "Text To Display", callback: function() {}, args: [] }
	 * 
	 * The callback function will be called upon chosing a list item, and will be passed the args supplied by the args array.
	 * Note that the callback function will be called in the context of the ListNav entity from which it is called.
	 */
	addListItem: function(listNavItem) {
		console.log("addListItem");
		this.listNavItems.push(listNavItem);
	},
	
	renderListNav: function() {
		console.log("rending list nav");
		var output = "", that = this, active;
		_.each(this.listNavItems, function(item, index) {
			active = (index === that.selectedItem) ? "active" : '';
			output += "<span class='"+active+"'>"+item.text+"</span>";
		});
		this.replace("<div id='"+this.wrappingId+"'class='"+this.wrappingClass+"'>"+output+"</div>");
	},
	selectNextItem: function() {
		if(this.selectedItem < this.listNavItems.length-1) {
			Crafty.audio.play(this.selectSnd);
			this.selectedItem += 1;
		}
		this.renderListNav();
	},
	selectPrevItem: function() {
		if(this.selectedItem > 0) {
			Crafty.audio.play(this.selectSnd);
			this.selectedItem -= 1;
		}
		this.renderListNav();	
	},
	chooseSelectedListItem: function() {
		Crafty.audio.play(this.chooseSelectionSnd);
		var chosen = this.listNavItems[this.selectedItem];
		if(_.isFunction(chosen.callback)) {
			chosen.callback.apply(this, chosen.args);
		};
	}
});
