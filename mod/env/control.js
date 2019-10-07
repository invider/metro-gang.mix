const control = {
    player: [],

    move: function(player, action) {
        if (!this.player[player]) {
            // active new player
            this.player[player] = {}
        }
        this.player[player][action] = true
    },

    stop: function(player, action) {
        if (!this.player[player]) return
        this.player[player][action] = false
    },

}
