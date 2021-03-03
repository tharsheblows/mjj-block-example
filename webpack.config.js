const path = require( 'path' );

const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
let adminEnv = '';
let frontEndEnv = '';

// Check if local.json exists
try {
	const localEnv = require( './local.json' );
	adminEnv =  localEnv.adminURL;
	frontEndEnv = localEnv.frontEndURL;
} catch ( err ) {
	// Fallback if it does not
	adminEnv = 'https://idontthink.test';
	frontEndEnv = 'https://idontthink.test';
}

const adminConfig = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3123, // You can change this if port 3000 is in use.
				proxy: adminEnv,
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

const frontEndConfig = {
	...defaultConfig,
	entry: './src/front-index.js',
	output: {
		...defaultConfig.output,
		path: path.resolve( process.cwd(), 'dist' ), // For some reason, npm run build removes the front bundle from /build so I'm explicitly setting the path here so it doesn't randomly change.
		filename: 'front.bundle.js',
	},
	stats: {
		maxModules: Infinity, // Way too much information but I like it.
		exclude: undefined,
	},
	plugins: [
		// including ...defaultConfig.plugins here causes it not to build the bundle.
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3124,
				proxy: frontEndEnv,
				open: true,
				files: [ 'dist/front.bundle.js', 'build/*.css' ],
			},
			{
				injectCss: true,
				reload: false,
			}
		),
		new DependencyExtractionWebpackPlugin(), // This creates the assets php file.
	],
};

module.exports = [ adminConfig, frontEndConfig ];