/*global describe, after*/

const { connection } = require('../src/services/db/tables')

describe('All tests', () => {
  describe('Index', () => {
    require('./get-not-found.test')
    require('./get-say-hello.test')
  })

  describe('Projects', () => {
    require('./projects/get-projects.test')
    require('./projects/get-project-image')
    require('./projects/post-projects.test')
    require('./projects/put-projects.test')
    require('./projects/delete-projects.test')
  })

  after(async () => {
    connection.close()
  })
})
