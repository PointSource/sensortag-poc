import {Component, OnInit} from 'angular2/core';
import {SensorService} from './sensor.service';
import {RouteParams} from 'angular2/router';
import {ChartComponent} from './chart.component';

@Component({
    templateUrl: 'app/sensor-detail.component.html',
    directives: [ChartComponent]
})
export class SensorDetailComponent implements OnInit {
    device: any;

    constructor(
    	private _routeParams: RouteParams,
    	private _sensorService: SensorService
	) { }

    ngOnInit() {
		var address = this._routeParams.get('address');
        this.device = this._sensorService.getSensor(address);
    }
}