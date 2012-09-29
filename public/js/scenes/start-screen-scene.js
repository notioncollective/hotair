Crafty.scene("start", function() {
	console.log("Scene: start");
	
	var startMenuNav, partySelectNav, closeMenuNav;

	function closeModals() {
		$(".modal").hide();		
	}
	function openModal(id) {
		$("#"+id).show();
	}

	function createCloseMenu() {
		closeMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "CloseListNav"});
			
		closeMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				closeModals();
				createMainStartMenu();
			}
		});
		closeMenuNav.renderListNav();
	}

	function createMainStartMenu() {
		startMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "StartListNav"});
	
		startMenuNav.addListItem({
			text: "New Game",
			callback: function(arg) {
				console.log("New Game!"); 
				createPartySelectMenu();
				closeModals();
				this.destroy();
			}
		});
		
		startMenuNav.addListItem({
			text: "Instructions",
			callback: function(arg) { 
				console.log("list item callback says: "+arg);
				closeModals();
				openModal("InstructionsDisplay"); 
				this.destroy();
				createCloseMenu();
			},
			args: ["Instructions!"]
		});
		
		startMenuNav.addListItem({
			text: "About",
			callback: function(arg) { 
				console.log("list item callback says: "+arg);
				closeModals();
				openModal("AboutDisplay"); 
				this.destroy();
				createCloseMenu();
			},
			args: ["About!!"]
		});
		
		startMenuNav.addListItem({
			text: "High Scores",
			callback: function(arg) { 
				console.log("list item callback says: "+arg);
				closeModals();
				openModal("HighScoresDisplay"); 
				this.destroy();
				createCloseMenu(); 
			},
			args: ["High Scores!"]
		});
		
		startMenuNav.renderListNav();
	}
	

	function createPartySelectMenu() {
		console.log("party select menu...");
		
		partySelectNav = Crafty.e('ListNav')
		.attr({wrappingId: "PartySelectNav"});
	
		partySelectNav.addListItem({
			text: "Democrats",
			callback: function(arg) {
				console.log("Go Democrats!");
				this.destroy();
				HA.m.publish(HA.events.SET_PARTY, ["d"]);
				HA.m.publish(HA.events.LOAD_SCENE, ["gameplay"]);
			}
		});
		
		partySelectNav.addListItem({
			text: "Republicans",
			callback: function(arg) {
				console.log("Go Republicans!");
				this.destroy();
				HA.m.publish(HA.events.SET_PARTY, ["r"]);
				HA.m.publish(HA.events.LOAD_SCENE, ["gameplay"]);
			}
		});
		
		partySelectNav.renderListNav();
	}

	var startScreenMainGraphic = Crafty.e('StartScreenMainGraphic')
		.attr({x:(Crafty.DOM.window.width/2)-256, y:(Crafty.DOM.window.height/2)-256, z:100});
	
	createMainStartMenu();
	
	// fullscreen mode
	if(screenfull) {
		this.bind('KeyDown', function(e) {
		    if(e.key == Crafty.keys['ESC']) screenfull.toggle();
	    });
		screenfull.onchange = function(e) {
			if(screenfull.isFullscreen) {
				$('#FullScreenPrompt').hide();					
			} else {
				$('#FullScreenPrompt').show();									
			}
		};
	}
	
	// HA.startScreen = new Crafty.StartScreen();
	// HA.startScreen.init();
	
});
