import { useVisualization } from "./classes/Visualization.js"
import getAllSortFunctions from "./sort.js"

const fieldHTML = document.querySelector("#field")
let visualization = null    // Визализация сортировок
generateNewArray()


function generateNewArray() {
    const arr = [...Array(65)].map(e => Math.ceil(Math.random() * 40))
    if (visualization) visualization.stop()
    visualization = useVisualization(arr, fieldHTML)
    visualization.sort(getAllSortFunctions())
}

// Обработчик нажатия кнопок
window.addEventListener("keydown", function(e) {
    if (e.keyCode == "38") {    // Стрелока вверх
        generateNewArray()
    }
    else if (e.keyCode == "40") {    // Стрелока вниз
        visualization.start()
    }
    else if (e.keyCode == "39") {    // Стрелока вправо
        visualization.next()
    }
    else if (e.keyCode == "37") {    // Стрелока влево
        visualization.faster()
    }
})
