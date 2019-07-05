// const { Model, File, Entry, Project, ProjectAndUserRelation, ProjectImage } = require('./tables')
const { Project, ProjectImage, User, EncryptionKey } = require('./tables')
// const { AuthToken, RecoverPass, ApiToken, Contact } = require('./tables')

const defaultNormToDb = ({ id, ...rest }) => ({ ...rest })
const defaultNormFromDb = entity => {
  const res = {}
  const { _id, __v, buffer, ...rest } = entity.toObject()
  if (_id) res.id = _id
  if (buffer) res.buffer = entity.buffer
  return { ...res, ...rest }
}

class Db {
  constructor({ Model, normToDb = null, normFromDb = null, hooks = {} }) {
    const { beforeInsert, afterInsert, beforeUpdate, afterUpdate, beforeRemove, afterRemove } = hooks
    this.Model = Model
    this.normToDb = normToDb || defaultNormToDb
    this.normFromDb = normFromDb || defaultNormFromDb
    this.beforeInsert = beforeInsert
    this.afterInsert = afterInsert
    this.beforeUpdate = beforeUpdate
    this.afterUpdate = afterUpdate
    this.beforeRemove = beforeRemove
    this.afterRemove = afterRemove
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
    if (this.beforeRemove) await this.beforeRemove(id)
    const entity = await this.Model.findById(id)
    await entity.remove()
    if (this.afterRemove) await this.afterRemove(id)
  }
  /*
  async findByIdAndRemove(id) {
    await this.Model.findByIdAndRemove(id)
  }
*/
  async insert(entity) {
    if (this.beforeInsert) await this.beforeInsert(entity)
    const newEntity = new this.Model(this.normToDb(entity))
    const savedEntity = await newEntity.save()
    if (this.afterInsert) await this.afterInsert(savedEntity)
    return this.normFromDb(savedEntity)
  }

  async update(id, entity) {
    if (this.beforeUpdate) await this.beforeUpdate(id, entity)
    const foudedEntity = await this.Model.findById(id)
    await foudedEntity.updateOne(this.normToDb(entity))
    const updatedEntity = await this.Model.findById(id)
    if (this.afterUpdate) await this.afterUpdate(updatedEntity)
    return this.normFromDb(updatedEntity)
  }
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
  User: new Db({ Model: User }),
  EncryptionKey: new Db({ Model: EncryptionKey }),
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
