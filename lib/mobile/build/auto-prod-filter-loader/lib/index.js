module.exports = function (source) {
  if (process.env.NODE_ENV === 'development') {
    return source
  } else {
    const match = /\/\/\s*?>>>(\s|.)*?\/\/\s*?<<</g
    return source.replace(match, '')
  }
}
