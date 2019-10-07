function createGangs() {
    lab.gang = []

    lab.gang.push(new dna.Gang({ id: 0 }))
    lab.gang.push(new dna.Gang({ id: 1 }))
    lab.gang.push(new dna.Gang({ id: 2 }))
    lab.gang.push(new dna.Gang({ id: 3 }))
    lab.gang.push(new dna.Gang({ id: 4 }))
}

function start() {
    createGangs()
    lab.metro.runTraffic()

    bros()
}

function bros() {
    lab.street.spawn('Bro', {
        //player: 1,
        gang: 1,
        x: rx(.5),
        y: ry(.5),
        dir: 0,
    })

    lab.street.spawn('Bro', {
        //player: 2,
        gang: 2,
        x: width() * .3,
        y: 0,
    })

    lab.street.spawn('Bro', {
        gang: 3,
        x: rx(.6),
        y: 0,
    })
    lab.street.spawn('Bro', {
        gang: 4,
        x: rx(.7),
        y: 0,
        dir: 0,
    })
    lab.street.spawn('Bro', {
        gang: 0,
        x: rx(.5),
        y: 0,
    })
}
