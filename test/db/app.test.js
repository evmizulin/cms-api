/*global describe, it*/

const { App, Client, ClientPermission } = require('../../src/services/db/Db')
const assert = require('assert')
const randomstring = require('randomstring')
const { getDefaultClientPermissions } = require('../../src/helpers/getDefaultClientPermissions')

describe('App', () => {
  it('Create', async () => {
    const app = await App.insert({
      name: randomstring.generate(),
    })
    const client = await Client.findOne({ clientSourceId: app.id })
    const clientPermission = await ClientPermission.findOne({ clientId: client.id })

    await App.remove(app.id)

    {
      const { id, type, clientSourceId, ...rest } = client
      assert.equal(type, 'app')
      assert.deepEqual(rest, {})
    }

    {
      const { id, clientId, ...rest } = clientPermission
      assert.deepEqual(rest, getDefaultClientPermissions('app'))
    }
  })
})
