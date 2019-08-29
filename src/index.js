const express = require('express')
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes')
const { ApiError } = require('./helpers/ApiError')
const { ApiResp } = require('./helpers/ApiResp')
const { allowAll } = require('./helpers/corsSettings')
const { setPasswordRecoveryRoutes } = require('./password-recovery/setPasswordRecoveryRoutes')
const { setSigninRoutes } = require('./signin/setSigninRoutes')
const { setProjectsRoutes } = require('./projects/setProjectsRoutes')
const { setSignupRoutes } = require('./signup/setSignupRoutes')
const { setApiTokensRoutes } = require('./api-tokens/setApiTokensRoutes')
const { setUsersRoutes } = require('./users/setUsersRoutes')
const { setFilesRoutes } = require('./files/setFilesRoutes')
const { setModelsRoutes } = require('./models/setModelsRoutes')
const { setEntriesRoutes } = require('./entries/setEntriesRoutes')
const { setPermissionsRoutes } = require('./permissions/setPermissionsRoutes')
const { config } = require('./config')

const app = express()
if (config.logsTo !== 'no') {
  app.use(
    morgan(
      ':date[iso] :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms',
      config.logsTo === 'file'
        ? {
            stream: rfs('access.log', {
              interval: '1d',
              path: path.join(__dirname, '../logs'),
            }),
          }
        : undefined
    )
  )
}
app.use(cookieParser())
app.use(bodyParser.json())
app.use(fileUpload())

app.options('/say-hello', cors(allowAll))

app.get('/say-hello', cors(allowAll), (req, res) => {
  const apiResp = new ApiResp({ message: 'hello' })
  res.status(apiResp.code).send(apiResp.body)
})

setProjectsRoutes(app)
setSignupRoutes(app)
setSigninRoutes(app)
setApiTokensRoutes(app)
setPasswordRecoveryRoutes(app)
setUsersRoutes(app)
setFilesRoutes(app)
setModelsRoutes(app)
setEntriesRoutes(app)
setPermissionsRoutes(app)

app.use(cors(allowAll), (error, req, res, next) => {
  if (error) {
    const apiError = error instanceof ApiError ? error : new ApiError(INTERNAL_SERVER_ERROR)
    // eslint-disable-next-line no-console
    if (apiError.code === INTERNAL_SERVER_ERROR) console.log(error)
    res.status(apiError.code).send(apiError.body)
  }
  next(error)
})

app.use(cors(allowAll), (req, res) => {
  const apiError = new ApiError(NOT_FOUND, 'Route is not found')
  res.status(apiError.code).send(apiError.body)
})

if (config.shouldStartServer) {
  app.listen(config.apiServerPort, config.apiServerHost, () => {
    // eslint-disable-next-line no-console
    console.log(`${new Date().toISOString()} listening on ${config.apiServerHost}:${config.apiServerPort}`)
    // eslint-disable-next-line no-console
    console.log(`${new Date().toISOString()} NODE_ENV=${config.env}`)
  })
}

module.exports = { app }
