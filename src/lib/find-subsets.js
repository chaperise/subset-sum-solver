/*!
	version: 1.0.0
	author: Clinton Mulligan
	license: BSD 3-Clause License
	Copyright (c) 2020, Clinton Mulligan. All rights reserved.
	https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md
!*/

// ANCHOR docblock
/**
 * @module find-subset-sums
 *
 * @version 1.0.0
 * @author Clinton Mulligan
 * @license BSD 3-Clause License
 * Copyright (c) 2020, Clinton Mulligan
 * All rights reserved.
 * {@link https://github.com/armirage/subset-sum-solver/blob/master/LICENSE.md | LICENSE}
 *
 * @desc In computer science, the subset sum problem (SSP) is an important decision
 * problem in complexity theory and cryptography. There are several equivalent
 * formulations of the problem.
 *
 * One example; Knapsack problem. Given a knapsack of size 's' and items of
 * varying sizes 'w', what combinations of items will pack the knapsack with the
 * most stuff.
 *
 * The 'problem' is while it is relatively easy to check if a subset is correct,
 * it is exponentially harder to find the subset as a solution. This makes the
 * SSP NP-Complete. A group of Math problems whose renown difficulty have been
 * both the bane and advantage to things like cryptography, packing problems,
 * navigation, etc.
 *
 * There are techniques with different advantages and disadvantages.
 * This technique uses a Branch-and-Bound with early pruning as an heuristic
 * sieve to solve the problem quickly. Quicker than any comparative technique.
 *
 * (Some techniques are quicker with small input sizes.)
 *
 * PRECONDITIONS:
 * 	* Given an array of numbers.
 * 	* Given a target number.
 * 	* Numbers may be positive, negative, decimal, or zero.
 *
 * POSTCONDITIONS:
 *  * Returns an Array of strings. Each string is the number and its index.
 *  * (This is to retain multiplicity of the numbers. In concert with the
 *    original array the index can be used to discern the exact input returned.)
 *
 * SIDE EFFECTS:
 *
 * INVARIANTS:
 *
 * @see {@link https://en.wikipedia.org/wiki/Subset_sum_problem | Subset sum problem}
 *
 // ANCHOR examples
 * @example <caption>Usage of findSubsets</caption>
 * import { findSubsets } from "./find-subset-sums.js";
 *
 * let multiset = [ 1, 2, 3, 4, 5 ];
 * let target = 6;
 *
 * results = findSubsets( target, multiset );
 * console.log(results);
 * // expected output: [ "5^4,1^0", "4^3,2^1", "3^2,2^1,1^0" ]
 *
 * @exports findSubsets
 */

// ANCHOR imports and exports
export { findSubsets };

/**
 * @function findSubsets
 * @param {!number} target - Target number every subset should add up to.
 * @param {!Array.<number>} array - Array of numbers to compose subsets from.
 * @return {Array.<string>} An array of strings, each string is format
 * "number^index,number^index", of subset solutions.
 */
// ANCHOR function declaration
function findSubsets( target, multiset ) {

	const container = [];
	let processes = 0;

	// To test efficiency uncomment deadBranches related code. (3 places)
	// const deadBranches = [];

	// Sorting the inputArray is a performance overhead. Preferably I would like
	// to remove it but it is necessary for the maths to work.
	// Keeping it here is keeping the solution-finder self contained.
	multiset.sort(( x, y ) => Number( x ) - Number( y ));

	let positiveRelativity = 0;
	let negativeRelativity = 0;

	// When adding decimals together be sure to convert to Integer and then back with Math.round((x + y) * 1e12) / 1e12.
	// The relativity array is each number in relation to its sign group. This is associative array matches index with
	// the multiset. This brings the current reference memory space to 2N (N being the size of inputs in terms not bytes).
	const relArray = multiset.map(( n ) => n >= 0 ? positiveRelativity = Math.round(( positiveRelativity + n ) * 1e12 ) / 1e12 : negativeRelativity = Math.round(( negativeRelativity + n ) * 1e12 ) / 1e12 );

	// ANCHOR Target outside range of input array
	// Sanity check. If all the positives added together can not achieve the goal,
	// vice versa for negative targets, return empty set.
	if ( target < Math.min( ...relArray ) || target > relArray[relArray.length - 1]) {
		// console.log(`Target (${target}) is outside possible range (${Math.min(...relArray)} to ${relArray[relArray.length - 1]})`)
		return [];
	}

	// The Math is a Greedy heuristic. It attempts to take the biggest value for a child node.
	// Therefore, the spread is usually the biggest negative's relativity not taken already or 0 max.
	// We get the initial and subtract negatives as we grab children nodes. See inside the main loop.
	// const min = Math.min( ...relArray );
	let spread = Math.min( ...relArray ) < 0 ? Math.min( ...relArray ) : 0;

	// ANCHOR Begin recursion and building tree
	findChildren( target, spread );

	// ANCHOR Recursive function
	function findChildren( target, _sgn, branch = [], ignoreIndexes = []) {

		// ANCHOR Main loop
		for ( let index = multiset.length; index--; ) {

			// We ignore ancestors and numbers that have already been deemed too big or too small.
			if ( ignoreIndexes.includes( index )) {
				continue;
			}

			const number = multiset[index];

			// ANCHOR Maths
			let bigEnough = number >= 0 ? Math.abs( number ) <= Math.abs( target - spread ) : Math.abs( number ) <= Math.abs( target );
			let smallEnough = number >= 0 ? relArray[index] >= target : Math.round(( relArray[index] - target ) * 1e12 ) / 1e12 >= target;

			// ANCHOR Break early last index
			// If the number is the smallest number it is either the target or already
			// a child in another branch. Therefore, Maths can be skipped.
			// It also the last stop for branches that can not complete.
			// To test efficiency uncomment deadBranches.
			if ( index === 0 && number !== target ) {
			//	deadBranches.push( branch );
				processes--;
				break;
			}

			// ANCHOR Exact match to target
			if ( number === target ) {
				let subset = [ ...branch ];
				subset.push( `${multiset[index]}^${index}` );
				container.push( subset.join( "," ));
			}

			// ANCHOR Select child that is Not Too Big or Too Small
			// Push the child into the branch as its index. Associated with multiset
			// this captures number value and multiplicity.
			if ( bigEnough && smallEnough ) {

				// Child found. Push to current branch, change state, and call function again.
				// `${index}`
				let newTarget = Math.round(( target - number ) * 1e12 ) / 1e12;

				let newIgnore = [ ...ignoreIndexes ];
				newIgnore.push( index );

				// Add to current branch building the subset as code progresses.
				let newBranch = [ ...branch ];
				newBranch.push( `${multiset[index]}^${index}` );

				// Adjust spread (which is opposite sign group) if negative number is taken as child.
				let newSpread = _sgn;

				if ( number < 0 ) {
					newSpread = Math.round(( _sgn - number ) * 1e12 ) / 1e12;
				}

				// Run with new state
				// setTimeout( findChildren( newTarget, newSpread, newBranch, newIgnore ), 0 );
				findChildren( newTarget, newSpread, newBranch, newIgnore );
			}

			// If the number was Too big or small on this iteration it will likely be
			// the same for subsequent phases along this branch. Ignore it.
			ignoreIndexes.push( index );
		}
	}

	// ANCHOR findSubsets output
	// console.log( "Dead branches:", deadBranches.length );

	// Array of strings format number value and multiplicity: "number^index".
	// An external function will render the index as multiplicity. (presentation)
	return container;
}
