import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

import {ReadingService} from './reading.service';
import {SensorService} from '../sensor.service';
import {Reading} from './reading'
import {ChartComponent} from '../chart.component';

@Component({
    templateUrl: 'app/technician/reading-history.component.html',
    directives: [ChartComponent]
})
export class ReadingHistoryComponent implements OnInit {
    readings: Reading[];
    lastTenReadings: any = [];
    type: string;
    title: string;

    constructor(
        private _routeParams: RouteParams,
        private _readingService: ReadingService,
        private _sensorService: SensorService
    ) { }

    ngOnInit() {
        var policyNumber = this._routeParams.get('policyNumber');
        this.type = this._routeParams.get('type');

        this.readings = this._readingService.getReadingsForPolicy(policyNumber);

        var readingsBySensor = {};

        if (this.type === "humidity") {
            this.title = "Humidity";
        } else if (this.type === "targetTemperature") {
            this.title = "Target Temperature"
        } else if (this.type === "ambientTemperature") {
            this.title = "Ambient Temperature"
        }

        for (let reading of this.readings) {
            for (let sensorData of reading.sensorData) {
                if (!readingsBySensor[sensorData.address]) {
                    readingsBySensor[sensorData.address] = {
                        label: this._sensorService.getSensor(sensorData.address).name,
                        data: []
                    };
                }
                let dataPoint = 0;
                if (this.type === "humidity") {
                    dataPoint = sensorData.data.humidityData.relativeHumidity;
                } else if (this.type === "targetTemperature") {
                    dataPoint = sensorData.data.temperatureData.targetTemperature;
                } else if (this.type === "ambientTemperature") {
                    dataPoint = sensorData.data.temperatureData.ambientTemperature;
                }

                readingsBySensor[sensorData.address].data.push({
                    x: new Date(reading.date),
                    y: dataPoint
                });
            }
        }

        var readingKeys = Object.keys(readingsBySensor);
        for (let key of readingKeys) {
            this.lastTenReadings.push(readingsBySensor[key]);
        }

    }

}