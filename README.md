# Christmas-Lights-Controller
Control when the Christmas Lights turn on and off

This is a service that I have running as a Docker container in my [DIYSmartHome](https://DIYSmartHome.io) that takes in the current DAH (Degrees Above Horizon) of the sun, and based on that setting, sends a signal out to another Docker container to turn on all my inside Christmas lights.  This way, I don't have to continiously change a bunch of power plug timers as the days get longer and shorter when the seasons change. (Oh, I probably should explain that we have a number of Christmas lights up year round. Its more festive than using lamps, and it keeps the wife happy ;) )

Turning off the lights is done by the current time, and if it is now or past what is defined in the config file, sends out the signal to turn the lights off.

The command to turn on and off the Christmas lights are handled by another Docker container described in another of my Repos [MQTT-TPLink-Bridge](https://github.com/john2exonets/MQTT-TPLink-Bridge)

