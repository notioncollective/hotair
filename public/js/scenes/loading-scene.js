Crafty.scene("loading", function() {
	console.log("Scene: loading");
	HA.sm.fullScreenKeyEnabled(false);
	
	Crafty.load([
		"img/20.png",
		"img/40.png",
		"img/60.png",
		"img/fonts/blue_score_16x16.png",
		"img/fonts/grey_score_16x16.png",
		"/snd/cloud_loops.mp3",
		"/snd/drop.wav",
		"/snd/level.wav",
		"/snd/level.wav",
		"/snd/hit_good.wav",
		"/snd/hit_bad.wav",
		"/snd/whoosh.wav",
		"/snd/pause.wav",
		"/snd/select.wav",
		"/snd/addLife.wav"
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
			"/snd/cloud_loops.mp3"
		], 
		drop: [
			"/snd/drop.wav",
			"/snd/drop.mp3"
			// ,"/snd/shoot.mp3"
			// ,"/snd/shoot.ogg"
		],
		level: [
			"/snd/level.wav",
			"/snd/level.mp3"
		],
		hit_good: [
			"/snd/hit_good.wav",
			"/snd/hit_good.mp3"
		],
		hit_bad: [
			"/snd/hit_bad.wav",
			"/snd/hit_bad.mp3"
		],
		whoosh: [
			"/snd/whoosh.wav",
			"/snd/whoosh.mp3"
			
		],
		pause: [
			"/snd/pause.wav",
			"/snd/pause.mp3"
		],
		select: [
			"/snd/select.wav",
			"/snd/select.mp3"
		],
		choose: [
			"/snd/select2.wav",
			"/snd/select2.mp3"
		],
		addLife: [
			"/snd/addLife.wav",
			"/snd/addLife.mp3"
		]
	});
});