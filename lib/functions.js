const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
const getdht = async (pin) => {
    return new Promise((resolve, reject) => {
        var sensor = {
            initialize: function () {
                return DHT.initialize(22, pin);
            },
            read: function () {
                var readout = DHT.read();
                return readout;
            }
        };
        if (sensor.initialize()) {
            var readout = sensor.read();
            resolve(readout);
        } else {
            reject("Failed to initialize sensor");
        }
    })
}

const getservoclose = async (pin) => {
    return new Promise((resolve, reject) => {
        const servo = new Gpio(pin, { mode: Gpio.OUTPUT });
        servo.servoWrite(0);
        resolve(servo);
    })
}

const getservoopen = async (pin) => {
    return new Promise((resolve, reject) => {
        const servo = new Gpio(pin, { mode: Gpio.OUTPUT });
        servo.servoWrite(2500);
        resolve(servo);
    })
}*/

exports.processTime = processTime;
exports.sleep = sleep;
//exports.getdht = getdht;
//exports.getservoclose = getservoclose;
//exports.getservoopen = getservoopen;

