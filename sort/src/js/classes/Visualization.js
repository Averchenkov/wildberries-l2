import makeSceneIterator from "../sceneIterator.js"
import { useLoop } from "./Loop.js"

// Визуализация сортировок
class Visualization {
    constructor(array, fieldHTML) {
        this.array = array    // Список для сортировки
        this.fieldHTML = fieldHTML    // Поле для визуализации сортировки
        this.fieldHTML.innerHTML = ""
        this.sceneItarator = makeSceneIterator()
        this.maxValue = Math.max(...array)
        this.loop = useLoop(() => this.nextScene())    // Цикл визуализации с отрисовкой каждой сцены
    }

    // Добавление этапа сортировки
    addSection({ sortName, array, indexNumber, redColumnes, greenColumnes }) {
        if (!this.sceneItarator.hasSort(sortName)) {
            this.craeteDiagram(sortName)
            this.renderSection({sortName})
        }

        this.sceneItarator.addSection(sortName, {
            array: [...array],    // Список на каждом этапе сортировки
            indexNumber,    // Место указателя
            redColumnes,    // Список красных полос (подчеркивание чисел, которые были переставлены)
            greenColumnes    // Список зеленых полос (подчеркивание чисел)
        })
    }

    // Возвращает копию списка
    getArray() {
        return [...this.array]
    }

    // Сортирует список алгоритмами
    sort(sortAlgorithms) {
        for (const sortFunc of sortAlgorithms) {
            sortFunc(this.getArray(), this.addSection.bind(this))
        }
    }

    // Остановка визализации
    stop() {
        this.loop.stop()
    }

    // Запуск визуализации с медленной прокруткой
    start() {
        this.loop.restart(700)
    }

    // Следующий слайд
    next() {
        this.loop.stop()
        this.nextScene()
    }

    // Запуск визуализации с быстрой прокруткой
    faster() {
        this.loop.restart(20)
    }

    // Перелистывание сцены
    nextScene() {
        const scene = this.sceneItarator.next()
        if (scene.done) {
            this.stop()
        } else {
            for (const section of scene.value) {
                this.renderSection(section)
            }
        }
    }

    // Отрисовка этапа сортировки
    renderSection({ sortName, array = this.array, indexNumber = [0], redColumnes = [], greenColumnes = [] }) {
        const diagramHTML = [...this.fieldHTML.children].find(diagramHTML => {
            return diagramHTML.classList.contains("diagram_" + sortName)
        }).querySelector(".diagram__content")

        const columnListHTML = [...diagramHTML.children].filter(element => element.classList.contains("diagram__column"))
        const indexListHTML = [...diagramHTML.children].filter(element => element.classList.contains("diagram__index"))

        array.forEach((element, index) => {
            const columnHTML = columnListHTML[index]
            columnHTML.style.height = Math.round(element / this.maxValue * 100) + "%"
            columnHTML.className = "diagram__column"
        });

        redColumnes.forEach(index => {
            const columnHTML = columnListHTML[index]
            columnHTML.classList.add("diagram__column_red")
        });

        greenColumnes.forEach(index => {
            const columnHTML = columnListHTML[index]
            columnHTML.classList.add("diagram__column_green")
        });

        indexNumber && indexListHTML.forEach((indexHTML, index) => {
            indexNumber.includes(index) ? indexHTML.className = "diagram__index diagram__index_current" : indexHTML.className = "diagram__index"
        });
    }

    // Создание диаграммы представляющей список для сортировки
    craeteDiagram(sortName) {
        const diagramHTML = document.createElement("div")
        diagramHTML.className = "diagram diagram_" + sortName

        const titleHTML = document.createElement("div")
        titleHTML.className = "diagram__title"
        titleHTML.textContent = sortName + " Sort"

        const diagramContentHTML = document.createElement("div")
        diagramContentHTML.className = "diagram__content"

        for (let i = 0; i < this.array.length; i++) {
            const columnHTML = document.createElement("div")
            columnHTML.className = "diagram__column"
            diagramContentHTML.appendChild(columnHTML)


            const indexHTML = document.createElement("div")
            indexHTML.className = "diagram__index"
            diagramContentHTML.appendChild(indexHTML)
        }
        
        diagramHTML.appendChild(titleHTML)
        diagramHTML.appendChild(diagramContentHTML)
        
        this.fieldHTML.appendChild(diagramHTML)
    }
}

export function useVisualization (array, fieldHTML) {
    return new Visualization(array, fieldHTML)
}

