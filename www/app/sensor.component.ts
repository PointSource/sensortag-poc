import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'sensor',
    templateUrl: 'app/sensor.component.html',
    inputs: ['device', 'dindex']

})
export class SensorComponent {
	device;
	dindex;

    constructor(
        private _router: Router
	) { }

    nameDevice(name) {
        this.device.isNamed = true;
        this.device.name = name;
    }

    toggleDeviceConnection() {
        if (this.device.isConnected) {
            this.device.sensortag.disconnectDevice();
            this.device.status = "DISCONNECTED";
            this.device.isConnected = false;
        } else {
            this.device.sensortag.connectToDevice(this.device.device);
        }
    }

    goToSensorDetails() {
		this._router.navigate(['SensorDetail', { index: this.dindex }]);
    }

}