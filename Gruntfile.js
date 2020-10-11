module.exports = function( grunt ) {

	grunt.initConfig({
		eslint: {
			options: {
				configFile: ".eslintrc.json",
				format: "html",
				outputFile: "docs/eslint-fix-report.html",
				fix: true
			},
			target: [
				"src/**/*.js"
			]
		},
		"remove-js-comments": {
			docco: {
				options: {
					removeJSDocs: true,
					removeMultilines: true,
					removeAnchors: true,
					removeSpecials: false,
					removeHeaderLines: false,
					removeDoubleSlashes: false,
					removeHTMLStyle: false,
					removeRegex: ""
				},
				cwd: "src",
				src: [ "**/*.*" ],
				dest: "www",
				expand: true
			},
			jsdoc: {
				options: {
					removeJSDocs: false,
					removeMultilines: false,
					removeAnchors: true,
					removeSpecials: false,
					removeHeaderLines: true,
					removeDoubleSlashes: true,
					removeHTMLStyle: false,
					removeRegex: ""
				},
				cwd: "src",
				src: [ "**/*.*" ],
				dest: "api",
				expand: true
			},
			release: {
				options: {
					removeJSDocs: true,
					removeMultilines: true,
					removeAnchors: true,
					removeSpecials: false,
					removeHeaderLines: true,
					removeDoubleSlashes: true,
					removeHTMLStyle: true,
					removeRegex: ""
				},
				cwd: "src",
				src: [ "**/*.*" ],
				dest: "release",
				expand: true
			}
		},
		"docco-plus": {
			docco: {
				src: [ "www/**/*.js" ],
				options: {
					css: "docs/doc-settings/docco/docco-style.css",
					output: "docs/Narrative"
				}
			}
		},
		jsdoc: {
			doc: {
				src: [ "api/**/*.js" ],
				options: {
					configure: "docs/doc-settings/better-docs/jsdoc.json",
					template: "node_modules/better-docs",
					destination: "docs/Technical"
				}
			}
		},
		clean: { documents: { src: [ "www", "api" ] } },

		pkg: grunt.file.readJSON( "package.json" )
	});

	grunt.loadNpmTasks( "@armirage/grunt-remove-js-comments" );
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-docco-plus" );
	grunt.loadNpmTasks( "grunt-eslint" );
	grunt.loadNpmTasks( "grunt-jsdoc" );

	grunt.registerTask( "default", [ "eslint", "remove-js-comments", "docco-plus:docco", "jsdoc:doc", "clean:documents" ]);
};
