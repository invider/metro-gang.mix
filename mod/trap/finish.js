function finish(e) {
    const station = e.station
    const gang = e.gang

    log('fight is finished at ' + station.name)

    env.control.resetAll()

    const winner = lab.score.findWinner()
    console.dir(winner)

    if (!station.gang || winner.gang.id !== station.gang.id) {
        // transfer control!
        log(gang.name + ' captured the station!')

        const gangColor = winner.gang.color()
        lab.title.show(gang.name
            + ' captured ' + e.station.name, 3, gangColor)

        station.gang = winner.gang
        station.mobs = RND(1, 4)

        winner.gang.cashIn(winner.sum)
        winner.gang.mobs ++
    }

    lab.metro.show()
}
