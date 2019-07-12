const crypto = require('crypto')
const { EncryptionKey } = require('./db/Db')
const randomstring = require('randomstring')

const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

class Encrypter {
  constructor() {
    EncryptionKey.findOne().then(key => {
      if (!key) {
        this.encryptionKey = randomstring.generate(32)
        EncryptionKey.insert({ key: this.encryptionKey })
      } else {
        this.encryptionKey = key.key
      }
    })
  }

  encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv(ALGORITHM, new Buffer(this.encryptionKey), iv)
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString('hex') + '_' + encrypted.toString('hex')
  }

  decrypt(text) {
    let textParts = text.split('_')
    let iv = new Buffer(textParts.shift(), 'hex')
    let encryptedText = new Buffer(textParts.join('_'), 'hex')
    let decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(this.encryptionKey), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  }
}

module.exports = { encrypter: new Encrypter() }