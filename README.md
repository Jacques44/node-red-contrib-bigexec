# node-red-contrib-bigexec

"Big Exec" is a Big Node for node-red. 

![alt tag](https://cloud.githubusercontent.com/assets/18165555/14944259/fa209b50-0fed-11e6-87f6-9dfa91dec26e.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/14944260/fbc861e0-0fed-11e6-976f-e6320ae26749.png)

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

## Example flow files

Try pasting in the flow file below that shows the node behaviour 

  ```json
[{"id":"859c0b6f.7a63f8","type":"debug","z":"a7f26b5c.580d98","name":"output","active":true,"console":"false","complete":"payload","x":705.5,"y":97,"wires":[]},{"id":"1b4d760d.e4b28a","type":"bigexec","z":"a7f26b5c.580d98","name":"true","command":"true","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":true,"payloadIsArg":false,"x":270.5,"y":53,"wires":[[],[]]},{"id":"9f877f0b.60788","type":"bigexec","z":"a7f26b5c.580d98","name":"sh","command":"sh","commandArgs":"-c","minError":"8","minWarning":"1","cwd":"/tmp","shell":false,"noStdin":true,"payloadIsArg":true,"x":318,"y":266,"wires":[[],[]]},{"id":"f870bc7c.078f4","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 0\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":112,"y":222,"wires":[["9f877f0b.60788"]]},{"id":"109f9ae3.ef6065","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 1\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":112,"y":265,"wires":[["9f877f0b.60788"]]},{"id":"cb048e03.34fb7","type":"inject","z":"a7f26b5c.580d98","name":"","topic":"","payload":"\"exit 8\"","payloadType":"str","repeat":"","crontab":"","once":false,"x":113,"y":308,"wires":[["9f877f0b.60788"]]},{"id":"197992d5.e6866d","type":"inject","z":"a7f26b5c.580d98","name":"True!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":113,"y":53,"wires":[["1b4d760d.e4b28a"]]},{"id":"aae26a45.551d98","type":"bigexec","z":"a7f26b5c.580d98","name":"true","command":"false","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":true,"payloadIsArg":false,"x":269,"y":107,"wires":[[],[]]},{"id":"3f0aa43b.c0f55c","type":"inject","z":"a7f26b5c.580d98","name":"False!","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":112.5,"y":105,"wires":[["aae26a45.551d98"]]},{"id":"14fc825.feb037e","type":"inject","z":"a7f26b5c.580d98","name":"Hello!","topic":"","payload":"Hello you!","payloadType":"str","repeat":"","crontab":"","once":false,"x":111,"y":157,"wires":[["457f20e1.ba80e"]]},{"id":"457f20e1.ba80e","type":"bigexec","z":"a7f26b5c.580d98","name":"echo","command":"echo","commandArgs":"","minError":1,"minWarning":"","cwd":"","shell":false,"noStdin":false,"payloadIsArg":true,"x":270,"y":161,"wires":[["c8af8289.37508"],[]]},{"id":"c8af8289.37508","type":"function","z":"a7f26b5c.580d98","name":"toString()","func":"msg.payload = msg.payload.toString()\nreturn msg;","outputs":1,"noerr":0,"x":490.5,"y":138,"wires":[["859c0b6f.7a63f8"]]},{"id":"2850acbd.d7af54","type":"bigexec","z":"a7f26b5c.580d98","name":"","command":"/I/m/not/existing","commandArgs":"","minError":1,"minWarning":1,"cwd":"","shell":"","noStdin":false,"payloadIsArg":false,"x":731.5,"y":241,"wires":[[],[]]},{"id":"69967327.96698c","type":"inject","z":"a7f26b5c.580d98","name":"nonexistent","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":566,"y":241,"wires":[["2850acbd.d7af54"]]}]
  ```

  ![alt tag](https://cloud.githubusercontent.com/assets/18165555/14944261/fd1504ea-0fed-11e6-9061-b22165f0ac5b.png)

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


