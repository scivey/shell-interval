# shell-interval

`setInterval` for the command line.

```shell
shell-interval -t 5 -c "echo Hello." -r 3

#response:
#Hello.
#Hello.
#Hello.
#[Stopping.]

```
## Options
* -c, --command :       
    The shell command to execute.

* -t, --time    :   
    The second interval between calls
* -r, --reps    :   
    The number of times to execute the command.  Default is infinite.

* -q, --quiet   :
    Don't log stdout to the terminal.  Has no effect if `shellInterval` is called from node with a user-specified callback (see Programmatic Use).


##Programmatic Use
shell-interval can be called in the same way from within node:
```js
var shellInterval = require("shell-interval");
shellInterval({
    command: "echo Hello.",
    time: 5,
    reps: 3
});
```
Calls to `shellInterval` return the node `timeoutID` set by shell-interval internally.  This means it can be used as a drop-in replacement for `setInterval` in cases where periodic shell execution is needed.

```js
var shellInterval = require("shell-interval");

var intervalId = shellInterval({
                    command: "echo Hello.",
                    time: 5,
                }, function(stdout) {
                    console.log(stdout);
                    if( /* some condition */ ) {
                        clearInterval(intervalId);
                    }
                },
);
```

## Installation
Via [npm](http://npmjs.org):
```
npm install -g shell-interval
```
## License
The MIT License (MIT)

Copyright (c) Scott Ivey 2013

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

