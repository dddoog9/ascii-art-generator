import {CustomImage} from './CustomImage'

class ASCIIGenerator extends CustomImage {
  private _asciiStr = ''
  private _asciiChars = '@QB#NgWM8RDHdOKq9$6khEPXwmeZaoS2yjufF]}{tx1zv7lciL/\\|?*>r^;:_\"~,\'.-`'

  constructor(src: string = '') {
    super(src)
  }

  private _pixelsToAscii() {
    let buff = this.buffer

    this._asciiStr = ''
    if (buff === null) return

    let asciiChars = this._asciiChars

    for (let i = 0; i < buff.length; i += 4) {
      let char = Math.round(asciiChars.length/255*buff[i])

      char = Math.max(char, 0)
      char = Math.min(char, asciiChars.length-1)

      this._asciiStr += asciiChars.charAt(char)
    }
  }

  private _insertNewlineChars() {
    if (this.buffer === null) return
    let asciiArr = []

    let asciiStr = this._asciiStr
    let width = this.width
    let len = asciiStr.length

    for (let i = 0; i < len; i += width) {
      asciiArr.push(asciiStr.slice(i, i+width))
    }

    this._asciiStr = asciiArr.join('\n')
  }

  generate(redraw=true) {
    if (redraw) {
      this.redraw()
    }

    this.grayscale()
    this._pixelsToAscii()
    this._insertNewlineChars()

    return this
  }

  get asciiStr() { return this._asciiStr }
  get asciiChars() { return this._asciiChars }

  set asciiChars(value: string) { this._asciiChars = value }
}

export {ASCIIGenerator}
