Crafty.scene("loading", function() {
	console.log("Scene: loading");
	HA.sm.fullScreenKeyEnabled(false);
	
	var messageDisplay = Crafty.e("MessageDisplay");
	messageDisplay.showMessage("Loading...");
	
	var cacheBuster = Date.now();
	console.log(cacheBuster);
	
	Crafty.load([
		"img/20x2.png?_="+cacheBuster,
		"img/40x2.png?_="+cacheBuster,
		"img/balloonx2.png?_="+cacheBuster,
		"img/balloon_select_arrowx2.png?_="+cacheBuster,
		"img/cloud_scorex2.png?_="+cacheBuster,
		"img/cloudsx2.png?_="+cacheBuster,
		"img/keysx2.png?_="+cacheBuster,
		"img/lives_score_clouds.png?_="+cacheBuster,
		"img/parachutex2.png?_="+cacheBuster,
		"img/startscreen_basket.png?_="+cacheBuster,
		"img/tweet_display.png?_="+cacheBuster,
		"img/fonts/blue_score_16x16.png?_="+cacheBuster,
		"img/fonts/grey_score_16x16.png?_="+cacheBuster,
		"/snd/cloud_loops.mp3?_="+cacheBuster,
		"/snd/cloud_loops.wav?_="+cacheBuster,
		"/snd/cloud_loops.ogg?_="+cacheBuster,
		"/snd/drop.wav?_="+cacheBuster,
		"/snd/drop.mp3?_="+cacheBuster,
		"/snd/drop.ogg?_="+cacheBuster,
		"/snd/level.wav?_="+cacheBuster,
		"/snd/level.mp3?_="+cacheBuster,
		"/snd/level.ogg?_="+cacheBuster,
		"/snd/hit_good.wav?_="+cacheBuster,
		"/snd/hit_good.mp3?_="+cacheBuster,
		"/snd/hit_good.ogg?_="+cacheBuster,
		"/snd/hit_bad.wav?_="+cacheBuster,
		"/snd/hit_bad.mp3?_="+cacheBuster,
		"/snd/hit_bad.ogg?_="+cacheBuster,
		"/snd/whoosh.wav?_="+cacheBuster,
		"/snd/whoosh.mp3?_="+cacheBuster,
		"/snd/whoosh.ogg?_="+cacheBuster,
		"/snd/pause.wav?_="+cacheBuster,
		"/snd/pause.mp3?_="+cacheBuster,
		"/snd/pause.ogg?_="+cacheBuster,
		"/snd/select.wav?_="+cacheBuster,
		"/snd/select.ogg?_="+cacheBuster,
		"/snd/select.mp3?_="+cacheBuster,
		"/snd/select2.wav?_="+cacheBuster,
		"/snd/select2.ogg?_="+cacheBuster,
		"/snd/select2.mp3?_="+cacheBuster,
		"/snd/addLife.wav?_="+cacheBuster,
		"/snd/addLife.mp3?_="+cacheBuster,
		"/snd/addLife.ogg?"+cacheBuster
		],
		function() {
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
			HA.m.publish(HA.events.GAME_LOADED);
		},
		function(e) {
			// onProgress
			console.log("percent: ", e.percent, "src: ", e.src);
		},
		function(e) {
			// onError
			console.log("error: ", e);
		}
	);
	
});