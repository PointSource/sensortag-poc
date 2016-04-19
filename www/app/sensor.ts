import {NgZone, Inject} from 'angular2/core';
import {SensorData} from './sensor-data';
import {BLEService} from './ble.service';

export class Sensor {
	systemId: string;
	policyNumber: string;
	name: string;
	status: string;
	sensortag: any;
	data: SensorData;
    onDeviceConnected: any;
    onDeviceConnectFail: any;
    _bleService: BLEService;

    constructor(
		private _ngZone: NgZone,
        // private _bleService: BLEService,
        @Inject('Evothings') private _evothings
	) { }

    initialize(policyNumber: string) {
        this._bleService = new BLEService(this._evothings);
        this.policyNumber = policyNumber;

        // Create SensorTag CC2650 instance.
        this.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART);

        this.data = {
            humidityData: {
                lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                relativeHumidity: 0
            },
            temperatureData: {
                lastTenAmbient: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                lastTenTarget: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ambientTemperature: 0,
                targetTemperature: 0
            },
            keypressData: 0
        }
        this.name = "Sensor";
        this.status = "DISCONNECTED";
    }

    setName(name: string) {
        this.name = name;
    }

    setSystemId(systemId: string) {
        this.systemId = systemId;
    }

    connectToDevice(device) {
        var self = this;

        this.sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.initialStatusHandler(status);
                    if (self.onDeviceConnected && 'DEVICE_INFO_AVAILABLE' == status) {
                        self.onDeviceConnected(device);
                    }
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        this.sensortag.connectToDevice(device);
    }

    setOnDeviceConnected(callback: Function) {
        this.onDeviceConnected = callback;
    }

    setOnDeviceConnectFail(callback: Function) {
        this.onDeviceConnectFail = callback;
    }


    scanForSensor() {
        var self = this;
        var foundAddresses = [];
        var nonMatchingDevices = [];
        var matchingDevice = null;

        var numCompleted = 0;

        console.log('Sensor.scanForSensor() '+this.name.toUpperCase());
        this._evothings.easyble.startScan((device) => {
            if (self._bleService.deviceIsSensorTag(device) && foundAddresses.indexOf(device.address) === -1) {
                foundAddresses.push(device.address);
                self._bleService.getSystemIdFromDevice(device,
                    (systemId, device) => {
                        numCompleted++;

                        console.log("Sensor.scanForSensor() " + self.name.toUpperCase() + " success -- " + numCompleted + " completed out of " + foundAddresses.length)
                        if (self.systemId === systemId) {
                            matchingDevice = device;
                        } else {
                            nonMatchingDevices.push({
                                device: device,
                                systemId: systemId
                            });
                        }

                        // self.gotSystemId(systemId, device);
                        if (numCompleted === foundAddresses.length) {
                            console.log("LAST ITEM");
                            console.log("foundMatch?", (matchingDevice !== null));

                            // Disconnect from all of the non matching devices
                            for (let nonMatchingDevice of nonMatchingDevices) {
                                console.log('Sensor.scanForSensor() disconnecting');
                                nonMatchingDevice.device.close();
                                nonMatchingDevice.device = null;
                            }

                            if (matchingDevice !== null) {
                                console.log('Sensor.scanForSensor() matches!!');
                                self._ngZone.run(() => {
                                    self.connectToDevice(matchingDevice);
                                });
                            }

                            if (matchingDevice === null && self.onDeviceConnectFail) {
                                self.onDeviceConnectFail('NO_MATCH');
                            }
                        }

                    }, () => {
                        console.log("Sensor.scanForSensor() system id fail");
                        numCompleted++;
                        console.log("fail -- "+numCompleted + " completed out of " + foundAddresses.length)
                    }
                );
            }
        });

        setTimeout(() => { 
            console.log("Stop Scanning " + self.name.toUpperCase() + " --- " + numCompleted + " completed out of " + foundAddresses.length);
            this._evothings.easyble.stopScan();
            if (foundAddresses.length === 0 && self.onDeviceConnectFail) {
                self._ngZone.run(() => {
                    self.onDeviceConnectFail("NO_SENSORS");
                });
            }

        }, 1000);
    }

    // gotSystemId(systemId, device) {
    //     console.log("Sensor.gotSystemId()", systemId);
    //     if (this.systemId === systemId) {
    //         console.log('Sensor.gotSystemId() matches!!');
    //         device.close();
    //         this.connectToDevice(device);
    //     } else {
    //         console.log('Sensor.gotSystemId() disconnecting');
    //         device.close();
    //     }
    // }

    connectToNearestDevice(statusCallback) {
        var self = this;

        this.sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.initialStatusHandler(status)
                    statusCallback(self, status);
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        this.sensortag.connectToNearestDevice();
    }

	initialStatusHandler(status) {
        console.log(this.name.toUpperCase() + " initial status = " + status);

		if ('DEVICE_INFO_AVAILABLE' == status) {
            this.deviceConnectedHandler();
        }

        this.status = status;
    }

    deviceConnectedHandler() {
        var self = this;

        this.systemId = this.sensortag.getSystemId();
        console.log('deviceConnectedHandler', this.systemId);

        this.sensortag
            .statusCallback((status) => {
				self._ngZone.run(() => {
					self.statusHandler(status)
				});
            })
            .humidityCallback((data) => {
				self._ngZone.run(() => {
					self.humidityHandler(data);
				});
            }, 1000)
            .temperatureCallback((data) => {
				self._ngZone.run(() => {
					self.temperatureHandler(data);
				});
            }, 1000)
            .keypressCallback((data) => {
				self._ngZone.run(() => {
					self.keypressHandler(data);
				});
            });
    }

	statusHandler(status) {
        console.log(this.name.toUpperCase() + " status = " + status);
        this.status = status;
    }

    temperatureHandler(data) {
        var values = this.sensortag.getTemperatureValues(data);
        var af = this.sensortag.celsiusToFahrenheit(values.ambientTemperature);
        var tf = this.sensortag.celsiusToFahrenheit(values.targetTemperature);

        this.data.temperatureData.ambientTemperature = af.toFixed(1);
        this.data.temperatureData.targetTemperature = tf.toFixed(1)
        var lastTenAmbient = this.data.temperatureData.lastTenAmbient.slice();
        lastTenAmbient.push(af);
        lastTenAmbient.shift();
        this.data.temperatureData.lastTenAmbient = lastTenAmbient;

        var lastTenTarget = this.data.temperatureData.lastTenTarget.slice();
        lastTenTarget.push(tf);
        lastTenTarget.shift();
        this.data.temperatureData.lastTenTarget = lastTenTarget;
    }

    humidityHandler(data) {
        var values = this.sensortag.getHumidityValues(data)

        // Calculate the relative humidity.
        var h = values.relativeHumidity;

        this.data.humidityData.relativeHumidity = h.toFixed(1)
        var lastTenValues = this.data.humidityData.lastTenValues.slice();
        lastTenValues.push(h);
        lastTenValues.shift();
        this.data.humidityData.lastTenValues = lastTenValues;

    }

    keypressHandler(data) {
        this.data.keypressData = data[0];
    }

    errorHandler(error) {
        console.log('errorHandler', error);
        if (this._evothings.easyble.error.DISCONNECTED == error) {
			// Deal with disconnected
		}
		this.status = 'ERROR';
    }
}