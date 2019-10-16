//
// pad controllers monitor
//
const USAGE_TIMEOUT = 15 * 1000

let sens = 0.3 // analog sticks sensitivity

const bind = []
const lastUsage = []

function activate(id, control) {
    lastUsage[id] = Date.now()
}

function isActive(id) {
    return (lastUsage[id] && Date.now()
        -lastUsage[id] < USAGE_TIMEOUT);
}

function evo(dt) {
    pad().forEach(p => {
        if (p.index >= 4) return
        if (!bind[p.index]) {
            bind[p.index] = {}
            log('registering gamepad:')
            console.dir(p)
        }

        const id = p.index + 1

        // directional controls
        let x = p.axes[0] || p.axes[2] || p.axes[4]
        let y = p.axes[1] || p.axes[3] || p.axes[5]

        if (p.buttons[12] && p.buttons[12].pressed) y = -1
        if (p.buttons[13] && p.buttons[13].pressed) y = 1
        if (p.buttons[14] && p.buttons[14].pressed) x = -1
        if (p.buttons[15] && p.buttons[15].pressed) x = 1

        if (x < -sens) {
            activate(id)
            env.control.move(id, 'left')
        } else if (x > sens) {
            activate(id)
            env.control.move(id, 'right')
        } else if (isActive(id)) {
            env.control.stop(id, 'left')
            env.control.stop(id, 'right')
        }

        if (y < -sens) {
            activate(id)
            env.control.move(id, 'jump')
        } else if (y > sens) {
            activate(id)
            env.control.move(id, 'block')
        } else if (isActive(id)) {
            env.control.stop(id, 'jump')
            env.control.stop(id, 'block')
        }

        if ((p.buttons[0] && p.buttons[0].pressed)
                || (p.buttons[1] && p.buttons[1].pressed)
                || (p.buttons[2] && p.buttons[2].pressed)
                || (p.buttons[3] && p.buttons[3].pressed)) {
            activate(id)
            env.control.move(id, 'punch')
        } else if (isActive(id)) {
            env.control.stop(id, 'punch')
        }
    })
}
