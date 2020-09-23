const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginConfigs = {
	// CopyWebpackPlugin: new CopyWebpackPlugin([
	// 	// { from: 'src/index.html', to: 'index.html' },
	// 	// { from: 'src/css', to: 'css' },
	// 	// { from: 'src/images', to: 'images' },
	// 	// { from: 'server/schemas/*.graphql', to: 'schemas/[name].graphql', toType: 'template' },
	// 	// { from: 'node_modules/semantic-ui-css/themes', to: 'themes' },
	// 	// { from: 'configuration.json', to: 'configuration.json' },
	// 	// { from: "src/assets", to: "assets" },
	// 	// { from: "server/driver", to: "driver" },
	// 	// { from: 'node_modules/carbon-components/css/carbon-components.css', to: 'css/carbon-components.css' }
	// 	// { from: 'node_modules/semantic-ui-css/semantic.css', to: 'semantic.css' }
	// ], {}),
	EnvironmentPlugin: new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	})
};

const baseConfig = {
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '../dist')
	},
	stats: "errors-only",
	mode: 'production',
	node: {
		path: true,
		__dirname: true
	},
	module: {
		// noParse: [/\/ws\//],
		rules: [
			{
				enforce: "pre",
				test: [
					/\.js$/,
					/\.ts$/,
					/\.(graphql|gql)$/
				],
				exclude: [
					/node_modules/,
					/lib/,
					/vcap.local.js/
				],
				loader: "eslint-loader"
				// options: {
				// 	"print-config": true
				// }
			},
			{
				test: [
					/\.js$/,
					/\.ts$/
				],
				exclude: [
					/node_modules/,
					/lib/,
					/vcap.local.js/
				],
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: false
							// configFile: resolvePath('./tsconfig.json'),
							// context: ROOT_DIR
							// getCustomTransformers: () => ({
							// 	before: [transformateurRepoGraphql()]
							// }),
						}
					}
				]
			},
			{
				test: /\.(graphql|gql)$/,
				// enforce: "pre",
				exclude: [
					/node_modules/,
					/lib/,
					/vcap.local.js/
				],
				loader: 'graphql-tag/loader'
			},
			{
				type: 'javascript/auto',
				test: /\.mjs$/,
				include: [
					/node_modules/,
					/lib/,
					/vcap.local.js/
				],
				use: []
			}
		]
	}
};

const serverConfig = Object.assign({}, baseConfig, {
	entry: {
		server: path.join(__dirname, '../src/index.ts')
	},
	resolve: {
		extensions: ['.js', '.ts', '.graphql']
	},
	target: 'node',
	plugins: []
});

module.exports = [serverConfig];

module.exports.pluginConfigs = pluginConfigs;
