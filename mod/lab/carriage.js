
const HSHIFT = 0.02
const VSHIFT = 0.005

//const exit = []
const flag = []
const keep = []

const ERX = .4
const NRX = .2
const WRX = .3

// @depends(env/tune)
function reset() {
    for (let i = 0; i < env.tune.gangs + 1; i++) {
        //exit[i] = 0
        keep[i] = 0
    }
}

function exitQueue() {
    const q = []
    let total = 0

    for (let i = 0; i < env.tune.gangs + 1; i++) {
        const g = lab.gang[i]
        const n = countDoers(i)
        const cash = ((g.cash/g.mobs) * n)
        q[i] = {
            mobs: n,
            cash: lib.util.normalizeCash(cash),
        }
        total += n
    }

    if (total > 0) return q
    else return false
}

function init() {
    reset()
}

function findTarget() {
    return rnd(rx(2*NRX)) - rx(NRX)
}

function findEdge() {
    return lib.math.rnds() * rx(ERX)
}

function countGang(gangId) {
    let n = 0
    lab.train._ls.forEach(b => {
        if (b.bro && !b.dead && b.gang === gangId) n++
    })
    return n
}

function spawnInQueue(gangId) {
    if (countGang(gangId) >= lab.gang[gangId].mobs) return

    const bro = lab.train.spawn('Bro', {
        Z: 100,
        gang: gangId,
        x: findEdge(),
        dir: 0,
        state: 9,
        bot: new dna.bot.Passenger(),
    })
    return bro
}

function lookForQuitters(gangId) {
    let bro
    lab.train._ls.forEach(e => {
        if (e.bro && !e.dead && e.gang === gangId && e.bot.isQuitter()) {
            bro = e
        }
    })
    return bro
}

function listNearExit(gangId) {
    return lab.train._ls.filter(b => b.bro
                && !b.bro.dead
                && b.gang === gangId
                && b.x >= -rx(WRX)
                && b.x <= rx(WRX))
}

function countDoers(gangId) {
    return listNearExit(gangId).filter(b => b.bot.isDoer()).length
}

function catchAllQuitters(gangId) {
    let catched = 0
    lab.train._ls.filter(b => b.bro
                && !b.bro.dead
                && b.gang === gangId
                && b.bot.isQuitter()
                && b.x >= -rx(WRX)
                && b.x <= rx(WRX))
        .forEach(b => {
            b.bot.followTo(b.bot.mark)
            catched++
        })
    return catched
}

function numberInQueue(gangId) {
    let bros = 0
    lab.train._ls.forEach(e => {
        if (e.bro && !e.dead && e.gang === gangId && e.bot.isDoer()) bros++
    })
    return bros
}

function getInQueue(gangId) {
    // find a runner of this gang
    let bro = lookForQuitters(gangId)
    if (bro) {
        // we've found our guy
        // set a new goal
        bro.bot.followTo(findTarget())

    } else {
        // spawn a new one
        bro = spawnInQueue(gangId)
        if (bro) bro.bot.followTo(findTarget())
    }
    return bro
}

function cancel(gangId) {
    keep[gangId] = 0
    flag[gangId] = false

    lab.train._ls.forEach(e => {
        if (e.bro && !e.dead && e.gang === gangId) {
            e.bot.runAway(findEdge())
        }
    })
}

function cleanUp() {
    let target
    let i = 0

    while (!target && i < lab.train._ls.length) {
        const e = lab.train._ls[i++]
        if (e.dead) target = e
    }
    if (target) kill(target)
}

function evo(dt) {
    cleanUp()

    for (let i = 1; i <= env.tune.gangs; i++) {
        const c = env.control.player[i] || {}

        if (c.punch || c.kick) {
            if (!flag[i]) {
                flag[i] = true
                const quitters = catchAllQuitters(i)
                if (quitters > 0) {
                    keep[i] = env.tune.bro.takeInTime
                }
            }

            keep[i] -= dt
            if (keep[i] <= 0) {
                keep[i] = env.tune.bro.takeInTime
                //exit[i] ++ 
                getInQueue(i)
            }
        } else {
            cancel(i)
        }
    }
}

/*
function gangExit(gangId, x, y) {

    //const mobs = exit[gangId]
    const mobs = countDoers()
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
*/
