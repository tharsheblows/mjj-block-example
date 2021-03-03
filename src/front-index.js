/**
 * The entry point for building the front end.
 * This is working around the file structure already set up for the block editor blocks.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Game from './blocks/click-game/components/game.js';

const elementsToRender = document.getElementsByClassName( 'porchy' );

const blockNameToComponents = {
	'porchy/clickgame': Game,
};

for ( let element of elementsToRender ) {

	const attrString = element.getAttribute( 'data-attr' ); // The JSON string with the attributes.
	const blockName = element.getAttribute( 'data-block' ); // The block's name.
	const attr = JSON.parse( attrString ); // Putting the attributes in a JSON object.
	const ComponentToUse = blockNameToComponents[ blockName ]; // Which component should this use?

	ReactDOM.render( <ComponentToUse attr={ attr } />, element ); // Render the component.
}
