# MQTT2MPD

This proof of concept transforms the MPD API to MQTT.

# Rationale
The existing mpd binding for openHAB 1.8 had some bugs when controlling multiple MPD instances. Additionally, openHAB 2.0 currently has no MPD binding at all. 

# Installation
`npm install`, copy `config/sample.json`, customize the values accoring to your needs and put your configuration in an own `.json` file within `config/` directory (e.g. `config/kitchen.json`). Then `NODE_ENV=kitchen npm start`.

For regular operations you should run the script with forever, supervisor or anything else that will restart the script on errors.

# openHAB Config Example

```
Switch Mpd_Office_StartStop   		"Start/Stop"    	(Music) 
	{mqtt="
		<[mosquitto:/office/mpd/status/state:state:MAP(mpdState.map)]],
		>[mosquitto:/office/mpd/command/play:command:ON:empty],
		>[mosquitto:/office/mpd/command/stop:command:OFF:empty]
	"}

Dimmer Mpd_Office_VolumeControl    "Volume [%d%%]"     (Music)  							  
	{ mqtt="
		<[mosquitto:/office/mpd/status/volume:state:default]],
		>[mosquitto:/office/mpd/command/volume:command:INCREASE:+5],
		>[mosquitto:/office/mpd/command/volume:command:DECREASE:-5],
		>[mosquitto:/office/mpd/command/setvol:command:*:default]
	"}

```
