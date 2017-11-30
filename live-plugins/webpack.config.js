var webpack = require('webpack');
var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
var copy = require('ncp').ncp;

var proxy = 'http://localhost:8080';

var isWebpackDevServer = process.env['_'].indexOf('webpack-dev-server') !== -1;

var pluginDirNamesStr = process.env['LIVE_PLUGINS'],
    pluginDirNames;

if (typeof pluginDirNamesStr != 'undefined' && pluginDirNamesStr.length > 0) {
    // Get plugins from env variable
    pluginDirNames = pluginDirNamesStr.split(',').map(function (dirname) {
        return dirname.substr('live-plugins/'.length);
    });
} else {
    // Use all plugin-* directories
    pluginDirNames = fs.readdirSync(__dirname).filter(function (dirname) {
        try {
            return (dirname.indexOf("plugin") === 0 && fs.statSync(path.join(__dirname, dirname)).isDirectory() &&
            fs.statSync(path.join(__dirname, dirname, 'webapp/js/app.js')).isFile()
            );
        } catch (e) {
            console.error(e.message);
        }
    });
}

function assets(name) {
    var paths = {
        assets: path.join(__dirname, name, 'webapp/assets/'),
        dest: path.join(__dirname, name, 'webapp/target/')
    };

    rimraf(paths.dest + '*', function () {
        try {
            if (fs.lstatSync(paths.assets).isDirectory()) {
                copy(paths.assets, paths.dest, function (err) {
                    if (err) console.error(err);
                });
            }
        } catch (e) {
        }
    });
}

function loadWebpackPlugins() {
    var plugins = [];

    var uglify = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    });

    if (!isWebpackDevServer) {
        plugins.push(uglify);
    }

    return plugins;
}

var entries = {};
pluginDirNames.forEach(function (dir) {
    entries[dir.substr(dir.indexOf("-") + 1)] = path.join(__dirname, dir, 'webapp/js/app.js');
    assets(dir);
});

console.log('[Live webpack] Building plugins:', Object.keys(entries).join(', '));

var isExternalModule = function (request) {
    return (
        (/^live\//.test(request)) ||
        (/^react/.test(request)) ||
        (/^lodash/.test(request)) ||
        (/^react-autocomplete/.test(request)) ||
        (/^codemirror/.test(request))
    );
};

module.exports = {
    entry: entries,
    output: {
        filename: isWebpackDevServer
            ? path.join("content/plugin-[name]/bundle.js")
            : path.join(__dirname, "plugin-[name]/webapp/target/bundle.js")
    },
    plugins: loadWebpackPlugins(),
    resolveLoader: {
        root: path.join(__dirname, "node_modules")
    },
    externals: [
        function (context, request, callback) {
            if (isExternalModule(request))
                return callback(null, "commonjs " + request);

            callback();
        }
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader'
            }
        ]
    },
    devServer: {
        inline: true,
        port: 8084,
        historyApiFallback: true,
        proxy: [
            {
                path: /^(?!\/content.+\.js)/,
                target: proxy
            }
        ]
    }
};
