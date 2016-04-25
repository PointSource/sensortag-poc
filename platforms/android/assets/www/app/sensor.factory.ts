import {NgZone, Inject, Injectable} from 'angular2/core';
import {Sensor} from './sensor';
import {SensorData} from './sensor-data';

@Injectable()
export class SensorFactory {

    constructor (
    	private _ngZone: NgZone,
        @Inject('Evothings') private _evothings
	) {}

    sensor(policyNumber: string) {

        var sensor: Sensor = new Sensor(this._ngZone, this._evothings);
        sensor.initialize(policyNumber);

        return sensor;

    }


}