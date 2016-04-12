import {NgZone, Inject} from 'angular2/core';
import {SensorData} from './sensor-data';

export class Sensor {
	systemId: string;
	policyNumber: string;
	name: string;
	status: string;
	sensortag: any;
	data: SensorData;

    constructor(
		private _ngZone: NgZone,
        @Inject('Evothings') private _evothings
	) { }

    initialize(policyNumber: string) {
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
        this.status = "initializing";
    }

    setName(name: string) {
        this.name = name;
    }

    connectToDevice(device) {
        var self = this;

        this.sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.initialStatusHandler(status)
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        this.sensortag.connectToDevice(device);
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