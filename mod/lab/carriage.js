
const TAKE_TIME = 0.5
const HSHIFT = 0.02
const VSHIFT = 0.005

const exit = []
const keep = []

// @depends(env/tune)
function reset() {
    for (let i = 0; i < env.tune.gangs + 1; i++) {
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

function spawnInQueue(gangId, expect) {
    if (lab.gang[gangId].numberOnStreet() >= expect) return

    lab.train.spawn('Bro', {
        Z: 100,
        gang: gangId,
        x: -rx(.4),
        dir: 0,
        state: 9,
        bot: new dna.bot.Passenger(),
    })
}

function cancel(i) {
    keep[i] = 0
    exit[i] = 0

    lab.train._ls.forEach(e => {
        if (e.bro && e.gang === i && !e.dead) e.bot.runAway()
    })
}

function evo(dt) {
    for (let i = 1; i < env.tune.gangs; i++) {
        const c = env.control.player[i] || {}

        if (c.punch || c.kick) {
            keep[i] += dt
            if (keep[i] > TAKE_TIME) {
                keep[i] = 0
                exit[i] ++ 
                spawnInQueue(i, exit[i])
            }
        } else {
            cancel(i)
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
    /*
    gangExit(1, rx(0.2), ry(0.8))
    gangExit(2, rx(0.4), ry(0.8))
    gangExit(3, rx(0.6), ry(0.8))
    gangExit(4, rx(0.8), ry(0.8))
    */
}
