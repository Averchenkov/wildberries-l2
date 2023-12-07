import ITetromino from "./ITetromino.js"
import JTetromino from "./JTetromino.js"
import LTetromino from "./LTetromino.js"
import OTetromino from "./OTetromino.js"
import STetromino from "./STetromino.js"
import TTetromino from "./TTetromino.js"
import ZTetromino from "./ZTetromino.js"

class Tetris {
    constructor (width, height) {
        this.width = width
        this.height = height
        this.tetromines = [ITetromino, JTetromino, LTetromino, OTetromino, STetromino, TTetromino, ZTetromino]
        this.shape = this.randomTetramino()    // Текущая фигура
        this.nextShape = this.randomTetramino()    // Следуящая фигура
        this.deadCells = []    // Список клеток фигур, которые дошли до конца
        this.shadowCells = this.getShadow()    // Тень от текущей фигуры
        this.score = 0    // Счет
        this.countLines = 0    // Количество заполненных линий
        this.maxPointOnLevel = 500    // Количество очко для перехода на следующий уровень
        this.pointsForLine = 100    // Количество очков за заполнение линии
    }

    // Опускает фигуру, либо записывает в мертвые клетки и возвращает клетки, которые нужно перекрасить
    down() {
        let paintCells = []
        this.shape.down()
        if (!this.isCollision(this.shape.cellsAfterChanges)) paintCells = this.movedShape()
        else {
            this.deadCells = [...this.deadCells, ...this.shape.cells]
            paintCells.push(...this.eraseLines())
            this.shape = this.nextShape
            this.nextShape = this.randomTetramino()
            this.shadowCells = this.getShadow()
            paintCells.push(...this.shadowCells)
            paintCells.push(...this.shape.cells)
        }
        return paintCells
    }

    // Прибавляет счет, если пользователь сам опустил фигуру
    forcedDown() {
        this.score++
        return this.down()
    }
    
    // Функции двигают фигуры, если это возможно, и возвращает клетки, которые нужно перекрасить, иначе отменяют движения

    right() {
        if (!this.isCollision(this.shape.right().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()
        return []     
    }

    left() {
        if (!this.isCollision(this.shape.left().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()
        return []     
    }

    rotate() {
        if (!this.isCollision(this.shape.rotate().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()
        
        if (!this.isCollision(this.shape.rotate().up().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().down().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().right().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().left().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().up().up().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().right().right().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()

        if (!this.isCollision(this.shape.rotate().left().left().cellsAfterChanges)) return this.movedShape()
        this.shape.cancelChanges()
        return []
    }

    // Применяет движения фигуры и возвращают клетки фигуры и ее тени до и после движений на перекраску
    movedShape() {
        const paintCells = []
        paintCells.push(...this.setTypeDefault(this.shadowCells))
        paintCells.push(...this.setTypeDefault(this.shape.cells))
        this.shape.applyChanges()
        this.shadowCells = this.getShadow()
        paintCells.push(...this.shadowCells)
        paintCells.push(...this.shape.cells)
        return paintCells
    }

    // Возращает клетки текущей фигуры
    get shapeCells() {
        return this.shape.cells
    }

    // Определяет закончилась ли игра
    get isEnd() {
        return this.isCollision(this.shape.cells)
    }

    // Возращает клетки следующей фигуры
    get nextShapeCells() {
        return this.nextShape.cellsWithoutPosition
    }

    // Определяет уровень игры от 1 до 10
    get level() {
        return Math.min(Math.floor(this.score / this.maxPointOnLevel) + 1, 10)
    }

    // Убирает заполненые линии, возвращает клетки, которые нужно перекрасить
    eraseLines() {
        const lines = {}
        const paintCells = []
        // Структурирование всех мертвых клеток по линиям
        for (const cell of this.deadCells) {
            if (Object.hasOwnProperty.call(lines, cell.y)) {
                lines[cell.y].push(cell)
            } else {
                lines[cell.y] = [cell]
            }
        }
        for (const lineNumber in lines) {
            // Определяет заполненую линию
            if (Object.hasOwnProperty.call(lines, lineNumber) && lines[lineNumber].length === this.width) {
                const untouchedCells = this.deadCells.filter(cell => cell.y > lineNumber)    // Клетки, которые ниже заполненой линии
                const cellsBeforeDown = this.deadCells.filter(cell => cell.y < lineNumber)    // Клетки, которые выше заполненой линии
                // Клетки, которые выше заполненой линии, опущенные вниз
                const cellsAfterDown = cellsBeforeDown.map(cell => {
                    const copyCell = {...cell}
                    copyCell.y += 1
                    return copyCell
                })
                paintCells.push(...this.setTypeDefault(lines[lineNumber]))
                paintCells.push(...this.setTypeDefault(cellsBeforeDown))
                paintCells.push(...cellsAfterDown)
                this.deadCells = [...untouchedCells, ...cellsAfterDown]    // Убирает заполненую линии
                this.score += this.pointsForLine
                this.lines++
            }
        }
        return paintCells
    }

    // Возвращает тень от текущей фигуры, клетки опущенной фигуры
    getShadow() {
        while (!this.isCollision(this.shape.cellsAfterChanges)) {
            this.shape.down()
        }
        this.shape.up()    // Поднимает вверх, до столкновения
        const shadow = this.shape.cellsAfterChanges.map(cell => {
            cell.type = "shadow"
            return cell
        })
        this.shape.cancelChanges()
        return shadow
    }

    // Меняет тип клетки на default
    setTypeDefault(cells) {
        return cells.map(cell => {
            cell.type = "default"
            return cell
        })
    }

    // Определяет столкнулась фигура с границами поля или с мертвыми клетками
    isCollision(cells) {
        for (const cell of cells) {
            if (cell.x < 0 || cell.x >= this.width || cell.y < 0 || cell.y >= this.height) return true
        }
        return cells.some(cell => this.deadCells.some(deadCell => deadCell.x === cell.x && deadCell.y === cell.y))
    }

    // Возвращает случайную фигуру
    randomTetramino() {
        const randomIndex = Math.floor(Math.random() * this.tetromines.length)
        const middleOfTableWidth = Math.ceil(this.width / 2) - 1
        return new this.tetromines[randomIndex](middleOfTableWidth)
    }

}

export default Tetris