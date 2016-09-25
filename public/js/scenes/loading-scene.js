Crafty.scene("loading", function() {
	console.log("Scene: loading");
	HA.sm.fullScreenKeyEnabled(false);
	
	var messageDisplay = Crafty.e("MessageDisplay");
	messageDisplay.showMessage("Loading...");
	
	var cacheBuster = HA.game.cacheBuster();
	console.log(cacheBuster);
	
	Crafty.load({
		images: [ 
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
		"img/sndx2.png?_="+cacheBuster,
		"img/snd_mutex2.png?_="+cacheBuster,
		"img/tweet_display.png?_="+cacheBuster,
		"img/fonts/blue_score_16x16.png?_="+cacheBuster,
		"img/fonts/grey_score_16x16.png?_="+cacheBuster,
		"img/tweet-display-arrow.png?_="+cacheBuster,
		"/snd/cloud_loops.mp3?_="+cacheBuster,
		"/snd/cloud_loops.ogg?_="+cacheBuster,
		"/snd/drop.mp3?_="+cacheBuster,
		"/snd/drop.ogg?_="+cacheBuster,
		"/snd/level.mp3?_="+cacheBuster,
		"/snd/level.ogg?_="+cacheBuster,
		"/snd/hit_good.mp3?_="+cacheBuster,
		"/snd/hit_good.ogg?_="+cacheBuster,
		"/snd/hit_bad.mp3?_="+cacheBuster,
		"/snd/hit_bad.ogg?_="+cacheBuster,
		"/snd/whoosh.mp3?_="+cacheBuster,
		"/snd/whoosh.ogg?_="+cacheBuster,
		"/snd/pause.mp3?_="+cacheBuster,
		"/snd/pause.ogg?_="+cacheBuster,
		"/snd/select.ogg?_="+cacheBuster,
		"/snd/select.mp3?_="+cacheBuster,
		"/snd/select2.ogg?_="+cacheBuster,
		"/snd/select2.mp3?_="+cacheBuster,
		"/snd/addLife.mp3?_="+cacheBuster,
		"/snd/addLife.ogg?_="+cacheBuster
		]},
		function() {
			
			// audio loading
			Crafty.audio.add({
				// start_music: [
					// "/snd/iamerror.mp3"
				// ],
				game_music: [
					"/snd/cloud_loops.mp3",
					"/snd/cloud_loops.ogg"
				], 
				drop: [
					"/snd/drop.mp3",
					"/snd/drop.ogg"
				],
				level: [
					"/snd/level.ogg",
					"/snd/level.mp3"
				],
				hit_good: [
					"/snd/hit_good.mp3",
					"/snd/hit_good.ogg"
				],
				hit_bad: [
					"/snd/hit_bad.mp3",
					"/snd/hit_bad.ogg"
				],
				whoosh: [
					"/snd/whoosh.mp3",
					"/snd/whoosh.ogg"					
				],
				pause: [
					"/snd/pause.mp3",
					"/snd/pause.ogg"
				],
				select: [
					"/snd/select.mp3",
					"/snd/select.ogg"
				],
				choose: [
					"/snd/select2.ogg",
					"/snd/select2.mp3"
				],
				addLife: [
					"/snd/addLife.ogg",
					"/snd/addLife.mp3"
				]
			});
			
			// sprite definitions
			Crafty
				.sprite(40, 'img/20x2.png?_='+cacheBuster, {
					d_emblemx2: [0, 0],
					r_emblemx2: [1, 0],
					d_dartx2: [2, 0],
					r_dartx2: [3, 0]
				})
				.sprite(80, 'img/40x2.png?_='+cacheBuster, {
					// minus_one_cloud: [0, 0],
					// plus_one_cloud: [1, 0],
					r_avatarx2: [4, 0],
					d_avatarx2: [5, 0]
				})
				.sprite(120, 'img/balloonx2.png?_='+cacheBuster, {
					balloonx2: [0,0]
				})
				.sprite(100, 'img/cloud_scorex2.png?_='+cacheBuster, {
					cloud_scorex2: [0,0]
				})
				.sprite(80, 'img/parachutex2.png?_='+cacheBuster, {
					parachutex2: [0, 0]
				})
				.sprite(80, 'img/lives_score_clouds.png?_='+cacheBuster, {
					score_cloud_left: [0, 0],
					score_cloud_1: [1, 0],
					score_cloud_2: [2, 0],
					score_cloud_3: [3, 0],
					score_cloud_4: [4, 0],
					score_cloud_5: [5, 0],
					score_cloud_6: [6, 0],
					score_cloud_7: [7, 0],
					score_cloud_8: [8, 0],
					score_cloud_right: [9, 0]
				})
				.sprite(100, 'img/cloudsx2.png?_='+cacheBuster, {
					cloud1: [0, 0],
					cloud2: [1, 0],
					cloud3: [2, 0],
					cloud4: [3, 0],
					cloud5: [4, 0]
				})
				.sprite(800, 'img/startscreen_basket.png?_='+cacheBuster, {
					startscreen_basket: [0, 0]
				})
				.sprite(60, 'img/balloon_select_arrowx2.png?_='+cacheBuster, {
					balloon_select_arrow: [0, 0]
				});
			window.setTimeout(function(){
				$('body').addClass('loaded');
				HA.m.publish(HA.events.GAME_LOADED);			
			}, 1500);

		},
		function(e) {
			// onProgress
			$('#LoadingDisplay').text('Loading: '+Math.floor(e.percent)+'%');
			console.log("percent: ", e.percent, "src: ", e.src);
		},
		function(e) {
			// onError
			console.log("error: ", e);
		}
	);
	
});