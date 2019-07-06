const { createCreds } = require('./createCreds')
const { User, AccessToken, Client } = require('../services/db/Db')
const hash = require('object-hash')
const { ApiError } = require('../helpers/ApiError')
const { BAD_REQUEST } = require('http-status-codes')
const { generateToken } = require('./generateToken')

class ApiLogin {
  async login(creds) {
    const createdCreds = createCreds({ creds })
    const user = await User.findOne({
      login: createdCreds.login,
      passHash: hash(createdCreds.password),
      isVerified: true,
    })
    if (!user) throw new ApiError(BAD_REQUEST, 'Invalid username or password')
    const client = await Client.findOne({ type: 'user', clientSourceId: user.id }, { _id: true })
    const token = await AccessToken.insert({
      clientId: client.id,
      token: generateToken(),
    })
    return token.token
  }
}

module.exports = { apiLogin: new ApiLogin() }
