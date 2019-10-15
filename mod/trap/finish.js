function finish(e) {
    const station = e.station

    log('fight is finished at ' + station.name)

    env.control.resetAll()

    const topGangs = lab.score.findWinner()
    console.dir(topGangs)

    if (!station.gang || topGangs.gang.id !== station.gang.id) {
        // transfer control!
        const gang = topGangs.gang
        log(gang.name + ' captured the station!')

        const gangColor = gang.color()
        lab.title.show(gang.name
            + ' captured ' + e.station.name, 3, gangColor)

        station.gang = gang
        station.mobs = RND(1, 4)

        gang.cashIn(topGangs.sum)
        gang.mobs ++
    }

    lab.metro.show()
}
