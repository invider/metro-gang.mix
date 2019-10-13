function rgbComponents(c) {
    if (c.startsWith('#')) c = c.substring(1)
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    return [r, g, b]
}

function mapColor(img, s, t) {
    if (!img) return

    const canvas = document.createElement('canvas')
    const c = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    c.drawImage(img, 0, 0)

    const idata = c.getImageData(0, 0, img.width, img.height)
    const d = idata.data

    for (let i = 0; i < d.length; i += 4) {
        if (d[i] === s[0] && d[i+1] === s[1] && d[i+2] === s[2]) {
            d[i] = t[0]
            d[i+1] = t[1]
            d[i+2] = t[2]
        }
    }
    c.putImageData(idata, 0, 0)
    const fixedImage = new Image()
    fixedImage.src = canvas.toDataURL()
    return fixedImage
}

function makeShaddow(img, s) {
    if (!img) return

    const canvas = document.createElement('canvas')
    const c = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    c.drawImage(img, 0, 0)

    const idata = c.getImageData(0, 0, img.width, img.height)
    const d = idata.data

    for (let i = 0; i < d.length; i += 4) {
        if (d[i] === s[0] && d[i+1] === s[1] && d[i+2] === s[2]) {
            // darken
            d[i] = 0
            d[i+1] = 0
            d[i+2] = 0
        } else {
            // make transparent
            d[i] = 0
            d[i+1] = 0
            d[i+2] = 0
            d[i+3] = 0
        }
    }
    c.putImageData(idata, 0, 0)
    const fixedImage = new Image()
    fixedImage.src = canvas.toDataURL()
    return fixedImage
}

function remapSprites() {
    res.gang = []
    res.player = []

    for (let gang = 0; gang < env.style.gang.length; gang++) {
        const color = lib.util.rgbComponents(env.style.gang[gang])
        res.gang[gang] = []
        res.player[gang] = []

        for (let i = 0; i < res.dude.length; i++) {
            const img = this.mapColor(res.dude[i], [255, 0, 0], color)
            res.gang[gang][i] = img
        }
        for (let i = 0; i < res.hero.length; i++) {
            const img = this.mapColor(res.hero[i], [255, 0, 0], color)
            res.player[gang][i] = img
        }
    }

    res.shaddow = []
    for (let i = 0; i < res.dude.length; i++) {
        const img = this.makeShaddow(res.dude[i], [36, 58, 92])
        res.shaddow[i] = img
    }
}

function lim(val, delta, target) {
    if (val < target) {
        val += delta
        if (val > target) val = target
        return val

    } else if (val > target) {
        val -= delta
        if (val < target) val = target
        return val
    }
    return target
}

function touch(s, t) {
    return (s[0] + s[2] >= t[0] && s[0] <= t[0] + t[2]
          && s[1] + s[3] >= t[1] && s[1] <= t[1] + t[3]);
}


