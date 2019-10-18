'use strict'

const IDLE = 0
const RUN = 1
const BLOCK = 2
const PUNCH = 3
const DASH = 4
const JUMP = 5
const DAMAGE = 6
const OUT = 7
const BREAK = 8
const EXIT = 9
const NOPE = 10

// states debug mapping
const states = [
    'idle',
    'run',
    'block',
    'punch',
    'dash',
    'jump',
    'damage',
    'out',
    'break',
    'exit',
    'nope',
]

const cycles = [
    [1,  4,  0.15],  // idle
    [5,  12, 0.1],  // run
    [19, 19, -1],   // block
    [15, 18, 0.1],  // punch
    [14, 14, -1],   // dash
    [13, 13, -1],   // jump
    [24, 24, -1],   // damage
    [20, 23, 0.25], // out
    [12, 12, -1],   // break
    [25, 28, 0.15],  // exit
    [1,  4,  0.15],  // nope
]

const HEAD = 0
const BODY = 1
const LEGS = 2
const FIST = 3
const PICK = 4
const area = [
    [11, -26, 7, 5, 0],
    [10, -21, 9, 9, 0],
    [10, -4, 9, 4, 0],
    [12, -18, 12, 4, 1],
    [8, -25, 7, 25, 0],
]

const df = {
    Z: 100,
    _hittable: true,
    bro: true,
    bounded: true,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    dir: 1,
    sdir: 0,
    mass: 100,
    hits: 10,
    maxHits: 10,
    hitCount: 0,
    dashLock: 0,
    recharge: 0,
    timer: 0,
    cash: 2,
}

let bros = 0
function Bro(st) {
    this.name = 'bro' + ++bros
    this.frame = {}
    this.heal = env.tune.bro.healRate

    augment(this, df)
    augment(this, st)

    if (this.bot) this.setBot(this.bot)
    else {
        this.bot = {
            control: {},
            evo: function() {},
        }
    }
}

Bro.prototype.setBot = function(bot) {
    this.bot = bot
    this.bot.init(this)
}

Bro.prototype.tuneToScale = function(s) {
    this.scale = s
    this.acceleration = env.tune.bro.acceleration * env.base
    this.maxSpeed = env.tune.bro.maxSpeed * env.base
    this.dashThreshold = env.tune.bro.dashThreshold * env.base
    this.dashAcceleration = env.tune.bro.dashAcceleration * env.base
    this.maxDashSpeed = env.tune.bro.maxDashSpeed * env.base
    this.w = this.sw * this.scale
    this.h = this.sh * this.scale
}

Bro.prototype.init = function() {
    this.perform(IDLE)
    const f = res.dude[this.frame.cur]
    this.sw = f.width
    this.sh = f.height
    this.tuneToScale(env.scale)
}

Bro.prototype.getArea = function(n) {
    const bx = this.x
    const by = this.y
    const s = this.scale

    const a = area[n]
    const y = a[1]*s + by
    const w = a[2]*s
    const h = a[3]*s
    let x = 0
    if (this.dir === 0) {
        x = this.w-a[0]*s-a[2]*s+2*s + this.x - this.w/2
    } else {
        x = a[0]*s + this.x - this.w/2
    }
    
    return [ x, y, w, h ]
}

Bro.prototype.getPoint = function(n) {
    const a = this.getArea(n)
    return [ a[0] + a[2]/2, a[1] + a[3]/2 ]
}

Bro.prototype.setCycle = function(n) {
    if (this.frame.cycle === n) return
    const c = cycles[n]
    if (!c) {
        log.warn('no cycle #' + n)
        return
    }
    this.frame.cycle = n
    this.frame.start = c[0]
    this.frame.cur = c[0]
    this.frame.end = c[1]
    this.frame.delay = c[2]
    this.frame.time = 0
}

function roundCash(v) {
    if(v < 0) return 0
    return floor(v*100)/100
}

