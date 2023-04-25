upload = document.getElementById('upload')
tiles = document.getElementById('tiles')
selected = document.getElementById('selected')
tile = 0
document.getElementById('draw').selected = true

upload.addEventListener('change', function() { tiles.setAttribute('src', URL.createObjectURL(upload.files[0])) })
tiles.addEventListener('load', function() {
    selected.getContext('2d').drawImage(tiles, 0, 0, 32, 32, 0, 0, 32, 32)
    selected.setAttribute('title', '0')
})

tiles.addEventListener('click', function(event) {
    mx = event.clientX - tiles.getBoundingClientRect().left
    my = event.clientY - tiles.getBoundingClientRect().top
    multi_x = []
    multi_y = []
    for (a = 0; a < (tiles.width / 32); a++) { multi_x.push(a) }
    multi_x.forEach(function(a) { if (mx > (a * 32)) { sx = a * 32 } })
    for (a = 0; a < (tiles.height / 32); a++) { multi_y.push(a) }
    multi_y.forEach(function(a) { if (my > (a * 32)) { sy = a * 32 } })
    tile = ( ((sy / 32) * (tiles.width / 32)) + (sx / 32) )
    selected.getContext('2d').drawImage(tiles, sx, sy, 32, 32, 0, 0, 32, 32)
    selected.setAttribute('title', tile)
})

document.getElementById('width').addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, '') })
document.getElementById('height').addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, '') })

document.getElementById('set').addEventListener('click', function() {
    w = document.getElementById('width').value
    h = document.getElementById('height').value
    document.getElementById('map').innerHTML = ''
    document.getElementById('map').style.height = h * 32
    if (w != 0 && h != 0) {
        for (a = 0; a < h; a++) {
            for (b = 0; b < w; b++) {
                square = document.createElement('canvas')
                square.setAttribute('width', '32')
                square.setAttribute('height', '32')
                square.setAttribute('tile', '0')
                square.setAttribute('title', '')
                square.style.border = '1px black dashed'
                square.style.position = 'absolute'
                square.style.top = (a * 32) + 'px'
                square.style.left = (b * 32) + 'px'
                square.setAttribute('id', (b + (a * w)))
                square.addEventListener('click', function() {

                    if (document.getElementById('draw').selected == true) {
                        this.getContext('2d').drawImage(selected, 0, 0, 32, 32, 0, 0, 32, 32)
                        this.setAttribute('tile', tile)
                    } else if (document.getElementById('erase').selected == true) {
                        this.getContext('2d').clearRect(0, 0, 32, 32)
                        this.setAttribute('tile', '0')
                    } else if (document.getElementById('collision').selected == true) {
                        if (this.title != 'collision') {
                            this.title = 'collision'
                            this.style.border = '2px gray solid'
                        } else {
                            this.title = ''
                            this.style.border = '1px black dashed'
                        }
                    } else if (document.getElementById('t_spawn').selected == true) {
                        if (this.title != 't_spawn') {
                            this.title = 't_spawn'
                            this.style.border = '2px red solid'
                        } else {
                            this.title = ''
                            this.style.border = '1px black dashed'
                        }
                    } else if (document.getElementById('ct_spawn').selected == true) {
                        if (this.title != 'ct_spawn') {
                            this.title = 'ct_spawn'
                            this.style.border = '2px blue solid'
                        } else {
                            this.title = ''
                            this.style.border = '1px black dashed'
                        }
                    } else if (document.getElementById('waypoint').selected == true) {
                        if (this.title != 'waypoint') {
                            this.title = 'waypoint'
                            this.style.border = '2px white solid'
                        } else {
                            this.title = ''
                            this.style.border = '1px black dashed'
                        }
                    }
                    document.getElementById('info').innerHTML = this.title
                })
                square.addEventListener('mouseover', function() {
                    document.getElementById('info').innerHTML = this.title
                })
                square.addEventListener('mouseout', function() {
                    document.getElementById('info').innerHTML = ''
                })
                document.getElementById('map').appendChild(square)
            }
        }
    }
})

document.getElementById('bg').addEventListener('click', function() {
    document.getElementById('info').innerHTML = tile
    this.setAttribute('title', tile)
})

