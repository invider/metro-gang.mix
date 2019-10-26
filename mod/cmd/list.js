function list() {
    lab.street._ls.forEach(e => {
        if (!e.bro) return
        log(e.name)
    })
}

list.info = 'list all bros on the street'
