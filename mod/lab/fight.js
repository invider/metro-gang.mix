function init() {
    this.timer = 0
}

function markAllDead() {
    lab.street._ls.forEach(e => {
        e.dead = true
    })
}

function cleanUp() {
    lab.street._ls.forEach(e => {
        if (e.dead) kill(e)
    })
}

function evo(dt) {
    cleanUp()
    if (env.state !== 'street') return
    this.timer -= dt

    if (this.timer < 0) {
        markAllDead()
        trap('finish', {
            station: this.station,
            gang: this.gang,
        })
    }
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
    lab.street.spawn('Bro', {
        gang: gang.id,
        player: gang.player,
        x: sx,
        y: 0,
        dir: dir,
        cash: cash,
    })

    for (let i = 0; i < n; i++) {
        // other bots
        lab.street.spawn('Bro', {
            gang: gang.id,
            x: sh + rnd(rx(.2)),
            y: 0,
            dir: dir,
            cash: cash,
        })
    }
}

function begin(station, gang) {
    this.station = station
    this.gang = gang
    this.timer = env.tune.roundTime

    markAllDead()

    bros(gang, 1, gang.mobs, 2)

    if (!station.gang) {
        bros(lab.gang[0], 0, RND(1,4), 4)
    } else {
        bros(station.gang, 0, station.mobs, 2)
    }
}
