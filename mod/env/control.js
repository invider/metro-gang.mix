const control = {
    player: [],

    move: function(player, action) {
        if (!this.player[player]) {
            // active new player
            this.player[player] = {
                active: true,
                lastTime: env.time,
            }
        }
        this.player[player][action] = true
    },

    stop: function(player, action) {
        if (!this.player[player]) return
        this.player[player][action] = false

        this.player[player].active = true
        this.player[player].lastTime = env.time
    },

    any: function(p) {
        const c = this.player[p]
        if (!c) return false

        let actionFlag = false

        Object.keys(c).forEach(k => {
            // TODO - that screams for refactoring!
            if (k === 'active' || k === 'lastTime') return
            if (c[k]) actionFlag = true
        })

        return actionFlag
    },

}
