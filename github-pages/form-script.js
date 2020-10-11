/*!
	version: 1.0.0
	author: Clinton Mulligan
	license: BSD 3-Clause License
	Copyright (c) 2020, Clinton Mulligan. All rights reserved.
	https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md
!*/

import { returnSolutions } from "../src/index.js";

function displayOutput() {

	const form = document.getElementById( "form1" );

	let settings = {
		"removeDuplicates": form.removeDuplicates.checked,
		"removeZeroes": true,
		"returnHTML": form.returnHTML.checked,
		"returnRaw": false,
		"returnSubsets": form.returnSubsets.checked,
		"returnTime": form.returnTime.checked,
		"uniqueTarget": true
	};

	// Remove whitespace and trailing comma from Form inputs and make numbers.
	let multiset = form.inputCSV.value.replace( /(^\s*,)|(,\s*$)/g, "" )
		.split( "," )
		.map(( number ) => Number( number.trim()));

	// Make form input for target a number.
	let target = Number( form.inputTarget.value );

	const reply = returnSolutions( target, multiset, settings );

	function appendOutput( label, contents ) {
		// create Header.
		let labelNode = document.createElement( "H3" );
		let labelText = document.createTextNode( label );
		labelNode.appendChild( labelText );

		// Create container.
		let divNode = document.createElement( "div" );
		divNode.setAttribute( "class", "output" );

		divNode.appendChild( contents );

		// Append outputDiv
		document.getElementById( "outputDiv" ).appendChild( labelNode );
		document.getElementById( "outputDiv" ).appendChild( divNode );
	}

	if ( settings.returnTime ) {
		const fragment = document.createDocumentFragment();
		let textNode = document.createElement( "P" );
		let text = document.createTextNode( reply.time );
		textNode.appendChild( text );
		fragment.appendChild( textNode );

		appendOutput( "Time:", fragment );
	}

	if ( settings.returnHTML ) {
		appendOutput( "Rendered List:", reply.html );
	}

	if ( settings.returnSubsets ) {
		const fragment = document.createDocumentFragment();

		reply.subsets.forEach( array => {
			let subsetNode = document.createElement( "P" );
			let text = document.createTextNode( `[ ${array.join( ", " )} ]` );
			subsetNode.appendChild( text );

			fragment.appendChild( subsetNode );
		});

		appendOutput( "Subset Arrays:", fragment );
	}
}

document.body.addEventListener( "runScript", displayOutput );
