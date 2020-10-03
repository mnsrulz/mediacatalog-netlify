const webpack = require('webpack')

module.exports = {
  mode: "development",  
  plugins: [    
    new webpack.DefinePlugin({
      "global.GENTLY": false
    }),
    // new webpack.LoaderOptionsPlugin({
    //   // test: /\.xxx$/, // may apply this only for some modules
    //   options: {
    //     alias: {
    //       'inherits': 'inherits/inherits_browser.js',
    //       'superagent': 'superagent/lib/client',
    //       'emitter': 'component-emitter',
    //     },
    //   }
    // })
  ],
}