const merge = require('deepmerge')

/**
 * 深度合并包含数组
 *
 * @param {*} oldData
 * @param {*} newData
 * @returns mergeData
 */
module.exports = (oldData, newData) => {
  const emptyTarget = value => (Array.isArray(value) ? [] : {})
  const clone = (value, options) => merge(emptyTarget(value), value, options)

  function combineMerge(target, source, options) {
    const destination = target.slice()

    source.forEach((e, i) => {
      if (typeof destination[i] === 'undefined') {
        const cloneRequested = options.clone !== false
        const shouldClone = cloneRequested && options.isMergeableObject(e)
        destination[i] = shouldClone ? clone(e, options) : e
      } else if (options.isMergeableObject(e)) {
        destination[i] = merge(target[i], e, options)
      } else if (target.indexOf(e) === -1) {
        destination.push(e)
      }
    })
    return destination
  }

  return merge(oldData, newData, {
    arrayMerge: combineMerge,
  })
}
