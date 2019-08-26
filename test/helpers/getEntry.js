const { Entry } = require('../../src/services/db/Db')
const randomstring = require('randomstring')

const getEntry = async model => {
  const entry = await Entry.insert({
    projectId: model.model.projectId,
    modelId: model.model.id,
    some: randomstring.generate(10),
  })
  return {
    remove: async () => {
      await Entry.remove(entry.id)
    },
    entry,
  }
}

module.exports = { getEntry }
