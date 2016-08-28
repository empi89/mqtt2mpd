MQTT2MPD

This proof of concept transforms the MPD API to MQTT.

# Rationale
The existing mpd binding for openHAB 1.8 had some bugs when controlling multiple MPD instances. Additionally, openHAB lacks an MPD binding. 

# Installation
`npm install`, copy `config/sample.json`, customize the values accoring to your needs and put your configuration in an own `.json` file within `config/` directory (e.g. `config/kitchen.json`). Then `NODE_ENV=kitchen npm run`.

For regular operations you should run the script with forever, supervisor or anything else that will restart the script on errors.
