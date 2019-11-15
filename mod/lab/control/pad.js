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
    pad().forEach(d => {
        if (d.index >= 4) return
        if (!bind[d.index]) {
            bind[d.index] = {}
            log('registering gamepad:')
            console.dir(d)
        }

        const p = lab.control.player
        const id = lab.control.mapping.GAMEPAD_ID_SHIFT + d.index

        // directional controls
        let x = d.axes[0] || d.axes[2] || d.axes[4]
        let y = d.axes[1] || d.axes[3] || d.axes[5]

        if (d.buttons[12] && d.buttons[12].pressed) y = -1
        if (d.buttons[13] && d.buttons[13].pressed) y = 1
        if (d.buttons[14] && d.buttons[14].pressed) x = -1
        if (d.buttons[15] && d.buttons[15].pressed) x = 1

        if (x < -sens) {
            activate(id)
            p.act(id, p.LEFT)
        } else if (x > sens) {
            activate(id)
            p.act(id, p.RIGHT)
        } else if (isActive(id)) {
            p.stop(id, p.LEFT)
            p.stop(id, p.RIGHT)
        }

        if (y < -sens) {
            activate(id)
            p.act(id, p.UP)
        } else if (y > sens) {
            activate(id)
            //p.act(id, p.BLOCK)
        } else if (isActive(id)) {
            p.stop(id, p.UP)
        }

        // TODO refactor on custom mapping scheme (like the keyboard)
        if (d.buttons[0] && d.buttons[0].pressed) {
            activate(id)
            p.act(id, p.KICK)
        } else {
            p.stop(id, p.KICK)
        }
        if (d.buttons[1] && d.buttons[1].pressed) {
            activate(id)
            p.act(id, p.PUNCH)
        } else {
            p.stop(id, p.PUNCH)
        }
        if (d.buttons[2] && d.buttons[2].pressed) {
            activate(id)
            p.act(id, p.CUT)
        } else {
            p.stop(id, p.CUT)
        }
        if (d.buttons[3] && d.buttons[3].pressed) {
            activate(id)
            p.act(id, p.BLOCK)
        } else {
            p.stop(id, p.BLOCK)
        }
    })
}
