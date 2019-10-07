function evo(dt) {

    lab.collide((e, t) => {
        if (e.solid && t.solid) {
            const hit = e.isHitting(t)
            if (hit) {
                t.hit(hit)
            }
        }
    })
}
