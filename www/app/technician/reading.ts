export interface Reading {
	policyNumber: string;
	date: number;
	sensorData: [{
		name: string,
		address: string,
		data: any
	}];
}