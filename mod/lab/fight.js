const HIDDEN = 0
const READY = 1
const FIGHT = 2
const RESULT = 3
const FADE = 4

function init() {
    this.timer = 0
    this.state = HIDDEN
}

function markAllDead() {
    lab.street._ls.forEach(e => {
        e.dead = true
    })
    lab.train._ls.forEach(e => {
        e.dead = true
    })
}

function cleanUp() {
    let target
    let i = 0

    while(!target && i < lab.street._ls.length) {
        const e = lab.street._ls[i++]
        if (e.dead) target = e
    }
    if (target) kill(target)
}

function spawnBro(igang) {
    if (!igang) igang = 0

    const b = lab.street.spawn('Bro', {
        Z: RND(100, 199),
        gang: igang,
        x: rnd(rx(.1), rx(.9)),
        y: 0,
        dir: RND(1),
        cash: 2,
        bot: new dna.bot.Idle(),
    })
}

function spawnBros(gang, dir, n, totalCash) {
    if (!n) return

    let sh = 0
    let sx = rx(.4)

    if (dir === 0) {
        sh = rx(.6)
        sx = rx(.6)
    }

    const cash = lib.util.normalizeCash(totalCash/n)

    /*
    n--
    const p = lab.street.spawn('Bro', {
        Z: RND(200, 299),
        gang: gang.id,
        //player: gang.player,
        x: sx,
        y: 0,
        dir: dir,
        cash: cash,
        //bot: new dna.bot.Fighter(),
        bot: new dna.bot.Idle(),
    })
    */

    for (let i = 0; i < n; i++) {
        // other bots
        const b = lab.street.spawn('Bro', {
            Z: RND(100, 199),
            gang: gang.id,
            x: sh + rnd(rx(.2)),
            y: 0,
            dir: dir,
            cash: cash,
            bot: new dna.bot.Idle(),
        })
    }
}

function allWait() {
    lab.street._ls.forEach(b => {
        if (b.bro && !b.dead) {
            b.setBot(new dna.bot.Idle())
        }
    })
}

function allFight() {
    lab.street._ls.forEach(b => {
        if (b.bro && !b.dead) {
            b.setBot(new dna.bot.Fighter())
        }
    })
}

function calculateStat() {
    const gang = []
    const score = []

    for (let i = 0; i <= env.tune.gangs; i++) {
        gang[i] = {
            id: i,
            mobs: 0,
            cash: 0,
        }
        score[i] = gang[i]
    }

    lab.street._ls.forEach(b => {
        if (b.bro && !b.dead) {
            gang[b.gang].mobs++
            gang[b.gang].cash += lib.util.normalizeCash(b.cash)
        }
    })

    score.sort((a,b) => {
        if (a.cash > b.cash) return -1
        else if (a.cash < b.cash) return 1
        else if (a.mobs > b.mobs) return -1
        else if (a.mobs < b.mobs) return 1
        else if (a.id === this.station.gang.id) return -1
        else if (b.id === this.station.gang.id) return 1
        else return 0
    })

    return {
        station: this.station,
        owner: this.station.gang,
        mobs: this.station.mobs,
        gang: gang,
        score: score,
    }
}

function calculateDiff() {
    const res = this.result
    res.finish = this.calculateStat()
    res.diff = {
        gang: [],
        newOwner: -1,
    }

    for (let gid  = 0; gid < res.finish.gang.length; gid++) {
        const gang = lab.gang[gid]

        res.diff.gang[gid] = {}
        const mobs = res.finish.gang[gid].mobs - res.start.gang[gid].mobs
        const cash = lib.util.normalizeTransaction(
            res.finish.gang[gid].cash - res.start.gang[gid].cash)

        res.diff.gang[gid].mobs = mobs
        res.diff.gang[gid].cash = cash

        gang.mobIn(mobs)
        gang.cashIn(cash)
    }

    const wid = res.finish.score[0].id
    const winner = lab.gang[wid]

    if (res.start.owner !== winner) {
        // new station owner!
        this.station.gang = winner
        res.finish.owner = winner.id
        res.diff.newOwner = winner.id
    }
}

function begin() {
    log('fight!')
    this.state = FIGHT
    this.timer = env.tune.roundTime
    this.allFight()
}

function ready(station, queue) {
    this.state = READY
    this.station = station
    this.timer = env.tune.readyTime

    // clear the scene
    markAllDead()

    if (!station.gang || station.gang.id === 0) {
        // citizens 
        spawnBros(lab.gang[0], 0, RND(1,4), RND(1, 8))
    } else {
        // station gang
        spawnBros(station.gang, 0, station.mobs, RND(1, 8))

        spawnBros(lab.gang[0], 0, RND(0,2), RND(1, 2))
    }

    // arrival gangs
    for (let i = 1; i < queue.length; i++) {
        spawnBros(lab.gang[i], 1, queue[i].mobs, queue[i].cash)
    }

    this.result = {
        start: this.calculateStat()
    }
    lab.stat.show(this.result, env.tune.readyTime)
}

function finish() {
    this.state = RESULT
    this.timer = env.tune.finishStatTime - env.tune.fadeTime
    this.calculateDiff()
    this.allWait()

    trap('finish', {
        station: this.station,
        result: this.result,
    })
}

function evo(dt) {
    cleanUp()
    //if (env.state !== 'street') return

    this.timer -= dt

    switch(this.state) {
    case READY:
        if (this.timer <= 0) this.begin()
        break;

    case FIGHT:
        if (this.timer <= 0) {
            if (env.skip) this.timer = env.tune.roundTime
            else this.finish()
        }
        break;

    case RESULT:
        if (this.timer <= 0) {
            this.state = FADE
            lab.transition.transit(
                env.tune.transitionTime, env.tune.fadeTime)
        }
        break;
    }
}
