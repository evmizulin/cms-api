const express = require('express')
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = require('http-status-codes')
const { getStatusMessage, getMessage } = require('./helpers/getStatusMessage')
const { ApiError } = require('./helpers/ApiError')
const { allowAll } = require('./helpers/corsSettings')
const { setPublicRoutes } = require('./routes/setPublicRoutes')
const { setChangePassRoutes } = require('./routes/setChangePassRoutes')
const { setEntriesRoutes } = require('./routes/setEntriesRoutes')
const { setFilesRoutes } = require('./routes/setFilesRoutes')
const { setLoginRoutes } = require('./routes/setLoginRoutes')
const { setModelsRoutes } = require('./routes/setModelsRoutes')
const { setProjectsRoutes } = require('./routes/setProjectsRoutes')
const { setRegisterRoutes } = require('./routes/setRegisterRoutes')
const { setTokensRoutes } = require('./routes/setTokensRoutes')
const { config } = require('./config')

const app = express()
app.use(
  morgan(
    ':date[iso] :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms',
    config.logsToFile
      ? {
          stream: rfs('access.log', {
            interval: '1d',
            path: path.join(__dirname, '../logs'),
          }),
        }
      : undefined
  )
)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(fileUpload())

app.options('/say-hello', cors(allowAll))

app.get('/say-hello', cors(allowAll), (req, res) => {
  res.status(OK).send('hello')
})

setPublicRoutes(app)
setChangePassRoutes(app)
setEntriesRoutes(app)
setFilesRoutes(app)
setLoginRoutes(app)
setModelsRoutes(app)
setProjectsRoutes(app)
setRegisterRoutes(app)
setTokensRoutes(app)

app.use(cors(allowAll), (error, req, res, next) => {
  if (error) {
    if (error.message === 'Not allowed by CORS') {
      res.status(FORBIDDEN).send(getMessage(error.message))
      return
    }
    if (error instanceof ApiError) {
      res.status(error.code).send(getMessage(error.message))
      return
    }
    res.status(INTERNAL_SERVER_ERROR).send(getStatusMessage(INTERNAL_SERVER_ERROR))
  }
  next(error)
})

app.use(cors(allowAll), (req, res) => {
  res.status(NOT_FOUND).send(getStatusMessage(NOT_FOUND))
})

app.listen(config.apiServerPort, config.apiServerHost, () => {
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} listening on ${config.apiServerHost}:${config.apiServerPort}`)
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} NODE_ENV=${process.env.NODE_ENV}`)
})
