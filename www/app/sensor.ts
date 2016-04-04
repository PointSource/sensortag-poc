export interface Sensor {
	status: string;
	sensortag: any;
	data: any;
	address: string;
	name: string;
	isNamed: boolean;
	isConnected: boolean;
	device: any;
	job: string;
}