Crafty.scene("loading", function() {
	console.log("Scene: loading");
	Crafty.load([
		"img/20.png",
		"img/40.png",
		"img/60.png"],
		Crafty.Twitter.init()
		// Crafty.Twitter.init()
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
		]
	});
});