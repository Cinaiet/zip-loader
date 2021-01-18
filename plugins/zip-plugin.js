const JsZip = require('jszip')
const path = require('path')
const RawSource = require("webpack-sources").RawSource

const zip = new JsZip()

module.exports = class ZipPlugin{
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      const folder = zip.folder(this.options.filename)

      for(let filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        console.log('source', source)
        folder.file(filename, source)

        zip.generateAsync({
          type: 'nodebuffer',
        }).then(res => {
          const outputPath = path.join(
            compilation.options.output.path,
            this.options.filename + '.zip'
          )

          const outputRelativePath = path.relative(
            compilation.options.output.path,
            outputPath
          )
          compilation.assets[outputRelativePath] = new RawSource(res)
          callback()
        })
      }
    })
  }
}