# node-red-contrib-bigexec

"Big Exec" is a Big Node for node-red. It's used to execute command

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15128101/209b7cbc-163a-11e6-80dc-6a182c1ca86f.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15128101/209b7cbc-163a-11e6-80dc-6a182c1ca86f.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15128099/20968496-163a-11e6-9c36-5d7bab13c112.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15128100/20979ff2-163a-11e6-9426-0fd74e72de48.png)

## Installation
```bash
npm install node-red-contrib-bigexec
```

## Principles for Big Nodes

###1 can handle big data or block mode

  That means, in block mode, not only "one message is a whole file" and able to manage start/end control messages

###2 send start/end messages as well as statuses

  That means it uses a second output to give control states (start/end/running and error) control messages

###3 tell visually what they are doing

  Visual status on the node tells it's ready/running (blue), all is ok and done (green) or in error (red)

## Usage

Still some to write there...

## Dependencies

[biglib](https://www.npmjs.com/package/node-red-biglib) library for building node-red flows that supports blocks, high volume
[node-shell-quote](https://github.com/substack/node-shell-quote) quote and parse shell commands
[event-stream](https://github.com/dominictarr/event-stream) EventStream is like functional programming meets IO

## Capabilities

This now launches a command using spawn which gives 3 streams, 1 for stdin, 1 for stdout and 1 for stderr. This node can launch command which doesn't need any input or a single message as an input or a flow of messages if driven by a Big Node (with control messages)
<p>
It's possible to use payload as extra arguments to the command
It's possible to use another message property for extra arguments (in cas payload is stdin and the extra property means extra parameters)
It's possible to set minimum error codes in order to get a warning or error status for the node
It's possible to set extra environment variables in mustache form to complete existing one (example: <code>{ PATH: "{{PATH}}:." }</code>)
<p>
	
## Example flow files

Try pasting in the flow file below that shows the node behaviour 

  ```json
[{"id":"a05a9c2c.5fa56","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"sh","commandArgs":"-c '(echo stdout; echo stderr >&2)'","minError":1,"minWarning":1,"cwd":"","shell":false,"noStdin":true,"payloadIsArg":false,"extraArgumentProperty":"","envProperty":"","x":760,"y":300,"wires":[["21472444.deb8dc"],["7b3b770f.84c488"],["f0e24eb7.0f1db"]]},{"id":"3c6d4df.fc392b2","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":340,"y":1100,"wires":[["b3f8ce39.4c073"]]},{"id":"2555979c.daaa68","type":"debug","z":"a7f26b5c.580d98","name":"","active":false,"console":"false","complete":"false","x":1290,"y":1200,"wires":[]},{"id":"859c0b6f.7a63f8","type":"debug","z":"a7f26b5c.580d98","name":"output","active":true,"console":"false","complete":"payload","x":570,"y":500,"wires":[]},{"id":"1b4d760d.e4b28a","type":"bigexec","z":"a7f26b5c.580d98","name":"true","command":"true","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":true,"payloadIsArg":false,"x":270,"y":100,"wires":[[],[],[]]},{"id":"b3ed2096.4c12e","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"cat","commandArgs":"-n -b ","minError":1,"minWarning":"","cwd":"/tmp","shell":false,"noStdin":false,"payloadIsArg":false,"x":677.5,"y":1132,"wires":[["387f4221.c780be"],["387f4221.c780be"],[]]},{"id":"387f4221.c780be","type":"bigline","z":"a7f26b5c.580d98","name":"mine","filename":"","format":"utf8","keepEmptyLines":false,"x":837.5,"y":1239,"wires":[[],["3212c1eb.cded3e"]]},{"id":"3212c1eb.cded3e","type":"bigstatus","z":"a7f26b5c.580d98","name":"","locale":"fr","x":1090,"y":1260,"wires":[["2555979c.daaa68"]]},{"id":"b3f8ce39.4c073","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"cat","commandArgs":"/tmp/a","minError":"1","minWarning":"","cwd":"/tmp","shell":true,"noStdin":true,"payloadIsArg":false,"x":512.5,"y":1133,"wires":[["b3ed2096.4c12e"],["b3ed2096.4c12e"],[]]},{"id":"47b7d017.b8483","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"b.csv","payloadType":"str","repeat":"","crontab":"","once":false,"x":343.5,"y":1191,"wires":[["b3f8ce39.4c073"]]},{"id":"9f877f0b.60788","type":"bigexec","z":"a7f26b5c.580d98","name":"sh","command":"sh","commandArgs":"-c","minError":"8","minWarning":"1","cwd":"/tmp","shell":false,"noStdin":true,"payloadIsArg":true,"x":710,"y":140,"wires":[[],[],[]]},{"id":"f870bc7c.078f4","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 0\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":100,"wires":[["9f877f0b.60788"]]},{"id":"109f9ae3.ef6065","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 1\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":140,"wires":[["9f877f0b.60788"]]},{"id":"cb048e03.34fb7","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 8\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":550,"y":180,"wires":[["9f877f0b.60788"]]},{"id":"f371e0df.0c8e2","type":"bigexec","z":"a7f26b5c.580d98","name":"sleep","command":"sleep","commandArgs":"","minError":"8","minWarning":"1","cwd":"/tmp","shell":true,"noStdin":true,"payloadIsArg":true,"extraArgumentProperty":"","envProperty":"","x":270,"y":380,"wires":[[],[],[]]},{"id":"b405d1c3.4bfa3","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"10","payloadType":"num","repeat":"","crontab":"","once":false,"x":110,"y":380,"wires":[["f371e0df.0c8e2"]]},{"id":"197992d5.e6866d","type":"inject","z":"a7f26b5c.580d98","name":"True!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":110,"y":100,"wires":[["1b4d760d.e4b28a"]]},{"id":"aae26a45.551d98","type":"bigexec","z":"a7f26b5c.580d98","name":"false","command":"false","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":true,"payloadIsArg":false,"extraArgumentProperty":"","envProperty":"","x":270,"y":180,"wires":[[],[],[]]},{"id":"3f0aa43b.c0f55c","type":"inject","z":"a7f26b5c.580d98","name":"False!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":110,"y":180,"wires":[["aae26a45.551d98"]]},{"id":"14fc825.feb037e","type":"inject","z":"a7f26b5c.580d98","name":"Hello!","topic":"","payload":"Hello you!","payloadType":"str","repeat":"","crontab":"","once":false,"x":110,"y":500,"wires":[["457f20e1.ba80e"]]},{"id":"457f20e1.ba80e","type":"bigexec","z":"a7f26b5c.580d98","name":"echo","command":"echo","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":false,"payloadIsArg":true,"x":270,"y":500,"wires":[["c8af8289.37508"],[],[]]},{"id":"c8af8289.37508","type":"function","z":"a7f26b5c.580d98","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":420,"y":500,"wires":[["859c0b6f.7a63f8"]]},{"id":"2850acbd.d7af54","type":"bigexec","z":"a7f26b5c.580d98","name":"unknown","command":"/I/m/not/existing","commandArgs":"","minError":1,"minWarning":1,"cwd":"","shell":"","noStdin":false,"payloadIsArg":false,"extraArgumentProperty":"","envProperty":"","x":280,"y":300,"wires":[[],[],[]]},{"id":"69967327.96698c","type":"inject","z":"a7f26b5c.580d98","name":"unknown","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":100,"y":300,"wires":[["2850acbd.d7af54"]]},{"id":"70b7808d.8f488","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"cat","commandArgs":"-n","minError":"1","minWarning":"","cwd":"","shell":false,"noStdin":false,"payloadIsArg":true,"x":509.5,"y":1274,"wires":[["cc088e1f.33f77"],["cc088e1f.33f77"],[]]},{"id":"9977298b.6688d8","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"b.csv","payloadType":"str","repeat":"","crontab":"","once":false,"x":337.5,"y":1276,"wires":[["70b7808d.8f488"]]},{"id":"9a248287.65db8","type":"debug","z":"a7f26b5c.580d98","name":"a","active":true,"console":"false","complete":"payload","x":842.5,"y":1275,"wires":[]},{"id":"cc088e1f.33f77","type":"bigline","z":"a7f26b5c.580d98","name":"","filename":"","format":"utf8","keepEmptyLines":false,"x":681,"y":1275,"wires":[["9a248287.65db8"],[]]},{"id":"ec680c66.1397f","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"cat","commandArgs":"-n","minError":"1","minWarning":"","cwd":"/tmp","shell":false,"noStdin":true,"payloadIsArg":false,"x":511.5,"y":1340,"wires":[["88d85dd0.7727a"],["88d85dd0.7727a"],[]]},{"id":"88d85dd0.7727a","type":"bigline","z":"a7f26b5c.580d98","name":"","filename":"","format":"utf8","keepEmptyLines":false,"x":683.5,"y":1336,"wires":[["ed8bea02.127418"],[]]},{"id":"ed8bea02.127418","type":"debug","z":"a7f26b5c.580d98","name":"b","active":true,"console":"false","complete":"payload","x":845.5,"y":1330,"wires":[]},{"id":"8b4fd44b.74b028","type":"debug","z":"a7f26b5c.580d98","name":"stdout","active":true,"console":"false","complete":"payload","x":1110,"y":240,"wires":[]},{"id":"a20f9adb.5df068","type":"debug","z":"a7f26b5c.580d98","name":"stderr","active":true,"console":"false","complete":"payload","x":1110,"y":360,"wires":[]},{"id":"e2c52b94.1d3ad8","type":"inject","z":"a7f26b5c.580d98","name":"sample echo","topic":"","payload":"3","payloadType":"num","repeat":"","crontab":"","once":false,"x":570,"y":300,"wires":[["a05a9c2c.5fa56"]]},{"id":"7b3b770f.84c488","type":"function","z":"a7f26b5c.580d98","name":"rc","func":"if (msg.control && (msg.control.state == 'end' || msg.control.state == 'error')) return { payload: msg.control.rc }","outputs":1,"noerr":0,"x":950,"y":300,"wires":[["53bd5dbc.ac42a4"]]},{"id":"53bd5dbc.ac42a4","type":"debug","z":"a7f26b5c.580d98","name":"rc","active":true,"console":"false","complete":"payload","x":1110,"y":300,"wires":[]},{"id":"d42f5301.2bd0b","type":"comment","z":"a7f26b5c.580d98","name":"Sample usage of Big Exec (Linux / Mac) command lines","info":"","x":240,"y":40,"wires":[]},{"id":"21472444.deb8dc","type":"function","z":"a7f26b5c.580d98","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":960,"y":240,"wires":[["8b4fd44b.74b028"]]},{"id":"f0e24eb7.0f1db","type":"function","z":"a7f26b5c.580d98","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":960,"y":360,"wires":[["a20f9adb.5df068"]]},{"id":"56434d84.a9bcb4","type":"comment","z":"a7f26b5c.580d98","name":"Big Line should be better here","info":"","x":1020,"y":180,"wires":[]},{"id":"a50f378b.5af0c8","type":"comment","z":"a7f26b5c.580d98","name":"Showing 3 states statuses","info":"","x":770,"y":80,"wires":[]},{"id":"1e2d23bd.e1d2dc","type":"comment","z":"a7f26b5c.580d98","name":"Sending data through stdin","info":"","x":330,"y":460,"wires":[]},{"id":"905f7c93.6fa08","type":"comment","z":"a7f26b5c.580d98","name":"Unknow command","info":"","x":310,"y":260,"wires":[]}]
  ```

  ![alt tag](https://cloud.githubusercontent.com/assets/18165555/15128026/c3779b10-1639-11e6-8456-32923903acd1.png)

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


