const { User, Client, AccessToken } = require('../../src/services/db/Db')
const randomstring = require('randomstring')
const hash = require('object-hash')

const getAuth = async () => {
  const pass = randomstring.generate(10)
  const user = await User.insert({
    login: randomstring.generate(10),
    passHash: hash(pass),
    isVerified: true,
  })
  user.pass = pass
  const client = await Client.findOne({ type: 'user', clientSourceId: user.id })
  const accessToken = await AccessToken.insert({ clientId: client.id, token: randomstring.generate(10) })
  return {
    remove: async () => {
      await User.remove(user.id)
      await AccessToken.remove(accessToken.id)
    },
    user,
    client,
    accessToken,
  }
}

module.exports = { getAuth }
