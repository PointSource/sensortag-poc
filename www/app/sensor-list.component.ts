import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {SensorService} from './sensor.service';
import {Sensor} from './sensor';
import {SensorComponent} from './sensor.component';

@Component({
    templateUrl: 'app/sensor-list.component.html',
    styleUrls: ['app/sensor-list.component.css'],
    directives: [SensorComponent]
})
export class SensorListComponent implements OnInit {
	title: string = "SensorTag Demo";
    objIOT: any;
    chart: any;
	status: string;
    statusPercentage: number;

	// List of devices
	sensors: Sensor[];

	constructor(
        private _sensorService: SensorService,
        @Inject('IoTFoundationLib') private _iotfoundationlib,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
	) { }

	ngOnInit() {
        this.statusPercentage = 0;

        this.sensors = this._sensorService.getSensors();

        // IoT Foundation object..
        this.objIOT = this._iotfoundationlib.createInstance();

        this.objIOT
            .onConnectSuccessCallback(() => {
                // alert("connect success")
            })
            .onConnectFailureCallback(() => {
                // alert("connect fail")
            })
            .connectToFoundationCloud()
    }

    connectToNearestDevice() {
        var self = this;

        // Create SensorTag CC2650 instance.
        var sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

        sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.initialStatusHandler(sensortag, status)
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        sensortag.connectToNearestDevice();
    }

    initialStatusHandler(sensortag, status) {
        if ('SCANNING' == status) {
            this.statusPercentage = 20
        } else if ('SENSORTAG_FOUND' == status) {
            this.statusPercentage = 40
        } else if ('CONNECTING' == status) {
            this.statusPercentage = 60
        } else if ('READING_DEVICE_INFO' == status) {
            this.statusPercentage = 80
        } else if ('DEVICE_INFO_AVAILABLE' == status) {
            this.statusPercentage = 100;
            this.deviceConnectedHandler(sensortag, this.sensors.length);
        } else if ('SENSORTAG_NOT_FOUND' == status) {
            this.statusPercentage = 0;
        }

        this.status = status;
    }

    deviceConnectedHandler(sensortag, index) {
        var self = this;
        sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.statusHandler(index, status)
                });
            })
            .humidityCallback(function(data) {
                self._ngZone.run(function() {
                    self.humidityHandler(index, data);
                });
            }, 1000)
            .keypressCallback(function(data) {
                self._ngZone.run(function() {
                    self.keypressHandler(index, data);
                });
            }, 1000);


        var connectedDevice: Sensor = {
            status: "initializing",
            sensortag: sensortag,
            data: {
                humidityData: {
                    lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    relativeHumidity: 0,
                    humidityTemperature: 0
                },
                keypressData: 0
            },
            address: sensortag.getDeviceAddress(),
            device: sensortag.getDevice(),
            name: "",
            isNamed: false,
            isConnected: true,
            job: ""
        };

        this._sensorService.addSensor(connectedDevice);
        this.sensors = this._sensorService.getSensors();
    }

    statusHandler(index, status) {
        this.sensors[index].status = status;
        if (status === "DEVICE_INFO_AVAILABLE") {
            this.sensors[index].isConnected = true;
        }
    }

    errorHandler(error) {
        if (this._evothings.easyble.error.DISCONNECTED == error) {
            this.resetSensorDisplayValues()
        }
        else {
			this.status = 'Error: ' + error;
        }
    }

    humidityHandler(index, data) {
        var values = this.sensors[index].sensortag.getHumidityValues(data)

        // Calculate the humidity temperature (C and F).
        var tc = values.humidityTemperature
        var tf = this.sensors[index].sensortag.celsiusToFahrenheit(tc)

        // Calculate the relative humidity.
        var h = values.relativeHumidity;

        this.sensors[index].data.humidityData.humidityTemperature = tc.toFixed(1);
        this.sensors[index].data.humidityData.relativeHumidity = h.toFixed(1)
        var lastTenValues = this.sensors[index].data.humidityData.lastTenValues.slice();
        lastTenValues.push(h);
        lastTenValues.shift();
        this.sensors[index].data.humidityData.lastTenValues = lastTenValues;

        // Publish event to the IoTF
        this.objIOT.publishToFoundationCloud({
            humidityData: {
                humidityTemperature: tc.toFixed(1),
                relativeHumidity: h.toFixed(1)
            }
        });
    }

    keypressHandler(index, data) {
        this.sensors[index].data.keypressData = data[0];
    }

    resetSensorDisplayValues() {
        // Clear current values.
        this.status = 'Press Connect to find a SensorTag';
    }

    saveDevices() {
        this._sensorService.sync();
    }

    // Reset status after device was named
    deviceNamedHandler() {
        this.status = ""
    }
}