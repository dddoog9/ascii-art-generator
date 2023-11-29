import './style.css'

import {ASCIIGenerator} from './ASCIIGenerator'

/* generator vars */
let width = 0
let height = 0
let wAspect = 1
let hAspect = 1
let asciiGenerator = new ASCIIGenerator()
let grayscale = false
let zoom = 0.5
let fileLoaded = false

/* DOM elemets*/
let $preview = document.getElementById('preview') as HTMLDivElement
let $imgWidth = document.getElementById('img-width') as HTMLInputElement
let $imgHeight = document.getElementById('img-height') as HTMLInputElement
let $imgAspect = document.getElementById('img-aspect') as HTMLInputElement
let $imgGrayscale = document.getElementById('img-grayscale') as HTMLInputElement
let $imgUpload = document.getElementById('img-upload') as HTMLInputElement
let $asciiSurf = document.getElementById('ascii-surf') as HTMLParagraphElement
let $asciiScale = document.getElementById('ascii-scale') as HTMLInputElement
let $asciiChars = document.getElementById('ascii-chars') as HTMLInputElement
let $notifi = document.getElementById('notifi') as HTMLDivElement

let notifiTypes = [
  'error',
]

$preview.appendChild(asciiGenerator.canvas)

$asciiScale.value = String(zoom*100)

$asciiSurf.style.transform = 'scale('+zoom+')'

$asciiChars.value = asciiGenerator.asciiChars

function addNotifi(txt: string, typeId: number, time?: number) {
  let el = document.createElement('div')

  el.classList.add(notifiTypes[typeId])
  el.innerHTML = txt

  $notifi.appendChild(el)

  if (time !== undefined) {
    setTimeout(() => {
      el.remove()
    }, time)
  }
}

function generateAscii() {
  asciiGenerator.generate(false)

  if (grayscale) {
    asciiGenerator.updateCanvasSurf()
  }
}

function update() {
  asciiGenerator.width = width
  asciiGenerator.height = height

  generateAscii()

  $asciiSurf.innerHTML = asciiGenerator.asciiStr
}

/* events */
asciiGenerator.addEventListener('load', () => {
  width = asciiGenerator.width
  height = asciiGenerator.height

  if ($imgAspect.checked && width !== 0 && height !== 0) {
    wAspect = width/height
    hAspect = height/width
  }

  $imgWidth.value = String(width)
  $imgHeight.value = String(height)

  generateAscii()

  $asciiSurf.innerHTML = asciiGenerator.asciiStr
})

asciiGenerator.addEventListener('error', () => {
  if (fileLoaded) {
    addNotifi('Unknown error', 0, 3500)
  }
})

$imgWidth.addEventListener('input', () => {
  if ($imgAspect.checked) {
    width = Number($imgWidth.value)
    height = Math.round(hAspect*width)

    $imgHeight.value = String(height)
  } else {
    width = Number($imgWidth.value)
  }

  update()
})

$imgWidth.addEventListener('change', () => {
  if ($imgWidth.value === '') {
    $imgWidth.value = '0'
  }
})

$imgHeight.addEventListener('input', () => {
  if ($imgAspect.checked) {
    height = Number($imgHeight.value)
    width = Math.round(wAspect*height)

    $imgWidth.value = String(width)
  } else {
    height = Number($imgHeight.value)
  }

  update()
})

$imgHeight.addEventListener('change', () => {
  if ($imgHeight.value === '') {
    $imgHeight.value = '0'
  }
})

$imgAspect.addEventListener('change', () => {
  if (width !== 0 && height !== 0) {
    wAspect = width/height
    hAspect = height/width
  }
})

$imgGrayscale.addEventListener('change', () => {
  grayscale = $imgGrayscale.checked

  update()
})

$imgUpload.addEventListener('change', () => {
  let files = $imgUpload.files

  if (files && files[0]) {
    asciiGenerator.src = URL.createObjectURL(files[0])

    fileLoaded = true
  } else {
    fileLoaded = false
  }
})

$asciiScale.addEventListener('input', () => {
  zoom = Number($asciiScale.value)/100

  $asciiSurf.style.transform = 'scale('+zoom+')'
})

$asciiScale.addEventListener('change', () => {
  if ($asciiScale.value === '') {
    $asciiScale.value = '0'
  }
})

$asciiChars.addEventListener('input', () => {
  asciiGenerator.asciiChars = $asciiChars.value

  update()
})
