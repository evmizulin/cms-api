const cors = require('cors')
const { allowMe } = require('../helpers/corsSettings')
const { apiSignin } = require('./apiSignin')
const { ApiResp } = require('../helpers/ApiResp')
const { config } = require('../config')

const setSigninRoutes = app => {
  app.options('/signin', cors(allowMe))

  app.post('/signin', cors(allowMe), async (req, res) => {
    const accessToken = await apiSignin.signin(req.body)
    const apiResp = new ApiResp()
    res
      .status(apiResp.code)
      .set('Set-Cookie', `accessToken=${accessToken};${config.isProd ? ' Secure;' : ''} HttpOnly`)
      .send(apiResp.body)
  })
}

module.exports = { setSigninRoutes }
