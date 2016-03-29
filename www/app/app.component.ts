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
    deviceAddress: string;
	firmwareData: string;
	deviceModel: string;

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

        // IoT Foundation object..
        this.objIOT = this._iotfoundationlib.createInstance();

        this.objIOT
            .onConnectSuccessCallback(() => {
                // alert("connect success")
            })
            .onConnectFailureCallback(() => {
                // alert("connect fail")
            })
            .connectToFoundationCloud() 
    }

    initSensorTag() {
        // Create SensorTag CC2650 instance.
        var sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)
        return sensortag;
    }

    connectToNearestDevice() {
        var self = this;
        var sensortag = this.initSensorTag();

        sensortag
            .statusCallback(function(status, data) {
                self._ngZone.run(function() {
                    if ('DEVICE_INFO_AVAILABLE' == status) {
                        self.deviceConnectedHandler(sensortag, self.connectedDevices.length);
                    }

                    self.status = status;
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        sensortag.connectToNearestDevice();
    }

    deviceConnectedHandler(sensortag, index) {
        var self = this;
        var deviceAddress = sensortag.getDeviceAddress();
        sensortag
            .humidityCallback(function(data) {
                self._ngZone.run(function() {
                    self.humidityHandler(index, data);
                });
            }, 1000)
        this.connectedDevices.push(sensortag);
    }

    resetDeviceLists() {
		this.knownDevices = [];
		this.connectedDeviceAddresses = [];
		this.connectedDevices = [];
		this.connectedSensorData = [];
    }


    disconnectFromDevice(device) {
        this.connectedDevices[device.address].disconnectDevice();
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

    humidityHandler(index, data) {
        var values = this.connectedDevices[index].getHumidityValues(data)
        
        // Calculate the humidity temperature (C and F).
        var tc = values.humidityTemperature
        var tf = this.connectedDevices[index].celsiusToFahrenheit(tc)

        // Calculate the relative humidity.
        var h = values.relativeHumidity

        var humidityData = {
            humidityTemperature: tc,
            humidityTemperatureFahrenheit: tf,
            relativeHumidity: h
        }


        this.connectedSensorData[index] = {
			humidityData: humidityData
        }

        // Publish event to the IoTF
        this.objIOT.publishToFoundationCloud({
            humidityData: humidityData
        });
    }



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

}

