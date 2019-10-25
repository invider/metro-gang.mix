// player set
const NONE = 0
const HUMAN = 1
const AI = 2

// action set
const actionSet = {
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
    PUNCH: 5,
    KICK: 6,
    BLOCK: 7,
    CUT: 8,
    ALL: 99,
}

const src = []
const bind = []

let player = 0

function init() {
    augment(this, actionSet)
}

function isActive(player) {
    const source = bind[player]
    if (!source) return false
    if (source.lastUsed + env.tune.control.activeTimeout
            < Date.now()) {
        return false
    } else {
        return true
    }
}

function getAction(player, action) {
    const source = bind[player]

    if (!source) {
        // bind player and wait for AI to take control over
        bind[player] = {
            id: 0,
            act: [],
            lastUsed: Date.now(),
        }
        return false
    }

    if (!this.isActive(player)) {
        source.bot = true
        return lab.control.AI.getAction(player, action)
    } else {
        source.bot = false
        return source.act[action]
    }
}

function touch(ctrl) {
    if (!src[ctrl]) {
        // activate new controller
        player ++
        if (player > lab.gang.length) player = 1

        src[ctrl] = {
            id: ctrl,
            bot: false,
            act: [],
        }
        bind[player] = src[ctrl]

        const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
        const type = ctrl < kshift?  'gamepad' : 'keyset'

        log('binding ' + type + ' #' + ctrl + ' to ' + player)
    }
    src[ctrl].bot = false
    src[ctrl].lastUsed = Date.now()
}

function act(ctrl, action) {
    touch(ctrl)
    src[ctrl].act[action] = true
}

function stop(ctrl, action) {
    touch(ctrl)
    src[ctrl].act[action] = false
}
