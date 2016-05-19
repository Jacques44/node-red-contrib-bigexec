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
    var stream = require('stream');
    var promise = require('promise');

    var Mustache = require('mustache');
    // Avoid html escaping
    Mustache.escape = function (value) { return value; };

    var custom_event = 'my_finish';

    // Definition of which options are known for spawning a command (ie node configutation to BigExec.spawn function)
    var spawn_options = {
      "command": "",                                                  // Command to execute
      "commandArgs": { value: "", validation: biglib.argument_to_array },    // Arguments from the configuration box
      "commandArgs2": { value: "", validation: biglib.argument_to_array },   // Payload as additional arguments if required
      "commandArgs3": { value: "", validation: biglib.argument_to_array },   // Extra argument from message if property set
      "minWarning": 1,                                                // The min return code the node will consider it is a warning
      "minError": 8,                                                  // The min return code the node will consider it is as an error
      "cwd": "",                                                      // The working directory
      "env": {},                                                      // env variables as key/value pairs
      "shell": false,                                                 // Use a shell (only node v6)
      "payloadAction": {}
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

        this.working("Executing " + my_config.command.substr(0,20) + "...");

        // Here it is, the job is starting now
        var child = new require('child_process').spawn(my_config.command, my_config.commandArgs.concat(my_config.commandArgs2||[]).concat(my_config.commandArgs3||[]), spawn_config);

        // Cases for stdin
        var stdin = child.stdin;

        // if payload is some data needed by the command
        if (my_config.payloadAction.data) {
          stdin = biglib.stringify_stream(my_config.payloadAction.cr ? "\n": "");
          stdin.pipe(child.stdin);
        } else {
          // This dummy writable is used when the command does not need any data on its stdin
          // If any data is coming, this stream drops it and no "EPIPE error" is thrown                 
          stdin = biglib.dummy_writable();
        }

        // stdin needs to be closed?
        if (!my_config.payloadAction.stdin) child.stdin.end();

        // stdout configuration        
        if (my_config.format) child.stdout.setEncoding(format);

        var ret = require('event-stream').duplex(stdin, child.stdout);

        ret.others = [ child.stderr ]; 

        child
          .on('error', function(err) {
            ret.emit('error', err);
          })

        // Use promise to wait both events (exit & finish)
        var p1 = new Promise(function(fullfill, reject) { 
          child.on('exit', function(code, signal) {                         
            fullfill({ rc: code, signal: signal })
          })
        })

        var p2 = new Promise(function(fullfill, reject) {
          child.stdout.on('finish', fullfill);          
        })

        Promise.all([p1, p2]).then(function(data) {          
          this.stats(data[0]);
          ret.emit(custom_event);
        }.bind(this));
      
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
        generator: 'limiter',
        finish_event: custom_event    // custom finish event to listen to
      });

      // biglib changes the configuration to add some properties
      config = bignode.config();

      var payloadIs = {
        "trigger": { stdin: true, arg: false, data: false },
        "triggerNoStdin": { stdin: false, arg: false, data: false },
        "argument": { stdin: true, arg: true, data: false },
        "argumentNoStdin": { stdin: false, arg: true, data: false },
        "input": { stdin: true, arg: false, data: true },
        "inputCR": { stdin: true, arg: false, data: true, cr: true }
      }

      this.on('input', function(msg) {

        msg.config = msg.config || {};
        msg.config.payloadAction = payloadIs[config.payloadIs] || payloadIs["triggerNoStdin"];

        // Is payload an extra argument
        delete config.commandArgs2;
        // If payload is an extra argument...
        if (msg.config.payloadAction.arg && msg.payload) {
          msg.config.commandArgs2 = msg.payload;

          // if not, the size_stream which streams to the command will throw EPIPE
          delete msg.payload;
        }

        if (config.extraArgumentProperty && msg[config.extraArgumentProperty]) {
          msg.config.commandArgs3 = msg[config.extraArgumentProperty];
        }

        if (config.envProperty && msg[config.envProperty]) {

          try {
            msg.config.env = Object.assign({}, process.env);;
            var env = typeof msg[config.envProperty] == 'string' ? JSON.parse(msg[config.envProperty]) : msg[config.envProperty];
            Object.keys(env).forEach(function(k) {
              msg.config.env[k] = Mustache.render(msg[config.envProperty][k], process.env);
            });
          } catch (err) {
            this.error(err);
          }
        }

        bignode.main.call(bignode, msg);
      })
    }  

    RED.nodes.registerType("bigexec", BigExec);

}
