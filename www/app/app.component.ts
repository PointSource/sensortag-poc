import {Component, OnInit, Inject, NgZone} from 'angular2/core';



@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})
export class AppComponent implements OnInit {
	public title: string = "SensorTag Demo";
    objIOT: any;
  	status: string;

	// List of devices
	connectedDevices;

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
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.initialStatusHandler(sensortag, status)
                });
            })
            .errorCallback(function(error) {
                self._ngZone.run(function() {
                    self.errorHandler(error);
                });
            })

        sensortag.connectToNearestDevice();
    }

    initialStatusHandler(sensortag, status) {
        if ('DEVICE_INFO_AVAILABLE' == status) {
            this.deviceConnectedHandler(sensortag, this.connectedDevices.length);
        }

        this.status = status;
    }

    deviceConnectedHandler(sensortag, index) {
        var self = this;
        sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.statusHandler(index, status)
                });
            })
            .humidityCallback(function(data) {
                self._ngZone.run(function() {
                    self.humidityHandler(index, data);
                });
            }, 1000)
        this.connectedDevices.push({
            status: "initializing",
            sensortag: sensortag,
            data: {},
            address: sensortag.getDeviceAddress(),
            name: "",
            isNamed: false
        });
    }

    nameDevice(connectedDevice, name) {
        connectedDevice.isNamed = true;
        connectedDevice.name = name;
        this.status = "";
    }

    disconnectFromDevice(index) {
        this.connectedDevices[index].sensortag.disconnectDevice();
        this.connectedDevices[index].status = "DISCONNECTED";
    }

    statusHandler(index, status) {
        this.connectedDevices[index].status = status;
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
        var values = this.connectedDevices[index].sensortag.getHumidityValues(data)
        
        // Calculate the humidity temperature (C and F).
        var tc = values.humidityTemperature
        var tf = this.connectedDevices[index].sensortag.celsiusToFahrenheit(tc)

        // Calculate the relative humidity.
        var h = values.relativeHumidity

        var humidityData = {
            humidityTemperature: tc,
            humidityTemperatureFahrenheit: tf,
            relativeHumidity: h
        }


        this.connectedDevices[index].data.humidityData = humidityData;

        // Publish event to the IoTF
        this.objIOT.publishToFoundationCloud({
            humidityData: humidityData
        });
    }

    resetSensorDisplayValues() {
        // Clear current values.
        var blank = '[Waiting for value]'
        this.status = 'Press Connect to find a SensorTag';
        this.currentKey = 0;
    }


    resetDeviceLists() {
        this.connectedDevices = [];
    }


}