Bro.prototype.cashIn = function(val) {
    if (this.state === OUT) return false

    this.cash = roundCash(this.cash + val)
    sfx(res.sfx.pickup, 0.6)
    return true
}

Bro.prototype.cashOut = function(val) {
    this.cash = roundCash(this.cash - val)
}

Bro.prototype.throwOutCash = function() {
    this.cashOut(env.tune.cashUnit)
    this.__.spawn('Coin', {
        x: this.x,
        y: this.y,
    })
}

Bro.prototype.perform = function(action, dt) {

    if ((this.state === DAMAGE || this.state === OUT)
        && action !== IDLE) return false

    switch(action) {
    case RUN:
        if (this.state === DASH) return false

        if (this.y === 0) {
            // regular run
            this.state = action
            this.setCycle(action)
        } else {
            // in jump - don't change state or cycle
        }
        if (this.dir === 0) {
            this.dx = max(this.dx-this.acceleration*dt, -this.maxSpeed)
        } else {
            this.dx = min(this.dx+this.acceleration*dt, this.maxSpeed)
        }
        return true

    case DASH:
        if (abs(this.dx) < this.dashThreshold) return false
        if (this.state !== DASH && this.dashLock > 0) return false

        if (this.dir === 0) {
            this.dx = max(this.dx-this.dashAcceleration*dt,
                -this.maxDashSpeed)
        } else {
            this.dx = min(this.dx+this.dashAcceleration*dt,
                this.maxDashSpeed)
        }

        if (this.state !== DASH) {
            this.recharge = -1
            this.timer = env.tune.bro.dashTimeout
        }
        this.dashLock = env.tune.bro.dashLock

        break;

    case JUMP:
        if (this.y !== 0) return false;
        this.dy = -this.h * env.tune.bro.jump
        break;

    case PUNCH:
        if (this.state !== PUNCH) {
            this.recharge = env.tune.bro.punchCharge
        }
        break;

    case DAMAGE:
        this.state = action
        if (this.dir !== dt.bro.dir) this.setCycle(action)

        if (dt.bro.dir === 1) {
            this.dx = dt.force * env.tune.forceFeedback
        }  else {
            this.dx = -dt.force * env.tune.forceFeedback
        }

        return true

    case OUT:
        if (this.state !== OUT) {
            // getting into an out
            if (this.player) this.recharge = env.tune.bro.playerOutTime
            else this.recharge = env.tune.bro.botOutTime
            this.hitCount = 0
        }
    }

    /*
    if (this.state !== action) {
        log(this.name + ' new state: ' + states[action])
    }
    */
    this.state = action
    this.setCycle(action)
    return true
}

Bro.prototype.idle = function() {
    this.perform(IDLE)
}

Bro.prototype.performance = function(dt) {
    if (this.hits < 1) {
        this.perform(OUT)
    } else if (this.state === OUT) {
        this.perform(IDLE)
    }

    if (this.state === JUMP && this.y === 0) this.idle()
    if (this.state === RUN && this.dx === 0) this.idle()
    if (this.state === DASH && this.dx === 0) this.idle()
    if (this.state === DAMAGE && this.dx === 0) this.idle()

    if (this.dashLock && this.state !== DASH) this.dashLock -= dt

    // timeout for dash
    if (this.state === DASH && this.timer < 0) {
        this.idle()
    }

    if (this.state === PUNCH) {
        if (this.recharge < 0) this.recharge = env.tune.bro.punchRecharge
        else this.recharge -= dt
    } else {
        this.recharge -= dt
    }

    this.timer -= dt
}


