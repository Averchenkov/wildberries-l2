// Запускает игровой цикл и выполняет фунцию с заданным интервалом, с возможностью остановки и перезапуска
class GameLoop {
    constructor (callback, time = 1000) {
        this.callback = callback
        this.time = time
        this.interval = null
        this.start()
    }

    start () {
        this.interval = setInterval(this.callback, this.time)
    }

    stop () {
        clearInterval(this.interval)
        this.interval = null
    }

    restart (time) {
        this.stop()

        if (time) {
            this.time = time
        }

        this.start()
    }
}

export function useGameLoop (callback,keysHandler, time) {
    return new GameLoop(callback, keysHandler, time)
}