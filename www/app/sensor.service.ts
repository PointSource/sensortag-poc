import {Injectable} from 'angular2/core';
import {ConnectedDevice} from './connected-device';
import {Http, Headers} from 'angular2/http';


@Injectable()
export class SensorService {
	public sensors: ConnectedDevice[] = [];

	constructor(
        private _http: Http
	) {}

	getSensors(): ConnectedDevice[] {
		return this.sensors;
	}

	getSensorsForJob(jobName): ConnectedDevice[] {
		var sensorsForJob = [];
		for (let sensor of this.sensors) {
			if (sensor.job === jobName) {
				sensorsForJob.push(sensor);
			}
		}
		return sensorsForJob;
	}

	saveSensors() {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var device = {
            address: 'address999'
        }

		this._http.post('http://10.0.1.7:1337/devices/add', JSON.stringify(device), {
			headers: headers
		}).subscribe((res) => console.log(res));

	}

	addSensor(sensor: ConnectedDevice): void {
		this.sensors.push(sensor);
	}

	getSensor(index): ConnectedDevice {
		return this.sensors[index];
	}

}