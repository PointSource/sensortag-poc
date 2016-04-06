export interface Sensor {
	status: string;
	sensortag: any;
	data: any;
	name: string;
	isNamed: boolean;
	isConnected: boolean;
	device: any;
	policyNumber: number;
}