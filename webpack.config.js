module.exports = {
    watch: true,
    entry: "./src/react/app.js",
    output: {
        filename: "assets/js/react/app.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};