const { Model } = require('../../src/services/db/Db')
const randomstring = require('randomstring')

const getModel = async project => {
  const model = await Model.insert({
    projectId: project.project.id,
    apiId: randomstring.generate(10),
    some: randomstring.generate(10),
  })
  return {
    remove: async () => {
      await Model.remove(model.id)
    },
    model,
  }
}

module.exports = { getModel }
