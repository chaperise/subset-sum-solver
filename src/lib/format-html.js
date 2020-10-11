/*!
	version: 1.0.0
	author: Clinton Mulligan
	license: BSD 3-Clause License
	Copyright (c) 2020, Clinton Mulligan. All rights reserved.
	https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md
!*/

// ANCHOR docblock
/**
 * @module format-html
 *
 * @version 1.0.0
 * @author Clinton Mulligan
 * @license BSD 3-Clause License
 * Copyright (c) 2020, Clinton Mulligan
 * All rights reserved.
 * {@link https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md | LICENSE}
 *
 * @desc Function renders an array of strings into an HTML block.
 *
 * PRECONDITIONS:
 * 	* Given an array of strings in format "number^index".
 * 	* Given the sorted inputArray index are associated with.
 *
 * POSTCONDITIONS:
 *  * Returns a Fragment for inserting into DOM.
 *  * Indexes converted into multiplicity of numbers.
 *
 * SIDE EFFECTS:
 *
 * INVARIANTS:
 *
 // ANCHOR examples
 * @example <caption>Usage of formatHTML</caption>
 * import { findSubsets } from "./find-subsets.js";
 * import { formatHTML } from "./format-html.js";
 *
 * // Note: multiset is sorted from lowest to highest value at highest index.
 * let multiset = [ 1, 1, 2];
 * let target = 3;
 *
 * results = findSubsets( target, multiset );
 * console.log(results);
 * // expected output: [ "2^3,1^0", "2^3,1^1" ]
 *
 * let fragment = formatHTML(results, multiset);
 * document.getElementById( "output" ).appendChild( fragment );
 *
 *	<div id="output">
 *		<p>1<sup>a</sup>, 2</p>
 *		<p>1<sup>b</sup>, 2</p>
 *	</div>
 *
 * @exports formatHTML
 */

// ANCHOR imports and exports
export { formatHTML };

const sumArray = ( array ) => {
	let list = array.map( x => x ); return ( array.length === 0 ) ? null : list.reduce(( x, y ) => Math.round(( Number( x ) + Number( y )) * 1e12 ) / 1e12 );
};

/**
 * @function formatHTML
 * @param {!Array.<string>} subsetArray - Array of strings format "number^index".
 * @param {!Array.<numbers>} inputArray - Original array of numbers sorted in ascending order.
 * @return {DOMError.<fragment>} Fragment of HTML for insertion in DOM.
 */

// ANCHOR function expression
const formatHTML = ( subsetArray, inputArray ) => {

	inputArray = inputArray.reverse();
	let multiplicity = [];
	let counter = 1;

	for ( let index = inputArray.length; index--; ) {

		if ( inputArray[index] === inputArray[index + 1]) {
			multiplicity.pop();
			multiplicity.push( counter );

			counter++;
			multiplicity.push( counter );

		} else {
			multiplicity.push( 0 );
			counter = 1;
		}
	}

	// ANCHOR Dictionary for multiplicity
	// Use an Object so translation of alphabet can be portable.
	/** @TODO Call an external object for enumeration of alphabet for multiplicity. */
	let dictionary = {
		0: "",
		1: "a",
		2: "b",
		3: "c",
		4: "d",
		5: "e",
		6: "f",
		7: "g",
		8: "h",
		9: "i",
		10: "j",
		11: "k",
		12: "l",
		13: "m",
		14: "n",
		15: "o",
		16: "p",
		17: "q",
		18: "r",
		19: "s",
		20: "t",
		21: "u",
		22: "v",
		23: "w",
		24: "x",
		25: "y",
		26: "z"
	};

	// ANCHOR Convert index to Multiplicity
	function getMultiplicity( index ) {
		return dictionary[multiplicity[index]];
	}

	// ANCHOR Construct HTML of number<sup>multiplicity</sup>
	function decorateNumber( number, index, hasComma = true ) {
		let phrase = document.createDocumentFragment();
		let supNode = document.createElement( "SUP" );
		let comma = document.createTextNode( ", " );
		let sup = getMultiplicity( index );

		if ( sup !== "" ) {
			let text = document.createTextNode( number );
			let supText = document.createTextNode( sup );

			phrase.appendChild( text );
			supNode.appendChild( supText );
			phrase.appendChild( supNode );

		} else {
			let text = document.createTextNode( number );

			phrase.appendChild( text );
		}

		if ( hasComma ) {
			phrase.appendChild( comma );
		}

		return phrase;
	}

	// ANCHOR Construct return Fragment
	const fragment = document.createDocumentFragment();

	// Header
	const headerFound = document.createElement( "H4" );
	const textFound = document.createTextNode( `Found ${subsetArray.length} Subsets` );
	headerFound.appendChild( textFound );

	const header = document.createElement( "P" );
	const text = document.createTextNode( "Input: " );
	header.appendChild( text );

	// inputArray Reference
	inputArray.reverse().forEach(( number, index ) => {
		let arrayNode = document.createElement( "SPAN" );

		if ( index === inputArray.length - 1 ) {

			arrayNode.appendChild( decorateNumber( number, index, false ));
		} else {

			arrayNode.appendChild( decorateNumber( number, index, true ));
		}

		header.appendChild( arrayNode );
	});

	fragment.appendChild( headerFound );
	fragment.appendChild( header );

	// Subset Output.
	const preppedArray = subsetArray.reverse().map(( string ) => string.split( "," ).reverse());

	preppedArray.forEach(( array ) => {
		let subsetNode = document.createElement( "P" );
		let sum = sumArray(( array.map(( item ) => item.split( "^" )[0])));

		array.forEach(( number, index ) => {
			let [ value, indexTag ] = number.split( "^" );

			if ( index === array.length - 1 ) {

				subsetNode.appendChild( decorateNumber( value, indexTag, false ));
			} else {

				subsetNode.appendChild( decorateNumber( value, indexTag, true ));
			}
		});

		fragment.appendChild( subsetNode );
		let sumNode = document.createElement( "SPAN" );
		let text = document.createTextNode( ` = ${sum}` );
		sumNode.appendChild( text );
		subsetNode.appendChild( sumNode );
	});

	return fragment;
};
