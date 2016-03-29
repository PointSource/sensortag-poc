import {Component, OnInit, Inject, NgZone} from 'angular2/core';



@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})
export class AppComponent implements OnInit {
	public title: string = "TI SensorTag CC2650";
    objIOT: any;
  	sensortag: any;
  	status: string;
	firmwareData: string;
	deviceModel: string;
	needsUpgrade: boolean;

	// List of devices
	knownDevices;
	connectedDeviceAddresses;
	connectedDevices;
	connectedSensorData;

	// sensor data
	keypressData: string;
	currentKey: number;
	temperatureData: string;

  	constructor(
        @Inject('IoTFoundationLib') private _iotfoundationlib,
        @Inject('Evothings') private _evothings,
  		private _ngZone: NgZone
  	) { }

  	ngOnInit() {
		var self = this;

		this.resetDeviceLists();

        // Create SensorTag CC2650 instance.
        this.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

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


        // IoT Foundation object..
        this.objIOT = this._iotfoundationlib.createInstance();

        this.objIOT
            .onConnectSuccessCallback(() => {
                alert("connect success")
            })
            .onConnectFailureCallback(() => {
                alert("connect fail")
            })
            .connectToFoundationCloud() 
    }

    createSensorTag(device) {
		var self = this;

        // Create SensorTag CC2650 instance.
        var sensortag = this._evothings.tisensortag.createInstance(
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
        sensortag
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
   //          .keypressCallback(function(error) {
			// 	self._ngZone.run(function() {
			// 		self.keypressHandler(error);
			// 	});
   //          })
			// .temperatureCallback(function(data) {
			// 	self._ngZone.run(function() {
			// 		self.temperatureHandler(data);
			// 	});
			// }, 1000)
			.humidityCallback(function(data) {
				self._ngZone.run(function() {
					self.humidityHandler(device, data);
				});
			}, 1000)

		return sensortag;
    }

    scan() {
		this.resetDeviceLists();
		this.sensortag.startScanningForDevices((foundDevice) => {
			this.onFoundDevice(foundDevice);
		});

		setTimeout(() => { this.stopScanning() }, 1000);
    }

    resetDeviceLists() {

		this.knownDevices = [];
		this.connectedDeviceAddresses = [];
		this.connectedDevices = [];
		this.connectedSensorData = [];
    }

    stopScanning() {
		this.sensortag.stopScanningForDevices((foundDevice) => {
			this.onFoundDevice(foundDevice);
		})
    }

    onFoundDevice(device) {
    	if (this.sensortag.deviceIsSensorTag(device)) {
			if (this.connectedDeviceAddresses.indexOf(device.address) === -1) {
				this.connectedDeviceAddresses.push(device.address);
				this.knownDevices.push(device);
    		}
    	}
    }

    connectToDevice(device) {
		var sensortag = this.createSensorTag(device);
		this.connectedDevices[device.address] = sensortag;
		this.connectedDevices[device.address].connectToDevice(device);
		this.connectedSensorData[device.address] = {
			humidityData: {}
        }
    }


    disconnect() {
		this.resetSensorDisplayValues();
		this.sensortag.disconnectDevice();
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
        if (this._evothings.easyble.error.DISCONNECTED == error)
        {
            this.resetSensorDisplayValues()
        }
        else
        {
	        this.status = 'Error: ' + error;
        }
    }

    humidityHandler(device, data) {
        var values = this.connectedDevices[device.address].getHumidityValues(data)
        
        // Calculate the humidity temperature (C and F).
        var tc = values.humidityTemperature
        var tf = this.connectedDevices[device.address].celsiusToFahrenheit(tc)

        // Calculate the relative humidity.
        var h = values.relativeHumidity

        var humidityData = {
            humidityTemperature: tc,
            humidityTemperatureFahrenheit: tf,
            relativeHumidity: h
        }


        this.connectedSensorData[device.address] = {
			humidityData: humidityData
        }

        // here we publish event to the IoTF
        this.objIOT.publishToFoundationCloud({
            humidityData: humidityData
        });
    }


  //   keypressHandler(data) {

		// this.currentKey = data[0];

		// this.keypressData = "raw: 0x" + this.bufferToHexStr(data, 0, 1)
  //   }

  //   temperatureHandler(data) {
  //       var values = this.sensortag.getTemperatureValues(data)
  //       var ac = values.ambientTemperature
  //       var af = this.sensortag.celsiusToFahrenheit(ac)
  //       var tc = values.targetTemperature
  //       var tf = this.sensortag.celsiusToFahrenheit(tc)

  //       var temperatureString =
  //           (tc >= 0 ? '+' : '') + tc.toFixed(2) + ' C ' +
  //           '(' + (tf >= 0 ? '+' : '') + tf.toFixed(2) + ' F) ' +
  //           (ac >= 0 ? '+' : '') + ac.toFixed(2) + ' C ' +
  //           '(' + (af >= 0 ? '+' : '') + af.toFixed(2) + ' F) [amb]'


		// this.temperatureData = temperatureString;
  //   }

    resetSensorDisplayValues() {
        // Clear current values.
        var blank = '[Waiting for value]'
        this.status = 'Press Connect to find a SensorTag';
        this.deviceModel = '?';
        this.firmwareData = '?';
        this.keypressData = blank;
        this.temperatureData = blank;
        this.currentKey = 0;
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

