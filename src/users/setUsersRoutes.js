const cors = require('cors')
const { allowAll } = require('../helpers/corsSettings')
const { extractClientId } = require('../auth/extractClientId')
const { checkClientPermission } = require('../auth/checkClientPermission')
const { apiUsers } = require('./apiUsers')
const { OK } = require('http-status-codes')

const setUsersRoutes = app => {
  app.options('/users', cors(allowAll))

  app.get('/users', cors(allowAll), extractClientId, checkClientPermission('userRead'), async (req, res) => {
    const { login } = req.query
    const users = await apiUsers.search(login)
    res.status(OK).send(users)
  })
}

module.exports = { setUsersRoutes }
