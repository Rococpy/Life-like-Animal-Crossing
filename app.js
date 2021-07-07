const RcoAnimalPlayApp = {
	Version: "1.0.7",
	nowtime: -1,
	play: 0,
	lang: [],

	init() {
		$("#version").text("Rco Animal Play App Ver." + RcoAnimalPlayApp.Version)

		$.get('Setting.json', (data) => {
			$("option").toArray().map((v, i) => $(v).val() == localStorage['RcoAnimallang'] ? $(v).attr("selected", "true") : "")

			//언어설정
			$('html').attr("lang", localStorage['RcoAnimallang']);
			RcoAnimalPlayApp.lang = data['lang'][localStorage['RcoAnimallang'] ? localStorage['RcoAnimallang'] : "ko"]
			RcoAnimalPlayApp.lang.map(x => $(`.${Object.entries(x)[0][0]}`).text(Object.entries(x)[0][1]))

			//설정값 불러오기
			$(".main img").css("opacity", localStorage['RcoAnimalBackground'] ? localStorage['RcoAnimalBackground'] : 1)
			$("audio")[0].volume = localStorage['RcoAnimalVolume'] ? localStorage['RcoAnimalVolume'] : 1

			//설정값 적용
			$(".background_opacity_input").val((localStorage['RcoAnimalBackground'] ? localStorage['RcoAnimalBackground'] : 1) * 100)
			$(".music_volume_input").val((localStorage['RcoAnimalVolume'] ? localStorage['RcoAnimalVolume'] : 1) * 100)

			//경고 모달
			$(".modal_contents").css("animation", "modal 0.25s")

			//태스트
			RcoAnimalPlayApp.loop()

			//행동 감지
			$(document)
				.on("click", ".play", () => {
					if(RcoAnimalPlayApp.play == 0){
						RcoAnimalPlayApp.play = 1;

						$(".play").text(RcoAnimalPlayApp.lang[5]['pause'])
						RcoAnimalPlayApp.loop()
					} else{
						RcoAnimalPlayApp.play = 0;

						$(".play").text(RcoAnimalPlayApp.lang[4]['play'])
						$('audio')[0].pause();
					}
				})

				.on("click", ".close", () => {
					$(".modal_contents").css("transform", "translate(-50%, -50%) scale(0.7)")
					$(".modal").css({
						"opacity": "0",
						"visibility": "hidden"
					})
				})

				.on("change", "#changelang", () => {
					localStorage['RcoAnimallang'] = $("#changelang").val()

					//HTML언어 설정 변경
					$('html').attr("lang", localStorage['RcoAnimallang']);

					//기본 언어 값 변경
					RcoAnimalPlayApp.lang = data['lang'][$("#changelang").val()]
					RcoAnimalPlayApp.lang.map(x => $(`.${Object.entries(x)[0][0]}`).text(Object.entries(x)[0][1]))

					//재생, 일시정지 언어변경
					$(".play").text(RcoAnimalPlayApp.play == 0 ? RcoAnimalPlayApp.lang[4]['play'] : RcoAnimalPlayApp.lang[5]['pause'])
				})

				.on("input", ".background_opacity_input", function() {
					localStorage['RcoAnimalBackground'] = $(this).val() / 100

					$(".main img").css("opacity", $(this).val() / 100)
				})

				.on("input", ".music_volume_input", function() {
					localStorage['RcoAnimalVolume'] = $(this).val() / 100

					$("audio")[0].volume = ($(this).val() / 100)
				})

			$('audio')[0].ontimeupdate = () => {
				if($('audio')[0].currentTime == $(`audio`)[0].duration) RcoAnimalPlayApp.loop();
			}

		})
		.fail(() => {
			console.error("[RcoAnimalPlay] Can't run RcoAnimalPlay. Refresh the page or contact the administrator.");
    	console.error("[RcoAnimalPlay] This happens when there is a major error or missing essential files.");
    	console.error("[RcoAnimalPlay] Setting.json could not be found.");
    })
	},

	loop() {
		let audio = $('audio')[0];
		const RcoAnimalPlayDate = new Date().getHours();

		console.log(RcoAnimalPlayDate)

		if(RcoAnimalPlayDate == RcoAnimalPlayApp.nowtime) {
 			if(RcoAnimalPlayApp.play == 1) audio.play();
 		} else {
			RcoAnimalPlayApp.nowtime = RcoAnimalPlayDate
			audio.src = `https://cdn.rococpy.com/audio/animalcrossing/${RcoAnimalPlayDate}.mp3`;

	  	audio.onloadedmetadata = () => RcoAnimalPlayApp.play == 1 ? audio.play() : "";
	  	audio.onerror = () =>	audio.src = `https://cdn.rococpy.com/audio/animalcrossing/${RcoAnimalPlayDate}.mp3`;
 		}
	}
}

$(_ => RcoAnimalPlayApp.init())