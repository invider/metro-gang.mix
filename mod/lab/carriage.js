
const TAKE_TIME = 0.5
const HSHIFT = 0.02
const VSHIFT = 0.005

const exit = []
const keep = []

function reset() {
    for (let i = 0; i < 5; i++) {
        exit[i] = 0
        keep[i] = 0
    }
}

function exitQueue() {
    const all = exit.reduce((v, sum) => sum += v, 0)
    if (all > 0) return exit.slice()
    else return false
}

function init() {
    reset()
}

function evo(dt) {
    for (let i = 1; i < 5; i++) {
        const c = env.control.player[i] || {}

        if (c.punch || c.kick) {
            keep[i] += dt
            if (keep[i] > TAKE_TIME) {
                keep[i] = 0
                exit[i] ++ 
            }
        } else {
            keep[i] = 0
            exit[i] = 0
        }
    }
}

function gangExit(gangId, x, y) {

    const mobs = exit[gangId]
    const f = res.gang[gangId][1]

    for (let i = 0; i < mobs; i++) {
        image(f, x, y,
            f.width * env.scale,
            f.height * env.scale)
        x += rx(HSHIFT)
        y += ry(VSHIFT)
    }
}

function draw() {
    gangExit(1, rx(0.2), ry(0.8))
    gangExit(2, rx(0.4), ry(0.8))
    gangExit(3, rx(0.6), ry(0.8))
    gangExit(4, rx(0.8), ry(0.8))
}
