'use strict'

const MAX_BUFFER = 1024
const MIN_BUFFER = 32

let keyBuffer = ''

let cheatCodes = {
    'jamcast': function() {
        lab.debug.cast.enabled = !lab.debug.cast.enabled
        log('cast: ' + lab.debug.cast.enabled)
    },

    'debug': function() {
        env.debug = !env.debug
        log('debug: ' + env.debug)
    },
}

function match(code) {
    return keyBuffer.endsWith(code)
}

function tryToCheat() {
    Object.getOwnPropertyNames(cheatCodes).forEach(code => {
       if (match(code)) {
           log('cheat: [' + code + ']')
           cheatCodes[code]()
       }
    })
}

module.exports = {

    key: function(ch) {
        if (!ch || ch.length > 1) return

        keyBuffer += ch
        if (keyBuffer.length > MAX_BUFFER) {
            keyBuffer = keyBuffer.substring(
                keyBuffer.length - MIN_BUFFER,
                keyBuffer.length)
        }

        tryToCheat()
    },
}
