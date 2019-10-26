const Z = 9999

const HIDDEN = 0
const FADE_IN = 1
const KEEP = 2
const FADE_OUT = 3

function init() {
    this.state = HIDDEN
}

function transit(time, fade) {
    this.state = FADE_IN
    this.time = time
    this.fade = fade? fade : time/2
    this.fader = this.fade
}

function evo(dt) {
    if (this.state === HIDDEN) return

    this.fader -= dt

    switch(this.state) {
    case FADE_IN:
        if (this.fader <= 0) {
            this.state = KEEP
            this.fader = this.time - 2*this.fade
        }
        break;

    case KEEP:
        if (this.fader <= 0) {
            this.state = FADE_OUT
            this.fader = this.fade
        }
        break;

    case FADE_OUT:
        if (this.fader <= 0) {
            this.state = HIDDEN
        }
        break;
    }
}

function draw() {
    if (this.state === HIDDEN) return

    save()
    switch (this.state) {
    case FADE_IN:   alpha(1 - this.fader/this.fade); break;
    case KEEP:      alpha(1); break;
    case FADE_OUT:  alpha(this.fader/this.fade); break;
    }
    background('#000000')

    text('#' + this.state, rx(.5), ry(.5))
    restore()
}
