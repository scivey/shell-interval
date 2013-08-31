var sinon = require("sinon");
var shellInterval = require("../");
var assert = require("assert");

var execSpy = sinon.spy();

describe("shell-interval", function() {

	var execFn;
	var cmd = "echo hello";

	beforeEach(function() {
		execFn = sinon.spy();
	})

	it("calls onFinish at the end of a finite number of --reps.", function(done) {
		this.timeout(2000);
		var exec = sinon.spy();
		shellInterval({
			options: {
				command: cmd,
				time: 1,
				reps: 1,
			},
			onExec: execFn,
			onFinish: function() {
				done();
			}
		});
	});

	it("calls the onExec parameter passed to it to handle each shell call.", function(done) {
		this.timeout(4000);
		execFn = sinon.spy();
		shellInterval({
			options: {
				command: cmd,
				time: 1,
				reps: 1,
			},
			onExec: execFn,
			onFinish: function() {
				//console.log("finished");
				assert.ok(execFn.called);
				done();
			}
		});
	});

	it("calls onExec exactly --reps times when that flag is passed.", function(done) {
		this.timeout(8000);
		var exec = sinon.spy();
		shellInterval({
			options: {
				command: cmd,
				time: 1,
				reps: 3
			},
			onExec: exec,

			onFinish: function() {
				//console.log("finished");
				//console.log("finished");
				assert.equal(exec.callCount, 3);
				done();
			},
		});
	});

	it("executes the shell command passed to it in `options.command`", function(done) {
		this.timeout(8000);
		var command = "echo someOutput";
		var expectedRegex = /^someOutput(?:\s*)?$/
		var actualOutput = "";
		var exec = sinon.spy();
		shellInterval({
			options: {
				command: command,
				time: 1,
				reps: 1
			},
			onExec: function(err, stdout, stderr) {
				if (err) throw err;
				actualOutput = stdout;
			},
			onFinish: function() {
				//console.log("finished");
				//console.log("finished");
				//console.log(actualOutput);
				assert.ok(expectedRegex.test(actualOutput));
				done();
			},
		});
	});

});

/*
	it("calls onExec an exact number of times, specified by params.options.reps", function(done) {
		shellInterval({
			options: {
				command: cmd,
				time: 1,
				reps: 5,
			},
			onExec: execFn,
			onFinish: function() {
				assert(execFn.called)
			}
		})
	})
shellInterval({
	options: {
		command: "echo hello",the 
		time: 3,
		reps: 2
	},
	onExec: execSpy();
});


}
*/