/*!
	version: 1.0.0
	author: Clinton Mulligan
	license: BSD 3-Clause License
	Copyright (c) 2020, Clinton Mulligan. All rights reserved.
	https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md
!*/

// ANCHOR docblock
/**
 * @module index
 *
 * @version 1.0.0
 * @author Clinton Mulligan
 * @license BSD 3-Clause License
 * Copyright (c) 2020, Clinton Mulligan
 * All rights reserved.
 * {@link https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md | LICENSE}
 *
 * @desc Wrapper function to render and format results from findSubsets function.
 *
 * PRECONDITIONS:
 * 	* Given an array of numbers.
 * 	* Given a target number.
 * 	* Numbers may be positive, negative, decimal, or zero.
 *
 * POSTCONDITIONS:
 * 	* Returns an Object with selected return options.
 *
 * SIDE EFFECTS:
 *
 * INVARIANTS:
 *
 * @see {@link https://en.wikipedia.org/wiki/Subset_sum_problem | Subset sum problem}
 *
 // ANCHOR examples
 * @example <caption>Usage of returnSolutions</caption>
 * import { returnSolutions } from "./index.js";
 *
 * let multiset = [ 1, 2, 3, 4, 5 ];
 * let target = 6;
 *
 * let settings = {
 * 	"removeDuplicates": false,
 * 	"removeZeroes": true,
 * 	"returnHTML": false,
 * 	"returnRaw": false,
 * 	"returnSubsets": true,
 * 	"returnTime": true,
 * 	"uniqueTarget": true
 * 	};
 *
 * const reply = returnSolutions( target, multiset, settings );
 *
 * console.log(reply.time);
 * // expected output: .oo1 seconds
 *
 * console.log(reply.subsets);
 * // expected output: [ [ 5, 1 ], [ 4, 2 ], [ 3, 2, 1 ] ]
 *
 * @requires module:find-subsets
 * @requires module:format-html
 * @exports returnSolutions
 */

// ANCHOR imports and exports
import { findSubsets } from "./lib/find-subsets.js";
import { formatHTML } from "./lib/format-html.js";
export { returnSolutions };

/**
 * @function returnSolutions
 * @param {!number} target - Target number every subset should add up to.
 * @param {!Array.<number>} array - Array of numbers to compose subsets from.
 * @param {Object} [inputOptions = {}] - An object of different settings and returns to choose from.
 * @return {Object} Object containing different formats of the subset solutions.
 */
// ANCHOR Function expression
const returnSolutions = ( target, inputArray, inputOptions = {}, terms = undefined ) => {

	// ANCHOR Default Options
	const defaultOptions = {
		"removeDuplicates": false,
		"removeZeroes": true,
		"returnHTML": false,
		"returnRaw": false,
		"returnSubsets": true,
		"returnTime": false,
		"uniqueTarget": true
	};

	const options = { ...defaultOptions, ...inputOptions };
	const returnObject = {
		"target": target,
		"multiset": inputArray
	};

	let results = [];

	// ANCHOR Remove Zeroes
	// Zeroes are frivolous. A zero (0) adds nothing to a branch's total sum.
	// They can be added to every branch without impact. One Zero will duplicate
	// results and 2 zeroes (accounting for multiplicity) would quadruple the
	// results. Therefore, while the math can handle multiple zeroes, the default
	// option is to remove them.
	if ( options.removeZeroes === true ) {
		inputArray = inputArray.filter(( n ) => n !== 0 );
	}

	// ANCHOR Remove all but one target number from inputs
	// For similar reason as Zeroes, If the inputArray has many numbers that equal
	// the target, the branches are duplicated and explode.
	// This behavior makes the performance on par with combination techniques.
	// We include one target as a way to identify zero-sum sets. To get all chains
	// of target and zero-sum subsets set to false. (if you know what you are doing.)
	if ( options.uniqueTarget === true ) {
		let before = inputArray.length;
		inputArray = inputArray.filter(( n ) => n !== target );
		let after = inputArray.length;
		if ( before !== after ) {
			inputArray.push( target );
		}
	}

	// ANCHOR Main action
	// Run findSubsets to get solutions.
	// Depending on options alter results before appending to returnObject.
	if ( options.returnTime !== true ) {

		results = findSubsets( target, inputArray, terms );
	} else {

		// ANCHOR options.returnTime
		// Performance.now() has built in accuracies to protect against certain
		// security exploits.
		/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now | Reduced time precision} */
		const t0 = performance.now();
		results = findSubsets( target, inputArray, terms );
		const t1 = performance.now();

		returnObject["time"] = `${( t1 - t0 ) / 1000} seconds`;
	}

	// ANCHOR options.returnHTML
	if ( options.returnHTML === true ) {
		returnObject["html"] = formatHTML( results, inputArray );
	}

	// ANCHOR options.returnRaw
	if ( options.returnRaw === true ) {
		returnObject["raw"] = results;
	}

	// ANCHOR options.returnSubsets
	if ( options.returnSubsets === true ) {
		returnObject["subsets"] = results.map(( string ) => string.split( "," ).map(( number ) => Number( number.split( "^" )[0])));
	}

	// ANCHOR Return returnObject
	return returnObject;
};
