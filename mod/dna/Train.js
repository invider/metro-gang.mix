function Train(line, src, dest, gang) {
    this.line = line
    this.src = src
    this.dest = dest
    this.gang = gang
    this.transit = 0
}

Train.prototype.onArrival = function() {
    const src = this.dest
    const dest = lab.metro.nextSegment(this.src, this.dest)

    this.src = src
    this.dest = dest
    this.transit = 0
}

Train.prototype.evo = function(dt) {
    this.transit += (1/env.tune.metro.transitTime) * dt
    if (this.transit >= 1) this.onArrival()
}

Train.prototype.draw = function() {
    const s = this.src
    const d = this.dest

    const dx = rx(s.x) - rx(d.x)
    const dy = ry(s.y) - ry(d.y)

    const angle = atan(dy/dx)

    const x = rx(s.x + (d.x-s.x) * this.transit)
    const y = ry(s.y + (d.y-s.y) * this.transit)

    save()
    translate(x, y)
    rotate(angle)

    let gangColor
    if (this.gang) gangColor = env.style.gang[this.gang.id]
    else gangColor = env.style.gang[0]

    const w = rx(env.style.metro.trainWidth)
    const h = ry(env.style.metro.trainHeight)
    fill(gangColor)
    rect(-w/2, -w/2, w, h)

    /*
    fill(gangColor)
    font(style.fontSize*env.scale + 'px boo-city')
    */
    restore()
}

