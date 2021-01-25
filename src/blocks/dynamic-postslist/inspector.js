/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { Fragment, Component } from '@wordpress/element';
import { PanelBody, RangeControl } from '@wordpress/components';

/**
 * Inspector controls
 */
class Inspector extends Component {
	render() {
		const { attributes, setAttributes } = this.props;

		const { postsToShow } = attributes;

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Post Settings', 'porchy' ) }>
						<RangeControl
							label={ __( 'Number of posts', 'porchy' ) }
							help={ __(
								'Change the number of posts displayed.',
								'porchy'
							) }
							value={ postsToShow }
							onChange={ ( value ) =>
								setAttributes( { postsToShow: value } )
							}
							min={ 2 }
							max={ 20 }
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default Inspector;
