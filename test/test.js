/*global describe, after, before*/

const { connection } = require('../src/services/db/tables')
const assert = require('assert')

const getDocsAmount = async () => {
  let res = 0
  for (let key in connection.models) {
    const amount = await connection.models[key].countDocuments()
    res = amount + res
  }
  return res
}
let beforeDocsAmount

describe('All tests', () => {
  before(async () => {
    beforeDocsAmount = await getDocsAmount()
  })

  describe('Index', () => {
    require('./get-not-found.test')
    require('./get-say-hello.test')
  })

  describe('Projects', () => {
    require('./projects/all-projects-id.test')
    require('./projects/get-projects.test')
    require('./projects/get-projects-image.test')
    require('./projects/post-projects.test')
    require('./projects/put-projects.test')
    require('./projects/delete-projects.test')
  })

  describe('Registration', () => {
    require('./registration/post-users.test')
    require('./registration/post-email-token.test')
  })

  after(async () => {
    const afterDocsAmount = await getDocsAmount()
    connection.close()
    assert.equal(beforeDocsAmount, afterDocsAmount)
  })
})
