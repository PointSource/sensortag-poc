export interface Reading {
	policyNumber: string;
	date: number;
	sensorData: [{
		name: string,
		systemId: string,
		data: any
	}];
}