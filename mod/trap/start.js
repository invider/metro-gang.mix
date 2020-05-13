function createGangs() {
    lab.gang = []

    lab.gang.push(new dna.Gang({
        id: 0,
        name: 'Citizens',
    }))

    lab.gang.push(new dna.Gang({
        id: 1,
        name: 'Reds',
        player: 1,
    }))

    lab.gang.push(new dna.Gang({
        id: 2,
        name: 'Lemons',
        player: 2,
    }))

    lab.gang.push(new dna.Gang({
        id: 3,
        name: 'Limes',
        player: 3,
    }))

    lab.gang.push(new dna.Gang({
        id: 4,
        name: 'Grapes',
        player: 4,
    }))
}

function demoBrawl() {
    lab.street.spawn('Bro', {
        Z: 100,
        //player: 1,
        gang: 1,
        x: rx(.5),
        y: ry(.5),
        dir: 0,
    })

    lab.street.spawn('Bro', {
        Z: 199,
        //player: 2,
        gang: 2,
        x: rx(1) * .3,
        y: 0,
    })

    lab.street.spawn('Bro', {
        Z: 130,
        gang: 3,
        x: rx(.6),
        y: 0,
    })
    lab.street.spawn('Bro', {
        Z: 160,
        gang: 4,
        x: rx(.7),
        y: 0,
        dir: 0,
    })
    lab.street.spawn('Bro', {
        Z: 180,
        gang: 0,
        x: rx(.5),
        y: 0,
    })
}

function start() {
    env.tagline = env.msg.title

    createGangs()
    lab.metro.runTraffic()
    lab.metro.show()

    //demoBrawl()
}

