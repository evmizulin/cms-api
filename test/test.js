/*global describe, after, before*/

const { connection } = require('../src/services/db/tables')
const assert = require('assert')

const getDocsAmount = async () => {
  let res = { amount: 0 }
  for (let key in connection.models) {
    const amount = await connection.models[key].countDocuments()
    res[key] = amount
    res.amount = amount + res.amount
  }
  return res
}
let beforeDocsAmount

describe('All tests', () => {
  before(async () => {
    beforeDocsAmount = await getDocsAmount()
  })

  describe('Index', async () => {
    require('./get-not-found.test')
    require('./get-say-hello.test')
  })

  describe('Signup', () => {
    require('./signup/post-signup.test')
    require('./signup/post-confirmation.test')
  })

  describe('Signin', () => {
    require('./signin/post-signin.test')
  })

  describe('Projects', () => {
    require('./projects/all-client-id.test')
    require('./projects/all-projects-id.test')
    require('./projects/all-project-permissions.test')
    require('./projects/get-projects.test')
    require('./projects/get-projects-image.test')
    require('./projects/post-projects.test')
    require('./projects/put-projects.test')
    require('./projects/delete-projects.test')
  })

  after(async () => {
    const afterDocsAmount = await getDocsAmount()
    connection.close()
    assert.deepEqual(beforeDocsAmount, afterDocsAmount)
  })
})