//
//   XmasLights.js
//     Control all the Christmas lights and turn them on at sunset!
//
//   John D. Allen
//   Feb 2019
//

var mqtt = require('mqtt');
var moment = require('moment');
var config = require('./config/config.json');

var DEBUG = config.debug;
if (DEBUG) { console.log("XmasLights started..."); }

var isNight = false;
var turnedOn = false;

//-----------------------------------------------------------------------------
//-----------------------[   MQTT Stuff   ]------------------------------------
//-----------------------------------------------------------------------------
// MQTT connection options
var copts = {
  clientId: "xmaslights",
  keepalive: 20000
};

var client = mqtt.connect(config.mqtt_broker, copts);

client.on("connect", function() {
  //
  //  info/daylight: '{"isNight": false, "DAH": 36}'
  //
  client.subscribe("info/daylight");
});

client.on('message', function(topic, message) {
  var out = topic + ": " + message.toString();
  //if (DEBUG) { console.log("IN>>" + out); }

  // Check for bad data
  if (message.indexOf("nan") > -1) {
    if (DEBUG) { console.log(">> BAD DATA"); }
    return false;
  }

  if (topic == "info/daylight") {
    var rr = JSON.parse(message.toString());
    if (rr.DAH < config.DAHon) {
      isNight = true;
    } else {
      isNight = false;
    }
  }

});

//-----------------------------------------------------------------------------
// Function: turnOnNow()
//   Check to see if we turn on the lights now?
//-----------------------------------------------------------------------------
function turnOnNow() {
  if (isNight && ! turnedOn) {
    if (DEBUG) { console.log("Turning on lights now..." + new Date()); }
    client.publish(config.turnOnTopic, "{}");
    turnedOn = true;
    setTimeout(turnOffNow, 600000);    // start check for when to turn off an hour from now.
  } else {
    setTimeout(turnOnNow, 60000);   // Once a minute.
  }
}

//-----------------------------------------------------------------------------
// Function: turnOffNow()
//   Check to see if its time to turn the lights off.
//-----------------------------------------------------------------------------
function turnOffNow() {
  if (isPastTime(config.turnOffTime)) {
    if (DEBUG) { console.log("Turning OFF lights now..." + moment().local().format('LLL')); }
    client.publish(config.turnOffTopic, "{}");
    turnedOn = false;
    setTimeout(turnOnNow, 43200000);     // start to check 12 hrs from now.
  } else {
    setTimeout(turnOffNow, 60000);
  }
}

//-----------------------------------------------------------------------------
// Function: isPastTime()
//   Is the current time after the passed time?
//-----------------------------------------------------------------------------
function isPastTime(tt) {
  var today = moment().local();
  var chkTime = moment(tt, "HH:mm");

  if (today.date() == chkTime.date()) {
    if (today.hour() > chkTime.hour()) {
      chkTime.add(1, 'days');
    }
  }
  if (today.local() > chkTime) {
    return true;
  } else {
    return false;
  }
}


//-----------------------------------------------------------------------------
//-----------------------------[   MAIN   ]------------------------------------
//-----------------------------------------------------------------------------

turnOnNow();