Bro.prototype.isHitting = function(t) {
    if ((this.state === PUNCH || this.state === DASH)
            && this.recharge <= 0) {

        const fist = this.getArea(FIST)
        const body = t.getArea(BODY)
        const head = t.getArea(HEAD)

        this.showBound(fist, '#ff4040')

        let punchSpeed = 0
        if (this.state === PUNCH) {
            punchSpeed = env.tune.bro.punchSpeed
        } else {
            punchSpeed = abs(this.dx) / env.base
        }

        if (lib.util.touch(fist, head)) {
            this.showBound(head, '#ffff40')
            return {
                bro: this,
                type: FIST,
                src: fist,
                area: HEAD,
                force: this.mass * punchSpeed,
            }
        }
        if (lib.util.touch(fist, body)) {
            this.showBound(body, '#ffff40')
            return {
                bro: this,
                type: FIST,
                src: fist,
                area: BODY,
                force: this.mass * punchSpeed,
            }
        }

    } else if (this.state === JUMP
            && this.dy > 0
            && this.recharge < 0) {
        const legs = this.getArea(LEGS)
        const body = t.getArea(BODY)
        const head = t.getArea(HEAD)

        this.showBound(legs, '#ff4040')

        const punchSpeed = abs(this.dx) / env.base
        if (lib.util.touch(legs, head)) {
            this.showBound(head, '#ffff40')
            return {
                bro: this,
                type: LEGS,
                src: legs,
                area: HEAD,
                force: this.mass * punchSpeed
            }
        }
        if (lib.util.touch(legs, body)) {
            this.showBound(body, '#ffff40')
            return {
                bro: this,
                type: LEGS,
                src: legs,
                area: BODY,
                force: this.mass * punchSpeed
            }
        }
    }

    return false
}

Bro.prototype.feedback = function(t, hit) {
    if (this.state === DASH) this.recharge = env.tune.bro.dashRecharge
    if (this.state === JUMP) this.recharge = env.tune.bro.jumpRecharge
}

Bro.prototype.block = function(hit) {
    this.hits = max(this.hits
        - hit.force * env.tune.bro.hitBlock, 0)
    hit.bro.feedback(this, hit)

    if (hit.bro.dir === 1) {
        this.dx = hit.force * env.tune.blockFeedback
    }  else {
        this.dx = -hit.force * env.tune.blockFeedback
    }

    this.__.spawn('Emitter', {
        x: hit.bro.getPoint(hit.type)[0],
        y: hit.bro.getPoint(hit.type)[1],
        color: env.style.gang[this.gang],
        lifespan: 0.05,
        force: 200,
        radius: hit.src[2]/2,
        radius: 0,
        size: 1 * this.scale, vsize: 0,
        speed: 20 * this.scale, vspeed: 40 * this.scale,
        angle: Math.PI * 0.9, spread: Math.PI * 1.2,
        minLifespan: 0.2, vLifespan: 0.4,
        drawParticle: function() {
            fill(this.color)
            rect(this.x, this.y, this.r, this.r)
        }
    })
}

Bro.prototype.hit = function(hit) {
    if (this.state !== DAMAGE) {
        if (hit.force === 0) return
        /*
        log(hit.bro.name + ' hitting ' + this.name
            + ' force: ' + round(hit.force))
        */

        if (this.state === BLOCK && this.dir !== hit.bro.dir) {
            this.block(hit)
            return
        }

        this.hits = max(this.hits
            - hit.force * env.tune.bro.hitForce, 0)
        hit.bro.feedback(this, hit)

        if (this.state === OUT) {
            this.hitCount ++
            if (this.hitCount >= env.tune.hitsToBro
                    && this.cash === 0
                    && (this.x <= rx(env.tune.broCorner)
                        || this.x >= rx(1-env.tune.broCorner))) {
                this.gang = hit.bro.gang
            }

            if (this.cash > 0) {
                /*
                log(hit.bro.name + '->' + this.name
                    + ": giv'me your money!")
                */
                this.throwOutCash()
            }

        } else {
            this.perform(DAMAGE, hit)
        }

        /*
        this.__.spawn('Emitter', {
            x: this.getPoint(hit.area)[0],
            y: this.getPoint(hit.area)[1],
            color: env.style.gangLow[this.gang],
            lifespan: 0.05,
            force: 1000,
            radius: hit.src[2]/2,
            size: 1 * this.scale, vsize: 0,
            speed: 20 * this.scale, vspeed: 40 * this.scale,
            //angle: Math.PI * 0.9, spread: Math.PI * 1.2,
            angle: 0, spread: PI2,
            minLifespan: 0.2, vLifespan: 0.4,
            drawParticle: function() {
                fill(this.color)
                rect(this.x, this.y, this.r, this.r)
            }
        })
        */

        this.__.spawn('Emitter', {
            x: hit.bro.getPoint(hit.type)[0],
            y: hit.bro.getPoint(hit.type)[1],
            color: env.style.gang[this.gang],
            lifespan: 0.05,
            force: 1000,
            radius: hit.src[2]/2,
            radius: 0,
            size: 1 * this.scale, vsize: 0,
            speed: 20 * this.scale, vspeed: 40 * this.scale,
            angle: Math.PI * 0.9, spread: Math.PI * 1.2,
            minLifespan: 0.2, vLifespan: 0.4,
            drawParticle: function() {
                fill(this.color)
                rect(this.x, this.y, this.r, this.r)
            }
        })
        sfx(res.sfx.hit3, 0.6)
    }
}

