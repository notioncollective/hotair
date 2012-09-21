Crafty.scene("start", function() {
	console.log("Scene: start");
	// Crafty.background('rgb(140, 208, 255)');
	
	// TODO: Audio needs to load first, so this doesn't work...
	// Crafty.audio.play("start_music", -1, .5);
	$("#StartDisplay").show();
	var $startMenu = $("#StartDisplay li");
	var startMenu = new Crafty.ListNav($startMenu);
	startMenu.init();
	
	var startScreenMainGraphic = Crafty.e('StartScreenMainGraphic')
		.attr({x:(Crafty.DOM.window.width/2)-256, y:(Crafty.DOM.window.height/2)-256, z:100});
	
	var $partySelectMenu = $("#PartySelectDisplay li");
	var partySelectMenu = new Crafty.ListNav($partySelectMenu);
	
	// event handlers
	$(document).on('click', "#new-game", function(e) {
		console.log('new-game');
		$("#StartDisplay").hide();
		$("#PartySelectDisplay").show();
		partySelectMenu.init();
		return false;
	});
	
	$(document).on('click', ".party-select", function(e) {
		console.log('begin game!');
		$('.start-scene').hide();
		var party = $(this).data('party');
		HA.game.setParty(party);
		Crafty.scene("gameplay");
		// Crafty.Twitter.init(true);
		return false;
	});
	
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
