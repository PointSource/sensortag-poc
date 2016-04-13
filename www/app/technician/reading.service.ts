import {Injectable} from 'angular2/core';
import {Reading} from './reading';
import {Http, Headers, Response} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class ReadingService {
	public readings: Reading[] = [];

	constructor(
        private _http: Http
	) { 
		this.fetch();
	}

	fetch() {
		return this._http.get('http://10.128.64.62:1337/readings')
			.map(res => res.json())
			.subscribe((res) => {
				this.readings = res;
			});
	}

	getReadings(): Reading[] {
		return this.readings;
	}

	addReading(reading: Reading) {
		this.readings.push(reading);

		var headers = new Headers();
        headers.append('Content-Type', 'application/json');
		this._http.post('http://10.128.64.62:1337/readings/add', JSON.stringify(reading), {
			headers: headers
		}).subscribe((res) => console.log(res));
	}

	getReadingsForPolicy(policyNumber: string): Reading[] {

		let readingsForPolicy: Reading[] = [];
		for (let reading of this.readings) {
			if (reading.policyNumber === policyNumber) {
				readingsForPolicy.push(reading);
			}
		}
		return readingsForPolicy;
	}

}