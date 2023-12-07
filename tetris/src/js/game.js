import { useGameLoop } from "./classes/GameLoop.js"
import Tetris from "./classes/Tetris.js"
import { openEndGameMenu, openMenu } from "./menu.js"

const tetrisHTML = document.querySelector("#tetris")
const tableHTML = tetrisHTML.querySelector(".tetris__table")
const cellTemplate = tetrisHTML.querySelector("#tetris-cell")
const tableNextShapeHTML = document.querySelector("#tetris-next")
const scoreHTML = document.querySelector("#tetris-score")
const levelHTML = document.querySelector("#tetris-level")
const countLinesHTML = document.querySelector("#tetris-lines")
const bestScoreHTML = document.querySelector("#tetris-best")

let level = null
let tetris = null
let gameLoop = null
const width = 10    // Ширина поля
const height = 2 * width    // Высота поля

// Очищает и составляет игровое поле и поле вывода следующе фигуры
function renderTetrisTable() {
    tableHTML.innerHTML = ""
    tableNextShapeHTML.innerHTML = ""
    tableHTML.style.gridTemplateColumns = `repeat(${width}, 1fr)`
    tableHTML.style.gridTemplateRows = `repeat(${height}, 1fr)`

    for (let i = 0; i < width * height; i++) {
        const cellHTML = cellTemplate.content.cloneNode(true)
        tableHTML.appendChild(cellHTML)
    }

    for (let i = 0; i < 6 * 4; i++) {
        const cellHTML = cellTemplate.content.cloneNode(true)
        tableNextShapeHTML.appendChild(cellHTML)
    }
}

// Начинает игру
function startGame() {
    renderTetrisTable()
    level = 1
    tetris = new Tetris(width, height)
    paint(tetris.shapeCells)
    paint(tetris.shadowCells)
    paintNextShape(tetris.nextShapeCells)
    bestScoreHTML.textContent = JSON.parse(localStorage.getItem("bestScore")) ?? 0
    scoreHTML.textContent = tetris.score
    levelHTML.textContent = tetris.level

    gameLoop = useGameLoop(() => move(tetris.down()), 1000)    // Запуск движения фигуры
}

// Заканчивет игру
function endGame() {
    const totalScore = tetris.score
    const bestScore = JSON.parse(localStorage.getItem("bestScore"))

    if (!bestScore || totalScore > bestScore) {
        localStorage.setItem("bestScore", JSON.stringify(totalScore))
    }

    gameLoop.stop()
    tetris = null
    openEndGameMenu(totalScore)
}

window.addEventListener("keydown", keysHandler)

// Обработчик нажатия кнопок
function keysHandler(e) {
    if (tetris) {
        if (e.keyCode == "38") {    // Стрелока вверх
            move(tetris.rotate())
        }
        else if (e.keyCode == "40") {    // Стрелока вниз
            move(tetris.forcedDown())
        }
        else if (e.keyCode == "39") {    // Стрелока вправо
            move(tetris.right())
        }
        else if (e.keyCode == "37") {    // Стрелока влево
            move(tetris.left())
        }
        else if (e.keyCode == "27") {    // Esc
            gameLoop.stop()
            openMenu(!!tetris)
                .then(() => gameLoop.restart())
        }
    }
}

// Движение фигуры
function move(paintCells) {
    if (tetris.isEnd) {
        endGame()
        return
    }
    paint(paintCells)
    paintNextShape(tetris.nextShapeCells)
    scoreHTML.textContent = tetris.score
    countLinesHTML.textContent = tetris.countLines
    levelHTML.textContent = tetris.level
    
    if (level !== tetris.level) {
        level = tetris.level
        gameLoop.restart(1000 / level)    // Ускорение цикла
    }
}

// Перекраска клеток на основном поле
function paint(cells) {
    for (const cell of cells) {
        const cellHTML = tableHTML.children[cell.y * width + cell.x]
        cellHTML.className = "tetris__cell"
        if (cell.type === "default") continue

        cellHTML.classList.add("tetris__cell_" + cell.tetromino)

        if (cell.type === "tetromino") cellHTML.classList.add("tetris__cell_tetromino")
        else if (cell.type === "shadow") cellHTML.classList.add("tetris__cell_shadow")
    }
}

// Перекраска клеток на поле вывода следующей фигуры
function paintNextShape(cells) {
    for (const cellHTML of tableNextShapeHTML.children) {
        cellHTML.className = "tetris__cell"
    }
    for (const cell of cells) {
        const cellHTML = tableNextShapeHTML.children[cell.y * 6 + cell.x + 1]
        cellHTML.classList.add("tetris__cell_" + cell.tetromino)
        cellHTML.classList.add("tetris__cell_tetromino")
    }
}

export { startGame, renderTetrisTable }