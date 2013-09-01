var exec = require("child_process").exec;
//require("js-yaml");
//var data = require("./data.yml");
var _ = require("lodash");

var runShellCommand = function(command, callback) {
  	var child = exec(command, callback)
};
var shellCallbacks = {
	quiet: function(err, stdout, stderr) {
		if (err) throw err;
	},
	verbose: function(err, stdout, stderr) {
		if(err) throw err;
	    if(stdout) console.log(stdout);
	    if (stderr) console.log(stderr);
	},
};


var ShellInterval = function(params) {
	//console.log(params);

	// params = {options, onExec, onFinish}
	// onExec -- called to handle each shell response
	// onFinish -- if a fixed number of iterations is set, this will be called at the end

	// accepted options:
	// 	 --eager, boolean : whether to execute once immediately before starting interval
	// 	 --quiet, boolean : whether to (not) log output to terminal
	// 	 --command, string : the shell command to execute
	// 	 --time, int : interval between shell calls, in seconds.
	


	var options = params.options;
		// runtime data
	var rtData = {
		// reps executed

		repsInvoked: null,
		repsResolved: 0,
		// id of interval, returned from `setInterval` below.
		intervalId: "",
	};

		// used by the setInterval callback if --reps was passed.
	var stopCalling = function() {
		//console.log(rtData.intervalId);
		clearInterval(rtData.intervalId);
		//console.log("stop calling")
	};

	// callback to pass to shell,
	var shellCallback;

	if (_.has(params, "onExec") ){
		shellCallback = params.onExec;
	} else {
		if ( options.quiet ) {
			// set callback to the quiet version if --quiet was passed.
			shellCallback = shellCallbacks.quiet;
		} else {
			shellCallback = shellCallbacks.verbose;
		}
	}
	
	if (_.has(options, "reps") && options.reps > 0) {
		var realCallback = shellCallback;
		shellCallback = function() {
			var args = Array.prototype.slice.call(arguments);
			rtData.repsResolved += 1;
			realCallback.apply(null, args);
		}
	}

	var callOnFinish = function() {
		if (rtData.repsResolved >= rtData.repsInvoked) {
			params.onFinish();
		} else {
			var timerId;
			timerId = setInterval(function() {
				if (rtData.repsResolved >= rtData.repsInvoked ) {
					clearInterval(timerId);
					params.onFinish();
				}
			}, 250);
		}
	};

	// call shell command once right now before setting interval, if --eager was passed.


	// time passed with -t is in seconds; convert to msec for setInterval call
	var interval = options.time * 1000;

	// if --reps wasn't passed, we just create an interval that cycles forever.
	
	this.start = function() {
		if (options.eager) {
			runShellCommand(options.command, shellCallback);
		}
		if (! options.reps) {
			//console.log("noreps");
			rtData.intervalId = setInterval(runShellCommand, interval, options.command, shellCallback);
		} else {
				//console.log("reps");
				rtData.repsInvoked = 0;
				if (options.eager) rtData.repsInvoked += 1; //compensate for initial execution
				rtData.intervalId = setInterval( function() {
					runShellCommand(options.command, shellCallback);
					rtData.repsInvoked += 1;

					if (rtData.repsInvoked >= options.reps) {
						// stop command execution
						stopCalling();
						if( _.has(params, "onFinish") ) {
							callOnFinish();
						}
					} 
				}, interval);
		}
	};

	this.getIntervalId = function() {
		return rtData.intervalId;
	}
	
};

var makeShellInterval = function(params) {
	var shellInt = new ShellInterval(params);
	shellInt.start();
	return shellInt.getIntervalId();
}

module.exports = makeShellInterval;
/*
var shellInterval = function(params) {

	//console.log(params);

	// params = {options, onExec, onFinish}
	// onExec -- called to handle each shell response
	// onFinish -- if a fixed number of iterations is set, this will be called at the end

	// accepted options:
	// 	 --eager, boolean : whether to execute once immediately before starting interval
	// 	 --quiet, boolean : whether to (not) log output to terminal
	// 	 --command, string : the shell command to execute
	// 	 --time, int : interval between shell calls, in seconds.
	var options = params.options;
		// runtime data
	var rtData = {
		// reps executed
		repsInvoked: null,
		repsResolved: 0,
		// id of interval, returned from `setInterval` below.
		intervalId: "",
	};

		// used by the setInterval callback if --reps was passed.
	var stopCalling = function() {
		//console.log(rtData.intervalId);
		clearInterval(rtData.intervalId);
		//console.log("stop calling")
	};

	// callback to pass to shell,
	var shellCallback;

	if (_.has(params, "onExec") ){
		shellCallback = params.onExec;
	} else {
		if ( options.quiet ) {
			// set callback to the quiet version if --quiet was passed.
			shellCallback = shellCallbacks.quiet;
		} else {
			shellCallback = shellCallbacks.verbose;
		}
	}
	
	if (_.has(options, "reps") && options.reps > 0) {
		var realCallback = shellCallback;
		shellCallback = function() {
			var args = Array.prototype.slice.call(arguments);
			rtData.repsResolved += 1;
			realCallback.apply(null, args);
		}
	}

	var callOnFinish = function() {
		if (rtData.repsResolved >= rtData.repsInvoked) {
			params.onFinish();
		} else {
			var timerId;
			timerId = setInterval(function() {
				if (rtData.repsResolved >= rtData.repsInvoked ) {
					clearInterval(timerId);
					params.onFinish();
				}
			}, 250);
		}
	};

	// call shell command once right now before setting interval, if --eager was passed.
	if (options.eager) runShellCommand(options.command, shellCallback);

	// time passed with -t is in seconds; convert to msec for setInterval call
	var interval = options.time * 1000;

	// if --reps wasn't passed, we just create an interval that cycles forever.
	if (! options.reps) {
		//console.log("noreps");
		rtData.intervalId = setInterval(runShellCommand, interval, options.command, shellCallback);
	} else {
			//console.log("reps");
			rtData.repsInvoked = 0;
			rtData.intervalId = setInterval( function() {
				runShellCommand(options.command, shellCallback);
				rtData.repsInvoked += 1;

				if (rtData.repsInvoked >= options.reps) {
					// stop command execution
					stopCalling();
					if( _.has(params, "onFinish") ) {
						callOnFinish();
					}
				} 
			}, interval);
	}

	return rtData.intervalId;

};
*/
