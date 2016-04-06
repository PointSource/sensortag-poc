export interface Reading {
	policyNumber: number;
	date: number;
	sensorData: [{
		name: string,
		address: string,
		data: any
	}];
}