const path = require('path')

// 首字母大写
exports.capitalize = str => {
  return str.replace(/\w/, s => s.toUpperCase())
}

// 以项目根目录生成路径
exports.resolveProjectPath = (...toPath) => {
  return path.join(process.cwd(), ...toPath)
}

// 以脚手架目录生成路径
exports.resolveAutosPath = (...toPath) => {
  return path.join(__dirname, '../../', ...toPath)
}
