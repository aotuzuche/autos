module.exports = (config = {}) => {
  const raw = Object.keys(process.env)
    .filter(key => /^AT_/i.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PACKAGE: process.env.PACKAGE || 'development',
      },
    )
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = Object.keys(raw).reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(raw[key])
    return env
  }, config)

  return stringified
}
