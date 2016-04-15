import {Injectable, Inject} from 'angular2/core';

@Injectable()
export class BLEService {
    private DEVICEINFO_SERVICE: string;
    private SYSTEM_ID: string;
    private sensortag: any;

	constructor(
        @Inject('Evothings') private _evothings
	) {
		this.DEVICEINFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
        this.SYSTEM_ID = '00002a23-0000-1000-8000-00805f9b34fb';
        
        // Create SensorTag CC2650 instance.
        this.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

	}

    disconnectAllDevices() {
        this._evothings.easyble.closeConnectedDevices();
    }

    deviceIsSensorTag(device) {
        return this.sensortag.deviceIsSensorTag(device)
    }

    getSystemIdFromDevice(device, success, fail) {
        if(this.sensortag.deviceIsSensorTag(device)) {
            device.connect(
                (device) => {
                    this.readSystemId(device, success, fail);
                }, fail);
        }
    }

    readSystemId(device, success, fail) {
        let self = this;
        console.log(device.address, 'connect success');
        device.readServices([this.DEVICEINFO_SERVICE],
            (device) => {
                console.log(device.address, 'read services success')
                device.readServiceCharacteristic(
                    this.DEVICEINFO_SERVICE,
                    this.SYSTEM_ID,
                    (data) => {
                        console.log(device.address, 'got system id')
                        var systemId = this._evothings.util.typedArrayToHexString(data);
                        success(systemId, device);
                    },
                    (error) => {
                        console.error(device.address, 'read characteristics FAIL')
                        console.error(error);
                    }
                );
            },
            (error) => {
                console.error(device.address, 'read services FAIL');
                fail(error);
            })
    }


}