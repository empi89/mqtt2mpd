'use strict';

var config = require('config');
var mpd = require('mpd');
var mqtt = require('mqtt');
var winston = require('winston');

var mqttClient  = mqtt.connect(config.mqtt.url);

mqttClient.on('connect', function() {
	winston.info('sucessfully connected to mqtt broker');
	mqttClient.subscribe(config.mqtt.prefix+"command/+");
});

var mpdClient = mpd.connect(config.mpd);
mpdClient.on('ready', function() {
	winston.info("mpd connection ready");
});


mqttClient.on('message', function(topic, message) {
	var matches = topic.match(/\w+$/);
	if (matches[0] === null) {
		throw new Error("invalid command");
	}
	if (message.toString() !== "" && message.toString() !== "empty") {
		var args = Array(message.toString());
		winston.info("sending command "+matches[0]+" to mpd with arguments "+args);
		mpdClient.sendCommand(mpd.cmd(matches[0], args), function(err, msg) {
			if (err) {
				winston.error(err);
			}
		});
	} else {
		winston.info("sending command "+matches[0]+" to mpd");
		mpdClient.sendCommand(mpd.cmd(matches[0], []), function(err, msg) {
			if (err) {
				winston.error(err);
			}
		});
	}
});

mpdClient.on('system', function() {
	publishStatus();
});

function publishStatus() {
	mpdClient.sendCommand(mpd.cmd("status", []), function(err, msg) {
		if (err) {
			throw err;
		}

		var re = /((\w+):\s+(.+)\S?)/g;
		var m;

		while ((m = re.exec(msg)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
			var topic = config.mqtt.prefix + "status/"+m[2];
			var value = m[3];
			winston.info("publish to "+topic+ " value "+value);
			mqttClient.publish(topic, value);
		}
	});
}
