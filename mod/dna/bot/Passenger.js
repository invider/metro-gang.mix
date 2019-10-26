// @depends(dna/bot/Walker)
const Walker = dna.bot.Walker

const HIDDEN = -1
const IDLE = 0
const IN = 1
const OUT = 2

function Passenger() {}
sys.extend(Passenger, Walker)

Passenger.IDLE = IDLE
Passenger.IN = IN
Passenger.OUT = OUT

Passenger.prototype.init = function(bro) {
    Walker.prototype.init.call(this, bro)
    bro.bounded = false
}

Passenger.prototype.followTo = function(x) {
    this.state = IN
    this.target = x
    this.mark = x

    if (this.bro.x < x) this.action = 3
    else this.action = 2
    this.timeout = 999
}

Passenger.prototype.runAway = function(target) {
    if (this.state === OUT || this.state === HIDDEN) return

    this.state = OUT
    this.target = target

    if (this.bro.x < target) this.action = 3
    else this.action = 2
    this.timeout = 999
}


Passenger.prototype.isDoer = function() {
    return !this.bro.dead && (this.state === IN || this.state === IDLE)
}

Passenger.prototype.isQuitter = function() {
    return !this.bro.dead && (this.state === OUT || this.state === HIDDEN)
}

Passenger.prototype.evo = function(dt) {
    if (this.bro.dead) return

    if (this.action) {
        this.follow() 
        this.timeout -= dt
        if (this.timeout < 0) this.action = 0

        if (this.state === IDLE) {
            this.bro.perform(9)

        } else if ((this.state === IN || this.state === OUT)
                && ((this.action === 2 && this.bro.x <= this.target)
                    || (this.action === 3 && this.bro.x >= this.target))) {

            //log('reached @' + this.target)
            if (this.state === IN) {
                this.state = IDLE
            } else {
                this.state = HIDDEN
            }
            this.action = 1
        }

    } else {
        this.action = 1
    }
}
