let sens = 0.3

const bind = {}

const USAGE_TIMEOUT = 15 * 1000
const lastUsage = {}

function activate(id) {
    lastUsage[id] = Date.now()
}

function active(id) {
    return (lastUsage[id] && Date.now()
        -lastUsage[id] < USAGE_TIMEOUT);
}

function evo(dt) {
    pad().forEach(p => {
        if (p.index >= 4) return
        if (!bind[p.index]) {
            bind[p.index] = true
            log('registering gamepad:')
            console.dir(p)
        }

        const id = p.index + 1

        const x = p.axes[0] || p.axes[2] || p.axes[4]
        const y = p.axes[1] || p.axes[3] || p.axes[5]

        if (x < -sens) {
            activate(id)
            env.control.move(id, 'left')
        } else if (x > sens) {
            activate(id)
            env.control.move(id, 'right')
        } else if (active(id)) {
            env.control.stop(id, 'left')
            env.control.stop(id, 'right')
        }

        if (y < -sens) {
            activate(id)
            env.control.move(id, 'jump')
        } else if (y > sens) {
            activate(id)
            env.control.move(id, 'block')
        } else if (active(id)) {
            env.control.stop(id, 'jump')
            env.control.stop(id, 'block')
        }

        /*
        if (p.buttons[12]) {
            if (p.buttons[12].pressed) {
                activate(id)
                env.control.move(id, 'jump')
            } else if (active(id)) {
                env.control.stop(id, 'jump')
            }
        }

        if (p.buttons[13].pressed) {
            activate(id)
            env.control.move(id, 'block')
        } else if (active(id)) {
            env.control.stop(id, 'block')
        }

        if (p.buttons[14].pressed) {
            activate(id)
            env.control.move(id, 'left')
        } else if (p.buttons[14].pressed) {
            activate(id)
            env.control.move(id, 'right')
        } else if (active(id)) {
            env.control.stop(id, 'left')
            env.control.stop(id, 'right')
        }
        */

        if (p.buttons[0].pressed
                || p.buttons[1].pressed
                || p.buttons[2].pressed
                || p.buttons[3].pressed) {
            activate(id)
            env.control.move(id, 'punch')
        } else if (active(id)) {
            env.control.stop(id, 'punch')
        }
    })
}
