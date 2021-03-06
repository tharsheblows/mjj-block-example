/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';

/**
 * Style dependencies
 */
import './editor.scss';
import './style.scss';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;

const settings = {
	title: __( 'Porchy Click Game', 'porchy' ),
	description: __(
		'The circle click game',
		'porchy'
	),
	icon: 'excerpt-view',
	keywords: [
		__( 'posts', 'porchy' ),
		__( 'post', 'porchy' ),
		__( 'blog', 'porchy' ),
	],
	attributes,
	supports,
	edit: Edit,
	save() {
		return null;
	},
};
export { name, category, settings };
