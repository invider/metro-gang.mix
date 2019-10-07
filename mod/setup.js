function adjust() {
    const sampleFrame = res.dude[1]
    env.scale = (rx(env.tune.base)/sampleFrame.width)
    env.base = sampleFrame.width * env.scale
    env.unit = sampleFrame.height * env.scale
}

function setup() {
    adjust()
    lib.util.remapSprites()

    const cam = lab.spawn('SlideCamera', {
        name: 'street',
        Z: 101,
        x: 0,
        y: 0,
    })


    lab.street.spawn('Bro', {
        player: 2,
        gang: 2,
        x: width() * .3,
        y: 0,
    })

    lab.street.spawn('Bro', {
        player: 1,
        gang: 1,
        x: rx(.5),
        y: ry(.5),
        dir: 0,
    })

    /*
    lab.spawn('Bro', {
        gang: 0,
        x: rx(.5),
        y: 0,
    })
    lab.spawn('Bro', {
        gang: 3,
        x: rx(.6),
        y: 0,
    })
    lab.spawn('Bro', {
        gang: 4,
        x: rx(.7),
        y: 0,
        dir: 0,
    })
    */
}
