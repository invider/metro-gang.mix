// player set
const NONE = 0
const HUMAN = 1
const AI = 2

// action set
const LEFT = 1
const RIGHT = 2
const UP = 3
const DOWN = 4
const PUNCH = 5
const KICK = 6
const BLOCK = 7
const CUT = 8
const ALL = 99

const src = []
const bind = []

let player = 0

function touch(ctrl) {
    if (!src[ctrl]) {
        // activate new controller
        player ++
        if (player > lab.gang.length) player = 1

        src[ctrl] = {
            act: [],
        }
        bind[player] = src[ctrl]

        const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
        const type = ctrl < kshift?  'gamepad' : 'keyset'

        log('binding ' + type + ' #' + ctrl + ' to ' + player)
    }
}

function act(ctrl, action) {
    touch(ctrl)
    src[ctrl].act[action] = true
    src[ctrl].active = true
    src[ctrl].lastUsed = Date.now()
}

function stop(ctrl, action) {
    touch(ctrl)
}
