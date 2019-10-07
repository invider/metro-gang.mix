function street(e) {
    log('gang #' + e.gang.id + ' hopping out at ' + e.station.name)

    lab.metro.hide()
    lab.fight.begin(e.station, e.gang)

    // show station name
    let gangColor
    if (e.station.gang) {
        gangColor = e.station.gang.color()
        /*
        if (s.gang.mobs > 0) {
            suffix = ' - ' + s.gang.mobs
        }
        */
    } else {
        gangColor = env.style.gang[0]
    }

    lab.title.show(e.station.name, 3, gangColor)
}
