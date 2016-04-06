import {Injectable} from 'angular2/core';
import {Sensor} from './sensor';
import {Http, Headers, Response} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class SensorService {
	public sensors: Sensor[] = [];

	constructor(
        private _http: Http
	) {}

	fetch() {
		return this._http.get('http://10.128.64.62:1337/devices')
			.map(res => res.json())
			.subscribe((res) => {
				this.sensors = res;
			});
	}

	sync() {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		this._http.post('http://10.128.64.62:1337/devices/sync', JSON.stringify(this.sensors), {
			headers: headers
		}).subscribe((res) => console.log(res));

	}

	getSensors(): any {
		return this.sensors;
	}

	getSensorsForPolicy(policyNumber): Sensor[] {
		var sensorsForPolicy = [];
		for (let sensor of this.sensors) {
			if (sensor.policyNumber === policyNumber) {
				sensorsForPolicy.push(sensor);
			}
		}
		return sensorsForPolicy;
	}

	countSensorsForPolicy(policyNumber): number {
		var count = 0
		for (let sensor of this.sensors) {
			if (sensor.policyNumber === policyNumber) {
				count++;
			}
		}
		return count;
	}

	addSensor(sensor: Sensor): void {
		this.sensors.push(sensor);
	}

	getSensor(address): Sensor {
		return this.sensors.find(
			(sensor) => sensor.device.address === address
		);
	}

	removeSensor(address: string) {
		var index = this.sensors.findIndex(
			(sensor) => sensor.device.address === address
		);
		this.sensors.splice(index, 1);
	}

}