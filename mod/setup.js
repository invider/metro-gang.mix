env.time = 0

function adjust() {
    const sampleFrame = res.dude[1]
    env.scale = (rx(env.tune.base)/sampleFrame.width)
    env.base = sampleFrame.width * env.scale
    env.unit = sampleFrame.height * env.scale
}

function setup() {
    adjust()
    lib.util.remapSprites()

    lab.spawn('SlideCamera', {
        name: 'train',
        Z: 22,
        x: 0,
        y: -ry(env.style.metro.floorRY),
        scale: 1.5,
        x1: -rx(.22),
        x2: rx(.22),
    })

    lab.spawn('SlideCamera', {
        name: 'street',
        Z: 11,
        x: 0,
        y: 0,
    })

    trap('start')
}
