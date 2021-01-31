/**
 * External dependencies
 */
import { useState, useEffect } from 'react'
import { sprintf, __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import ClickCircle from './click-circle'

function Game ( props ) {

	const { minTime, maxTime, playable } = props

		// If min and max are not correct, swap them.
	const min = maxTime > minTime ? parseInt(minTime) : parseInt(maxTime)
	const max = maxTime > minTime ? parseInt( maxTime ) : parseInt( minTime )

	// Allows use in the editor.
	const defaultStatus = ( playable === 'no' ) ?
		sprintf(
			__( 'Click to edit. Min time: %d Max time: %d', 'porchy' ),
			minTime,
			maxTime
		)
		:
		sprintf(
			__( 'Click to start, click again in %d to %d seconds to win.', 'porchy' ),
			min,
			max
		)

	const [ gameState, setGameState ] = useState( 'start' )
	const [ start, setStart ] = useState( null )
	const [ gameStatus, setGameStatus ] = useState( defaultStatus )

	const getResult = () => {
		// When is the window to win?
		const winFrom = ( min * 1000 ) + start
		const winTo = ( max * 1000 ) + start

		const now = new Date().getTime()
		const timeElapsed = ( now - start ) / 1000

		if ( now <= winTo && now >= winFrom ){
			return {
				status: sprintf(
					 __( 'You won! You clicked after %f seconds.', 'porchy' ),
					 timeElapsed
				),
				state: 'won'
			}
		} else {
			return {
				status: sprintf(
					__( 'You lost! You clicked after %f seconds.', 'porchy' ),
					timeElapsed
				),
				state: 'lost',
			}
		}
	}

	const clicked = () => {
		if( playable === 'no' ){
			return
		}
		switch( gameState ){
			case 'start':
				setStart( new Date().getTime() )
				setGameStatus(
					__( `Click again in ${ min } to ${ max } seconds to win`, 'porchy' )
				)
				setGameState( 'running' )
				break
			case 'running':
				const result = getResult()
				setGameStatus( result.status )
				setGameState( result.state )
				break
			default:
				setGameStatus( defaultStatus )
				setGameState('start')
		}
	}

	// If the minTime or maxTime are updated while playing the game, start over.
	useEffect( () => {
		setGameStatus( defaultStatus )
		setGameState('start')
	}, [minTime, maxTime])

	return (
		<div className="game" onClick={ () => clicked() }>
			<ClickCircle circleState={gameState} />
			<p className="game-status">{ gameStatus }</p>
		</div>
	)

}

export default Game