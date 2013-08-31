
var shellInterval = require('../index.js');
var ArgumentParser = require("argparse").ArgumentParser;
var parser = new ArgumentParser({
	version: "0.1.0",
	addHelp: true,
	description: "Set an interval or timeout for shell command execution.",
});
parser.addArgument(
	['-t', '--time'],
	{
		help: 'Seconds between calls.',
		type: "int",
	}
);
parser.addArgument(
	['-c', '--command'],
	{
		help: 'The quoted shell command to execute.',
	}
);
parser.addArgument(
	['-e', '--eager'],
	{
		help: 'Make the first call to [command] immediately, instead of after the interval.',
		default: false,
		action: "storeTrue",
	}
);
parser.addArgument(
	['-q', '--quiet'],
	{
		help: "Don't log output to the terminal.",
		default: false,
		action: "storeTrue",
	}
);
parser.addArgument(
	['-r', '--reps'],
	{
		help: "Number of intervals to loop through. [default: infinite]",
		type: "int",
		default: "-1",
	}
);
var options = parser.parseArgs();
var id = shellInterval({
	options: options,
});

//console.log(id);

