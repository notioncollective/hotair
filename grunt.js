module.exports = function(grunt) {
  grunt.initConfig({
  	pkg: '<json:package.json>',
  	meta: {
  		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
  			'<%= grunt.template.today("yyyy-mm-dd") %> */' 
  	},
	  // lint: {
	    // all: ['public/js/components/*.js', 'public/js/modules/*.js', 'public/js/scenes/*.js', 'grunt.js']
	  // },
	  // minify & concat in one step
	  min: {
	    dist: {
	      src: ['<banner>', 'public/js/lib/*.js', 'public/js/modules/HA.js', 'public/js/modules/HA.*.js', 'public/js/components/*.js', 'public/js/scenes/*.js', 'public/js/main.js'],
	      dest: 'public/js/dist/build.js'
	    }
	  }
	});
};