const express = require('express')
require('express-async-errors')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes')
const { ApiError } = require('./helpers/ApiError')
const { allowAll } = require('./helpers/corsSettings')
// const { setPublicRoutes } = require('./routes/setPublicRoutes')
// const { setChangePassRoutes } = require('./routes/setChangePassRoutes')
// const { setEntriesRoutes } = require('./routes/setEntriesRoutes')
// const { setFilesRoutes } = require('./routes/setFilesRoutes')
// const { setLoginRoutes } = require('./routes/setLoginRoutes')
// const { setModelsRoutes } = require('./routes/setModelsRoutes')
// const { setProjectsRoutes } = require('./routes/setProjectsRoutes')
// const { setRegisterRoutes } = require('./routes/setRegisterRoutes')
// const { setTokensRoutes } = require('./routes/setTokensRoutes')
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

// setPublicRoutes(app)
// setChangePassRoutes(app)
// setEntriesRoutes(app)
// setFilesRoutes(app)
// setLoginRoutes(app)
// setModelsRoutes(app)
// setProjectsRoutes(app)
// setRegisterRoutes(app)
// setTokensRoutes(app)

app.use(cors(allowAll), (error, req, res, next) => {
  if (error) {
    const apiError = error instanceof ApiError ? error : new ApiError(INTERNAL_SERVER_ERROR)
    res.status(apiError.code).send({ message: apiError.message })
  }
  next(error)
})

app.use(cors(allowAll), (req, res) => {
  const apiError = new ApiError(NOT_FOUND)
  res.status(apiError.code).send({ message: apiError.message })
})

app.listen(config.apiServerPort, config.apiServerHost, () => {
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} listening on ${config.apiServerHost}:${config.apiServerPort}`)
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} NODE_ENV=${process.env.NODE_ENV}`)
})
