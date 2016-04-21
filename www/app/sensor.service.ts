import {Injectable} from 'angular2/core';
import {Sensor} from './sensor';
import {Http, Headers, Response} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class SensorService {
	public sensors: Sensor[] = [];
	public clientSensors: Sensor[] = [];

	constructor(
        private _http: Http
	) {}

	fetch() {
		return this._http.get('http://tisensortag-node.mybluemix.net/devices')
			.map(res => res.json())
			.subscribe((res) => {
				this.sensors = res;
			});
	}

	sync() {
        var sensorsCopy = [];

        for (let sensor of this.sensors) {
        	sensorsCopy.push({
        		status: "DISCONNECTED",
        		systemId: sensor.systemId,
        		name: sensor.name,
        		policyNumber: sensor.policyNumber
        	})
        }

		var headers = new Headers();
        headers.append('Content-Type', 'application/json');
		this._http.post('http://tisensortag-node.mybluemix.net/devices/sync', JSON.stringify(sensorsCopy), {
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

	getSensor(systemId: string): Sensor {
		return this.sensors.find(
			(sensor) => sensor.systemId === systemId
		);
	}

	removeSensor(systemId: string) {
		var index = this.sensors.findIndex(
			(sensor) => sensor.systemId === systemId
		);
		this.sensors.splice(index, 1);
	}

	setClientSensors(clientSensors: Sensor[]) {
		this.clientSensors = clientSensors;
	}

	getClientSensors(): Sensor[] {
		return this.clientSensors;
	}


	reset() {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this._http.post('http://tisensortag-node.mybluemix.net/devices/reset', null, {
			headers: headers
		}).subscribe((res) => console.log(res));

	}

}