const fs = require( "fs" );
const path = require( "path" ).posix;
const execSync = require( "child_process" ).execSync;

const VUE_WRAPPER = process.env.IS_DEV ? "source/vue-wrapper.js" : "lib/vue-wrapper.js";
const REACT_WRAPPER = process.env.IS_DEV ? "source/react-wrapper.jsx" : "lib/react-wrapper.js";

module.exports = function bundle( Components, out, config ) {
	if ( !Components.length ) {
		return;
	}
	const vueComponents = Components.filter( c => c.component.type === "vue" );
	const reactComponents = Components.filter( c => c.component.type === "react" );
	const entry = path.join( out.replace( /\\/g, "/" ), "entry.js" ).replace( /\\/g, "/" );
	const absoluteOut = path.resolve( out ).replace( /\\/g, "/" );

	let init = `
    window.reactComponents = {};\n
    window.vueComponents = {};\n
  `;
	if ( vueComponents.length ) {
		init = init + `
      import Vue from 'vue/dist/vue.js';\n
      window.Vue = Vue;\n

      import VueWrapper from '${path.relative( absoluteOut, path.join( __dirname, VUE_WRAPPER ).replace( /\\/g, "/" ))}';\n
      window.VueWrapper = VueWrapper;\n
    `;
	}
	if ( reactComponents.length ) {
		init = init + `
      import React from "react";\n
      import ReactDOM from "react-dom";\n

      import ReactWrapper from '${path.relative( absoluteOut, path.join( __dirname, REACT_WRAPPER ).replace( /\\/g, "/" ))}';\n

      window.React = React;\n
      window.ReactDOM = ReactDOM;\n
      window.ReactWrapper = ReactWrapper;\n
    `;
	}

	// Import css
	init = init + `
    import './styles/reset.css';\n
    import './styles/iframe.css';\n
  `;

	if ( config.betterDocs.component ) {
		if ( config.betterDocs.component.wrapper ) {
			const absolute = path.resolve( config.betterDocs.component.wrapper );
			init += `
      import _CustomWrapper from '${path.relative( absoluteOut, absolute )}';\n
      window._CustomWrapper = _CustomWrapper;\n
      `;
		}
		if ( config.betterDocs.component.entry
      && config.betterDocs.component.entry.length ) {
			init = `${config.betterDocs.component.entry.join( "\n" )}\n${init}`;
		}
	}

	const entryFile = init + Components.map(( c, i ) => {
		const { displayName, filePath, type } = c.component;
		const relativePath = path.relative( absoluteOut, filePath.replace( /\\/g, "/" ));
		const name = `Component${i}`;
		return [
			`import ${name} from '${relativePath}';`,
			`${type}Components['${displayName}'] = ${name};`
		].join( "\n" );
	}).join( "\n\n" );

	console.log( "Generating entry file for \"components\" plugin" );
	fs.writeFileSync( entry, entryFile );
	console.log( "Bundling components" );
	const outDist = path.join( out.replace( /\\/g, "/" ), "build" ).replace( /\\/g, "/" );
	const cmd = `parcel build ${entry} --out-dir ${outDist}`;
	console.log( `running: ${cmd}` );
	try {
		execSync( cmd );
	} catch ( error ) {
		if ( error.output && error.output.length ) {
			console.log( error.output[ 1 ].toString());
		}
		throw error;
	}
};
