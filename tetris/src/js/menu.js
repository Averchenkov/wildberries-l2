import { startGame } from "./game.js"

const menuHTML = document.querySelector("#menu")
const buttonBackHTML = menuHTML.querySelector("#menu-back-btn")
const buttonStartHTML = menuHTML.querySelector("#menu-start-btn")
const pointsHTML = menuHTML.querySelector("#points")

// Открывает меню, если идет игра, добавляет кнопку "Начать сначала"
const openMenu = openModal((gameIsStart) => {
    menuHTML.classList.add("menu_open")
    if (gameIsStart) {
        buttonBackHTML.classList.add("button_show")
        buttonStartHTML.textContent = "Начать сначала"
    } else {
        buttonBackHTML.classList.remove("button_show")
        buttonStartHTML.textContent = "Старт"
    }
})

// Открывает меню в конце игры и уведомляет о набранных очках
const openEndGameMenu = openModal((points) => {
    menuHTML.classList.add("menu_open")
    menuHTML.classList.add("menu_end-game")

    buttonBackHTML.classList.remove("button_show")
    buttonStartHTML.textContent = "Начать сначала"

    pointsHTML.textContent = points
})

// Открывет модальное окно с задержкой до закрытия
function openModal(func) {
    return function(...args) {
        func.apply(this, args)

        return new Promise((resolve, reject) => {
            const abortController = new AbortController()

            buttonBackHTML.addEventListener("click", () => {
                closeModal()
            }, { signal: abortController.signal })

            buttonStartHTML.addEventListener("click", () => {
                closeModal()
                startGame()
            },{ signal: abortController.signal })
    
            // Закрывае модальное окно и завершает promise
            function closeModal() {
                menuHTML.classList.remove("menu_open")
                menuHTML.classList.remove("menu_end-game")
                abortController.abort()   // Убирает все события с кнопок в модальном окне
                resolve()
            }
        })
    }
}

export { openMenu, openEndGameMenu }