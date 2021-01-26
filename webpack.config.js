const toml = require( 'toml' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
let localEnv = '';

// Check if local.json exists
try {
	localEnv = require( './local.json' ).devURL;
} catch ( err ) {
	// Fallback if it does not
	localEnv = 'https://idontthink.test';
}

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /.toml/,
				type: 'json',
				parser: {
					parse: toml.parse,
				},
			},
		],
	},
	optimization: {
		...defaultConfig.optimization,
	},
	plugins: [
		...defaultConfig.plugins,
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3123, // You can change this if port 3000 is in use.
				proxy: localEnv,
				open: true,
				files: [ 'build/*.php', 'build/*.js', 'build/*.css' ],
			},
			{
				injectCss: true,
				reload: false,
			}
		),
	],
};
