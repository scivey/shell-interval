# shell-interval

####`setInterval` for the command line.

---

```
npm install -g shell-interval
```

```Shell
$   shell-interval -t 5 -c "echo Hello." -r 3

Hello.      # 0:05
Hello.      # 0:10
Hello.      # 0:15
            # [stop]
```
```js
var shellInterval = require("shell-interval");
shellInterval({
    options: {
        command: "echo ten seconds has passed",
        time: 10,
        reps: 5,
    },
    onExec: function(err, stdout, stderr) {
        if (err) throw err;
        console.log(stdout);
    },
    onFinish: function() {
        console.log("The shell command was called five times. Exiting...");
    },
        
});
```



## Shell Usage

####Parameters
* __-c, --command__ :       
    The quote-delimited shell command to execute.
* __-t, --time__    :   
    The second interval between calls
* __-r, --reps__    :   
    The number of times to execute the command.  Default is infinite.
* __-q, --quiet__   :   
    Don't log stdout to the terminal. (boolean flag)
* __-e, --eager__ :     
    Execute the shell command once immediately, before starting the timer. (boolean flag)

#### Examples

* `shell-interval -c "[command]" -t 2` : Execute the `[command]` every ~ two seconds indefinitely, until a kill signal is received. (e.g. `^c`)

* `shell-interval -c "[command]" -t 5 -r 10` : Execute the `[command]` every ~five seconds until the command has been called ten times, and then exit.  `Command` is first invoked ~five seconds after the call to `shell-interval`.

* `shell-interval -c "[command]" -t 5 -r 10 -e` : Execute the `[command]` every ~five seconds until the command has been called ten times, and then exit.  Because the `-e` (`--eager`) flag was passed, the command is first executed as soon as node finishes initializing the script.

##Node API

The `shell-interval` module exports a single function with the same options as its command-line interface as well as hooks for two callbacks.  These callbacks can handle data returned from the shell calls (`onExec`) and perform any necessary cleanup after a finite series of shell calls has completed (`onFinish`).
```js
var shellInterval = require("shell-interval");
var timeout_id = shellInterval({
    options: /* object */ ,
    
    onExec: /* callback function */,
    
    onFinish: /* callback function */,
});
```
* __Arguments :__  A single hash of parameters with three properties.


    * __`options` [object] :__ a hash of values corresponding to set-interval's CLI flags. __Required.__
    
        * `command` __[string] :__ the shell command to execute. __Required.__
        
        * `time` __[number] :__ the number of seconds between calls. __Required.__
        
        * `reps` __[number] :__ a number of total shell calls to make.  After this number is reached, the interval will be cleared. _Optional._
        
        * `eager` __[boolean] :__ whether to immediately execute the function once before starting the timer. _Optional._
        
        * `quiet` __[boolean] :__ when used with the default `onExec` handler, tells set-interval not to print `stdout` to the terminal. _Optional._

    * `onExec` __[function] :__ a callback to handle data returned from shell command execution.  It is invoked once for each shell call and receives `err`, `stdout`, and `stderr` as its arguments. _Optional._
    
    * `onFinish` __[function] :__ when a limited number of repetitions is specified(in `options.reps`), this callback is invoked after the last shell call has returned a value and been handled. _Optional. Only has an effect if `reps` is specified._

* __Return Value__: a reference to the Node.js `timeoutId` assigned to shell-interval's internal timer.  This can be used with `clearInterval(<id>)` to stop executing the shell command.  

([See the Node.js documentation on __timeoutId__.](http://nodejs.org/api/timers.html))
    
    
    
####Basic Usage
Both callbacks are optional, but the hash of parameters passed in must contain an `options` property.  `options` itself must be a hash containing at least `command` and `time` properties.

```js
shellInterval({
    options: {
        command: "echo Hello.",
        time: 5,
    },
});

// echoes "Hello" in the terminal every five seconds
// until a break signal is received.

```
More usefully, client code can supply two optional callback functions: one for each of the `onExec` and `onFinish` events.

* `onExec` is invoked once for every execution of the shell command, and receives `err`, `stdout` and `stderr` as its arguments. 
* `onFinish` is only called if a finite number of repetitions has been specified (via `options.reps` in node or `-r <number>` in the shell).  In this case it is called exactly once, **after** the last callback has returned its value and been handled.  It does not receive any arguments.


```js
shellInterval({
            options: {
                command: "echo Hello.",
                time: 2,
                reps: 3,
            },
            onExec: function(err, stdout, stderr) {
                if (err) throw err;
                console.log("Output: " + stdout);
            },
            onFinish: function() {
                console.log("Finished.")                
            },           
});
```
The default `onExec` handler logs the shell response to the terminal unless the `--quiet` flag is passed.  Because this default handler is overridden by passing in a callback, the `--quiet` flag will not affect the behavior of a client-provided function.



####Usage in Place of `setInterval`
The function exported by `shell-interval` returns the Node `timeoutId` set by shell-interval internally, it can be used as a transparent replacement for a `setInterval` call in many cases where periodic shell execution is needed.  Most importantly, the return value can be passed to the normal `clearInterval` function to stop executing the shell command.

```js
var shellInterval = require("shell-interval");

var intervalId = shellInterval({
                options: {
                    command: "echo Hello.",
                    time: 5,
                },
                onExec: function(err, stdout, stderr) {
                    if (err) throw err;
                    console.log(stdout);
                    if( /* some condition */ ) {
                        clearInterval(intervalId);
                    }
                },
});
```

##Use Cases
__shell-interval__ provides similar functionality to [watch](https://github.com/visionmedia/watch), but in native Javascript and with a programmatic interface for Node.

Timed shell calls can be paired with a target- and dependency-based build program like [make](http://www.gnu.org/software/make/) to produce a flexible, automatic build system with far less configuration than e.g. [grunt-watch](https://github.com/gruntjs/grunt-contrib-watch).
```shell
$   shell-interval -c "make" -t 10

make: nothing to be done for 'all'.     #[0:10]
make: nothing to be done for 'all'.     #[0:20]


    # a dependency is changed between 0:20 and 0:30
    
jshint ./modules/*.js                  #[0:30]
cat ./modules/*.js > ./build/out.js    #[0:36]
mocha test ./build/spec                #[0:41]

make: noting to be done for 'all'.     #[0:50]
make: noting to be done for 'all'.     #[1:00]
# ... ad infinitum

```


## Installation
Via [npm](http://npmjs.org):

```
npm install -g shell-interval
```

## Testing
The specs depend on [Sinon](http://sinonjs.org/) and [Mocha](http://mochajs.org/).  Both are included in the devDependencies of package.json.

```
npm test
```

##Bugs and Issues
Use the [GitHub issue tracker](https://github.com/scivey/shell-interval/issues).

##Development
[See the GitHub page.](https://github.com/scivey/shell-interval)

Pull requests are welcome.  Include Mocha-compatible test specs and documentation of any changes to the API.

## License
The MIT License (MIT)

Copyright (c) 2013 Scott Ivey, <scott.ivey@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

