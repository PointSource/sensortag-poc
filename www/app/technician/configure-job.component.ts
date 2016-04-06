import {Component, OnInit, Inject, NgZone, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {SensorService} from '../sensor.service';
import {NavService} from '../nav.service';
import {JobService} from './job.service';

import {Sensor} from '../sensor';
import {Job} from './job';
import {SensorComponent} from '../sensor.component';

@Component({
    templateUrl: 'app/technician/configure-job.component.html',
    styleUrls: ['app/technician/configure-job.component.css'],
    directives: [SensorComponent]
})
export class ConfigureJobComponent implements OnInit {
    private job: Job;    
    objIOT: any = {};
    chart: any;
	status: string;
    statusPercentage: number;
    private modalElement: any;

	// List of devices
	sensors: Sensor[];

	constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _navService: NavService,
        private _routeParams: RouteParams,
        private _elementRef: ElementRef,
        @Inject('IoTFoundationLib') private _iotfoundationlib,
        @Inject('Foundation') private _foundation,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
	) { }

	ngOnInit() {
        this.modalElement = $(this._elementRef.nativeElement.children[0]);
        var elem = new this._foundation.Reveal(this.modalElement, { closeOnClick: false });

        var policyNumber = this._routeParams.get('policyNumber');

        this.job = this._jobService.getJob(policyNumber);
        if (this.job === null) {
            window.history.back();
        }
        this._navService.setTitle(this.job.name);

        this.statusPercentage = 0;

        this.sensors = this._sensorService.getSensorsForPolicy(policyNumber);

        // IoT Foundation object..
        this.objIOT['b0b448d31202'] = this._iotfoundationlib.createInstance('b0b448d31202', 'b4KBCvZ*ivr9cVhpPg');

        this.objIOT['b0b448d31202']
            .onConnectSuccessCallback(() => {
                // alert("connect success")
            })
            .onConnectFailureCallback(() => {
                // alert("connect fail")
            })
            .connectToFoundationCloud()


        // IoT Foundation object..
        this.objIOT['b0b448c9d807'] = this._iotfoundationlib.createInstance('b0b448c9d807', '2?Q7s4DL-_3L4LKKIM');

        this.objIOT['b0b448c9d807']
            .onConnectSuccessCallback(() => {
                // alert("connect success")
            })
            .onConnectFailureCallback(() => {
                // alert("connect fail")
            })
            .connectToFoundationCloud()



        // IoT Foundation object..
        this.objIOT['b0b448c8b807'] = this._iotfoundationlib.createInstance('b0b448c8b807', 'GXpLWf_ge1qX5z-BNO');

        this.objIOT['b0b448c8b807']
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
        this.modalElement.foundation('open');
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
            .temperatureCallback(function(data) {
                self._ngZone.run(function() {
                    self.temperatureHandler(index, data);
                });
            }, 1000)
            .keypressCallback(function(data) {
                self._ngZone.run(function() {
                    self.keypressHandler(index, data);
                });
            });


        var connectedDevice: Sensor = {
            status: "initializing",
            sensortag: sensortag,
            data: {
                humidityData: {
                    lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    relativeHumidity: 0,
                    humidityTemperature: 0
                },
                temperatureData: {
                    lastTenAmbient: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    lastTenTarget: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ambientTemperature: 0,
                    targetTemperature: 0
                },
                keypressData: 0
            },
            device: sensortag.getDevice(),
            name: "Untitled "+index,
            isNamed: true,
            isConnected: true,
            policyNumber: this.job.policyNumber
        };

        setInterval(() => {
            self.sendReport();
        }, 1000);

        this._sensorService.addSensor(connectedDevice);
        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
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

    temperatureHandler(index, data) {
        var values = this.sensors[index].sensortag.getTemperatureValues(data);
        var ac = values.ambientTemperature;
        var af = this.sensors[index].sensortag.celsiusToFahrenheit(ac);
        var tc = values.targetTemperature;
        var tf = this.sensors[index].sensortag.celsiusToFahrenheit(tc);

        this.sensors[index].data.temperatureData.ambientTemperature = af.toFixed(1);
        this.sensors[index].data.temperatureData.targetTemperature = tf.toFixed(1)
        var lastTenAmbient = this.sensors[index].data.temperatureData.lastTenAmbient.slice();
        lastTenAmbient.push(af);
        lastTenAmbient.shift();
        this.sensors[index].data.temperatureData.lastTenAmbient = lastTenAmbient;

        var lastTenTarget = this.sensors[index].data.temperatureData.lastTenTarget.slice();
        lastTenTarget.push(tf);
        lastTenTarget.shift();
        this.sensors[index].data.temperatureData.lastTenTarget = lastTenTarget;
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

        window.history.back();
    }

    sendReport() {
        for (let sensor of this.sensors) {
            var formattedAddress = sensor.device.address.replace(new RegExp(":", "g"), "").toLowerCase()
            this.objIOT[formattedAddress].publishToFoundationCloud({
                d: {
                    humidityData: {
                        relativeHumidity: sensor.data.humidityData.relativeHumidity
                    },
                    temperatureData: {
                        ambientTemperature: sensor.data.temperatureData.ambientTemperature,
                        targetTemperature: sensor.data.temperatureData.targetTemperature
                    }
                }
            });
        }
    }

    nameSensor(sensorName) {
        this.modalElement.foundation('close');
        this.sensors[0].name = sensorName;
        this.sensors[0].isNamed = true;
        this.status = ""
    }

    // Reset status after device was named
    deviceNamedHandler() {
        this.status = ""
    }
}