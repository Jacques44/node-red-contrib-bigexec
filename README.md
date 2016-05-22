# node-red-contrib-bigexec

"Big Exec" is a Big Node for node-red. It's used to execute command

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455714/ed942b5c-205c-11e6-94cb-4b2dce8a113a.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455716/f117a5a6-205c-11e6-9bd6-cdbe6409a87b.png)

## Installation
```bash
npm install node-red-contrib-bigexec
```

## Principles for Big Nodes

See [biglib](https://www.npmjs.com/package/node-red-biglib) for details on Big Nodes.
`Big Lib` and subsequent `Big Nodes` are a family of nodes built for my own purpose. They are all designed to help me build a complete process for **production purposes**. For that I needed nodes able to:

* Flow **big volume** of data (memory control, work with buffers)
* Work with *a flow of blocks* (buffers) (multiple payload within a single job)
* Tell what *they are doing* with extended use of statuses (color/message)
* Use their *second output for flow control* (start/stop/running/status)
* *Reuse messages* in order to propagate _msgid, topic
* Depends on **state of the art** libraries for parsing (csv, xml, xlsxs, line, ...)
* Acts as **filters by default** (1 payload = 1 action) or **data generators** (block flow)

All functionnalities are built under a library named `biglib` and all `Big Nodes` rely on it

## Dependencies

[biglib](https://www.npmjs.com/package/node-red-biglib) library for building node-red flows that supports blocks, high volume
[node-shell-quote](https://github.com/substack/node-shell-quote) quote and parse shell commands
[event-stream](https://github.com/dominictarr/event-stream) EventStream is like functional programming meets IO
[mustache](https://www.npmjs.com/package/mustache) to upgrade environment variables with templates

## Capabilities

This now launches a command using <code>spawn</code> which gives 3 streams, 1 for stdin, 1 for stdout and 1 for stderr. This node can launch command which doesn't need any input or a single message as an input or a flow of messages if driven by a Big Node (with control messages)

* It's possible to use payload as extra arguments to the command
* It's possible to use another message property for extra arguments (in cas payload is stdin and the extra property means extra parameters)
* It's possible to set minimum error codes in order to get a warning or error status for the node
* It's possible to set extra environment variables in mustache form to complete existing one (example: <code>{ PATH: "{{PATH}}:." }</code>)
* It's possible to tell which encoding is used for stdout for example, if the result of a command is in <code>binary</code> form to translate it to utf-8	

## Example flow files

Try pasting in the flow file below that shows the node behaviour 

  ```json
[{"id":"d5de2d26.2a21d","type":"bigexec","z":"f29bfab4.0d6408","name":"","command":"sh","commandArgs":"-c '(echo stdout; echo stderr >&2)'","minError":1,"minWarning":1,"cwd":"","shell":false,"extraArgumentProperty":"","envProperty":"","x":760,"y":300,"wires":[["5fc11ed1.a03ee"],["ea429413.15bd68"],["264e6051.d9b1a"]]},{"id":"f8c5aa9.f073a58","type":"debug","z":"f29bfab4.0d6408","name":"output","active":true,"console":"false","complete":"payload","x":570,"y":500,"wires":[]},{"id":"fe42cda2.01bd3","type":"bigexec","z":"f29bfab4.0d6408","name":"true","command":"true","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"x":270,"y":100,"wires":[[],[],[]]},{"id":"9984f682.667b08","type":"bigexec","z":"f29bfab4.0d6408","name":"sh","command":"sh","commandArgs":"-c","minError":"8","minWarning":"1","cwd":"/tmp","shell":false,"extraArgumentProperty":"","envProperty":"","format":"utf8","payloadIs":"argument","x":710,"y":140,"wires":[[],[],[]]},{"id":"2bb9bf06.d4464","type":"inject","z":"f29bfab4.0d6408","name":"","topic":"","payload":"\"exit 0\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":100,"wires":[["9984f682.667b08"]]},{"id":"89ba4484.7645b8","type":"inject","z":"f29bfab4.0d6408","name":"","topic":"","payload":"\"exit 1\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":140,"wires":[["9984f682.667b08"]]},{"id":"15f3c5e6.ea0c3a","type":"inject","z":"f29bfab4.0d6408","name":"","topic":"","payload":"\"exit 8\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":180,"wires":[["9984f682.667b08"]]},{"id":"64eb1fc.f9b14e","type":"bigexec","z":"f29bfab4.0d6408","name":"sleep","command":"sleep","commandArgs":"","minError":"8","minWarning":"1","cwd":"/tmp","shell":true,"extraArgumentProperty":"","envProperty":"","x":270,"y":380,"wires":[[],[],[]]},{"id":"f8e2ffe.f071d","type":"inject","z":"f29bfab4.0d6408","name":"","topic":"","payload":"10","payloadType":"num","repeat":"","crontab":"","once":false,"x":110,"y":380,"wires":[["64eb1fc.f9b14e"]]},{"id":"84c0f395.7b3f1","type":"inject","z":"f29bfab4.0d6408","name":"True!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":110,"y":100,"wires":[["fe42cda2.01bd3"]]},{"id":"8ec7d32f.71383","type":"bigexec","z":"f29bfab4.0d6408","name":"false","command":"false","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"extraArgumentProperty":"","envProperty":"","x":270,"y":180,"wires":[[],[],[]]},{"id":"e80797ae.17f868","type":"inject","z":"f29bfab4.0d6408","name":"False!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":110,"y":180,"wires":[["8ec7d32f.71383"]]},{"id":"c4498d7f.3bb67","type":"inject","z":"f29bfab4.0d6408","name":"Hello!","topic":"","payload":"Hello you!","payloadType":"str","repeat":"","crontab":"","once":false,"x":110,"y":500,"wires":[["8d33cea7.72cc3"]]},{"id":"8d33cea7.72cc3","type":"bigexec","z":"f29bfab4.0d6408","name":"echo","command":"echo","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"extraArgumentProperty":"","envProperty":"","format":"utf8","payloadIs":"argument","x":270,"y":500,"wires":[["d3ea0250.2c16"],[],[]]},{"id":"d3ea0250.2c16","type":"function","z":"f29bfab4.0d6408","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":420,"y":500,"wires":[["f8c5aa9.f073a58"]]},{"id":"31646763.ce9b98","type":"bigexec","z":"f29bfab4.0d6408","name":"unknown","command":"/I/m/not/existing","commandArgs":"","minError":1,"minWarning":1,"cwd":"","shell":"","extraArgumentProperty":"","envProperty":"","x":280,"y":300,"wires":[[],[],[]]},{"id":"cb4518e9.34bae8","type":"inject","z":"f29bfab4.0d6408","name":"unknown","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":120,"y":300,"wires":[["31646763.ce9b98"]]},{"id":"6f6db996.909248","type":"debug","z":"f29bfab4.0d6408","name":"stdout","active":true,"console":"false","complete":"payload","x":1110,"y":240,"wires":[]},{"id":"d12de8f8.2ed218","type":"debug","z":"f29bfab4.0d6408","name":"stderr","active":true,"console":"false","complete":"payload","x":1110,"y":360,"wires":[]},{"id":"4dfd7668.b20288","type":"inject","z":"f29bfab4.0d6408","name":"sample echo","topic":"","payload":"3","payloadType":"num","repeat":"","crontab":"","once":false,"x":570,"y":300,"wires":[["d5de2d26.2a21d"]]},{"id":"ea429413.15bd68","type":"function","z":"f29bfab4.0d6408","name":"rc","func":"if (msg.control && (msg.control.state == 'end' || msg.control.state == 'error')) return { payload: msg.control.rc }","outputs":1,"noerr":0,"x":950,"y":300,"wires":[["c9d0ae96.362f5"]]},{"id":"c9d0ae96.362f5","type":"debug","z":"f29bfab4.0d6408","name":"rc","active":true,"console":"false","complete":"payload","x":1110,"y":300,"wires":[]},{"id":"d7d24f0d.282db","type":"comment","z":"f29bfab4.0d6408","name":"Sample usage of Big Exec (Linux / Mac) command lines","info":"","x":240,"y":40,"wires":[]},{"id":"5fc11ed1.a03ee","type":"function","z":"f29bfab4.0d6408","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":960,"y":240,"wires":[["6f6db996.909248"]]},{"id":"264e6051.d9b1a","type":"function","z":"f29bfab4.0d6408","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":960,"y":360,"wires":[["d12de8f8.2ed218"]]},{"id":"e3dc229b.1c23e","type":"comment","z":"f29bfab4.0d6408","name":"Big Line should be better here","info":"","x":1020,"y":180,"wires":[]},{"id":"1b1197e8.e4ee68","type":"comment","z":"f29bfab4.0d6408","name":"Showing 3 states statuses","info":"","x":770,"y":80,"wires":[]},{"id":"85fee1ad.7a012","type":"comment","z":"f29bfab4.0d6408","name":"Sending data through stdin","info":"","x":330,"y":460,"wires":[]},{"id":"e9635a5.f169ca8","type":"comment","z":"f29bfab4.0d6408","name":"Unknow command","info":"","x":310,"y":260,"wires":[]}]
  ```

  ![alt tag](https://cloud.githubusercontent.com/assets/18165555/15454183/302a882a-2031-11e6-993a-0fdeea192ff9.png)

## Author

  - Jacques W

## License

This code is Open Source under an Apache 2 License.

You may not use this code except in compliance with the License. You may obtain an original copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Please see the
License for the specific language governing permissions and limitations under the License.

## Feedback and Support

Please report any issues or suggestions via the [Github Issues list for this repository](https://github.com/Jacques44/node-red-contrib-bigexec/issues).

For more information, feedback, or community support see the Node-Red Google groups forum at https://groups.google.com/forum/#!forum/node-red


