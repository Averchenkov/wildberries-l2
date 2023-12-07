import Tetramino from "./Tetromino.js";

// Фигура в тетрисе
//
//      *
//      *
//      *
//      *

class ITetromino extends Tetramino{
    constructor(middleOfTableWidth) {
        const type = "i-tetromino"
        const rotation0   = [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
        const rotation90  = [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }]
        const rotation180 = [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }]
        const rotation270 = [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }]
        const position = {
            x: middleOfTableWidth - 1,
            y: -1
        }
        super(type, position, rotation0, rotation90, rotation180, rotation270)
    }
}

export default ITetromino