function checkGameOver() {

    let gang = 0
    lab.metro.forEachStation(s => {
        if (gang === 0) gang = s.gang.id
        else if (s.gang.id !== gang) gang = -1
    })

    if (gang > 0) trap('gameover', gang)
}
