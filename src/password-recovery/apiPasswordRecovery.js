const { User, PasswordRecoveryToken } = require('../services/db/Db')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { mailer } = require('../services/mailer/Mailer')
const hash = require('object-hash')
const { config } = require('../config')
const { generateToken } = require('../helpers/generateToken')
const { createPasswordRecovery } = require('./createPasswordRecovery')
const { createConfirmation } = require('./createConfirmation')

class ApiPasswordRecovery {
  async postPasswordRecovery(creds) {
    const createdCreds = createPasswordRecovery(creds)
    const user = await User.findOne({ login: createdCreds.login, isVerified: true }, { login: true })
    if (!user) throw new ApiError(BAD_REQUEST, "User doesn't exist")
    const recoveryToken = await PasswordRecoveryToken.insert({ userId: user.id, token: generateToken() })
    await mailer.send({
      to: user.login,
      templateName: 'recover-pass',
      templateProps: {
        link: `${config.appUrl}/password-recovery/confirmation/${recoveryToken.token}`,
      },
    })
  }

  async postPasswordRecoveryConfirmation(creds) {
    const createdCreds = createConfirmation(creds)
    const recoveryToken = await PasswordRecoveryToken.findOne({ token: createdCreds.token }, { userId: true })
    if (!recoveryToken) throw new ApiError(BAD_REQUEST, 'Unvalid recovery token')
    await User.update(recoveryToken.userId, { passHash: hash(createdCreds.password) })
    const recoveryTokens = await PasswordRecoveryToken.find({ userId: recoveryToken.userId }, { _id: true })
    const promises = recoveryTokens.map(token => PasswordRecoveryToken.remove(token.id))
    await Promise.all(promises)
  }
}

module.exports = { apiPasswordRecovery: new ApiPasswordRecovery() }
