module.exports = {
    webpack:{
        loaders: [
            {
                test: /\.(pug|js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=es2015&presets[]=react', 'pug-as-jsx'],
              }
        ]
    }
}