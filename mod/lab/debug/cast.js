const FRAME_RATE = 15

const NONE = 0
const SELECTED = 1
const MARKING = 2
const SHOWING = 3

const selection = {
    state: 0,
    show: 0,
    sx: 0,
    sy: 0,
    ex: 0,
    ey: 0,

    area: function(inProgress) {
        if (!inProgress && this.state !== SELECTED) {
            return [0, 0, rx(1), ry(1)]
        }

        const area = []
        if (this.sx > this.ex) {
            area[0] = this.ex
            area[2] = this.sx - this.ex
        } else {
            area[0] = this.sx
            area[2] = this.ex - this.sx
        }
        if (this.sy > this.ey) {
            area[1] = this.ey
            area[3] = this.sy - this.ey
        } else {
            area[1] = this.sy
            area[3] = this.ey - this.sy
        }
        return area
    },

    imageData: function() {
        if (this.state !== SELECTED) return
        const a = this.area()
        const idata = ctx.getImageData(a[0], a[1], a[2], a[3])
        return idata
    },

    dump: function() {
        const a = this.area()
        log('selection: ' + a[0] + 'x' + a[1]
            + ' [' + a[2] + ', ' + a[3] + ']')
    },
}

const png = {
    started: false,
    id: 0,
    frame: 0,
    frameTime: 0,
}

const gif = {
    started: false,
}

function processCast(dt) {
    png.frameTime -= dt

    if (png.frameTime < 0) {
        png.frameTime = 1/FRAME_RATE

        const a = selection.area()
        lib.img.screenshotArea('cast-'
            + png.id + '.' + png.frame++,
            a[0], a[1], a[2], a[3])
    }
}

function processGif(dt) {
    gif.frameTime -= dt

    if (gif.frameTime < 0) {
        gif.frame++

        log('frame: ' + gif.frame)

        gif.frameTime = gif.delayS

        const a = selection.area()
        const idata = ctx.getImageData(
            a[0], a[1], a[2], a[3])

        gif.composer.addFrame(idata, {
            delay: gif.delayMS
        })
    }
}

const cast = {

    enabled: false,

    startSelection: function(x, y) {
        if (!this.enabled) return
        selection.sx = x
        selection.sy = y
        selection.state = MARKING
    },

    closeSelection: function(x, y) {
        if (!this.enabled) return

        selection.ex = x
        selection.ey = y

        if (selection.state === MARKING) {
            selection.state = SHOWING
            selection.show = 2
        }

        if (selection.sx === selection.ex
                || selection.sy === selection.ey) {
            selection.state = NONE
        }

        const s = selection
    },

    startScreencast: function() {
        if (!this.enabled) return
        png.id++
        png.frame = 1
        png.frameTime = 0
        png.started = true
    },

    stopScreencast: function() {
        if (!this.enabled) return
        png.started = false
    },

    startGif: function() {
        if (!this.enabled) return
        const a = selection.area()

        gif.started = true
        gif.composer = new GIF({
            workers: 2,
            quality: 10,
            width: a[2],
            height: a[3],
        })
        gif.frame = 0
        gif.frameTime = 0
        gif.delayMS = round(1/FRAME_RATE * 1000)
        gif.delayS = gif.delayMS/1000
        log('[gif] recording...')
    },

    stopGif: function() {
        if (!this.enabled) return
        gif.started = false

        gif.composer.on('finished', function(blob) {
            log('[gif] rendering completed, size: ' + blob.size)
            const url = URL.createObjectURL(blob)
            lib.img.downloadDataURL(url, 'metro-gang', 'gif')
            //window.open(URL.createObjectURL(blob))
        })
        gif.composer.render()
        log('[gif] rendering')
    },

    evo: function(dt) {
        if (!this.enabled) {
            selection.state = NONE
            return
        }

        if (png.started) processCast(dt)
        if (gif.started) processGif(dt)

        if (selection.state === SHOWING) {
            selection.show -= dt
            if (selection.show < 0) selection.state = SELECTED
        }
    },

    draw: function() {
        if (!this.enabled) return

        if (selection.state >= MARKING) {
            if (selection.state === MARKING) {
                selection.ex = mouse.x
                selection.ey = mouse.y
                lineWidth(1)
            } else {
                lineWidth(2)
            }

            const a = selection.area(true)

            stroke('#ffff00')
            rect(a[0], a[1], a[2], a[3])
        }
    },
}
