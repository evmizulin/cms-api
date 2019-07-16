const cors = require('cors')
const { OK } = require('http-status-codes')
const { apiPasswordRecovery } = require('./apiPasswordRecovery')
const { allowAll } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setPasswordRecoveryRoutes = app => {
  app.options('/password-recovery', cors(allowAll))

  app.post('/password-recovery', cors(allowAll), async (req, res) => {
    await apiPasswordRecovery.postPasswordRecovery(req.body)
    const apiResp = new ApiResp(OK)
    res.status(apiResp.code).send(apiResp.body)
  })

  app.options('/password-recovery/confirmation', cors(allowAll))

  app.post('/password-recovery/confirmation', cors(allowAll), async (req, res) => {
    await apiPasswordRecovery.postPasswordRecoveryConfirmation(req.body)
    const apiResp = new ApiResp(OK)
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setPasswordRecoveryRoutes }
