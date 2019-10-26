module.exports = function(args) {
    const i = parseInt(args[1])

    if (args[1] === 'all') {
        lab.fight.markAllDead()
    } else if (!isNaN(i)) {
        lab.street._ls.forEach(b => {
            if (b.bro && b.gang === i) {
                b.dead = true
            }
        })
    } else {
        lab.street._ls.forEach(b => {
            if (b.bro && b.name === args[1]) {
                b.dead = true
            }
        })
    }
}
