const cors = require('cors')
const { OK } = require('http-status-codes')
const { getStatusMessage } = require('../helpers/getStatusMessage')
const { apiChangePass } = require('../services/api/ApiChangePass')
const { allowMe } = require('../helpers/corsSettings')

const setChangePassRoutes = app => {
  app.options('/recover', cors(allowMe))

  app.post('/recover', cors(allowMe), async (req, res) => {
    await apiChangePass.recover(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })

  app.options('/change-pass', cors(allowMe))

  app.post('/change-pass', cors(allowMe), async (req, res) => {
    await apiChangePass.changePass(req.body)
    res.status(OK).send(getStatusMessage(OK))
  })
}

module.exports = { setChangePassRoutes }
