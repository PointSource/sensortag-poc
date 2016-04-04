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

	getSensorsForJob(jobName): Sensor[] {
		var sensorsForJob = [];
		for (let sensor of this.sensors) {
			if (sensor.job === jobName) {
				sensorsForJob.push(sensor);
			}
		}
		return sensorsForJob;
	}

	addSensor(sensor: Sensor): void {
		this.sensors.push(sensor);
	}

	getSensor(index): Sensor {
		return this.sensors[index];
	}

}