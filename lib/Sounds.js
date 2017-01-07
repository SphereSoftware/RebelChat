'use babel'

import path from 'path'

let instance = null
export default class Sounds {
  constructor() {
    if (instance) {
      return instance
    }

    const mediaPath = path.join(atom.packages.resolvePackagePath('RebelChat'), 'media')
    this.beepSoun = new Audio(path.join(mediaPath, 'beep.wav'))

    instance = this
    return instance
  }

  static
  beep() {
    (new Sounds()).beepSoun.play()
  }
}
