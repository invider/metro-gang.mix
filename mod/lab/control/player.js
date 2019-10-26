const type = {
    NONE: 0,
    BOT: 1,
    KEYSET: 2,
    GAMEPAD: 3,
}

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
const timeout = []

let player = 0

function init() {
    augment(this, type)
    augment(this, actionSet)

    for (let i = 0; i < env.tune.gangs + 1; i++) {
        bind[i] = {
            id: -1,
            act: [],
            lastUsed: Date.now(),
        }
        timeout[i] = env.tune.control.touchMinTimeout
            + RND(env.tune.control.touchVarTimeout)
    }
}

function isTouched(player) {
    return bind[player] && bind[player].id >= 0
}

function isIdle(player) {
    const source = bind[player]
    return (source.lastUsed + timeout[player] < Date.now())
}

function getType(player) {
    if (!isTouched(player)) return type.NONE
    if (bind[player].id === 0) return type.BOT

    const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
    if (bind[player].id < kshift) return type.GAMEPAD
    return type.KEYSET
}

function getAction(player, action) {
    const source = bind[player]
    if (!source) return false

    if (isIdle(player)) {
        if (source.id === 0) {
            return lab.control.AI.getAction(player, action)
        } else {
            // bot takes over
            source.id = 0
        }
    } else {
        return source.act[action]
    }
}

function ctrlType(ctrl) {
    const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
    return ctrl < kshift?  'gamepad' : 'keyset'
}

function touch(ctrl) {
    if (!src[ctrl]) {
        // activate new controller
        player ++
        if (player > lab.gang.length) player = 1

        src[ctrl] = bind[player]
        src[ctrl].id = ctrl

        log('binding ' + ctrlType() + ' #' + ctrl
            + ' to @' + player)
    } else {
        src[ctrl].lastUsed = Date.now()
        if (src[ctrl].id !== ctrl) {
            log('rebinding ' + ctrlType() + ' #' + ctrl
                + ' to @' + player)
            src[ctrl].id = ctrl
        }
    }
}

function act(ctrl, action) {
    touch(ctrl)
    src[ctrl].act[action] = true
}

function stop(ctrl, action) {
    src[ctrl].act[action] = false
}

/*
function draw() {
    // debug control usage
    font('24px coolville')
    alignLeft()

    let x = 20
    let y = 20
    bind.forEach(b => {
        text('#' + b.id + ': '
            + round(((Date.now() - b.lastUsed))/1000),
            x, y)
        y += 30
    })
}
*/
