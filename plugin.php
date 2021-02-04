<?php
/**
 * Plugin Name:     Porchy Block Example
 * Description:     An example of using a block scaffold
 * Version:         0.1.0
 * Author:          JJ
 * License:         GPL-2.0-or-later
 * Text Domain:     porchy
 *
 * @package         porchy
 */

namespace  porchy\mjj_block_example;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loads the plugin language files.
 *
 * @access public
 * @since 1.0.0
 * @return void
 */
function load_textdomain() {
	load_plugin_textdomain( 'porchy', false, dirname( plugin_basename( plugin_dir_path( __FILE__ ) ) ) . '/languages/' );
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\load_textdomain', 99 );

/**
 * Enqueue localization data for our blocks.
 *
 * @access public
 */
function block_localization() {
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'porchy' );
	}
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\block_localization' );

/**
 * Enqueue block assets for use within Gutenberg.
 *
 * @access public
 */
function block_assets() {

	// Styles.
	wp_enqueue_style(
		'porchy-mjj-block-example-frontend',
		plugins_url( '/build/style-index.css', __FILE__ ),
		array(),
		asset_file( 'style-index', 'version' )
	);
}

add_action( 'enqueue_block_assets', __NAMESPACE__ . '\block_assets' );

/**
 * Enqueue block assets for use within Gutenberg.
 *
 * @access public
 */
function editor_assets() {

	if ( ! is_admin() ) {
		return;
	}

	// Styles.
	wp_enqueue_style(
		'porchy-mjj-block-example-editor',
		plugins_url( '/build/index.css', __FILE__ ),
		array(),
		asset_file( 'index', 'version' )
	);

	// Scripts.
	wp_enqueue_script(
		'porchy-mjj-block-example-editor',
		plugins_url( '/build/index.js', __FILE__ ),
		array_merge( asset_file( 'index', 'dependencies' ), array( 'wp-api', 'wp-compose' ) ),
		asset_file( 'index', 'version' ),
		false
	);

}

add_action( 'enqueue_block_assets', __NAMESPACE__ . '\editor_assets' );

/**
 * Get asset file.
 *
 * @param string $handle Asset handle to reference.
 * @param string $key What do we want to return: version or dependencies.
 */
function asset_file( $handle, $key ) {
	$default_asset_file = array(
		'dependencies' => array(),
		'version'      => '1.0',
	);

	$asset_filepath = plugin_dir_path( __FILE__ ) . "/build/{$handle}.asset.php";
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

	if ( 'version' === $key ) {
		return $asset_file['version'];
	}

	if ( 'dependencies' === $key ) {
		return $asset_file['dependencies'];
	}
}

// Register server-side code for individual blocks.
foreach ( glob( dirname( __FILE__ ) . '/src/blocks/*/index.php' ) as $block_logic ) {
	require_once $block_logic;
}

/**
 * Hijack the rendering of these blocks, making a div which we will fill with our little app.
 *
 * @param null  $render A trigger to stop the block rendering process.
 * @param array $block The array of the block data generated by the block editor.
 * @return null|string If this is null, rendering continues in core, otherwise it uses the html string sent.
 */
function hijack_render_blocks( $render, $block ){
	$block_name = $block['blockName'];

	// This could be teased out as something in the individual block.
	// Add blocks to this array to keep them unrendered by the content filters.
	$blocks_to_hijack = [
		'porchy/clickgame',
	];

	if ( in_array( $block_name, $blocks_to_hijack, true ) ) {
		$attributes = wp_json_encode( $block['attrs'] );
		// I'm skipping innerContent, innerHTML and innerBlocks for now because I'm not using them.
		$classes = esc_html( str_replace( '/', ' ', $block['blockName'] ) ); // A bit delicate maybe.
		$render = "<div class='$classes' data-attr='$attributes' data-block='$block_name'></div>";
	}
	return $render;
}
add_filter( 'render_block',  __NAMESPACE__ . '\hijack_render_blocks', 10, 2 );
