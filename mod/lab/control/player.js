const type = {
    NONE: 0,
    BOT: -1,
    KEYSET: 1,
    GAMEPAD: 2,
}

const actionSet = {
    UP: 1,
    LEFT: 2,
    DOWN: 3,
    RIGHT: 4,
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
        timeout[i] = RND(env.tune.control.touchVarTimeout)
    }
}

function isTouched(player) {
    return bind[player] && bind[player].id >= 0
}

function isIdle(player) {
    const source = bind[player]
    const cfg = env.tune.control
    if (source.id < 0) return source.lastUsed + cfg.startBotTimeout + timeout[player] < Date.now();
    return source.lastUsed + cfg.touchMinTimeout + timeout[player] < Date.now();
}

function getType(player) {
    if (!isTouched(player)) return type.NONE
    if (bind[player].id === 0) return type.BOT

    const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
    if (bind[player].id < kshift) return type.GAMEPAD
    return type.KEYSET
}

function getAction(player, action) {
    if (!player) return false
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

function getActions(player) {
    // TODO refactor bro to work with array?
    const c = {}
    const source = bind[player]
    if (!source) return c
    const a = source.act

    c.left = a[this.LEFT]
    c.right = a[this.RIGHT]
    c.up = a[this.UP]
    c.down = a[this.DOWN]
    c.punch = a[this.PUNCH]
    c.kick = a[this.KICK]
    c.block = a[this.BLOCK]
    c.cut = a[this.CUT]
    return c
}

function getFeedback(player) {
    const source = bind[player]
    if (!source) return false

    if (source.id > 0) {
        let action = false
        for (let i = 0; i < source.act.length; i++) {
            if (source.act[i]) action = true
        }
        return action
    }
    return false
}

function ctrlType(ctrl) {
    const kshift = lab.control.mapping.KEYBOARD_ID_SHIFT
    return ctrl < kshift?  'gamepad' : 'keyset'
}

function pretouch(ctrl) {
    if (!src[ctrl]) {
        // activate new controller
        player ++
        if (player > env.tune.gangs) player = 1

        src[ctrl] = bind[player]
        src[ctrl].id = ctrl

        log('binding ' + ctrlType(ctrl) + ' #' + ctrl
            + ' to @' + player)
    }
}

function touch(ctrl) {
    pretouch(ctrl)

    src[ctrl].lastUsed = Date.now()

    if (src[ctrl].id !== ctrl) {
        log('rebinding ' + ctrlType() + ' #' + src[ctrl].id + ' -> #' + ctrl
            + ' for @' + player)
        src[ctrl].id = ctrl
    }
}

function act(ctrl, action) {
    touch(ctrl)
    src[ctrl].act[action] = true
}

function stop(ctrl, action) {
    if (src[ctrl]) {
        src[ctrl].act[action] = false
    }
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
