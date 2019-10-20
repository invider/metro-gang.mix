// @depends(dna/bot/Walker)
const Walker = dna.bot.Walker

function Fighter() {}
sys.extend(Fighter, Walker)

Fighter.prototype.evo = function(dt) {

    if (this.action) {
        this.follow() 
        this.timeout -= dt
        if (this.timeout <= 0) this.action = 0

    } else {

        // select next one
        // check the enemy in front?
        const enemy = this.bro.closestEnemy()
        const enemyDist = this.bro.dist(enemy)

        if (enemy && enemyDist < rx(.2)) {
            this.timeout = rnd(0.5, 2)
            if (this.bro.dir === 0) this.action = 9
            else this.action = 10
        } else if (enemy && enemyDist > rx(.2) && enemyDist < rx(.5)) {
            this.timeout = rnd(0.5)
            if (this.bro.dir === 0) this.action = 7
            else this.action = 8
        } else {
            this.action = RND(1, 10)
            this.timeout = rnd(1, 3)
        }
        log(this.bro.name + ' from #' + this.bro.gang + ' new action: ' + this.action)

    }
}

