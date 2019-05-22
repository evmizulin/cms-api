const entryForPublic = entry => {
  const res = entry
  res.value = normalize(entry.value)
  return res
}

const normSimple = value => value.value

const normObject = value => {
  return Object.keys(value.value).reduce((res, key) => {
    res[key] = normalize(value.value[key])
    return res
  }, {})
}

const normArray = value => {
  return value.value.map(item => normalize(item))
}

const normalize = value => {
  const MAP = {
    'string-line': normSimple,
    'string-multiline': normSimple,
    'string-html': normSimple,
    'string-markdown': normSimple,
    boolean: normSimple,
    number: normSimple,
    object: normObject,
    array: normArray,
    enum: normSimple,
    reference: normSimple,
    asset: normSimple,
  }
  return MAP[value.type](value)
}

module.exports = { entryForPublic }
