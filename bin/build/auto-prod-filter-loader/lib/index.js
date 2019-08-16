module.exports = source => {
  if (process.env.PACKAGE === 'production') {
    const match = /\/\/\s*?>>>(\s|.)*?\/\/\s*?<<</g
    return source.replace(match, '')
  }
  return source
}
