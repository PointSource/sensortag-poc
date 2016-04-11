export interface SensorData {
	humidityData: {
		lastTenValues: any[],
		relativeHumidity: number
    };
	temperatureData: {
		lastTenAmbient: any[],
		lastTenTarget: any[],
		ambientTemperature: number,
		targetTemperature: number
	};
	keypressData: number
}