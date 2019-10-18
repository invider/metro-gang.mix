// @depends(dna/bot/Walker)
const Walker = dna.bot.Walker

function Idle() {}
sys.extend(Idle, Walker)

Idle.prototype.init = function(bro) {
    Walker.prototype.init.call(this, bro)
    bro.player = 0
}

Idle.prototype.evo = function(dt) {
    if (this.bro.dead) return

    if (this.action) {
        this.follow() 
        this.timeout -= dt
        if (this.timeout < 0) this.action = 0
    } else {
        this.action = 1
    }
}
