import {NgZone, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Http} from 'angular2/http';
import {SensorService} from '../sensor.service';
import {JobService} from './job.service';
import {NavService} from '../nav.service';
import {ConfigureJobComponent} from "./configure-job.component"

var sensortag;
var sensor;
var tisensortag;
var evothings;
var iotFoundationLib;

beforeEach(() => {
	sensortag = {
		statusCallback: () => sensortag,
		errorCallback: () => sensortag,
		keypressCallback: () => sensortag,
		temperatureCallback: () => sensortag,
		humidityCallback: () => sensortag,
		connectToNearestDevice: () => { },
		connectToDevice: () => { },
		celsiusToFahrenheit: (celsius) => {
			return (celsius * 9 / 5) + 32
		},
		getDeviceAddress: () => {
			return "address123"
		},
		getSystemId: () => {
			return "000111222"
		},
		getDevice: () => {
			return {
				address: "address123"
			}
		}
	};

	sensor = {
		sensortag: sensortag,
		policyNumber: "Job1",
		data: {
			humidityData: {
				lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			}
		}
	};

	evothings = {
		tisensortag: {
			createInstance: function() {
				return sensortag
			}
		}
	}

	var objIOT = {
		onConnectSuccessCallback: () => { return objIOT },
		onConnectFailureCallback: () => { return objIOT },
		connectToFoundationCloud: () => { return objIOT },
		publishToFoundationCloud: () => { }
	}

	iotFoundationLib = {
		createInstance: () => {
			return objIOT
		}
	}
})



describe('Configure Job Component', () => {
	let _sensorService: SensorService;
	let _jobService: JobService;
	let _navService = jasmine.createSpyObj("_navService", ['setTitle']);
	let _routeParams = jasmine.createSpyObj("_routeParams", ['get']);
	let _elementRef = {
		nativeElement: {
			children: []
		}
	};
	let _jquery = () => { 
		return {
			foundation: ()=>{}
		}
	};
	let _ngZone: NgZone;
	let _foundation = jasmine.createSpyObj("_foundation", ['Reveal']);
	let _http: Http;
	let configureJob;

	beforeEach(() => {
		_sensorService = new SensorService(_http);
		_jobService = new JobService(_sensorService);

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})
		configureJob = new ConfigureJobComponent(
			_sensorService,
			_jobService,
			_navService,
			_routeParams,
			_elementRef,
			_jquery,
			_foundation,
			evothings, 
			_ngZone
		);
	})

	describe('on init', () => {

		it('fills list with any devices that were saved', () => {
			configureJob._sensorService.addSensor({
				address: "address123"
			});
			spyOn(configureJob._sensorService, "getSensorsForPolicy").and.callThrough();
			configureJob.ngOnInit();
			expect(configureJob._sensorService.getSensorsForPolicy).toHaveBeenCalled();
			expect(configureJob.sensors.length).toBe(1);
		});
	});



	describe('when device is connected', () => {

		beforeEach(() => {
			configureJob.ngOnInit();
		})

		it('adds the sensortag to the list of connected devices', () => {
			spyOn(configureJob._sensorService, "addSensor").and.callThrough();
			configureJob.deviceConnectedHandler(sensor);
			expect(configureJob._sensorService.addSensor).toHaveBeenCalled();
			expect(configureJob.sensors[0].sensortag)
				.toEqual(sensortag);
			expect(configureJob.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		})

	});

	describe('on status update', () => {


		it('should update main status', () => {
			configureJob.ngOnInit();
			spyOn(configureJob.modalElement, "foundation");
			configureJob.statusHandler(sensortag, "SCANNING");
			expect(configureJob.status).toBe("SCANNING");
		});


		it('should update status percentage', () => {
			configureJob.ngOnInit();
			configureJob.statusHandler(sensortag, "SCANNING");
			expect(configureJob.statusPercentage).toBe(20);
			configureJob.statusHandler(sensortag, "SENSORTAG_FOUND");
			expect(configureJob.statusPercentage).toBe(40);
			configureJob.statusHandler(sensortag, "CONNECTING");
			expect(configureJob.statusPercentage).toBe(60);
			configureJob.statusHandler(sensortag, "READING_DEVICE_INFO");
			expect(configureJob.statusPercentage).toBe(80);
			configureJob.statusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(configureJob.statusPercentage).toBe(100);
		});

		it('if status is DEVICE_INFO_AVAILABLE add sensortag to connected devices', () => {
			configureJob.ngOnInit();
			spyOn(configureJob, "deviceConnectedHandler");
			configureJob.statusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(configureJob.deviceConnectedHandler).toHaveBeenCalled();
		});

	});


	describe('when device is named', () => {
		it('sets device name to new name', () => {
			configureJob.ngOnInit();
			configureJob.deviceConnectedHandler(sensor);
			configureJob.nameSensor("new name");
			expect(configureJob.sensors[0].name).toBe("new name");
		});

	});

});