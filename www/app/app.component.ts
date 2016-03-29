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

    initSensorTag() {
        // Create SensorTag CC2650 instance.
        var sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)
        return sensortag;
    }

    createSensorTag(device) {
		var self = this;

        var sensortag = this.initSensorTag();

        // Set up sensors
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
			.humidityCallback(function(data) {
				self._ngZone.run(function() {
					self.humidityHandler(device, data);
				});
			}, 1000)

		return sensortag;
    }

    connectToNearestDevice() {
        var sensorTag = this.initSensorTag();

        sensorTag.connectToNearestDevice();
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


    disconnectFromDevice(device) {
        this.connectedDevices[device.address].disconnectDevice();
    }


    statusHandler(status)
    {
        if ('DEVICE_INFO_AVAILABLE' == status)
        {
            // Show device model and firmware version.
            this.deviceModel = this.sensortag.getDeviceModel();
            this.firmwareData = this.sensortag.getFirmwareString();
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

