module.exports = function(source) {
  if (process.env.PACKAGE === 'production') {
    const match = /\/\/\s*?>>>(\s|.)*?\/\/\s*?<<</g
    return source.replace(match, '')
  } else {
    return source
  }
}
