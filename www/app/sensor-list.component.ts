import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
import {SensorService} from './sensor.service';
import {ConnectedDevice} from './connected-device';

@Component({
    templateUrl: 'app/sensor-list.component.html'
})
export class SensorListComponent implements OnInit {
	public title: string = "SensorTag Demo";
    objIOT: any;
    chart: any;
	status: string;
    statusPercentage: number;

	// List of devices
	connectedDevices: ConnectedDevice[];

	constructor(
        private _sensorService: SensorService,
        @Inject('IoTFoundationLib') private _iotfoundationlib,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone,
        private _router: Router
	) { }

	ngOnInit() {
		var self = this;

        this.statusPercentage = 0;

        this.connectedDevices = this._sensorService.getSensors();

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

    initSensorTag() {
        // Create SensorTag CC2650 instance.
        var sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)
        return sensortag;
    }

    connectToNearestDevice() {
        var self = this;
        var sensortag = this.initSensorTag();

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
            this.deviceConnectedHandler(sensortag, this.connectedDevices.length);
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


        var connectedDevice: ConnectedDevice = {
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
            isConnected: true
        };

        this._sensorService.addSensor(connectedDevice);
        this.connectedDevices = this._sensorService.getSensors();
    }

    nameDevice(connectedDevice, name) {
        connectedDevice.isNamed = true;
        connectedDevice.name = name;
        this.status = "";
    }

    toggleDeviceConnection(index) {
        if (this.connectedDevices[index].isConnected) {
            this.connectedDevices[index].sensortag.disconnectDevice();
            this.connectedDevices[index].status = "DISCONNECTED";
            this.connectedDevices[index].isConnected = false;
        } else {
            this.connectedDevices[index].sensortag.connectToDevice(this.connectedDevices[index].device);
        }
    }

    statusHandler(index, status) {
        this.connectedDevices[index].status = status;
        if (status === "DEVICE_INFO_AVAILABLE") {
            this.connectedDevices[index].isConnected = true;
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
        var values = this.connectedDevices[index].sensortag.getHumidityValues(data)

        // Calculate the humidity temperature (C and F).
        var tc = values.humidityTemperature
        var tf = this.connectedDevices[index].sensortag.celsiusToFahrenheit(tc)

        // Calculate the relative humidity.
        var h = values.relativeHumidity;

        this.connectedDevices[index].data.humidityData.humidityTemperature = tc.toFixed(1);
        this.connectedDevices[index].data.humidityData.relativeHumidity = h.toFixed(1)
        var lastTenValues = this.connectedDevices[index].data.humidityData.lastTenValues.slice();
        lastTenValues.push(h);
        lastTenValues.shift();
        this.connectedDevices[index].data.humidityData.lastTenValues = lastTenValues;

        // Publish event to the IoTF
        this.objIOT.publishToFoundationCloud({
            humidityData: {
                humidityTemperature: tc.toFixed(1),
                relativeHumidity: h.toFixed(1)
            }
        });
    }

    keypressHandler(index, data) {
        this.connectedDevices[index].data.keypressData = data[0];
    }

    resetSensorDisplayValues() {
        // Clear current values.
        this.status = 'Press Connect to find a SensorTag';
    }

    goToSensorDetails(index) {
		this._router.navigate(['SensorDetail', { index: index }]);
    }

    saveDevices() {
        this._sensorService.saveSensors();
    }
}