const cors = require('cors')
const { OK } = require('http-status-codes')
const { getStatusMessage } = require('../helpers/getStatusMessage')
const { apiRegister } = require('../services/api/ApiRegister')
const { allowMe } = require('../helpers/corsSettings')

const setRegisterRoutes = app => {
  app.options('/register', cors(allowMe))

  app.post('/register', cors(allowMe), async (req, res) => {
    await apiRegister.register(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })

  app.options('/email-confirm', cors(allowMe))

  app.post('/email-confirm', cors(allowMe), async (req, res) => {
    await apiRegister.emailConfirm(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })
}

module.exports = { setRegisterRoutes }
