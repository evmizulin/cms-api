const { User, AuthToken } = require('../db/Db')
const { ApiError } = require('../../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { createCreds } = require('./types/creds/createCreds')
const hash = require('object-hash')
const { generateToken } = require('./helpers/generateToken')

class ApiLogin {
  async login(creds) {
    const createdCreds = createCreds(creds)
    const users = await User.find({
      login: createdCreds.login,
      passHash: hash(creds.password),
      isVerified: true,
    })
    if (!users.length) throw new ApiError('Invalid username or password', BAD_REQUEST)
    const token = await AuthToken.save({
      userId: users[0].id,
      token: generateToken(),
    })
    return token.token
  }
}

module.exports = { apiLogin: new ApiLogin() }
