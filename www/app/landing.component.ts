import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {SensorService} from './sensor.service';
import {ReadingService} from './technician/reading.service';
import {NavService} from './nav.service';
import {BLEService} from './ble.service';

@Component({
    templateUrl: 'app/landing.component.html'
})
export class LandingComponent implements OnInit {

    private loadingComplete: boolean;

    constructor(
        private _sensorService: SensorService,
        private _readingService: ReadingService,
        private _router: Router,
        private _navService: NavService,
        private _bleService: BLEService
    ) { }

    ngOnInit() {
        this.loadingComplete = false;
        this._navService.setTitle("Sensor Demo");
        if (this._sensorService.sensors.length === 0) {
            this._sensorService.fetch().add(() => {
                this._readingService.fetch().add(() => {
                    this.loadingComplete = true;
                });
            });
        } else {
            this.loadingComplete = true;
        }
    }

    goToTechnician() {
        this._router.navigate(['JobList', { }]);
    }

    goToClient() {
        this._router.navigate(['AccountDetails', {}]);
    }

    disconnect() {
        this._bleService.disconnectAllDevices();
        this._sensorService.setClientSensors([]);
    }

    reset() {
        this.loadingComplete = false;
        this._sensorService.reset().add(() => {
            this._readingService.reset().add(() => {
                this._sensorService.fetch().add(() => {
                    this._readingService.fetch().add(() => {
                        this.loadingComplete = true;

                        this._bleService.disconnectAllDevices();
                        this._sensorService.setClientSensors([]);
                    });
                });
            })
        });
    }

}