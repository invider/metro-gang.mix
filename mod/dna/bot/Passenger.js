
// @depends(dna/bot/Walker)
const Walker = dna.bot.Walker

function Passenger() {
    this.state = 0
}
sys.extend(Passenger, Walker)

Passenger.prototype.init = function(bro) {
    Walker.prototype.init.call(this, bro)
    bro.bounded = false
    this.action = 3
    this.timeout = rnd(0.5, 1.5)
}

Passenger.prototype.runAway = function() {
    this.action = 2
    this.timeout = 5
}

Passenger.prototype.evo = function(dt) {

    if (this.action) {
        this.follow() 
        this.timeout -= dt
        if (this.timeout < 0) this.action = 0

    } else {
        // select next one
        if (this.state === 0) {
            this.state = 1
            this.action = 1
            this.bro.state = 9
            this.bro.setCycle(9)
        }
    }
}


