import {Component, Inject, NgZone} from 'angular2/core';


@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
  	public title: string;
  	sensortag: any;
  	status: string;
	firmwareData: string;
	deviceModel: string;
	needsUpgrade: string;

	// sensor data
	keypressData: string;
	currentKey: number;

  	constructor(
		@Inject('Evothings') private _evothings: Evothings,
  		private _ngZone: NgZone
  	) {
  		this.initialiseSensorTag();
  		this.title = "Sensor Tag fun";
  		this.status = "";
  	}

  	initialiseSensorTag()
    {
    	var self = this;

        // Create SensorTag CC2650 instance.
        this.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

	        
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
            		self.statusHandler(status);
            	});
            })
            .errorCallback(function(error) {
            	self._ngZone.run(function() {
            		self.errorHandler(error);
            	});
            })
            .keypressCallback(function(error) {
				self._ngZone.run(function() {
					self.keypressHandler(error);
				});
            })
			.temperatureCallback(function(data) {
				self._ngZone.run(function() {
					self.temperatureHandler(data);
				});
			}, 1000)
			.humidityCallback(function(data) {
				self._ngZone.run(function() {
					self.humidityHandler(data);
				});
			}, 1000)
            // .barometerCallback(barometerHandler, 1000)
            // .accelerometerCallback(accelerometerHandler, 1000)
            // .magnetometerCallback(magnetometerHandler, 1000)
            // .gyroscopeCallback(gyroscopeHandler, 1000)
            // .luxometerCallback(luxometerHandler, 1000)


    }

    connect() {
    	this.status = "connect";
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
            if ('CC2541' == this.sensortag.getDeviceModel() &&
                parseFloat(this.sensortag.getFirmwareString()) < 1.5)
            {
                this.needsUpgrade = true;
            }
            else
            {
                this.needsUpgrade = false;
            }

            // Show device model and firmware version.
            this.deviceModel = this.sensortag.getDeviceModel();
            this.firmwareData = this.sensortag.getFirmwareString();

            // Show which sensors are not supported by the connected SensorTag.
            if (!this.sensortag.isLuxometerAvailable())
            {
                document.getElementById('Luxometer').style.display = 'none'
            }
        }

        this.status = status;
    }

    errorHandler(error)
    {
        console.log('Error: ' + error)

        if (this._evothings.easyble.error.DISCONNECTED == error)
        {
            this.resetSensorDisplayValues()
        }
        else
        {
	        this.status = 'Error: ' + error;
        }
    }

    keypressHandler(data) {

		this.currentKey = data[0];

		this.keypressData = "raw: 0x" + this.bufferToHexStr(data, 0, 1)
    }

    resetSensorDisplayValues() {
        // Clear current values.
        var blank = '[Waiting for value]'
        this.status = 'Press Connect to find a SensorTag';
        this.deviceModel = '?';
        this.firmwareData = '?';
        // displayValue('KeypressData', blank)
        // displayValue('TemperatureData', blank)
        // displayValue('AccelerometerData', blank)
        // displayValue('HumidityData', blank)
        // displayValue('MagnetometerData', blank)
        // displayValue('BarometerData', blank)
        // displayValue('GyroscopeData', blank)
        // displayValue('LuxometerData', blank)

        // Reset screen color.
        // setBackgroundColor('white')
    }

    /**
     * Convert byte buffer to hex string.
     * @param buffer - an Uint8Array
     * @param offset - byte offset
     * @param numBytes - number of bytes to read
     * @return string with hex representation of bytes
     */
    bufferToHexStr(buffer, offset, numBytes) {
		var hex = ''
		for (var i = 0; i < numBytes; ++i) {
			hex += this.byteToHexStr(buffer[offset + i])
		}
		return hex
	}


	byteToHexStr(d) {
        if (d < 0) { d = 0xFF + d + 1 }
        var hex = Number(d).toString(16)
        var padding = 2
        while (hex.length < padding) {
            hex = '0' + hex
        }
        return hex
    }
}