document.getElementById('bg').addEventListener('mouseover', function() {
    document.getElementById('info').innerHTML = this.title
})

selected.addEventListener('mouseover', function() {
    document.getElementById('info').innerHTML = tile
})

document.getElementById('bg').addEventListener('mouseout', function() {
    document.getElementById('info').innerHTML = ''
})

selected.addEventListener('mouseout', function() {
    document.getElementById('info').innerHTML = ''
})

document.getElementById('save').addEventListener('click', function() {
    if (document.getElementById('map').innerHTML != '') {
        map = []
        map.push('info {')
        map.push('bg:' + document.getElementById('bg').title)
        map.push('}')
        map.push('')
        map.push('tiles {')
        for (a = 0; a < h; a++) {
            text = ''
            for (b = 0; b < w; b++) {
                id = (b + (a * w)).toString()
            if (b == w - 1) { end = '' } else { end = ',' }
                text = text + document.getElementById(id).attributes['tile'].value + end
            }
            if (text != '') { map.push(text); text = '' }
        }
        map.push('}')
        map.push('')
        map.push('collision {')
//         map limit collision
        text = '(' + 0 + ',' + 0 + '),'
        text = text + '(' + (w * 32) + ',' + 0 + '),'
        text = text + '(' + (w * 32) + ',' + (h * 32) + '),'
        text = text + '(' + 0 + ',' + (h * 32) + '),'
        text = text + '(' + 0 + ',' + 0 + ')'
        if (text != '') { map.push(text); text = '' }

        for (a = 0, b = (h * w); a < b; a++) {
            id = document.getElementById(a.toString())
            if (id.attributes['title'].value == 'collision') {
                text = '(' + parseInt(id.style.left) + ',' + parseInt(id.style.top) + '),'
                text = text + '(' + (parseInt(id.style.left) + 32) + ',' + parseInt(id.style.top) + '),'
                text = text + '(' + (parseInt(id.style.left) + 32) + ',' + (parseInt(id.style.top) + 32) + '),'
                text = text + '(' + parseInt(id.style.left) + ',' + (parseInt(id.style.top) + 32) + '),'
                text = text + '(' + parseInt(id.style.left) + ',' + parseInt(id.style.top) + ')'
                if (text != '') { map.push(text); text = '' }
            }
        }
        map.push('}')
        map.push('')
        map.push('spawns {')
        for (a = 0, b = (h * w); a < b; a++) {
            id = document.getElementById(a.toString())
            if (id.attributes['title'].value == 't_spawn') {
                text = '(1,' + (parseInt(id.style.left) + 16) + ',' + (parseInt(id.style.top) + 16) + ')'
            }
            if (text != '') { map.push(text); text = '' }
            if (id.attributes['title'].value == 'ct_spawn') {
                text = '(0,' + (parseInt(id.style.left) + 16) + ',' + (parseInt(id.style.top) + 16) + ')'
            }
            if (text != '') { map.push(text); text = '' }
        }
//             if (id.attributes['title'].value == 't_spawn') {
//                 text = text + '(1,' + (parseInt(id.style.left) + 16) + ',' + (parseInt(id.style.top) + 16) + end
//             }
//             if (id.attributes['title'].value == 'ct_spawn') {
//                 text = text + '(0,' + (parseInt(id.style.left) + 16) + ',' + (parseInt(id.style.top) + 16) + end
//             }
//         }
//         if (text != '') { map.push(text) }
        text = ''
        map.push('}')
        map.push('')
        map.push('waypoints {')
        for (a = 0, b = (h * w); a < b; a++) {
            id = document.getElementById(a.toString())
            if (id.attributes['title'].value == 'waypoint') {
                text = '(' + (parseInt(id.style.left) + 16) + ',' + (parseInt(id.style.top) + 16) + ')'
            }
            if (text != '') { map.push(text); text = '' }
        }
        map.push('}')
        console.log(map.join('\n'))
        k = document.createElement('a')
        k.setAttribute('href', window.URL.createObjectURL(new Blob([map.join('\n')], {type: 'text/txt'})))
        k.setAttribute('download', 'map.txt')
        k.click()
    }
})
