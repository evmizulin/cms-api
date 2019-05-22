const { User, RecoverPass } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { mailer } = require('../../helpers/Mailer')
const hash = require('object-hash')
const { config } = require('../../config')
const { createRecoveryCreds } = require('./types/recoveryCreds/createRecoveryCreds')
const { generateToken } = require('./helpers/generateToken')
const { createChangePass } = require('./types/change-pass/createChangePass')

class ApiChangePass {
  async recover(creds) {
    const createdCreds = createRecoveryCreds(creds)
    const users = await User.find({ login: createdCreds.login, isVerified: true })
    if (!users.length) throw new ApiError("User doesn't exist", BAD_REQUEST)
    const recovers = await RecoverPass.find({ userId: users[0].id }, 'tokens')
    const token = generateToken()
    if (!recovers.length) {
      await RecoverPass.save({ userId: users[0].id, tokens: [token] })
    } else {
      await RecoverPass.update(recovers[0].id, { tokens: [...recovers[0].tokens, token] })
    }
    await mailer.send('recover-pass', {
      to: users[0].login,
      props: {
        link: `${config.appUrl}/change-pass/${token}`,
      },
    })
  }

  async changePass(creds) {
    const createdCreds = createChangePass(creds)
    const recovers = await RecoverPass.find({ tokens: creds.recoveryToken })
    if (!recovers.length) throw new ApiError('Unvalid recovery token', BAD_REQUEST)
    await User.update(recovers[0].userId, { passHash: hash(createdCreds.password) })
    await RecoverPass.remove(recovers[0].id)
  }
}

module.exports = { apiChangePass: new ApiChangePass() }
