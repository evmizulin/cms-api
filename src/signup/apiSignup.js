const hash = require('object-hash')
const { BAD_REQUEST } = require('http-status-codes')
const { ApiError } = require('../helpers/ApiError')
const { User } = require('../services/db/Db')
const { createUser } = require('./createUser')
const { mailer } = require('../services/mailer/Mailer')
const { config } = require('../config')
const { encrypter } = require('../services/Encrypter')
const { createEmailToken } = require('./createEmailToken')

class ApiSignup {
  /*
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
  */
  async signup(user) {
    const createdUser = createUser({ user })
    const verifiedUser = await User.findOne({ login: createdUser.login, isVerified: true }, { _id: true })
    if (verifiedUser) throw new ApiError(BAD_REQUEST, 'User with that email already exists')
    const unverifiedUser = await User.findOne({ login: createdUser.login, isVerified: false }, { _id: true })
    if (unverifiedUser) {
      await User.update(unverifiedUser.id, { passHash: hash(createdUser.password) })
    } else {
      await User.insert({
        login: createdUser.login,
        passHash: hash(createdUser.password),
        isVerified: false,
      })
    }
    await mailer.send({
      to: createdUser.login,
      templateName: 'email-confirm',
      templateProps: {
        link: `${config.appUrl}/signup/confirmation/${encrypter.encrypt(createdUser.login)}`,
      },
    })
  }
  /*
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
  */

  async confirmation(token) {
    const createdToken = createEmailToken({ token })
    let login
    try {
      login = encrypter.decrypt(createdToken.confirmationToken)
    } catch (err) {
      throw new ApiError(BAD_REQUEST, 'Unvalid confirmation token')
    }
    const user = await User.findOne({ login }, '_id')
    if (!user) throw new ApiError(BAD_REQUEST, 'Unvalid confirmation token')
    await User.update(user.id, { isVerified: true })
  }
}

module.exports = { apiSignup: new ApiSignup() }
