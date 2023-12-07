import { isEnd, nextTrack, pauseCurrentTrack, playCurrentTrack, prepareShuffle, previousTrack } from "./playlist.js";

const playerHTML = document.querySelector("#player")
const audio = document.getElementById('audio');
const progressBarHTML = playerHTML.querySelector(".player__progress-bar");
const volumeBarHTML = playerHTML.querySelector(".player__volume-bar");

const trackCoverHTML = playerHTML.querySelector(".player__img")
const trackTitleHTML = playerHTML.querySelector(".player__track-title")
const trackSubtitleHTML = playerHTML.querySelector(".player__track-subtitle")
const trackCurrentTimeHTML = playerHTML.querySelector(".player__track-current-time");
const trackDurationHTML = playerHTML.querySelector(".player__track-duration");

const shufleBtnHTML = playerHTML.querySelector(".player__shuffle-btn");
const previousBtnHTML = playerHTML.querySelector(".player__previous-btn");
const playPauseBtnHTML = playerHTML.querySelector(".player__play-pause-btn");
const nextBtnHTML = playerHTML.querySelector(".player__next-btn");
const repeatBtnHTML = playerHTML.querySelector(".player__repeat-btn");

const audioFolder = "./assets/audio/"    // Путь до папки с аудиофайлами
const imgCoverFolder = "./assets/img/cover/"    // Путь до папки с обложками альбомов

volumeBarHTML.value = audio.volume = JSON.parse(localStorage.getItem("volume")) ?? 0.6    // Установка громкости

// Подготовка всех слайдеров
for (let sliderHTML of document.querySelectorAll('input[type="range"].slider')) {
    sliderHTML.style.setProperty('--value', sliderHTML.value);
    sliderHTML.style.setProperty('--min', sliderHTML.min == '' ? '0' : sliderHTML.min);
    sliderHTML.style.setProperty('--max', sliderHTML.max == '' ? '100' : sliderHTML.max);
    sliderHTML.addEventListener('input', () => sliderHTML.style.setProperty('--value', sliderHTML.value));
}

let isPlaying = false;
let modeShuffle = JSON.parse(localStorage.getItem("modeShuffle")) ?? false
let modeRepeat = JSON.parse(localStorage.getItem("modeRepeat")) ?? false

playPauseBtnHTML.addEventListener('click', playPause);

function playPause() {
    if (isPlaying) {
        pause()
    } else {
        play()
    }
}

window.addEventListener("keydown", keysHandler)

// Обработчик нажатия кнопок
function keysHandler(e) {
    if (e.keyCode == "32") {    // Пробел
        e.preventDefault();
        playPause()
    }
    else if (e.keyCode == "39") {    // Стрелочка вправо
        nextTrack()
    }
    else if (e.keyCode == "37") {    // Стрелочка влево
        previousTrack()
    }
}

// Запускает текущий трек
function play() {
    audio.play();
    playPauseBtnHTML.classList.remove("player__play-pause-btn_play");
    playPauseBtnHTML.classList.add("player__play-pause-btn_pause");
    isPlaying = true
    document.getElementById('canvas').classList.add("play")    // Запускает визуализации звуковых волн
    playCurrentTrack()
}

// Останавливает текущий трек
function pause() {
    audio.pause();
    playPauseBtnHTML.classList.remove("player__play-pause-btn_pause");
    playPauseBtnHTML.classList.add("player__play-pause-btn_play");
    isPlaying = false
    document.getElementById('canvas').classList.remove("play")    // Останавливает визуализации звуковых волн
    pauseCurrentTrack()
}

// Устанавливает текущий трек
function setTrack(track) {
    audio.src = audioFolder + track.file
    trackCoverHTML.src = imgCoverFolder + track.cover
    trackTitleHTML.textContent = track.title
    trackSubtitleHTML.textContent = `${track.artist} - ${track.album}`
    updateNextBtn()
}

// Блокирует переключение следующего трека в конце плейлиста
function updateNextBtn() {
    nextBtnHTML.disabled = !modeRepeat && isEnd()
}

// Переключение режима случайного трека
shufleBtnHTML.addEventListener("click", function() {
    modeShuffle = !modeShuffle
    localStorage.setItem("modeShuffle", JSON.stringify(modeShuffle))
    updatingModeSwitchingButtons()
})

// Переключение режима повтора проигрывания плейлиста
repeatBtnHTML.addEventListener("click", function() {
    modeRepeat = !modeRepeat
    localStorage.setItem("modeRepeat", JSON.stringify(modeRepeat))
    updatingModeSwitchingButtons()
})

// Обновление активности кнопок переключения режимов
function updatingModeSwitchingButtons() {
    if (modeShuffle) {
        prepareShuffle()
        shufleBtnHTML.classList.add("player__button_active")
    } else {
        shufleBtnHTML.classList.remove("player__button_active")
    }

    if (modeRepeat) {
        repeatBtnHTML.classList.add("player__button_active")
    } else {
        repeatBtnHTML.classList.remove("player__button_active")
    }

    updateNextBtn()
}

nextBtnHTML.addEventListener("click", () => nextTrack())
previousBtnHTML.addEventListener("click", () => previousTrack())

audio.addEventListener('timeupdate', function () {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    trackCurrentTimeHTML.textContent = timeToString(currentTime);
    progressBarHTML.value = (currentTime / duration) * 100;
    progressBarHTML.style.setProperty('--value', (currentTime / duration) * 100)
});

function timeToString(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? '0' : ''}${seconds}` // Формат "01:02"
}

progressBarHTML.addEventListener('input', function () {
    const seekTime = (progressBarHTML.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

volumeBarHTML.addEventListener('input', function () {
    audio.volume = volumeBarHTML.value;
    localStorage.setItem("volume", JSON.stringify(volumeBarHTML.value)) // Сохранение громкости в localStorage
});

audio.addEventListener('ended', function () {
    isPlaying = false;
    nextTrack()
});

audio.addEventListener('loadedmetadata', function () {
    audio.currentTime = 0
    progressBarHTML.value = 0;
    trackDurationHTML.textContent = timeToString(audio.duration);
});



export { updatingModeSwitchingButtons, modeShuffle, modeRepeat, setTrack, play, playPause }