function finish(e) {
    env.state = 'stat'
    const station = e.station
    const res = e.result

    log('fight is finished at ' + station.name)
    console.dir(res)

    env.control.resetAll()

    //const topGangs = lab.score.findWinner()
    //console.dir(topGangs)
    //
    /*
    if (e.result.diff.newOwner >= 0) {
        // transfer control!
        const gang = lab.gang[res.diff.newOwner]
        log(gang.name + ' captured the station!')

        const gangColor = gang.color()
        lab.title.show(gang.name
            + ' captured ' + e.station.name, 3, gangColor)
    }
    */

    lab.stat.show(res, 7, () => {
        lab.fight.markAllDead()
        lab.metro.show()
    })
}
