Crafty.scene("start", function() {
	console.log("Scene: start");
	var that = this;
	var startMenuNav,
			partySelectNav,
			closeMenuNav,
			startScreenMainGraphic;
			
  HA.sm.fullScreenKeyEnabled(true); // enable full-screen mode
  
  // fullscreen key binding
  $(document).on("keydown", function(e) {
    if(e.keyCode == Crafty.keys['ESC']) {
      console.log("Full scrn");
      HA.sm.toggleFullScreenMode();
    }
  });
  
  // Event subscriptions
  HA.m.subscribe(HA.events.RESIZE_VIEWPORT, resizeViewportHandler);
  HA.m.subscribe(HA.e.TWEETS_LOADED, handleTweetsLoadedEvent);
  
  	
	// draw some clouds	
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}

	function createMainStartMenu() {
		startMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "StartListNav"});
	
		startMenuNav.addListItem({
			text: "New Game",
			callback: function(arg) {
				console.log("New Game!"); 
				createPartySelectMenu();
				HA.game.closeModals();
				this.destroy();
			}
		});
		
		startMenuNav.addListItem({
			text: "Instructions",
			callback: function(arg) {
				HA.game.closeModals();
				HA.game.openModal("InstructionsDisplay"); 
				this.destroy();
				createCloseMenu();
			},
			args: ["Instructions!"]
		});
		
		startMenuNav.addListItem({
			text: "About",
			callback: function(arg) {
				HA.game.closeModals();
				HA.game.openModal("AboutDisplay"); 
				this.destroy();
				createCloseMenu();
			},
			args: ["About!!"]
		});
		
		// TODO: This templating could probably get moved to an HTMLTemplate entity? 
		startMenuNav.addListItem({
			text: "High Scores",
			callback: function(arg) {
				HA.game.closeModals();
				HA.game.openModal("HighScoresDisplay");
				this.destroy();
				createCloseMenu();
				$.getJSON('/highscores', function(resp) {
					var temp = _.template($("#HighScoresTemplate").html());
					var tempHtml = temp({
							highscores: resp.highscores,
							cumscore_d: resp.stats.d,
							cumscore_r: resp.stats.r
					});
					$("#HighScoresDisplay .modal-inner").html(tempHtml); 
				});
			},
			args: ["High Scores!"]
		});
		startMenuNav.renderListNav();
	}
		

	function createCloseMenu() {
		closeMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "CloseListNav"});
			
		closeMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				createMainStartMenu();
			}
		});
		closeMenuNav.renderListNav();
	}

	
	function handleTweetsLoadedEvent(e) {
		if(!startMenuNav) {
			HA.game.closeModals();
			createMainStartMenu();
		}
	}
	
	function handleTweetsLoadErrorEvent(e) {
		HA.game.closeModals();
		openModal("ErrorDisplay");
	}
	
	function resizeViewportHandler(e, width, height) {
	  createStartScreenMainGraphic(width, height);
	 }

  function createStartScreenMainGraphic(width, height) {  
    startScreenMainGraphic = startScreenMainGraphic || Crafty.e('StartScreenMainGraphic');
    startScreenMainGraphic.attr(
         {
           x:(Crafty.DOM.window.width/2)-256,
           y:(Crafty.DOM.window.height/2)-256
        });
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
		
		partySelectNav.addListItem({
      text: "Back",
      callback: function(arg) {
        this.destroy();
        createMainStartMenu();
      }
    });
    var defaultSelected = Math.floor(Math.random()*2);
		partySelectNav.selectItem(defaultSelected);
		partySelectNav.renderListNav();
	}

		
	createStartScreenMainGraphic()	
	if(HA.twitter.isLoaded()) {
		createMainStartMenu();
	}
	// HA.startScreen = new Crafty.StartScreen();
	// HA.startScreen.init();
	
});
