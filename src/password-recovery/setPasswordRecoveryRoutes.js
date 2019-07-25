const cors = require('cors')
const { apiPasswordRecovery } = require('./apiPasswordRecovery')
const { allowMe } = require('../helpers/corsSettings')
const { ApiResp } = require('../helpers/ApiResp')

const setPasswordRecoveryRoutes = app => {
  app.options('/password-recovery', cors(allowMe))

  app.post('/password-recovery', cors(allowMe), async (req, res) => {
    await apiPasswordRecovery.postPasswordRecovery(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })

  app.options('/password-recovery/confirmation', cors(allowMe))

  app.post('/password-recovery/confirmation', cors(allowMe), async (req, res) => {
    await apiPasswordRecovery.postPasswordRecoveryConfirmation(req.body)
    const apiResp = new ApiResp()
    res.status(apiResp.code).send(apiResp.body)
  })
}

module.exports = { setPasswordRecoveryRoutes }
