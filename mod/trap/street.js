function street(e) {
    log('hopping out at ' + e.station.name)

    lab.metro.hide()
    lab.fight.begin(e.station, e.queue)

    /*
    // show station name
    let gangColor
    if (e.station.gang) {
        gangColor = e.station.gang.color()
    } else {
        gangColor = env.style.gang[0]
    }

    lab.title.show(e.station.name, 3, gangColor)
    */
}
