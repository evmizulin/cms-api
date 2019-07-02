const { User } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { createCreds } = require('./types/creds/createCreds')
const { mailer } = require('../../helpers/Mailer')
const { encrypter } = require('../../helpers/Encrypter')
const hash = require('object-hash')
const { config } = require('../../config')
const { createEmailConfirmCreds } = require('./types/email-confirm-creds/createEmailConfirmCreds')

class ApiRegister {
  async register(creds) {
    const createdCreds = createCreds(creds)
    const verifiedUsers = await User.find({ login: createdCreds.login, isVerified: true }, '_id')
    if (verifiedUsers.length) throw new ApiError('User with that email already exists', BAD_REQUEST)
    const unverifiedUsers = await User.find({ login: createdCreds.login, isVerified: false }, '_id')
    if (unverifiedUsers.length) {
      await User.update(unverifiedUsers[0].id, { passHash: hash(createdCreds.password) })
    } else {
      await User.save({ login: createdCreds.login, passHash: hash(createdCreds.password), isVerified: false })
    }
    await mailer.send('email-confirm', {
      to: createdCreds.login,
      props: {
        link: `${config.appUrl}/email-confirm/${encrypter.encrypt(createdCreds.login)}`,
      },
    })
  }

  async emailConfirm(creds) {
    const createdCreds = createEmailConfirmCreds(creds)
    let login
    try {
      login = encrypter.decrypt(createdCreds.activationToken)
    } catch (err) {
      throw new ApiError('Unvalid confirmation token', BAD_REQUEST)
    }
    const users = await User.find({ login }, '_id')
    if (!users.length) throw new ApiError('Unvalid confirmation token', BAD_REQUEST)
    await User.update(users[0].id, { isVerified: true })
  }
}

module.exports = { apiRegister: new ApiRegister() }
