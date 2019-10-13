function cash() {
    lab.street._ls.forEach(e => {
        if (!e.bro) return
        e.cash += 2
        log(e.name + ' - $' + e.cash)
    })
}
