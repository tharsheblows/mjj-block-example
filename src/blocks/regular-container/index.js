/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

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
	title: __( 'Container', 'porchy' ),
	description: __( 'Provide custom container.', 'porchy' ),
	icon: 'editor-kitchensink',
	keywords: [
		__( 'container', 'porchy' ),
		__( 'wrapper', 'porchy' ),
		__( 'section', 'porchy' ),
	],
	attributes,
	supports,
	edit: Edit,
	save: Save,
};
export { name, category, settings };
