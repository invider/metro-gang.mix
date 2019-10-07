const df = {
    _touchable: true,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    dx: 0,
    dy: 0,
}

Coin.prototype.showBound = function(b, color) {
    if (env.config.bounds) {
        save()
        translate(lab.street.worldX(this.x), lab.street.worldY(this.y))
        stroke(color)
        lineWidth(1)
        rect(b[0], b[1], b[2], b[3])
        restore()
    }
}

let instances = 0
function Coin(st) {
    this.name = 'coin' + ++instances
    augment(this, df)
    augment(this, st)

    this.value = env.tune.cashUnit

    // random direction
    this.dx = (rnd(5) - 2.5) * env.base
    this.dy = -rnd(3, 10) * env.unit
}

Coin.prototype.init = function() {
    this.w = res.coin.width * env.scale * env.style.coinSize
    this.h = res.coin.height * env.scale * env.style.coinSize
    log('coin size: ' + this.w + 'x' + this.h)
}

Coin.prototype.getArea = function() {
    return [ this.x, this.y, this.w, this.h ]
}


Coin.prototype.touch = function(t) {
    // pick coins only on the ground
    if (this.y !== 0) return
    if (!(t instanceof dna.Bro)) return

    this.showBound(this.getArea(), '#ffff00')
    if (lib.util.touch(this.getArea(), t.getArea(4))) {
        t.cashIn(this.value)
        kill(this)
    }
}

Coin.prototype.evo = function (dt) {
    // move
    this.x += this.dx * dt
    this.y += this.dy * dt
    // hard bounds
    if (this.y > 0) this.y = 0

    // gravity
    if (this.y < 0) {
        // pull down
        this.dy = this.dy + env.tune.gravity * env.unit * dt
    }

    // friction
    if (this.y === 0) {
        this.dx = lib.util.lim(this.dx, env.tune.friction*env.base*dt, 0)
    }
}

Coin.prototype.draw = function() {
    blocky()
    save()
    translate(this.x, this.y - this.h/2)
    image(res.coin, 0, 0, this.w, this.h)
    restore()
}

