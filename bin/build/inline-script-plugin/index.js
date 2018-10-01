const sourceMappingURL = require('source-map-url')

class InlineScriptPlugin {
  constructor(name) {
    this.name = name
  }

  apply(compiler) {
    const id = 'InlineScriptPlugin'
    const name = this.name

    compiler.hooks.emit.tap(id, compilation => {
      delete compilation.assets[this.getAssetName(compilation.chunks, name)]
    })

    compiler.hooks.compilation.tap(id, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        id,
        (data, cb) => {
          const manifestAssetName = this.getAssetName(compilation.chunks, name)

          if (manifestAssetName) {
            ['head', 'body'].forEach(section => {
              data[section] = this.inlineWhenMatched(
                compilation,
                data[section],
                manifestAssetName
              )
            })

            data['head'].push({
              tagName: 'script',
              closeTag: true,
              attributes: {
                type: 'text/javascript'
              },
              innerHTML: sourceMappingURL.removeFrom(
                compilation.assets[manifestAssetName].source()
              )
            })
          }
          cb(null, data)
        }
      )
    })
  }

  getAssetName(chunks, chunkName) {
    return (
      chunks.filter(function(chunk) {
        return chunk.name === chunkName
      })[0] || { files: [] }
    ).files[0]
  }

  inlineWhenMatched(compilation, scripts, manifestAssetName) {
    return scripts.filter(function(script) {
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
}

module.exports = InlineScriptPlugin
