const entryToValue = entry => {
  return toValue(entry.value)
}

const toValue = value => {
  const MAP = {
    'string-line': simpleToValue,
    'string-multiline': simpleToValue,
    'string-html': simpleToValue,
    'string-markdown': simpleToValue,
    boolean: simpleToValue,
    number: simpleToValue,
    object: objectToValue,
    array: arrayToValue,
    enum: simpleToValue,
    reference: simpleToValue,
    asset: simpleToValue,
  }
  return MAP[value.type](value)
}

const simpleToValue = value => {
  return value.value
}

const objectToValue = value => {
  return Object.keys(value.value).reduce((res, key) => {
    res[key] = toValue(value.value[key])
    return res
  }, {})
}

const arrayToValue = value => {
  return value.value.map(item => toValue(item))
}

module.exports = { entryToValue }
