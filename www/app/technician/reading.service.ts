import {Injectable} from 'angular2/core';
import {Reading} from './reading';

@Injectable()
export class ReadingService {
	public readings: Reading[] = [];

	constructor() {}

	getReadings(): Reading[] {
		return this.readings;
	}

	addReading(reading: Reading) {
		this.readings.push(reading);
	}

	getReadingsForPolicy(policyNumber: number): Reading[] {
		let readingsForPolicy: Reading[] = [];
		for (let reading of this.readings) {
			if (reading.policyNumber === policyNumber) {
				readingsForPolicy.push(reading);
			}
		}
		return readingsForPolicy;
	}

}