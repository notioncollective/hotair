// DEPRACATED
// Crafty.extend({
	// ListNav: function($list) {
		// var $menuItems = $list,
			// $currentlySelected = null,
			// _selectedIndex = null,
			// _numMenuItems = $menuItems.length; 
// 		
		// var _init = function() {
			// var that = this;
			// $currentlySelected = $menuItems.first().find('a').focus();
			// _selectedIndex = 0;
// 			
			// // set up event handlers
			// $(document).on('keydown', $menuItems, _keyBindings);
// 			
		// };
// 		
		// var _selectNextMenuItem = function() {
			// Crafty.audio.play("select");
			// if(_selectedIndex < _numMenuItems-1) {
				// _selectedIndex += 1;
				// $menuItems.eq(_selectedIndex).find('a').focus();
			// }
		// };
// 		
		// var _keyBindings = function(e) {
			// if(e.which === 37) {
				// _selectPrevMenuItem();
			// }
			// if(e.which === 39) {					
				// _selectNextMenuItem();
			// }			
		// }
// 		
		// var _selectPrevMenuItem = function() {
			// Crafty.audio.play("select");
			// if(_selectedIndex > 0) {
				// _selectedIndex -= 1;
				// $menuItems.eq(_selectedIndex).find('a').focus();				
			// }
		// };
// 		
		// var _destroy = function() {
			// $(document).off('keydown', _keyBindings);
			// $menuItems.eq(_selectedIndex).find('a').blur();
			// // $menuItems.blur();
			// // delete this;
		// };
// 
// 		
		// return {
			// init: function() {
				// _init();
			// },
			// destroy: function() {
				// _destroy();
			// },
			// selectNextMenuItem: function() {
				// _selectNextMenuItem();
			// },
			// selectPrevMenuItem: function() {
				// _selectPrevMenuItem();
			// }
		// } 
	// }
// });