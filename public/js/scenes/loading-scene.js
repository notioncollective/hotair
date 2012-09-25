Crafty.scene("loading", function() {
	console.log("Scene: loading");
	Crafty.load([
		"img/20.png",
		"img/40.png",
		"img/60.png",
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
			"/snd/drop.wav"
			// ,"/snd/shoot.mp3"
			// ,"/snd/shoot.ogg"
		],
		level: [
			"/snd/level.wav"
		],
		hit_good: [
			"/snd/hit_good.wav"
		],
		hit_bad: [
			"/snd/hit_bad.wav"
		],
		whoosh: [
			"/snd/whoosh.wav"
		],
		pause: [
			"/snd/pause.wav"
		],
		select: [
			"/snd/select.wav"
		],
		choose: [
			"/snd/select2.wav"
		],
		addLife: [
			"/snd/addLife.wav"
		]
	});
});