module.exports = function(grunt) {
	'use strict';

	var istanbul = require('istanbul');

	// load the grunt setup
	require('load-grunt-config')(grunt);

	grunt.event.on('coverage', function (coverage) {
		grunt.config('coverage.coverage', coverage);
	});

	grunt.registerMultiTask('coverage', 'Generates coverage reports for JS using Istanbul', function () {

		if (this.target === 'instrument') {

			var ignore = this.data.ignore || [];
			var instrumenter = new istanbul.Instrumenter();

			this.files.forEach(function (file) {

				var src = file.src[0],
					instrumented = grunt.file.read(src);

				// only instrument this file if it is not in ignored list
				if (!grunt.file.isMatch(ignore, src)) {
					instrumented = instrumenter.instrumentSync(instrumented, src);
				}

				// write
				grunt.file.write(file.dest, instrumented);
			});

			return;
		}

		if (this.target === 'report') {

			this.requiresConfig('coverage.coverage');

			var Report = istanbul.Report;
			var Collector = istanbul.Collector;
			var reporters = this.data.reports;
			var dest = this.data.dest;
			var collector = new Collector();

			// fetch the coverage object we saved earlier
			collector.add(grunt.config('coverage.coverage'));

			reporters.forEach(function (reporter) {

				Report.create(reporter, {
					dir: dest + '/' + reporter
				}).writeReport(collector, true);

			});

			return;
		}

		grunt.warn('Unknown target - valid targets are "instrument" and "report"');
	});

	grunt.registerMultiTask('test', 'Run JS Unit tests', function () {
		var options = this.options();

		var tests = grunt.file.expand(options.files).map(function(file) {
			return '../' + file;
		});

		// build the template
		var template = grunt.file.read(options.template).replace('{{ tests }}', JSON.stringify(tests)).replace('{{ baseUrl }}', JSON.stringify(options.baseUrl));

		// write template to tests directory and run tests
		grunt.file.write(options.runner, template);

		if (this.target === 'travis') {
			grunt.task.run('mocha:travis');
			return;
		} else if (this.target === 'coverage'){
			grunt.task.run('coverage:instrument', 'mocha:coverage', 'coverage:report');
			return;
		}
	});
};
