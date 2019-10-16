function init() {
    this.timer = 0
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

function evo(dt) {
    cleanUp()
    if (env.state !== 'street') return
    this.timer -= dt

    if (this.timer < 0) {
        if (env.skip) {
            this.timer = env.tune.roundTime
        } else {
            markAllDead()
            trap('finish', {
                station: this.station,
                gang: this.gang,
            })
        }
    }
}

function bro(igang) {
    if (!igang) igang = 0

    const b = lab.street.spawn('Bro', {
        Z: RND(100, 199),
        gang: igang,
        x: rnd(rx(.1), rx(.9)),
        y: 0,
        dir: RND(1),
        cash: 2,
        bot: new dna.bot.Walker(),
    })
}

function bros(gang, dir, n, cash) {
    if (!n) return

    let sh = 0
    let sx = rx(.4)

    if (dir === 0) {
        sh = rx(.6)
        sx = rx(.6)
    }

    n--
    const p = lab.street.spawn('Bro', {
        Z: RND(200, 299),
        gang: gang.id,
        player: gang.player,
        x: sx,
        y: 0,
        dir: dir,
        cash: cash,
        bot: new dna.bot.Walker(),
    })

    for (let i = 0; i < n; i++) {
        // other bots
        const b = lab.street.spawn('Bro', {
            Z: RND(100, 199),
            gang: gang.id,
            x: sh + rnd(rx(.2)),
            y: 0,
            dir: dir,
            cash: cash,
            bot: new dna.bot.Walker(),
        })
    }

}

function begin(station, queue) {
    this.station = station
    this.timer = env.tune.roundTime

    // clear the scene
    markAllDead()

    if (!station.gang) {
        // neutrals
        bros(lab.gang[0], 0, RND(1,4), 4)
    } else {
        // station gang
        bros(station.gang, 0, station.mobs, 2)
    }

    // arrival gangs
    for (let i = 1; i < queue.length; i++) {
        bros(lab.gang[i], 1, queue[i], 2)
    }
}
