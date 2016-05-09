/**
 * Copyright 2013, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original and good work by IBM
 * "Big Nodes" mods by Jacques W
 *
 * /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 *
 *  Big Nodes principles:
 *
 *  #1 can handle big data
 *  #2 send start/end messages
 *  #3 tell what they are doing
 *
 *  Any issues? https://github.com/Jacques44
 *
 * /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 *
 **/

module.exports = function(RED) {

    "use strict";

    var biglib = require('node-red-biglib');

    // Definition of which options are known for spawning a command (ie node configutation to BigExec.spawn function)
    var spawn_options = {
      "command": "",                                                  // Command to execute
      "commandArgs": { value: "", validation: biglib.argument_to_array },    // Arguments from the configuration box
      "commandArgs2": { value: "", validation: biglib.argument_to_array },   // Payload as additional arguments if required
      "commandArgs3": { value: "", validation: biglib.argument_to_array },   // Extra argument from message if property set
      "minWarning": 1,                                                // The min return code the node will consider it is a warning
      "minError": 8,                                                  // The min return code the node will consider it is as an error
      "cwd": "",                                                      // The working directory
      "env": {},                
      "shell": false,                                                 // Use a shell
      "noStdin": false                                                // Command does require an input (used to avoid EPIPE error)
    }    

    function BigExec(config) {

      RED.nodes.createNode(this, config);

      // Arguments from configuration box are broken into a suitable array
      //config.commandArgs = argument_to_array(config.commandArgs);

      var spawn = function(my_config) {

        var spawn_config = {
          cwd: my_config.cwd,
          env: my_config.env,
          shell: my_config.shell
        }

        console.log(spawn_config);

        // This dummy writable is used when the command does not need any data on its stdin
        // If any data is coming, this stream drops it and no "EPIPE error" is thrown
        var dummy = biglib.dummy_writable(my_config.noStdin);  

        this.working("Executing " + my_config.command.substr(0,20) + "...");

        console.log(my_config.commandArgs.concat(my_config.commandArgs2||[]).concat(my_config.commandArgs3||[]));

        // Here it is, the job is starting now
        var child = new require('child_process').spawn(my_config.command, my_config.commandArgs.concat(my_config.commandArgs2||[]).concat(my_config.commandArgs3||[]), spawn_config);

        // This to avoid "invalid chunk data" when payload is not a string
        var stringify = biglib.stringify_stream();
        stringify.pipe(child.stdin);

        var ret = require('event-stream').duplex(my_config.payloadIsArg ? dummy : stringify, child.stdout);
        //if (my_config.noStdin) child.stdin.end();

        ret.others = [ child.stderr ]; 

        child
          .on('exit', function(code, signal) {  
            // Gives biglib extra informations using the "stats" function                        
            this.stats({ rc: code, signal: signal });    
            ret.emit('my_finish');    
          }.bind(this))
          .on('error', function(err) {
            console.log(err);
            ret.emit('error', err);
          })        
      
        return ret;
      }

      // Custom progress function
      var progress = function(running) { return running ? "running for " + this.duration() : ("done with rc " + (this._runtime_control.rc != undefined ? this._runtime_control.rc : "?")) }

      // new instance of biglib for this configuration
      // probably the most tuned biglib I've asked ever...
      var bignode = new biglib({ 
        config: config, node: this,   // biglib needs to know the node configuration and the node itself (for statuses and sends)
        status: progress,             // define the kind of informations displayed while running
        parser_config: spawn_options, // the parser configuration (ie the known options the parser will understand)
        parser: spawn,                // the parser (ie the remote command)
        on_finish: biglib.min_finish, // custom on_finish handler
        finish_event: 'my_finish'     // custom finish event to listen to
      });

      // biglib changes the configuration to add some properties
      config = bignode.config();

      this.on('input', function(msg) {

        // Is payload an extra argument
        delete config.commandArgs2;
        if (config.payloadIsArg && msg.payload) {
          msg.config = msg.config || {};
          msg.config.commandArgs2 = msg.payload;

          // if not, the size_stream which streams to the command will throw EPIPE
          delete msg.payload;
        }

        if (config.extraArgumentProperty && msg[config.extraArgumentProperty]) {
          msg.config = msg.config || {};
          msg.config.commandArgs3 = msg[config.extraArgumentProperty];
        }

        if (config.envProperty && msg[config.envProperty]) {
          msg.config = msg.config || {};
          msg.config.env = msg[config.envProperty];
        }

        bignode.main.call(bignode, msg);
      })
    }  

    RED.nodes.registerType("bigexec", BigExec);

}
