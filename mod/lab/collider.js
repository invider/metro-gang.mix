function evo(dt) {

    // fix cam position
    lab.street.x = rx(.5)
    lab.street.y = -ry(env.style.groundLevel)
    lab.street.x1 = rx(.05)
    lab.street.x2 = rx(.95)

    lab.street.collide((e, t) => {
        if (e._hittable && t._hittable) {
            const hit = e.isHitting(t)
            if (hit) {
                t.hit(hit)
            }
        } else if (e._touchable) {
            e.touch(t)
        }
    })
}
