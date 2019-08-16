module.exports = source => {
  // eslint-disable-next-line no-unused-expressions
  this.cacheable && this.cacheable()

  let options = this.query.replace(/^\?/, '')

  // 解析配置文件
  if (options) {
    options = JSON.parse(options)
    options.include = options.include ? options.include : []
  }

  // 匹配中include目录
  let include = false
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < options.include.length; i++) {
    if (this.resourcePath.indexOf(options.include[i]) === 0) {
      include = true
      break
    }
  }

  if (include && options.components) {
    // eslint-disable-next-line no-restricted-syntax
    for (const i in options.components) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.components.hasOwnProperty(i)) {
        const useReg = new RegExp(`<${i}(\\s|\\.|(/)?>)`)
        const importReg = new RegExp(
          `(var|let|const|import)\\s+(.*\\{\\s*|.*\\,\\s*|\\s*)${i}(\\s+|\\,|\\})`,
        )

        const uri = options.components[i]

        // 页面中有用到相关的组件并没有引用
        if (useReg.test(source) && !importReg.test(source)) {
          source = `import ${i} from "${uri}";${source}`
        }
      }
    }
  }
  return source
}
