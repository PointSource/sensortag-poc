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
    directives: [SensorComponent]
})
export class ConfigureJobComponent implements OnInit {
    private job: Job;    
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
        @Inject('jQuery') private _jquery,
        @Inject('Foundation') private _foundation,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
	) { }

	ngOnInit() {
        this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
        var elem = new this._foundation.Reveal(this.modalElement, { closeOnClick: false });

        var policyNumber = this._routeParams.get('policyNumber');

        this.job = this._jobService.getJob(policyNumber);
        if (this.job === null) {
            window.history.back();
        }
        this._navService.setTitle(this.job.name);

        this.statusPercentage = 0;

        this.sensors = this._sensorService.getSensorsForPolicy(policyNumber);
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
            this.modalElement.foundation('open');
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

        var sensor: Sensor = {
            systemId: sensortag.getSystemId(),
            status: "initializing",
            sensortag: sensortag,
            data: {
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
            },
            name: "Sensor "+index,
            policyNumber: this.job.policyNumber
        };

        sensor.sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.statusHandler(sensor, status)
                });
            })
            .humidityCallback(function(data) {
                self._ngZone.run(function() {
                    self.humidityHandler(sensor, data);
                });
            }, 1000)
            .temperatureCallback(function(data) {
                self._ngZone.run(function() {
                    self.temperatureHandler(sensor, data);
                });
            }, 1000)
            .keypressCallback(function(data) {
                self._ngZone.run(function() {
                    self.keypressHandler(sensor, data);
                });
            });

        this._sensorService.addSensor(sensor);
        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
    }

    statusHandler(sensor, status) {
        sensor.status = status;
    }

    errorHandler(error) {
        if (this._evothings.easyble.error.DISCONNECTED == error) {
            this.resetSensorDisplayValues()
        }
        else {
			this.status = 'ERROR';
        }
    }

    temperatureHandler(sensor, data) {
        var values = sensor.sensortag.getTemperatureValues(data);
        var af = sensor.sensortag.celsiusToFahrenheit(values.ambientTemperature);
        var tf = sensor.sensortag.celsiusToFahrenheit(values.targetTemperature);

        sensor.data.temperatureData.ambientTemperature = af.toFixed(1);
        sensor.data.temperatureData.targetTemperature = tf.toFixed(1)
        var lastTenAmbient = sensor.data.temperatureData.lastTenAmbient.slice();
        lastTenAmbient.push(af);
        lastTenAmbient.shift();
        sensor.data.temperatureData.lastTenAmbient = lastTenAmbient;

        var lastTenTarget = sensor.data.temperatureData.lastTenTarget.slice();
        lastTenTarget.push(tf);
        lastTenTarget.shift();
        sensor.data.temperatureData.lastTenTarget = lastTenTarget;
    }

    humidityHandler(sensor, data) {
        var values = sensor.sensortag.getHumidityValues(data)

        // Calculate the relative humidity.
        var h = values.relativeHumidity;

        sensor.data.humidityData.relativeHumidity = h.toFixed(1)
        var lastTenValues = sensor.data.humidityData.lastTenValues.slice();
        lastTenValues.push(h);
        lastTenValues.shift();
        sensor.data.humidityData.lastTenValues = lastTenValues;
    }

    keypressHandler(sensor, data) {
        sensor.data.keypressData = data[0];
    }

    resetSensorDisplayValues() {
        // Clear current values.
        this.status = 'Press Connect to find a SensorTag';
    }

    saveDevices() {
        // this._sensorService.sync();
        window.history.back();
    }

    nameSensor(sensorName) {
        this.modalElement.foundation('close');
        this.sensors[this.sensors.length - 1].name = sensorName;
        this.status = ""
    }

    // Handle device disconnected
    deviceDisconnectedHandler(sensor) {
        this._sensorService.removeSensor(sensor.systemId);
        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
    }

}