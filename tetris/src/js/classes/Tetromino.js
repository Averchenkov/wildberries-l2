// Класс фигуры в тетрисе
class Tetramino {
    constructor(type, position, rotation0, rotation90, rotation180, rotation270) {
        this.type = type    // Тип/название
        this.position = position    // Позиция относительно центральной верхней точки на поле

        // Список всех точек относительно начальной позиции во всех 4-х положениях
        this.rotations = {
            rotation0,
            rotation90, 
            rotation180, 
            rotation270
        }
        this.state = "rotation0"    // Текущее состояние
        this.nextPosition = this.position   // Позиция после манипуляций
        this.nextState = this.state    // Состояние после манипуляций
    }

    // Манипуляции с фигрурой

    rotate() {
        const states = Object.keys(this.rotations)
        const stateIndex = states.findIndex(state => state === this.nextState)
        this.nextState = (stateIndex === states.length - 1) ? states[0] : states[stateIndex + 1]
        return this
    }

    down() {
        this.nextPosition = {
            x: this.nextPosition.x,
            y: this.nextPosition.y + 1
        }
        return this
    }

    up() {
        this.nextPosition = {
            x: this.nextPosition.x,
            y: this.nextPosition.y - 1
        }
        return this
    }

    right() {
        this.nextPosition = {
            x: this.nextPosition.x + 1,
            y: this.nextPosition.y
        }
        return this
    }

    left() {
        this.nextPosition = {
            x: this.nextPosition.x - 1,
            y: this.nextPosition.y
        }
        return this
    }

    // Примининие/отмена манипуляции
    
    applyChanges() {
        this.position = this.nextPosition
        this.state = this.nextState
    }

    cancelChanges() {
        this.nextPosition = this.position
        this.nextState = this.state
    }

    // Возвращает список клеток фигуры в данном состоянии и позиции
    getCells(state, position = {x: 0, y: 0}) {
        return this.rotations[state].map(cell => {
            return {
                x: cell.x + position.x,
                y: cell.y + position.y,
                tetromino: this.type,
                type: "tetromino"
            }
        })
    }

    get cells() {
        return this.getCells(this.state, this.position)
    }

    get cellsAfterChanges() {
        return this.getCells(this.nextState, this.nextPosition)
    }

    get cellsWithoutPosition() {
        return this.getCells(this.state)
    }
}

export default Tetramino