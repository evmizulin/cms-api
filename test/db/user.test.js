/*global describe, it*/

const { User, Client, ClientPermission } = require('../../src/services/db/Db')
const hash = require('object-hash')
const assert = require('assert')
const randomstring = require('randomstring')

describe('User', () => {
  it('Create', async () => {
    const user = await User.insert({
      login: randomstring.generate(),
      passHash: hash(randomstring.generate()),
      isVerified: true,
    })
    const client = await Client.findOne({ clientSourceId: user.id })
    const clientPermission = await ClientPermission.findOne({ clientId: client.id })

    await User.remove(user.id)

    {
      const { id, type, clientSourceId, ...rest } = client
      assert.equal(type, 'user')
      assert.deepEqual(rest, {})
    }

    {
      const entities = ['project', 'apiToken']
      const actions = ['Create', 'Read', 'Update', 'Delete']
      const { id, clientId, ...rest } = clientPermission
      entities.forEach(entity => {
        actions.forEach(action => {
          assert.equal(rest[`${entity}${action}`], true)
          delete rest[`${entity}${action}`]
        })
      })
      assert.deepEqual(rest, {})
    }
  })
})
