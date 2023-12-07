const gameHTML = document.querySelector("#game")
const conclusionHTML = gameHTML.querySelector(".game__conclusion")
const promptHTML = gameHTML.querySelector(".game__prompt")
const inputHTML = gameHTML.querySelector("#input-number")
const menuBackBtnHTML = gameHTML.querySelector(".menu__back-btn")
const menuStartBtnHTML = gameHTML.querySelector(".menu__start-btn")
const inputFromHTML = gameHTML.querySelector("#input-from")
const inputBeforeHTML = gameHTML.querySelector("#input-before")
const congratulationHTML = gameHTML.querySelector(".game__congratulation")
const againBtnHTML = gameHTML.querySelector(".game__again-btn")
const historyHTML = document.querySelector("#history")
const gameInfoTemplate = document.querySelector("#game-info")

let number = null
let minNumber = +inputFromHTML.value
let maxNumber = +inputBeforeHTML.value
const answers = [] 
const history = JSON.parse(localStorage.getItem("history")) ?? []
history.forEach(answers => renderGameInfo(answers));

inputFromHTML.addEventListener("input", debounce(function() {
    if (this.value === "") {
        this.value = 0
    }
    if (this.value >= maxNumber) {
        this.value = maxNumber - 1
    }
    minNumber = +this.value
    this.value = minNumber
}))

inputBeforeHTML.addEventListener("input", debounce(function() {
    if (this.value > 1000) {
        this.value = 1000
    }
    if (this.value <= minNumber) {
        this.value = minNumber + 1
    }
    maxNumber = +this.value
    this.value = maxNumber
}, 2000))

function debounce(func, timeout = 1000){
    let timer;
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    };
}

menuStartBtnHTML.addEventListener("click", () => {
    if (minNumber === "") {
        inputFromHTML.parentElement.classList.add("input_error")
        return
    }
    if (maxNumber === "") {
        inputBeforeHTML.parentElement.classList.add("input_error")
        return
    }
    start()
    gameHTML.className = "game game_content"
})
againBtnHTML.addEventListener("click", openMenu)
menuBackBtnHTML.addEventListener("click", () => {
    gameHTML.className = "game game_content"
})

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) + 1
}

function openMenu() {
    if (answers.length) {
        menuBackBtnHTML.classList.remove("button_hidden")
    } else {
        menuBackBtnHTML.classList.add("button_hidden")
    }
    gameHTML.className = "game game_menu"
}

window.addEventListener("keydown", keysHandler)

function keysHandler(e) {
    if (gameHTML.classList.contains("game_content")) {
        if (e.keyCode == "32") {
        }
        else if (e.keyCode == "39") {
            
        }
        else if (e.keyCode == "13") {
            getConclusion()
        }
        else if (e.keyCode == "27") {
            openMenu()
        }
    }
}

function getConclusion() {
    const answer = inputHTML.valueAsNumber
    if (answer !== answer) {
        return
    }
    if (answer < minNumber || answer > maxNumber) {
        conclusionHTML.classList.add("game__conclusion_error")
        conclusionHTML.textContent = "выход за пределы диапазона"
    } else if (answer === number) {
        answers.push(answer)
        end()
    } else {
        conclusionHTML.classList.remove("game__conclusion_error")
        conclusionHTML.textContent = (number > answer ? "больше" : "меньше") + " " + answer

        if (answers.includes(answer)) {
            conclusionHTML.textContent += ", повторяетесь :)"
        }

        if (answers.length > 3) {
            promptHTML.textContent = "Подсказка: " + (number % 2 === 0 ? "четное" : "не четное")
        }
        answers.push(answer)
    }
    inputHTML.value = ""
}

function start() {
    number = randomNumber(minNumber, maxNumber)
    console.log(number);
}

function end() {
    const topResult = Math.min(...history.map(answers => answers.length))
    if (answers.length === 1) {
        congratulationHTML.textContent = `Вы отгдали число с первой попытки, сходите сегодня за лотырейным билетом`
    } else if (history.length > 0 && answers.length < topResult) {
        congratulationHTML.textContent = `Так держать, вы побили свой личный рекорд и отгдали число за ${answers.length} попыток`
    } else if (answers.length <= (maxNumber - minNumber) * 0.04) {
        congratulationHTML.textContent = `Какое везение, вы отгдали число за ${answers.length} попыток`
    } else {    
        congratulationHTML.textContent = `Поздравляю, вы отгдали число за ${answers.length} попыток`
    }
    saveAnswers()

    answers.length = 0
    conclusionHTML.textContent = ""
    promptHTML.textContent = ""

    gameHTML.className = "game game_result"
}

function saveAnswers() {
    history.push([...answers])
    localStorage.setItem("history", JSON.stringify(history))
    renderGameInfo(answers)
}

function renderGameInfo(answers) {
    const gameInfoHTML = gameInfoTemplate.content.cloneNode(true)
    const indexHTML = gameInfoHTML.querySelector(".game-info__index")
    const attemptsListHTML = gameInfoHTML.querySelector(".game-info__attempts-list")
    const attemtsNumberHTML = gameInfoHTML.querySelector(".game-info__attempts-number")
    const bodyHTML = historyHTML.tBodies[0]

    indexHTML.textContent = bodyHTML.childElementCount + 1
    attemptsListHTML.textContent = answers.toString().replace(/,/g, ', ');
    attemtsNumberHTML.textContent = answers.length

    bodyHTML.appendChild(gameInfoHTML)
}