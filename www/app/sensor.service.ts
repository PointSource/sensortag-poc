import {Injectable} from 'angular2/core';
import {ConnectedDevice} from './connected-device';


@Injectable()
export class SensorService {
	public sensors: ConnectedDevice[] = [];

	getSensors(): ConnectedDevice[] {
		return this.sensors;
	}

	addSensor(sensor): void {
		this.sensors.push(sensor);
	}

	getSensor(index): ConnectedDevice {
		return this.sensors[index];
	}

}