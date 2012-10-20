Crafty.scene("start", function() {
	console.log("Scene: start");
	var that = this;
	var startMenuNav,
			partySelectNav,
			closeMenuNav,
			aboutMenuNav,
			shareMenuNav,
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
  	
	// draw some clouds	
	var j = 0;
	for (;j<5;j++) {
		Crafty.e("Cloud");
	}
	
	// draw some balloons	
	// var k = 0;
	// for (;k<10;k++) {
		// Crafty.e("StartScreenBalloon");
	// }

	function createMainStartMenu() {
		startMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "StartListNav"});
	
		startMenuNav.addListItem({
			text: "Play!",
			callback: function(arg) {
				console.log("New Game!");
				HA.game.closeModals();
				// If the hotair cookie exists go directly to party selection, otherwise show instructions
				if(Cookies.get('hotair')) {
					createPartySelectMenu();
				} else {
					HA.game.openModal("InstructionsDisplay");
					createCloseMenu(true);
					Cookies.set("hotair", "played", {"expires": 604800});
				}
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
				createAboutMenu();
			},
			args: ["About!!"]
		});
		
		// TODO: This templating could probably get moved to an HTMLTemplate entity? 
		startMenuNav.addListItem({
			text: "Scores",
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
		
		startMenuNav.addListItem({
			text: "Share",
			callback: function() {
				this.destroy();
				createShareMenu();
			}
		});
				
		startMenuNav.renderListNav();
	}
		
		
	function createAboutMenu() {
		aboutMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "AboutMenuNav"});

		aboutMenuNav.addListItem({
			text: "Contact Us",
			callback: function() {
				window.open('/contact');
			}
		});
		
		aboutMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				createMainStartMenu();
			}
		});
		
		aboutMenuNav.renderListNav();
	}
	
	function createShareMenu() {	
		shareMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "AboutMenuNav"});
		
		shareMenuNav.addListItem({
			text: "Twitter",
			callback: function() {
				window.open("/share/twitter");
			}
		});		
		
		shareMenuNav.addListItem({
			text: "Facebook",
			callback: function() {
				window.open("/share/facebook");
			}
		});								
		
		shareMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				createMainStartMenu();
			}
		});	
		
		shareMenuNav.renderListNav();
					
	}
	

	function createCloseMenu(selectParty) {
		closeMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "CloseListNav"});
			
		closeMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				if(selectParty) {
					createPartySelectMenu();
				} else {
					createMainStartMenu();
				}
			}
		});
		closeMenuNav.renderListNav();
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
      text: "&lt; Back",
      callback: function(arg) {
        this.destroy();
        createMainStartMenu();
      }
    });
    var defaultSelected = Math.floor(Math.random()*2);
		partySelectNav.selectItem(defaultSelected);
		partySelectNav.renderListNav();
	}

		
	createStartScreenMainGraphic();
	createMainStartMenu();
	
}, function () {
	HA.m.unsubscribe(HA.events.RESIZE_VIEWPORT);
  HA.m.unsubscribe(HA.e.TWEETS_LOADED);
});
