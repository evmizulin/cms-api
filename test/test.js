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

  describe('Db', async () => {
    require('./db/user.test')
    require('./db/app.test')
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

  describe('Auth', () => {
    require('./auth/all-extract-client-id.test')
    require('./auth/all-check-client-permission.test')
    require('./auth/all-extract-projects-id.test')
    require('./auth/all-project-permissions.test')
  })

  describe('ApiTokens', () => {
    require('./api-tokens/all-app-id.test')
    require('./api-tokens/all-app-permissions.test')
    require('./api-tokens/post-api-tokens.test')
    require('./api-tokens/get-api-tokens.test')
    require('./api-tokens/put-api-tokens.test')
    require('./api-tokens/delete-api-tokens.test')
  })

  describe('Projects', () => {
    require('./projects/get-projects.test')
    require('./projects/get-projects-image.test')
    require('./projects/post-projects.test')
    require('./projects/put-projects.test')
    require('./projects/delete-projects.test')
  })

  describe('Password recovery', () => {
    require('./password-recovery/post-password-recovery.test')
    require('./password-recovery/post-confirmation.test')
  })

  describe('User', () => {
    require('./users/all-user-id.test')
    require('./users/all-user-id-permissions.test')
    require('./users/get-users.test')
    require('./users/post-user.test')
    require('./users/get-users-of-project.test')
    require('./users/delete-user-of-project.test')
    require('./users/get-user-permissions.test')
    require('./users/put-user-permisions.test')
  })

  describe('Files', () => {
    require('./files/post-file.test')
  })

  after(async () => {
    const afterDocsAmount = await getDocsAmount()
    connection.close()
    assert.deepEqual(beforeDocsAmount, afterDocsAmount)
  })
})
