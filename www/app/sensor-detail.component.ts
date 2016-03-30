import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

@Component({
    templateUrl: 'app/sensor-detail.component.html'
})
export class SensorDetailComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        
    }

    goBack() {
        window.history.back();
    }
}