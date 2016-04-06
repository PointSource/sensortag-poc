import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

import {ReadingService} from './reading.service';
import {Reading} from './reading'
import {ChartComponent} from '../chart.component';

@Component({
    templateUrl: 'app/technician/reading-history.component.html',
    directives: [ChartComponent]
})
export class ReadingHistoryComponent implements OnInit {
    readings: Reading[];
    lastTenReadings: any = [];

    constructor(
        private _routeParams: RouteParams,
        private _readingService: ReadingService
    ) { }

    ngOnInit() {
        var policyNumber = this._routeParams.get('policyNumber');
        this.readings = this._readingService.getReadingsForPolicy(policyNumber);

        var readingsBySensor = {};

        for (let reading of this.readings) {
            // this.lastTenReadings.push([]);
            for (let sensorData of reading.sensorData) {
                if (!readingsBySensor[sensorData.address]) {
                    readingsBySensor[sensorData.address] = [];
                }
                readingsBySensor[sensorData.address].push({
                    x: new Date(reading.date),
                    y: sensorData.data.humidityData.relativeHumidity
                });
            }
        }

        var readingKeys = Object.keys(readingsBySensor);
        for (let key of readingKeys) {
            this.lastTenReadings.push(readingsBySensor[key]);
        }

    }

}