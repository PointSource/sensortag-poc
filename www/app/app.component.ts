import {Component, NgZone} from 'angular2/core';

declare var evothings: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
  	public title: string;
  	sensortag: any;
  	status: string;

  	constructor(private _ngZone: NgZone) {
  		this.initialiseSensorTag();
  		this.title = "Sensor Tag fun";
  		this.status = "";
  	}

  	initialiseSensorTag()
    {
    	var self = this;

        // Create SensorTag CC2650 instance.
        this.sensortag = evothings.tisensortag.createInstance(
            evothings.tisensortag.CC2650_BLUETOOTH_SMART)


	        
	        //
	        // Here sensors are set up.
	        //
	        // If you wish to use only one or a few sensors, just set up
	        // the ones you wish to use.
	        //
	        // First parameter to sensor function is the callback function.
	        // Several of the sensors take a millisecond update interval
	        // as the second parameter.
	        //
        this.sensortag
            .statusCallback(function(status) {
            	self._ngZone.run(function() {
            		self.statusHandler(status)
            	});
            })
            .errorCallback(this.errorHandler)
            // .keypressCallback(keypressHandler)
            // .temperatureCallback(temperatureHandler, 1000)
            // .humidityCallback(humidityHandler, 1000)
            // .barometerCallback(barometerHandler, 1000)
            // .accelerometerCallback(accelerometerHandler, 1000)
            // .magnetometerCallback(magnetometerHandler, 1000)
            // .gyroscopeCallback(gyroscopeHandler, 1000)
            // .luxometerCallback(luxometerHandler, 1000)


    }

    connect() {
    	this.title = "connect";

        this.sensortag.connectToNearestDevice();
    }

    disconnect() {
    	alert(this.status);
    }


    statusHandler(status)
    {
        if ('DEVICE_INFO_AVAILABLE' == status)
        {
            // Show a notification about that the firmware should be
            // upgraded if the connected device is a SensorTag CC2541
            // with firmware revision less than 1.5, since this the
            // SensorTag library does not support these versions.
            var upgradeNotice = document.getElementById('upgradeNotice')
            if ('CC2541' == this.sensortag.getDeviceModel() &&
                parseFloat(this.sensortag.getFirmwareString()) < 1.5)
            {
                upgradeNotice.classList.remove('hidden')
            }
            else
            {
                upgradeNotice.classList.add('hidden')
            }

            // Show device model and firmware version.
            // displayValue('DeviceModel', this.sensortag.getDeviceModel())
            // displayValue('FirmwareData', this.sensortag.getFirmwareString())

            // Show which sensors are not supported by the connected SensorTag.
            if (!this.sensortag.isLuxometerAvailable())
            {
                document.getElementById('Luxometer').style.display = 'none'
            }
        }

        this.title = status;
    }

    errorHandler(error)
    {
        console.log('Error: ' + error)

        if (evothings.easyble.error.DISCONNECTED == error)
        {
            resetSensorDisplayValues()
        }
        else
        {
	        this.title = 'Error: ' + error;
	        alert('Error: ' + error)
            // displayValue('StatusData', 'Error: ' + error)
        }
    }
}

