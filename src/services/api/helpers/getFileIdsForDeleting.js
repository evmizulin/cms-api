const isEqual = require('lodash.isequal')

const getFileIdsForDeleting = (oldEntry, newEntry = { value: { type: 'boolean' } }) => {
  const filesInNewEntry = []
  const filesInOldEntry = []
  inAny(filesInNewEntry, newEntry.value)
  inAny(filesInOldEntry, oldEntry.value)
  return filesInOldEntry
    .filter(oldFile => !filesInNewEntry.some(newFile => isEqual(newFile, oldFile)))
    .map(item => item.split('files/')[1].split('/')[0])
}

const inSimple = () => {}

const inAny = (res, value) => {
  const MAP = {
    'string-line': inSimple,
    'string-multiline': inSimple,
    'string-html': inSimple,
    'string-markdown': inSimple,
    boolean: inSimple,
    number: inSimple,
    object: isObject,
    array: inArray,
    enum: inSimple,
    reference: inSimple,
    asset: inAsset,
  }
  MAP[value.type](res, value)
}

const isObject = (res, value) => {
  Object.keys(value.value).forEach(propName => {
    inAny(res, value.value[propName])
  })
}

const inArray = (res, value) => {
  value.value.forEach(item => inAny(res, item))
}

const inAsset = (res, value) => {
  res.push(value.value)
}

module.exports = { getFileIdsForDeleting }
