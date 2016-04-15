import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {NavService} from './nav.service';
import {BLEService} from './ble.service';

@Component({
    templateUrl: 'app/landing.component.html'
})
export class LandingComponent implements OnInit {

    constructor(
        private _router: Router,
        private _navService: NavService,
        private _bleService: BLEService
    ) { }

    ngOnInit() {
        this._navService.setTitle("Sensor Demo");
    }

    goToTechnician() {
        this._router.navigate(['JobList', { }]);
    }

    goToClient() {
        this._router.navigate(['AccountDetails', {}]);
    }

    disconnect() {
        this._bleService.disconnectAllDevices();
    }

}