import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

@Component({
    templateUrl: 'app/sensor-detail.component.html'
})
export class SensorDetailComponent implements OnInit {
    device: any;

    constructor(private _routeParams: RouteParams) {}

    ngOnInit() {
        this.device = this._routeParams.get('device');
    }

    goBack() {
        window.history.back();
    }
}