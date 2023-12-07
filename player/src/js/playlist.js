import { modeRepeat, modeShuffle, play, playPause, updatingModeSwitchingButtons, setTrack } from "./player.js"

const playlistHTML = document.querySelector("#playlist")
const trackInfoTemplate = document.querySelector("#track-info")
const playlistFile = "./assets/data/playlist.json"    // Путь до JSON файла со списком треков
const imgCoverFolder = "./assets/img/cover/"    // Путь до папки с обложками альбомов
let playlist = []
let shufflePlaylist = []    // Плейлист для случайного порядка треков
let history = []    // История проигранных треков в режиме случайного порядка
let currentTrack = null

// Загрузка плейлста из JSON файла
async function loadPlaylist() {
    playlist = JSON.parse(localStorage.getItem("playlist"))    // Загрузка плейлиста из localStorage
    if (!playlist) {
        playlist = await fetch(playlistFile)
            .then(response => response.json())
            .catch(error => console.error('Error fetching JSON:', error));
        if (playlist.length > 0) {
            localStorage.setItem("playlist", JSON.stringify(playlist))    // Сохранение плейлиста в localStorage
        }
    }
    // Установка текущего трека из loacalStorage
    const currentTrackId = JSON.parse(localStorage.getItem("currentTrackId")) ?? 0
    currentTrack = playlist.find(track => track.id === currentTrackId)

    updatingModeSwitchingButtons() 
}


// Заполнение таблицы плейлиста
function fillPlaylist() {
    for (const track of playlist) {
        playlistHTML.tBodies[0].appendChild(trackInfoTemplate.content.cloneNode(true))
        const trackInfoHTML = [...playlistHTML.tBodies[0].children].slice(-1)[0]
        trackInfoHTML.name = track.id
        
        const titleHTML = trackInfoHTML.querySelector(".track-info__title")
        const artistHTML = trackInfoHTML.querySelector(".track-info__artist")
        const albumHTML = trackInfoHTML.querySelector(".track-info__album")
        const yearHTML = trackInfoHTML.querySelector(".track-info__year")
        const genreHTML = trackInfoHTML.querySelector(".track-info__genre")
        const durationHTML = trackInfoHTML.querySelector(".track-info__duration")
        const imageHTML = trackInfoHTML.querySelector(".track-info__img")
        const albumCoverHTML = trackInfoHTML.querySelector(".track-info__cover")

        titleHTML.textContent = track.title
        artistHTML.textContent = track.artist
        albumHTML.textContent = track.album
        yearHTML.textContent = track.year
        genreHTML.textContent = track.genre
        durationHTML.textContent = track.duration
        imageHTML.src = imgCoverFolder + track.cover

        albumCoverHTML.addEventListener("click", function() {
            prepareShuffle()
            if (currentTrack.id === track.id) playPause()           
            else changeTrack(track)
        })
    }
    setCurrentTrackInfo()
}

// Обновление флага о текущем треке в таблице плейлиста
function setCurrentTrackInfo() {
    for (const trackInfoHTML of playlistHTML.tBodies[0].children) {
        if (currentTrack.id === trackInfoHTML.name) {
            trackInfoHTML.classList.add("track-info_current")
        } else {
            trackInfoHTML.classList.remove("track-info_current")
        }
    }
}

// Проверка на конец плейлиста
function isEnd() {
    return modeShuffle ? 
        !shufflePlaylist.length 
        : 
        playlist.indexOf(currentTrack) === playlist.length - 1
}

// Подготовка плейлиста для случайного порядка треков как копия плейлиста без текущего трека
function prepareShuffle() {
    shufflePlaylist = playlist.filter(track => track.id !== currentTrack.id)
    history = []
}

// Запуск следующего трека
function nextTrack() {
    if (modeShuffle) {
        if (shufflePlaylist.length === 0) prepareShuffle()    // Обновление плейлиста для случайного порядка треков
        history.push(currentTrack)    // Сохранение проигранных треков

        // Запуск случайного трека
        const randomIndex = randomIndexOfArray(shufflePlaylist)
        const randomTrack = shufflePlaylist[randomIndex]
        shufflePlaylist.splice(randomIndex, 1)    // Опусташение плейлиста для случайного порядка треков
        changeTrack(randomTrack)
    }   else {
        const currentTrackIndex = playlist.indexOf(currentTrack)
        changeTrack(currentTrackIndex === playlist.length - 1 ?
            playlist[0] 
            :
            playlist[currentTrackIndex + 1]
        )
    }
}

// Запуск предыдущего трека
function previousTrack() {
    if (modeShuffle) {
        changeTrack(history.length === 0 ? currentTrack : history.pop())    // Запуск предыдущего проигранного трека, сохраненного в историю
    }   else {
        const currentTrackIndex = playlist.indexOf(currentTrack)
        changeTrack(currentTrackIndex === 0 ? 
            (modeRepeat ? 
                playlist[playlist.length - 1]
                :
                currentTrack
            ) 
            :
            playlist[currentTrackIndex - 1]
        )
    }
}

// Возвращает индекс любого случайного трека, кроме текущего
function randomIndexOfArray(array) {
    const index = Math.floor(Math.random() * array.length)
    if (array[index].id !== currentTrack.id) {
        return index
    }
    return randomIndexOfArray(array)
}

// Запуск трека
function changeTrack(track) {
    pauseCurrentTrack()
    // if (currentTrack.id === track.id) {
    //     playPause()
    // } else {
    //     currentTrack = track
    //     localStorage.setItem("currentTrackId", JSON.stringify(track.id))    // Сохранение текущего трека
    //     setTrack(track)
    //     setCurrentTrackInfo()
    //     play()
    // }

    currentTrack = track
        localStorage.setItem("currentTrackId", JSON.stringify(track.id))    // Сохранение текущего трека
        setTrack(track)
        setCurrentTrackInfo()
        play()
}

// Обновлене состояния текущего трека при проигрывании
function playCurrentTrack() {
    const currentTrackInfoHTML = playlistHTML.tBodies[0].querySelector(".track-info_current")
    const controlBtnHTML = currentTrackInfoHTML.querySelector(".track-info__control-btn")
    controlBtnHTML.className = "track-info__control-btn track-info__control-btn_play"
}

// Обновлене состояния текущего трека при остановке
function pauseCurrentTrack() {
    const currentTrackInfoHTML = playlistHTML.tBodies[0].querySelector(".track-info_current")
    const controlBtnHTML = currentTrackInfoHTML.querySelector(".track-info__control-btn")
    controlBtnHTML.className = "track-info__control-btn track-info__control-btn_pause"
}

export { currentTrack, fillPlaylist, loadPlaylist, previousTrack, nextTrack, isEnd, prepareShuffle, playCurrentTrack, pauseCurrentTrack }