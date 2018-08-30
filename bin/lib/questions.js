module.exports = {
  init: [
    {
      type: 'list',
      name: 'mobile',
      message: '选择初始化移动端项目还是后台项目',
      choices: [{ name: '移动端', value: true }, { name: '后台', value: false }]
    },
    {
      type: 'confirm',
      name: 'new',
      default: false,
      message: '是否创建新的文件夹完成初始化'
    },
    {
      type: 'input',
      name: 'dir',
      message: '请输入要初始化的文件夹名称',
      when: answers => answers.new,
      validate: input => {
        if (input === '') {
          return '请输入有效的文件夹名称'
        }
        return true
      }
    },
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称',
      default: '凹凸租车'
    },
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目类型',
      choices: ['m', 'act', 'system']
    },
    {
      type: 'input',
      name: 'prodPath',
      message: '请输入项目的打包出口目录',
      validate: input => {
        if (input === '') {
          return '请输入有效的打包出口目录'
        }
        return true
      }
    }
  ],
  create: [
    {
      type: 'list',
      name: 'createClass',
      message: '选择创建组件还是页面',
      default: 'component',
      choices: [
        { name: '组件', value: 'component' },
        { name: '页面', value: 'view' }
      ]
    },
    {
      type: 'input',
      name: 'createName',
      message: '请输入名称 (驼峰)',
      default: 'demo'
    }
  ]
}
