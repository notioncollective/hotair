Crafty.c("ListNav", {
	init: function() {
		this.addComponent("2D, DOM, HTML, Keyboard");
    this._fitToViewport();
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
		this.chooseSelectionKeys = [Crafty.keys.ENTER, Crafty.keys.SPACE];
		this.z = 2000;

		this.bind("KeyDown", function(e) {
			if (e.keyCode === Crafty.keys.LEFT_ARROW) {
				this.selectPrevItem();
			} else if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
				this.selectNextItem();
			} else if(_.indexOf(this.chooseSelectionKeys, e.keyCode) !== -1) {
				this.chooseSelectedListItem();
			}
		});

		// TODO: rebind to click events
		// this.bind("Click", function(e) {

		// });

	  var that = this;
		HA.m.subscribe(HA.events.RESIZE_VIEWPORT, function(e, w, h){
		  that.w = Crafty.viewport.width;
      that.h = Crafty.viewport.height;
		});

	},

	unInit: function() {
		_unbindClickEvents();
	},

	setTemplate: function(templateString) {
		this.template = _.template(templateString);
	},

	/**
	 * Add a list nav item object in the form:
	 *
	 * { text: "Text To Display", callback: function() {}, args: [], options }
	 *
	 * The callback function will be called upon chosing a list item, and will be passed the args supplied by the args array.
	 * Note that the callback function will be called in the context of the ListNav entity from which it is called.
	 *
	 * The options object can contain the following options:
	 *
	 * // a string of classes to add to the list-item element
	 * extraClasses: "class_one class_two"
	 */
	addListItem: function(listNavItem) {
		// console.log("addListItem");
		this.listNavItems.push(listNavItem);
	},

	renderListNav: function() {
		var output = "", that = this, active;
		_.each(this.listNavItems, function(item, index) {
			var text = (typeof item.text === 'function') ? item.text() : item.text;
			active = (index === that.selectedItem) ? "active" : '';
			output += "<span class='"+active+"' data-index='"+index+"'>"+text+"</span>";
		});
		this.replace("<div id='"+this.wrappingId+"'class='"+this.wrappingClass+"'>"+output+"</div>");
		this._bindClickEvents();
	},


  _fitToViewport: function() {
    this.w = Crafty.viewport.width;
    this.h = Crafty.viewport.height;
  },

	_unbindClickEvents: function() {
		$(document).off("click", "."+this.wrappingClass+" span");
	},

	_bindClickEvents: function() {
		var that = this;
		this._unbindClickEvents();
		$(document).on("click", "."+this.wrappingClass+" span", function(e) {
			that.selectedItem = $(this).data("index");
			that.chooseSelectedListItem();
		});
	},

	// select specific item in list
	selectItem: function(n) {
		if(0 <= n && n < this.listNavItems.length) {
			this.selectedItem = n;
		} else console.error("Invalid menu item selected")
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
