function split(res) {
    if (res.finish.owner === 0) return

    const winner = res.finish.owner
    const station = res.finish.station

    station.mobs = res.finish.split
    winner.mobIn(-res.finish.split)

    if (env.config.debug) {
        log('leaving ' + res.finish.split + ' bros @' + station.name + ' for ' + winner.name)
    }
}
