const Z = 21

const baseY = .9
const doorBase1 = 0.01
const doorBase2 = 0.15

const CLOSED = 0
const OPEN = 1
const OPENING = 2
const CLOSING = 3

const lights = []

let speed = 0
let speedFactor = 0

function init() {
    this.state = CLOSED
    this.doors = 0
}

function openDoors() {
    this.state = OPENING
}

function closeDoors() {
    this.state = CLOSING
}

function spawnLight() {
    // new light
    const drh = res.subwayDoorLeft.height * env.scale
    const ph = env.style.metro.lightsSize * env.scale
    const y = ry(baseY)-drh/2 - RND(drh/2)

    // get the light object
    let light
    for (let i = 0; i < lights.length; i++) {
        if (lights[i].dead) light = lights[i]
    }

    if (!light) {
        light = {
            evo: function(dt) {
                this.x -= dt * speed
                if (this.x < 0) this.dead = true
            },
            draw: function() {
                const trail  = 1 + env.style.metro.lightsTrail * speedFactor
                for (let i = 0; i < trail; i++) {
                    alpha(1 - i/trail)
                    fill(env.style.metro.lightsColor)
                    rect(this.x + i*this.r, this.y, this.r, this.r)
                }
            },
        }
        lights.push(light)
    }

    light.dead = false
    light.x = width()
    light.y = y
    light.r = env.style.metro.lightsSize * env.scale
}

function evoLights(dt) {
    const v1 = env.style.metro.lightsSpeedFactor
    const v2 = 1 - v1

    if (this.train.transit <= v1) speedFactor = this.train.transit/v1
    else if (this.train.transit >= v2) speedFactor = 1 - (this.train.transit-v2)/v1
    else speedFactor = 1
    speed = rx(env.style.metro.lightsSpeed) * speedFactor

    lights.forEach(l => {
        if (!l.dead) l.evo(dt)
    })

    if (rnd() < env.style.metro.lightsFQ*speedFactor*dt) {
        this.spawnLight()
    }
}

function drawLights() {
    lights.forEach(l => {
        if (!l.dead) l.draw()
    })
    alpha(1)
}

function evo(dt) {
    this.evoLights(dt)

    switch(this.state) {
    case OPENING:
        this.doors += dt / env.tune.metro.doorsMoveTime
        if (this.doors >= 1) {
            this.doors = 1
            this.state = OPEN
        }
        break;

    case CLOSING:
        this.doors -= dt / env.tune.metro.doorsMoveTime
        if (this.doors <= 0) {
            this.doors = 0
            this.state = CLOSED
        }
    }
}

function draw() {
    drawLights()

    const w = res.subway.width * env.scale
    const h = res.subway.height * env.scale

    // floor
    const by = ry(baseY)
    const y = ry(baseY) - h
    fill(env.style.metro.floorColor)
    rect(0, by, width(), height()-by)

    // doors
    let x = -w*.95

    while(x < width()) {
        const drw = res.subwayDoorLeft.width * env.scale
        const drh = res.subwayDoorLeft.height * env.scale
        const doorY = ry(baseY) - drh
        const drx1 = x + w*doorBase1 - drw * this.doors
        const drx2 = x + w*doorBase2 + drw * this.doors
        image(res.subwayDoorLeft, drx1, doorY, drw, drh)
        image(res.subwayDoorRight, drx2, doorY, drw, drh)

        x += w
    }

    // carriage
    x = -w*.95
    while(x < width()) {
        image(res.subway, x, ry(.9) - h, w, h)
        x += w
    }
}
