const { Project, ProjectImage, User, EncryptionKey, Client } = require('./tables')
const { AccessToken, ProjectPermission, ClientPermission, App } = require('./tables')
const { PasswordRecoveryToken, File, Model, Entry } = require('./tables')
const { getDefaultClientPermissions } = require('../../helpers/getDefaultClientPermissions')

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
  Model: new Db({
    Model: Model,
    normToDb: (...props) => {
      const { projectId, apiId, ...rest } = defaultNormToDb(...props)
      return { apiId, projectId, data: JSON.stringify(rest) }
    },
    normFromDb: (...props) => {
      const { data, ...rest } = defaultNormFromDb(...props)
      let res = {}
      if (data) res = JSON.parse(data)
      return { ...res, ...rest }
    },
  }),
  Entry: new Db({
    Model: Entry,
    normToDb: (...props) => {
      const { projectId, modelId, ...rest } = defaultNormToDb(...props)
      return { projectId, modelId, data: JSON.stringify(rest) }
    },
    normFromDb: (...props) => {
      const { data, ...rest } = defaultNormFromDb(...props)
      let res = {}
      if (data) res = JSON.parse(data)
      return { ...res, ...rest }
    },
  }),
  File: new Db({ Model: File }),
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
            ...getDefaultClientPermissions('user'),
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
            ...getDefaultClientPermissions('app'),
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
}
