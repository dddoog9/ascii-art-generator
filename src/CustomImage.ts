class CustomImage extends EventTarget {
  private _img: HTMLImageElement
  private _width = 0
  private _height = 0

  private _imgBuffer: Uint8ClampedArray | null = null

  private _canvasElem: HTMLCanvasElement
  private _canvasCx: CanvasRenderingContext2D

  constructor(src?: string) {
    super()

    this._img = new Image()
    this._img.crossOrigin = 'anonymous'
    if (src !== undefined) {
      this._img.src = src
    }

    let canvas = document.createElement('canvas')
    let cx = canvas.getContext('2d', {willReadFrequently: true})

    if (cx === null) { throw new Error('canvas cx is null') }

    this._canvasElem = canvas
    this._canvasCx = cx

    this._img.addEventListener('load', () => {
      this._width = this._img.width
      this._height = this._img.height

      this._makeImgBuffer()
      this.dispatchEvent(new Event('load'))
    })

    this._img.addEventListener('error', () => {
      let errEvent = new ErrorEvent('error')
      this.dispatchEvent(errEvent)
    })
  }

  public _makeImgBuffer() {
    let width = this._width
    let height = this._height

    this._canvasElem.width = width
    this._canvasElem.height = height

    if (width !== 0 && height !== 0) {
      this._canvasCx.drawImage(this._img, 0, 0, width, height)
      this._imgBuffer = this._canvasCx.getImageData(0, 0, width, height).data
    } else {
      this._imgBuffer = null
    }
  }

  redraw() {
    this._makeImgBuffer()
    return this
  }

  grayscale() {
    let buff = this._imgBuffer

    if (buff !== null) {
      for (let i = 0; i < buff.length; i += 4) {
        let average = (buff[i] + buff[i+1] + buff[i+2])/3

        buff[i] = average
        buff[i+1] = average
        buff[i+2] = average
      }
    }

    return this
  }

  updateCanvasSurf() {
    let buff = this._imgBuffer

    if (buff !== null) {
      let imgData = new ImageData(buff, this._width, this._height)

      this._canvasCx.putImageData(imgData, 0, 0)
    }

    return this
  }

  get img() { return this._img }
  get src() { return this._img.src }
  get buffer() { return this._imgBuffer }
  get canvas() { return this._canvasElem }
  get canvasCx() { return this._canvasCx }
  get width() { return this._width }
  get height() { return this._height }

  set src(value: string) { this._img.src = value }

  set width(value: number) {
    this._width = value
    this._makeImgBuffer()
    this.dispatchEvent(new Event('resize'))
  }

  set height(value: number) {
    this._height = value
    this._makeImgBuffer()
    this.dispatchEvent(new Event('resize'))
  }
}

export {CustomImage}
