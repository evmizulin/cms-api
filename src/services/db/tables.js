const mongoose = require('mongoose')
const { config } = require('../../config')

mongoose.Promise = global.Promise
mongoose.connect(
  config.mongoDbUrl,
  { useNewUrlParser: true, useFindAndModify: false }
)
const db = mongoose.connection

db.on('error', error => {
  console.log(error) // eslint-disable-line no-console
})

db.once('open', () => {
  if (config.logsTo !== 'no') {
    console.log('Conected to db!') // eslint-disable-line no-console
  }
})

const Schema = mongoose.Schema

const ProjectImage = new Schema({
  projectId: Schema.Types.ObjectId,
  buffer: Buffer,
})

const Project = new Schema({
  name: String,
})

const ProjectPermission = new Schema({
  projectId: Schema.Types.ObjectId,
  clientId: Schema.Types.ObjectId,
  projectRead: Boolean,
  projectUpdate: Boolean,
  projectDelete: Boolean,
  apiTokenCreate: Boolean,
  apiTokenRead: Boolean,
  apiTokenUpdate: Boolean,
  apiTokenDelete: Boolean,
  apiTokenPermissionsRead: Boolean,
  apiTokenPermissionsUpdate: Boolean,
  userOfProjectCreate: Boolean,
  userOfProjectRead: Boolean,
  userOfProjectDelete: Boolean,
  userPermissionsRead: Boolean,
  userPermissionsUpdate: Boolean,
  ownPermissionsRead: Boolean,
  fileCreate: Boolean,
  fileRead: Boolean,
  modelCreate: Boolean,
  modelRead: Boolean,
  modelUpdate: Boolean,
  modelDelete: Boolean,
  entryCreate: Boolean,
  entryRead: Boolean,
  entryUpdate: Boolean,
  entryDelete: Boolean,
})

const ClientPermission = new Schema({
  clientId: Schema.Types.ObjectId,
  userOfCmsRead: Boolean,
  projectCreate: Boolean,
  projectRead: Boolean,
  projectUpdate: Boolean,
  projectDelete: Boolean,
  apiTokenCreate: Boolean,
  apiTokenRead: Boolean,
  apiTokenUpdate: Boolean,
  apiTokenDelete: Boolean,
  apiTokenPermissionsRead: Boolean,
  apiTokenPermissionsUpdate: Boolean,
  userOfProjectCreate: Boolean,
  userOfProjectRead: Boolean,
  userOfProjectDelete: Boolean,
  userPermissionsRead: Boolean,
  userPermissionsUpdate: Boolean,
  ownPermissionsRead: Boolean,
  fileCreate: Boolean,
  fileRead: Boolean,
  modelCreate: Boolean,
  modelRead: Boolean,
  modelUpdate: Boolean,
  modelDelete: Boolean,
  entryCreate: Boolean,
  entryRead: Boolean,
  entryUpdate: Boolean,
  entryDelete: Boolean,
})

const Client = new Schema({
  type: String,
  clientSourceId: Schema.Types.ObjectId,
})

const User = new Schema({
  login: String,
  passHash: String,
  isVerified: Boolean,
})

const App = new Schema({
  name: String,
})

const AccessToken = new Schema({
  clientId: Schema.Types.ObjectId,
  token: String,
})

const EncryptionKey = new Schema({
  key: String,
})

const PasswordRecoveryToken = new Schema({
  userId: Schema.Types.ObjectId,
  token: String,
})

const File = new Schema({
  projectId: Schema.Types.ObjectId,
  name: String,
  buffer: Buffer,
  mimetype: String,
})

const Model = new Schema({
  projectId: Schema.Types.ObjectId,
  apiId: String,
  data: String,
})

const Entry = new Schema({
  projectId: Schema.Types.ObjectId,
  modelId: Schema.Types.ObjectId,
  data: String,
})

module.exports = {
  connection: db,
  ProjectImage: mongoose.model('ProjectImage', ProjectImage),
  Project: mongoose.model('Project', Project),
  ProjectPermission: mongoose.model('ProjectPermission', ProjectPermission),
  ClientPermission: mongoose.model('ClientPermission', ClientPermission),
  Client: mongoose.model('Client', Client),
  User: mongoose.model('User', User),
  App: mongoose.model('App', App),
  AccessToken: mongoose.model('AccessToken', AccessToken),
  EncryptionKey: mongoose.model('EncryptionKey', EncryptionKey),
  PasswordRecoveryToken: mongoose.model('PasswordRecoveryToken', PasswordRecoveryToken),
  File: mongoose.model('File', File),
  Model: mongoose.model('Model', Model),
  Entry: mongoose.model('Entry', Entry),
}
