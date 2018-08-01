module.exports = {
  // 一般情况下，它的值是 /${prodPathPrefix}/${prodPath}
  basename: process.env.NODE_ENV === 'production' ? '/m/<%= prodPath %>' : '',
  
  // 打包出口目录的前缀，注意：不需要以/开头
  prodPathPrefix: 'm',
  
  // 打包的出口目录(默认dist目录)
  prodPath: '<%= prodPath %>',
}
