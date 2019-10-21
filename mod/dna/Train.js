const TRANSIT = 1
const FADING = 2
const EXITING = 3
const WAITING = 4
const CLOSING = 5

function Train(line, src, dest) {
    this.line = line
    this.src = src
    this.dest = dest
    this.state = TRANSIT
    this.timer = 0
    this.transit = 0
    this.blink = 0
}

Train.prototype.attachSubway = function(subway) {
    this.subway = subway
    subway.train = this
}

Train.prototype.onHopOut = function(q) {
    trap('street', {
        station: this.dest,
        queue: q,
    })
}

Train.prototype.onArrival = function() {
    this.transit = 1
    this.state = EXITING
    this.timer = 0
    this.blink = 0
    if (this.subway) this.subway.openDoors()
}

Train.prototype.onExit = function() {
    this.queue = lab.carriage.exitQueue()
    if (this.queue) {
        // we have somebody for exit - fade out first
        this.state = FADING
        lab.transition.transit(
            env.tune.transitionTime, env.tune.fadeTime)
    } else {
        this.state = WAITING
    }
}

Train.prototype.onDeparture = function() {
    const src = this.dest
    const dest = lab.metro.nextSegment(this.src, this.dest)

    this.src = src
    this.dest = dest

    this.state = TRANSIT
    this.transit = 0
}

Train.prototype.handle = function() {
    if (lab.metro.block > 0) return

    /*
    let c = this.bot.control
    if (this.gang) {
        c = this.gang.control(c)
    }
    */
    /*
    if (this.gang && this.gang.player) {
        c = env.control.player[this.gang.player] || {}
    }
    */
    //if (c.kick || c.punch) this.onHopOut()
}

Train.prototype.ai = function(dt) {
    // handle bot controls here
}

Train.prototype.evo = function(dt) {

    switch(this.state) {
    case TRANSIT:
            this.transit += (1/env.tune.metro.transitTime) * dt
            if (this.transit >= 1) this.onArrival()
            break;

    case EXITING:
            if (this.timer >= env.tune.metro.exitWaiting) this.onExit()

    case FADING:
            if (this.timer >= env.tune.metro.exitWaiting + env.tune.fadeTime) {
                this.onHopOut(this.queue)
                this.state = WAITING
            }

    case WAITING:
            if (this.subway && this.timer >= (env.tune.metro.stationWaiting
                    - env.tune.metro.doorsMoveTime)) {
                this.subway.closeDoors()
                this.state = CLOSING
            }

    case CLOSING:
            if (this.timer >= env.tune.metro.stationWaiting) this.onDeparture()

            this.timer += dt
            this.blink -= dt
            if (this.blink <= 0) this.blink = 2*env.tune.metro.blink
            break;
    }

    /*
    if (this.transit >= env.tune.metro.hopOutThreshold
            && this.dest.station) this.handle()
    */
}

Train.prototype.draw = function() {
    if (this.state > TRANSIT && this.blink > env.tune.metro.blink) return

    const s = this.src
    const d = this.dest

    const dx = rx(s.x) - rx(d.x)
    const dy = ry(s.y) - ry(d.y)

    const angle = atan(dy/dx)

    let w = rx(env.style.metro.trainWidth)
    let h = rx(env.style.metro.trainHeight)

    /*
    if (lab.metro.block < 0
            && this.gang.player
            && env.control.any(this.gang.player)) {
        w *= env.style.selectedTrainScale
        h *= env.style.selectedTrainScale
    }
    */

    const x = rx(s.x + (d.x-s.x) * this.transit)
    const y = ry(s.y + (d.y-s.y) * this.transit)

    save()
    translate(x, y)
    rotate(angle)

    fill(env.style.trainColor)
    rect(-w/2, -h/2, w, h)

    restore()
}
