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

    setOnDeviceConnected(onDeviceConnected: Function) {
        this.onDeviceConnected = onDeviceConnected;
    }

    scanForSensor() {
        var self = this;
        var foundAddresses = [];
        console.log('Sensor.scanForSensor()');
        this.sensortag.startScanningForDevices((device) => {
            console.log('Sensor.scanForSensor() found device');
            if (self._bleService.deviceIsSensorTag(device) && foundAddresses.indexOf(device.address) === -1) {
                foundAddresses.push(device.address);
                self._bleService.getSystemIdFromDevice(device,
                    (systemId, device) => {
                        console.log("Sensor.scanForSensor() gotSystemId success");

                        self._ngZone.run(() => {
                            self.gotSystemId(systemId, device);
                        });
                    }, () => {
                        console.log("Sensor.scanForSensor() system id fail");
                    }
                );
            }
        });

        setTimeout(() => { 
            this.sensortag.stopScanningForDevices();
        }, 1000);
    }

    gotSystemId(systemId, device) {
        console.log("Sensor.gotSystemId()", systemId);
        if (this.systemId === systemId) {
            console.log('Sensor.gotSystemId() matches!!');
            device.close();
            this.connectToDevice(device);
        } else {
            console.log('Sensor.gotSystemId() disconnecting');
            device.close();
        }
    }

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

		if ('DEVICE_INFO_AVAILABLE' == status) {
            this.deviceConnectedHandler();
        }

        this.status = status;
    }

    deviceConnectedHandler() {
        var self = this;

        this.systemId = this.sensortag.getSystemId();

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
        if (this._evothings.easyble.error.DISCONNECTED == error) {
			// Deal with disconnected
		}
		this.status = 'ERROR';
    }
}