Crafty.scene("loading", function() {
	console.log("Scene: loading");
	HA.sm.fullScreenKeyEnabled(false);
	
	var messageDisplay = Crafty.e("MessageDisplay");
	messageDisplay.showMessage("Loading...");
		
	Crafty.load([
		"img/20x2.png",
		"img/40x2.png",
		"img/balloonx2.png",
		"img/balloon_select_arrowx2.png",
		"img/cloud_scorex2.png",
		"img/cloudsx2.png",
		"img/keysx2.png",
		"img/lives_score_clouds.png",
		"img/parachutex2.png",
		"img/startscreen_basket.png",
		"img/tweet_display.png",
		"img/fonts/blue_score_16x16.png",
		"img/fonts/grey_score_16x16.png",
		"/snd/cloud_loops.mp3",
		"/snd/cloud_loops.wav",
		"/snd/cloud_loops.ogg",
		"/snd/drop.wav",
		"/snd/drop.mp3",
		"/snd/drop.ogg",
		"/snd/level.wav",
		"/snd/level.mp3",
		"/snd/level.ogg",
		"/snd/hit_good.wav",
		"/snd/hit_good.mp3",
		"/snd/hit_good.ogg",
		"/snd/hit_bad.wav",
		"/snd/hit_bad.mp3",
		"/snd/hit_bad.ogg",
		"/snd/whoosh.wav",
		"/snd/whoosh.mp3",
		"/snd/whoosh.ogg",
		"/snd/pause.wav",
		"/snd/pause.mp3",
		"/snd/pause.ogg",
		"/snd/select.wav",
		"/snd/select.ogg",
		"/snd/select.mp3",
		"/snd/select2.wav",
		"/snd/select2.ogg",
		"/snd/select2.mp3",
		"/snd/addLife.wav",
		"/snd/addLife.mp3",
		"/snd/addLife.ogg"
		],
		function() {
			HA.m.publish(HA.events.GAME_LOADED);
		}
	);
	Crafty.audio.add({
		// start_music: [
			// "/snd/iamerror.mp3"
		// ],
		game_music: [
			"/snd/cloud_loops.mp3",
			"/snd/cloud_loops.wav",
			"/snd/cloud_loops.ogg"
		], 
		drop: [
			"/snd/drop.wav",
			"/snd/drop.mp3",
			"/snd/drop.ogg"
		],
		level: [
			"/snd/level.wav",
			"/snd/level.ogg",
			"/snd/level.mp3"
		],
		hit_good: [
			"/snd/hit_good.wav",
			"/snd/hit_good.mp3",
			"/snd/hit_good.ogg"
		],
		hit_bad: [
			"/snd/hit_bad.wav",
			"/snd/hit_bad.mp3",
			"/snd/hit_bad.ogg"
		],
		whoosh: [
			"/snd/whoosh.wav",
			"/snd/whoosh.mp3",
			"/snd/whoosh.ogg"
			
		],
		pause: [
			"/snd/pause.wav",
			"/snd/pause.mp3",
			"/snd/pause.ogg"
		],
		select: [
			"/snd/select.wav",
			"/snd/select.mp3",
			"/snd/select.ogg"
		],
		choose: [
			"/snd/select2.wav",
			"/snd/select2.ogg",
			"/snd/select2.mp3"
		],
		addLife: [
			"/snd/addLife.wav",
			"/snd/addLife.ogg",
			"/snd/addLife.mp3"
		]
	});
});