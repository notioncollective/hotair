Crafty.scene("start", function() {
	console.log("Scene: start");
	HA.sm.fullScreenKeyEnabled(true);
	
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
				closeModals();
				openModal("AboutDisplay"); 
				this.destroy();
				createCloseMenu();
			},
			args: ["About!!"]
		});
		
		// TODO: This templating could probably get moved to an HTMLTemplate entity? 
		startMenuNav.addListItem({
			text: "High Scores",
			callback: function(arg) {
				closeModals();
				openModal("HighScoresDisplay");
				this.destroy();
				createCloseMenu();
				$.getJSON('/highscores', function(resp) {
					var temp = _.template($("#HighScoresTemplate").html());
					var tempHtml = temp({highscores: resp.data});
					$("#HighScoresDisplay .modal-inner").html(tempHtml); 
				});
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
		.attr({x:(Crafty.DOM.window.width/2)-256, y:(Crafty.DOM.window.height/2)-256});
		
	createMainStartMenu();
	
	// HA.startScreen = new Crafty.StartScreen();
	// HA.startScreen.init();
	
});
