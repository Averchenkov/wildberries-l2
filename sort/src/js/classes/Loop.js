class Loop {
    constructor (callback, time = 1000) {
        this.callback = callback
        this.time = time
        this.interval = null
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

export function useLoop (callback, time) {
    return new Loop(callback, time)
}