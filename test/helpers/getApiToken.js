const { App, Client, AccessToken } = require('../../src/services/db/Db')
const randomstring = require('randomstring')

const getApiToken = async () => {
  const app = await App.insert({
    name: randomstring.generate(10),
  })
  const client = await Client.findOne({ type: 'app', clientSourceId: app.id })
  const accessToken = await AccessToken.insert({ clientId: client.id, token: randomstring.generate(10) })
  return {
    remove: async () => {
      await App.remove(app.id)
      await AccessToken.remove(accessToken.id)
    },
    app,
    client,
    accessToken,
  }
}

module.exports = { getApiToken }
