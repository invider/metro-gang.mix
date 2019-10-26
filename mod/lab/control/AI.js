// @depends(lab/control/player)

const bot = []

function init() {
    augment(this, lab.control.player.actionSet)

    for (let i = 0; i < 5; i++) {
        bot[i] = {}
    }
}

function getAction(p, action) {
    if (env.state === 'metro') {
        // AI works only in metro mode
        if (bot[p].exit
                && (action === this.PUNCH
                    || action === this.KICK)) { 
            return true
        }
        return false
    }
    return false
}

function selectAction(b) {
    if (rnd(3) < 1) {
        b.exit = true
    } else {
        b.exit = false
    }
}

function onDeparture() {
    bot.forEach(b => selectAction(b))
}

function onFinish() {
    // TODO decide how many bros should be left?
}

function evo(dt) {
}
