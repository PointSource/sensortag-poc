import {SensorDetailComponent} from "./sensor-detail.component"
import {SensorService} from "./sensor.service"
import {Http} from 'angular2/http';
import {RouteParams} from 'angular2/router';


describe('Sensor Detail Component', () => {
	let sensorService: SensorService;
	let routeParams: RouteParams;
	let sensorDetailComponent;
	let http: Http;

	beforeEach(() => {
		sensorService = new SensorService(http);
		routeParams = new RouteParams({"test": "test"});
		sensorDetailComponent = new SensorDetailComponent(routeParams, sensorService);
	})

	describe('on init', () => {

		it('gets the sensor from the sensorService', () => {
			spyOn(sensorService, "getSensor");
			spyOn(routeParams, "get").and.returnValue(1);
			sensorDetailComponent.ngOnInit();
			expect(sensorService.getSensor).toHaveBeenCalledWith(1);
		});

	});
});