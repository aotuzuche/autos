module.exports = {
  init: [
    {
      type: 'confirm',
      name: 'new',
      default: false,
      message: '是否需要创建新的文件夹来初始化项目？',
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
      },
    },
    {
      type: 'input',
      name: 'prodPath',
      message: '请输入项目名称（system code）',
      validate: input => {
        if (input === '') {
          return '请输入有效的文件名'
        }
        return true
      },
    },
  ],
  create: [
    {
      type: 'list',
      name: 'createClass',
      message: '选择创建组件还是页面',
      default: 'component',
      choices: [
        { name: '组件', value: 'component' },
        { name: '页面', value: 'view' },
      ],
    },
    {
      type: 'input',
      name: 'createName',
      message: '请输入名称 (驼峰)',
      default: 'demo',
    },
  ],
}
