function Train(line, src, dest) {
    this.line = line
    this.src = src
    this.dest = dest
    this.transit = 0
}

Train.prototype.onHopOut = function(q) {
    trap('street', {
        station: this.dest,
        queue: q,
    })
}

Train.prototype.onArrival = function() {
    const q = lab.carriage.exitQueue()
    if (q) {
        // we have somebody for exit
        this.onHopOut(q)
    }

    const src = this.dest
    const dest = lab.metro.nextSegment(this.src, this.dest)

    this.src = src
    this.dest = dest
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
    this.transit += (1/env.tune.metro.transitTime) * dt
    if (this.transit >= 1) this.onArrival()

    /*
    if (this.transit >= env.tune.metro.hopOutThreshold
            && this.dest.station) this.handle()
    */

}

Train.prototype.draw = function() {
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

