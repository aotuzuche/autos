const cdn =
  process.env.PACKAGE === 'production'
    ? 'https://carphoto.atzuche.com/'
    : 'https://at-images-test.oss-cn-hangzhou.aliyuncs.com/'

export default cdn