Bro.prototype.evo = function(dt) {
    /*
    this.status = '' 
        + round(this.x) + 'x' + round(this.y)
        + ' - ' + round(this.dx) + 'x' + round(this.dy)
    */
    //this.status = states[this.state] + ' ' + round(this.timer*100)/100

    // animate
    this.frame.time += dt
    if (this.frame.delay > 0 && this.frame.time >= this.frame.delay) {
        this.frame.time = 0
        this.frame.cur = warp(this.frame.cur+1,
            this.frame.start, this.frame.end+1)
    }

    // vector movement
    this.x += this.dx * dt
    this.y += this.dy * dt
    if (this.y > 0) {
        this.y = 0
        this.dy = 0 // stop falling
    }

    this.performance(dt)
    
    // dash - todo move to performance
    if (this.dash > 0) {
        this.dash -= dt
        //if (this.dir === 0) this.x -= this.speed * dt
        //else this.x += this.speed * dt
    }

    // gravity
    if (this.y < 0) {
        // pull down
        this.dy = this.dy + env.tune.gravity * env.unit * dt
        //this.y = min(this.y + GRAVITY * dt, 0)
    }
    if (this.y === 0) {
        // friction
        this.dx = lib.util.lim(this.dx, env.tune.friction*env.base*dt, 0)
    } else {
        // air drag
        this.dx = lib.util.lim(this.dx, env.tune.airDrag*env.base*dt, 0)
    }

    // bounds
    if (this.bounded) {
        if (this.x < this.__.x1) {
            // left edge
            this.x = this.__.x1
            this.dx = 0

        } else if (this.x > this.__.x2){
            // right edge
            this.x = this.__.x2 
            this.dx = 0
        }
        this.y = limit(this.y, -height(), 0)
    }

    // restore hits
    if (this.state !== OUT || this.recharge < 0) {
        this.hits = min(this.hits + this.heal*dt, this.maxHits)
    }

    // control
    if (!this.player) this.bot.evo(dt)

    let c = this.bot.control
    if (this.player) c = env.control.player[this.player] || {}

    if (c) {
        if (c.left) {
            //this.doMove(0, dt)
            this.dir = 0
            this.perform(RUN, dt)
        } else if (c.right) {
            //this.doMove(1, dt)
            this.dir = 1
            this.perform(RUN, dt)
        } else if (this.state === RUN) {
            //this.doMove(-1, dt)
            this.setCycle(BREAK)
        }

        if (c.block) this.perform(BLOCK)
        else if (this.state === BLOCK) this.idle()

        if (c.jump) this.perform(JUMP, .3)

        if (c.kick || c.punch) {
            if (c.right || c.left) this.perform(DASH, dt)
            else this.perform(PUNCH)
        } else if (this.state === PUNCH) {
            // we want to finish the punch before idle
            if (this.recharge > env.tune.bro.punchCharge) {
                this.idle()
            }
        }
    } 

    /*
    if (!this.player) {
        // TODO bot logic
        // figure out closest targets
        // jump and run in case of hits

        if (!this.bot.goal) {
            // select new goal
            if (this.gang) {
                // gang member actions
                this.bot.goal = RND(11)

                if (this.x < rx(.1) && this.dir === 0) {
                    this.bot.goal = 2
                } else if (this.x > rx(.9) && this.dir === 1) {
                    this.bot.goal = 1
                }
            } else {
                this.bot.goal = RND(4)
            }
            this.bot.timer = rnd(0.3, 2)
            //log(this.name + ' selected #'
            //    + this.bot.goal + ' for ' + this.bot.timer)
        } else {
            this.bot.timer -= dt
            if (this.bot.timer < 0) {
                this.bot.goal = false
            } else {
                const c = this.bot.control
                c.left = false
                c.right = false
                c.jump = false
                c.block = false
                c.punch = false

                switch(this.bot.goal) {
                case 0: break;
                case 1: c.left= true; break;
                case 2: c.right = true; break;
                case 3: c.down = true; break;
                case 4: c.punch = true; break;
                case 5: c.jump = true; break;
                case 6: c.jump = true; c.left = true; break;
                case 7: c.jump = true; c.right = true; break;
                case 8: c.punch= true; c.left = true; break;
                case 9: c.punch= true; c.right= true; break;
                }
            }
        }
    }
    */
}

