import Tetramino from "./Tetromino.js";

// Фигура в тетрисе
//
//      * *
//      * *

class OTetromino extends Tetramino {
    constructor(middleOfTableWidth) {
        const type = "o-tetromino"
        const rotation0   = [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 2 }]
        const rotation90  = rotation0
        const rotation180 = rotation0
        const rotation270 = rotation0
        const position = {
            x: middleOfTableWidth - 1,
            y: -1
        }
        super(type, position, rotation0, rotation90, rotation180, rotation270)
    }
}

export default OTetromino