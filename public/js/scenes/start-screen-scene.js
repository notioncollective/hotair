Crafty.scene("start", function() {
	console.log("Scene: start");
	var that = this;
	var startMenuNav,
			partySelectNav,
			closeMenuNav,
			aboutMenuNav,
			shareMenuNav,
			highScoresMenuNav,
			startScreenMainGraphic = new Crafty.e('StartScreenMainGraphic');

			
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
				this.destroy();
				createHighScoresMenu();
			},
			args: ["Daily High Scores!"]
		});
		
		startMenuNav.addListItem({
			text: "Share",
			callback: function() {
				this.destroy();
				createShareMenu();
			}
		});
		
		startMenuNav.addListItem({
			text: function() {
				var mute = HA.game.isMuted() ? "-mute" : "";
				var icon = "<i id='icon-snd' class='icon icon-snd" + mute +"'></i>";
				return icon;
			},
			// text: "Test",
			callback: function() {
				if(HA.game.isMuted()) {
					HA.game.unmute();
					$('#icon-snd').removeClass('icon-snd-mute').addClass('icon-snd');
				} else {
					HA.game.mute();
					$('#icon-snd').removeClass('icon-snd').addClass('icon-snd-mute');
				}
			}
		});
				
		startMenuNav.renderListNav();
	}
		
	function createAboutMenu() {
		aboutMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "AboutMenuNav"});
		
		aboutMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				createMainStartMenu();
			}
		});
		
		aboutMenuNav.addListItem({
			text: "Contact Us",
			callback: function() {
				window.open('/contact');
			}
		});
		
		aboutMenuNav.addListItem({
			text: "Newsletter",
			callback: function() {
				window.open('/newsletter');
			}
		});
		
		aboutMenuNav.addListItem({
			text: "@hotairgame",
			callback: function() {
				window.open('http://twitter.com/hotairgame');
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
	
	function createHighScoresMenu(scrn) {
		highScoresMenuNav = Crafty.e('ListNav')
			.attr({wrappingId: "HighScoresListNav"});		
		

		
		highScoresMenuNav.addListItem({
			text: "Daily",
			callback: function() { update_score_display('daily'); }
		});	
		highScoresMenuNav.addListItem({
			text: "All-time",
			callback: function() { update_score_display('all-time'); }
		});
		// always show this
		highScoresMenuNav.addListItem({
			text: "Ok!",
			callback: function() {
				this.destroy();
				HA.game.closeModals();
				createMainStartMenu();
			}
		});		
		
		
		function update_score_display(scrn) {	
			console.log("open modal score screen: ",scrn);
			var scrn = scrn || 'daily',
					tmpl_sel = "#HighScoresTemplate",
					modal_title =  "High scores!",
					endpoint = "/highscores";	
					
			// determine which menu items to show
			switch(scrn) {
				case 'all-time': // show all-time highscores	
					modal_title =  "All-time high scores!";		
					break;
				case 'daily':  // daily high-scores
					modal_title =  "Today's high scores!";
					endpoint = "/highscores/daily";		
					break;
			}
			
			HA.game.closeModals();
			$("#HighScoresDisplay .modal-inner").html('<span class="loading">Loading...</span>');
			$.getJSON(endpoint, function(resp) {
						var temp = _.template($(tmpl_sel).html());
						var tempHtml = temp({
								title: modal_title,
								highscores: resp.highscores,
								cumscore_d: resp.stats.d,
								cumscore_r: resp.stats.r
						});
						$("#HighScoresDisplay").html(tempHtml); 
			});
			HA.game.openModal("HighScoresDisplay");			
		};
		
		update_score_display('daily');
		highScoresMenuNav.renderListNav();

			
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
	  	startScreenMainGraphic.reposition();
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
	
	createMainStartMenu();
	
}, function () {
	HA.m.unsubscribe(HA.events.RESIZE_VIEWPORT);
  HA.m.unsubscribe(HA.e.TWEETS_LOADED);
});