Bro.prototype.showBound = function(b, color) {
    if (env.config.bounds) {
        save()
        translate(0, 0)
        stroke(color)
        lineWidth(1)
        rect(b[0], b[1], b[2], b[3])
        restore()
    }
}

Bro.prototype.draw = function() {
    // screen coordinates
    const x = this.x - this.w/2
    const y = this.y - this.h 
    const s = this.scale
    let f
    if (this.player) f = res.player[this.gang][this.frame.cur]
    else f = res.gang[this.gang][this.frame.cur]
    const shaddow = res.shaddow[this.frame.cur]

    save()
    translate(x, y)

    blocky()

    const z = limit(1 - (this.Z - 100)/100, 0, 1) * .5
    const zShift = z * 20

    if (this.dir === 0) {
        save()
        translate(f.width*s + 2*s, 0)
        scale(-1, 1)
        image(f, 0, -zShift, f.width*s, f.height*s)
        alpha(z)
        image(shaddow, 0, -zShift, f.width*s, f.height*s)
        restore()
    } else {
        save()
        image(f, 0, -zShift, f.width*s, f.height*s)
        alpha(z)
        image(shaddow, 0, -zShift, f.width*s, f.height*s)
        restore()
    }

    if (env.config.debug && this.status) {
        fill('#ffffff')
        font('24px zekton')
        alignCenter()
        text(this.status, this.w/2, 0)
    }
    restore()

    if (env.config.bounds) {
        save()

        // sprite area
        lineWidth(1)
        stroke('#80808050')
        rect(this.x-this.w/2, this.y-this.h, this.w, this.h)

        // active areas
        stroke('#0080ff')
        for (let i = 0; i < area.length; i++) {
            const a = this.getArea(i)
            rect(a[0], a[1], a[2], a[3])
        }

        fill('#ff0000')
        lineWidth(4)
        plot(this.getPoint(HEAD)[0]-2, this.getPoint(HEAD)[1]-2)
        plot(this.getPoint(BODY)[0]-2, this.getPoint(BODY)[1]-2)

        restore()
    }

    // hits bar
    const h = min(this.hits/this.maxHits, 1)
    const hy = lab.street.worldY(height() - 10 - 8*this.gang)
    const hw = this.w * env.style.healthWidth
    const hx = (x + this.w/2) - hw/2

    lineWidth(4)
    stroke(env.style.gangLow[this.gang])
    line(hx, hy, hx+hw, hy)
    stroke(env.style.gang[this.gang])
    line(hx, hy, hx+hw*h, hy)
}
