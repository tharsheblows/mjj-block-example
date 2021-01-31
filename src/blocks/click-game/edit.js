/**
 * External dependencies
 */
import { useEffect } from 'react'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import Game from './components/game'
import Inspector from './inspector';

/**
 * Block edit function
 */
function Edit( props ) {
	const {
		attributes,
		setAttributes,
		isSelected,
		className,
		clientId,
	} = props

	const {
		minTime,
		maxTime
	} = attributes

	// Use the clientId as a unique id for the block. This will be saved the first time the block is added.
	const getBlockId =
		typeof attributes.blockId === 'string'
			? attributes.blockId
			: clientId;

	// Do when the block is first rendered.
	useEffect( () => {
		// We only need update the saved attribute if it's not already set. :)
		if ( typeof attributes.blockId !== 'string' ) {
			setAttributes( { blockId: getBlockId } );
		}
	}, [])

	return (
		<Fragment>
			{ isSelected && <Inspector { ...props } /> }
			<div
				className={ `porchy-click-game ${ className }` }
				id={ `porchy-cid-${ getBlockId }` }
			>
				{ ! isSelected && (
					<Game
						minTime={ minTime }
						maxTime={ maxTime }
						playable="no"
					/>
				) }
				{ isSelected && (
					<Fragment>
						<Game
							minTime={ minTime }
							maxTime={ maxTime }
							playable="yes"
						/>
					</Fragment>
				) }
			</div>
		</Fragment>
	);
}

export default Edit