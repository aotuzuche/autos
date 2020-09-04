const sourceMappingURL = require('source-map-url')
const HtmlWebpackPlugin = require('html-webpack-plugin')

class InlineScriptPlugin {
  constructor(name) {
    this.name = name
  }

  apply(compiler) {
    const id = 'InlineScriptPlugin'
    const { name } = this

    function getAssetName(chunks, chunkName) {
      return (chunks.filter(chunk => chunk.name === chunkName)[0] || { files: [] }).files[0]
    }

    function inlineWhenMatched(compilation, scripts, manifestAssetName) {
      return scripts.filter(script => {
        const isManifestScript =
          script.tagName === 'script' &&
          script.attributes.src &&
          script.attributes.src.indexOf(manifestAssetName) >= 0

        if (isManifestScript) {
          return false
        }

        return script
      })
    }

    compiler.hooks.emit.tap(id, compilation => {
      delete compilation.assets[getAssetName(compilation.chunks, name)]
    })

    compiler.hooks.compilation.tap(id, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(id, (data, cb) => {
        const manifestAssetName = getAssetName(compilation.chunks, name)

        if (manifestAssetName) {
          // eslint-disable-next-line no-extra-semi
          ;['headTags', 'bodyTags'].forEach(section => {
            data[section] = inlineWhenMatched(compilation, data[section], manifestAssetName)
          })

          data.headTags.push({
            tagName: 'script',
            closeTag: true,
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: sourceMappingURL.removeFrom(compilation.assets[manifestAssetName].source()),
          })
        }
        cb(null, data)
      })
    })
  }
}

module.exports = InlineScriptPlugin
