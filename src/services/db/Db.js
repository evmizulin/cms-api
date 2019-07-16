// const { Model, File, Entry, Project, ProjectAndUserRelation, ProjectImage } = require('./tables')
const { Project, ProjectImage, User, EncryptionKey, Client } = require('./tables')
const { AccessToken, ProjectPermission, ClientPermission, App } = require('./tables')
const { PasswordRecoveryToken } = require('./tables')
// const { AuthToken, RecoverPass, ApiToken, Contact } = require('./tables')

const defaultNormToDb = ({ id, ...rest }) => ({ ...rest })
const defaultNormFromDb = entity => {
  const res = {}
  const { _id, __v, buffer, ...rest } = entity.toObject()
  if (_id) res.id = _id
  if (buffer) res.buffer = entity.buffer
  return { ...res, ...rest }
}

class CrudDb {
  constructor({ Model, normToDb = null, normFromDb = null }) {
    this.Model = Model
    this.normToDb = normToDb || defaultNormToDb
    this.normFromDb = normFromDb || defaultNormFromDb
  }

  async find(...props) {
    const entities = await this.Model.find(...props)
    return entities.map(item => this.normFromDb(item))
  }

  async findOne(...props) {
    const entities = await this.Model.find(...props)
    if (!entities.length) return null
    return this.normFromDb(entities[0])
  }

  async findById(...props) {
    const entity = await this.Model.findById(...props)
    if (!entity) return null
    return this.normFromDb(entity)
  }

  async remove(id) {
    const entity = await this.Model.findById(id)
    await entity.remove()
  }
  /*
  async findByIdAndRemove(id) {
    await this.Model.findByIdAndRemove(id)
  }
*/
  async insert(entity) {
    const newEntity = new this.Model(this.normToDb(entity))
    const savedEntity = await newEntity.save()
    return this.normFromDb(savedEntity)
  }

  async update(id, entity) {
    const foudedEntity = await this.Model.findById(id)
    await foudedEntity.updateOne(this.normToDb(entity))
    const updatedEntity = await this.Model.findById(id)
    return this.normFromDb(updatedEntity)
  }
}

class Db extends CrudDb {
  constructor(props) {
    const { hooks = {} } = props
    super(props)
    Object.keys(hooks).forEach(key => {
      this[key] = async (...props) => {
        const { before, after } = hooks[key]
        if (before) await before(...props)
        const result = await super[key](...props)
        if (after) await after({ props, result })
        return result
      }
    })
  }
}

const modifyError = async () => {
  throw new Error('Modification not allowed')
}

module.exports = {
  /*
  Model: new Db({
    Model: Model,
    normToDb: ({ id, apiId, projectId, ...rest }) => ({ apiId, projectId, data: JSON.stringify(rest) }),
    normFromDb: props => {
      const res = {}
      const { _id, __v, data = '{}', ...rest } = props.toObject()
      if (_id) res.id = _id.toString()
      return { ...res, ...JSON.parse(data), ...rest }
    },
  }),
  Entry: new Db({
    Model: Entry,
    normToDb: ({ id, modelId, projectId, ...rest }) => ({ modelId, projectId, data: JSON.stringify(rest) }),
    normFromDb: props => {
      const res = {}
      const { _id, __v, data = '{}', ...rest } = props.toObject()
      if (_id) res.id = _id.toString()
      return { ...res, ...JSON.parse(data), ...rest }
    },
  }),
  File: new Db({
    Model: File,
    normToDb,
    normFromDb: props => {
      const res = {}
      const { _id, __v, buffer, ...rest } = props.toObject()
      if (_id) res.id = _id.toString()
      if (buffer) res.buffer = props.buffer
      return { ...res, ...rest }
    },
  }),
  */
  Project: new Db({ Model: Project }),
  ProjectImage: new Db({ Model: ProjectImage }),
  ProjectPermission: new Db({ Model: ProjectPermission }),
  ClientPermission: new Db({
    Model: ClientPermission,
    hooks: {
      update: { before: modifyError },
      insert: { before: modifyError },
      remove: { before: modifyError },
    },
  }),
  AccessToken: new Db({ Model: AccessToken }),
  User: new Db({
    Model: User,
    hooks: {
      insert: {
        after: async ({ result: user }) => {
          const client = await new Client({ type: 'user', clientSourceId: user.id }).save()
          await new ClientPermission({
            clientId: client._id,
            projectCreate: true,
            projectRead: true,
            projectUpdate: true,
            projectDelete: true,
            apiTokenCreate: true,
            apiTokenRead: true,
            apiTokenUpdate: true,
            apiTokenDelete: true,
          }).save()
        },
      },
      remove: {
        before: async id => {
          const clients = await Client.find({ type: 'user', clientSourceId: id })
          const permissions = await ClientPermission.find({ clientId: clients[0]._id })
          await permissions[0].remove()
          await clients[0].remove()
        },
      },
    },
  }),
  App: new Db({
    Model: App,
    hooks: {
      insert: {
        after: async ({ result: app }) => {
          const client = await new Client({ type: 'app', clientSourceId: app.id }).save()
          await new ClientPermission({
            clientId: client._id,
            projectCreate: false,
            projectRead: false,
            projectUpdate: false,
            projectDelete: false,
            apiTokenCreate: false,
            apiTokenRead: false,
            apiTokenUpdate: false,
            apiTokenDelete: false,
          }).save()
        },
      },
      remove: {
        before: async id => {
          const clients = await Client.find({ type: 'app', clientSourceId: id })
          const permissions = await ClientPermission.find({ clientId: clients[0]._id })
          await permissions[0].remove()
          await clients[0].remove()
        },
      },
    },
  }),
  Client: new Db({
    Model: Client,
    hooks: {
      update: { before: modifyError },
      insert: { before: modifyError },
      remove: { before: modifyError },
    },
  }),
  EncryptionKey: new Db({ Model: EncryptionKey }),
  PasswordRecoveryToken: new Db({ Model: PasswordRecoveryToken }),
  /*
  ProjectAndUserRelation: new Db({ Model: ProjectAndUserRelation, normToDb, normFromDb }),
  AuthToken: new Db({ Model: AuthToken, normToDb, normFromDb }),
  RecoverPass: new Db({ Model: RecoverPass, normToDb, normFromDb }),
  ApiToken: new Db({ Model: ApiToken, normToDb, normFromDb }),
  Contact: new Db({
    Model: Contact,
    normToDb: contact => ({ data: JSON.stringify(contact) }),
    normFromDb: props => {
      const res = {}
      const { _id, __v, data = '{}', ...rest } = props.toObject()
      if (_id) res.id = _id.toString()
      return { ...res, ...JSON.parse(data), ...rest }
    },
  }),
  */
}
