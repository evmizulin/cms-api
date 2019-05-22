const { Model, File, Entry, Project, ProjectAndUserRelation } = require('./tables')
const { User, AuthToken, RecoverPass, ApiToken, Contact, EncryptionKey } = require('./tables')

class Db {
  constructor(props) {
    this.Model = props.Model
    this.normToDb = props.normToDb
    this.normFromDb = props.normFromDb
  }

  async find(...props) {
    const entities = await this.Model.find(...props)
    return entities.map(item => this.normFromDb(item))
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

  async findByIdAndRemove(id) {
    await this.Model.findByIdAndRemove(id)
  }

  async save(entity) {
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

const normToDb = ({ id, ...rest }) => ({ ...rest })
const normFromDb = props => {
  const res = {}
  const { _id, __v, ...rest } = props.toObject()
  if (_id) res.id = _id.toString()
  return { ...res, ...rest }
}

module.exports = {
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
  Project: new Db({ Model: Project, normToDb, normFromDb }),
  User: new Db({ Model: User, normToDb, normFromDb }),
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
  EncryptionKey: new Db({ Model: EncryptionKey, normToDb, normFromDb }),
}
