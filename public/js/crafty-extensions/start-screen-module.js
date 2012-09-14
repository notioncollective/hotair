Crafty.extend({
	StartScreen: function() {
		var $menuItems = $("#StartDisplay li a"),
			$currentlySelected = null,
			_selectedIndex = null,
			_numMenuItems = $menuItems.length; 
		
		var _init = function() {
			console.log("StartScreen: _init, _numMenuItems = ", _numMenuItems);
			var that = this;
			$currentlySelected = $menuItems.first().focus();
			_selectedIndex = 0;
			
			$(document).on('keydown', function(e) {
				if(e.which === 37) {
					_selectPrevMenuItem();
				}
				if(e.which === 39) {					
					_selectNextMenuItem();
				}
			});
			
			// set up event handlers
			$(document).on('click', "#new-game", function(e) {
				console.log('new-game');
				$("#StartDisplay").hide();
				_showPartySelection();
				return false;
			});
			
		};
		
		var _selectNextMenuItem = function() {
			console.log("_selectNextMenuItem");
			if(_selectedIndex < _numMenuItems-1) {
				_selectedIndex += 1;
				$menuItems.eq(_selectedIndex).focus();
			}
		};
		
		var _selectPrevMenuItem = function() {
			console.log("_selectPrevMenuItem");
			if(_selectedIndex > 0) {
				_selectedIndex -= 1;
				$menuItems.eq(_selectedIndex).focus();				
			}
		};
		
		var _showPartySelection = function() {
			var demY = Crafty.DOM.window.height/2;
			var repY = Crafty.DOM.window.height/2 + 30;
			var dem = Crafty.e("Button").text("Democrat").attr({
					y: demY,
					callback: function() {
						console.log("callback");
						HA.party = "d";
						Crafty.scene("gameplay");
					}
				});
			
			var rep = Crafty.e("Button").text("Republican").attr({
					y: repY, 
					callback: function() {
						HA.party = "r";
						Crafty.scene("gameplay");
					}
				});
		}
		
		return {
			init: function() {
				_init();
			},
			selectNextMenuItem: function() {
				_selectNextMenuItem();
			},
			selectPrevMenuItem: function() {
				_selectPrevMenuItem();
			}
		} 
	}
});