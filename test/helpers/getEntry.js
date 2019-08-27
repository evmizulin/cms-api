const { Entry } = require('../../src/services/db/Db')
const randomstring = require('randomstring')

const getEntry = async model => {
  const entry = await Entry.insert({
    projectId: model.model.projectId,
    modelId: model.model.id,
    identificator: randomstring.generate(),
    value: { type: 'string-line', value: randomstring.generate() },
  })
  return {
    remove: async () => {
      await Entry.remove(entry.id)
    },
    entry,
  }
}

module.exports = { getEntry }
