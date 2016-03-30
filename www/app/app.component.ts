import {Component, OnInit, Inject, NgZone} from 'angular2/core';



@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})
export class AppComponent implements OnInit {
	public title: string = "SensorTag Demo";
    objIOT: any;
    chart: any;
  	status: string;
    statusPercentage: number;

	// List of devices
	connectedDevices;

  	constructor(
        @Inject('IoTFoundationLib') private _iotfoundationlib,
        @Inject('Evothings') private _evothings,
  		private _ngZone: NgZone
  	) { }

  	ngOnInit() {
		var self = this;

        this.statusPercentage = 0;

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


        var lineChartData = {
            labels: ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                // {
                //     label: "My Second dataset",
                //     fillColor: "rgba(151,187,205,0.2)",
                //     strokeColor: "rgba(151,187,205,1)",
                //     pointColor: "rgba(151,187,205,1)",
                //     pointStrokeColor: "#fff",
                //     pointHighlightFill: "#fff",
                //     pointHighlightStroke: "rgba(151,187,205,1)",
                //     data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                // }
            ]
        }

        var ctx = document.getElementById("canvas").getContext("2d");
        this.chart = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false
        });
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

    initialStatusHandler(sensortag, status) {;
        if ('SCANNING' == status) {
            this.statusPercentage = 20
        } else if ('SENSORTAG_FOUND' == status) {
            this.statusPercentage = 40
        } else if ('CONNECTING' == status) {
            this.statusPercentage = 60
        } else if ('READING_DEVICE_INFO' == status) {
            this.statusPercentage = 80
        } else if ('DEVICE_INFO_AVAILABLE' == status) {
            this.statusPercentage = 100;
            this.deviceConnectedHandler(sensortag, this.connectedDevices.length);
        } else if ('SENSORTAG_NOT_FOUND' == status) {
            this.statusPercentage = 0;
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
        var h = values.relativeHumidity;

        var humidityData = {
            humidityTemperature: tc.toFixed(1),
            relativeHumidity: h.toFixed(1)
        }

        this.chart.addData([h.toFixed(1)], "-");
        this.chart.removeData();

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
    }


    resetDeviceLists() {
        this.connectedDevices = [];
    }


}

