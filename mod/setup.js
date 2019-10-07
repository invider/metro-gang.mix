
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

    const cam = lab.spawn('SlideCamera', {
        name: 'street',
        Z: 11,
        x: 0,
        y: 0,
    })

    trap('start')
}
