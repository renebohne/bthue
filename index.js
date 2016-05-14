var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var host = "192.168.10.106",
    username = "PT-NTFKdCtbUh-RDwPHYG9rfQiv2ScRxHoxJhZmK",
    api = new HueApi(host, username),
    state;

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var portName = "none";
var myPort;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};
 
// find bluetooth port and set it up
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
        if(port.comName.indexOf("rfcomm")>-1){
            console.log("bluetooth port: "+port.comName);
            portName = port.comName;
            myPort = new SerialPort(portName, { baudRate: 9600, parser: serialport.parsers.readline("\n")});
            myPort.on('open', showPortOpen);
            myPort.on('data', sendSerialData);
            myPort.on('close', showPortClose);
            myPort.on('error', showError);
        }  
    });
});

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
   console.log(data);
   if(data.indexOf("1")>-1)
   {
     LEDon();
   }
   else if(data.indexOf("0")>-1)
   {
       LEDoff();
   }
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

function LEDon()
{
    state = lightState.create().on().white(500, 100);
    api.setLightState(3, state).then(displayResult).done();
}

function LEDoff()
{
    state = lightState.create().off();
    api.setLightState(3, state).then(displayResult).done();
}
