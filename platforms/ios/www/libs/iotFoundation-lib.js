/**
 *  File: iotFoundation-lib.js
 *  Licensed Materials - Property of IBM
 *  (c) Copyright IBM Corporation. 
 *  All Rights Reserved. This program and the accompanying materials 
    are made available under the terms of the Apache v2 License.
 *
 *  Description: JavaScript library (class) to faciliate interacting with the IBM IoT Foundation over MQTT.
 *      Requires Paho MQTT JavaScript Lib (mqttws31.js)
 *
 *  Contributor: Mike Spisak
 * 
 */

var IoTFoundationLib = (function()
{
	var iotFoundation = {};
    /* PLACE THE CREDENTIAL INFORMATION FROM IOT FOUNDATION BELOW */
    // the format of the CLIENT_ID is d:<organization>:<device type>:<device ID>
    // these are examples below...
    // iotFoundation.CLIENT_ID = 'd:<ORG ID>:WICED-Sense:8675309'; // change this - the format is:  d:<organization>:<device type>:<device ID>
    // iotFoundation.ORG_ID = '<ORG ID>'; // change this to your organization ID
    // iotFoundation.IOT_URL = '<ORG ID>.messaging.internetofthings.ibmcloud.com';  // change the first part of this to match your organization ID
    // iotFoundation.IOT_PORT = 1883; // leave this
    // iotFoundation.IOT_USER = 'use-token-auth'; // leave this set
    // iotFoundation.IOT_PASS = '<PASSWORD>'; // put your provided password here
    // iotFoundation.IOT_TOPIC = 'iot-2/evt/iotsensor/fmt/json'; // leave this set

    config = {
        org: "wrr3st",
        deviceType: "TiCC2650STKSensorTag",
        deviceId: "b0b448d31202",
        authToken: "b4KBCvZ*ivr9cVhpPg"
    }

    iotFoundation.CLIENT_ID = 'd:'+config.org+':'+config.deviceType+':'+config.deviceId; // change this - the format is:  d:<organization>:<device type>:<device ID>
    iotFoundation.ORG_ID = config.org; // change this to your organization ID
    iotFoundation.IOT_URL = config.org+'.messaging.internetofthings.ibmcloud.com';  // change the first part of this to match your organization ID
    iotFoundation.IOT_PORT = 1883; // leave this
    iotFoundation.IOT_USER = 'use-token-auth'; // leave this set
    iotFoundation.IOT_PASS = config.authToken; // put your provided password here
    iotFoundation.IOT_TOPIC = 'iot-2/evt/iotsensor/fmt/json'; // leave this set


	/**
     * Public. Create tag instance.
     */
    iotFoundation.createInstance = function(configDeviceId, configDeviceToken)
    {

        if (configDeviceId !== undefined) {
            iotFoundation.CLIENT_ID = 'd:'+config.org+':'+config.deviceType+':'+configDeviceId;
        }
        if (configDeviceToken !== undefined) {
            iotFoundation.IOT_PASS = configDeviceToken;
        }

		/**
		* Variable holding the IOT foundation instance object.
		*/
		var instance = {};

		instance.client = null;

		/**
         * Set the IOT Foundation on connect notification callback.
         * @param fun - success callback called: fun()
         */
        instance.onConnectSuccessCallback = function(fun)
        {
            instance.connectionSuccessFun = fun;

            return instance;
        }
		/**
         * Set the IOT Foundation on connect failure notification callback.
         * @param fun - success callback called: fun(msg)
         */
        instance.onConnectFailureCallback = function(fun)
        {
            instance.connectionFailureFun = fun;

            return instance;
        }
		/**
         * Connect to the IoT Foundation Cloud.
         */
        instance.connectToFoundationCloud = function()
        {
            console.log("connectToFoundationCloud");
        	var options = {
				timeout: 30,
				userName: iotFoundation.IOT_USER,
				password: iotFoundation.IOT_PASS,
				//Gets Called if the connection has sucessfully been established
				onSuccess: instance.connectionSuccessFun,
				//Gets Called if the connection could not be established
				onFailure: instance.connectionFailureFun
			};
            
            // create a new Paho MQTT Client - pass in our URL, Port, and Client ID.
            instance.client = new Paho.MQTT.Client(iotFoundation.IOT_URL, iotFoundation.IOT_PORT, iotFoundation.CLIENT_ID);
        	// establish connection using our options (which includes user, pass and callbacks)..
        	instance.client.connect(options);
        }

        /**
         * Publish data to the channel..
         * @param payload - needs to be a JSON formatted string {d:{<name>:<val>,<name>:<val>}}
         */
        instance.publishToFoundationCloud = function(payload)
        {
            var message = new Paho.MQTT.Message(JSON.stringify(payload));
        	message.destinationName = iotFoundation.IOT_TOPIC;
            // debug...
    		console.log("publish | " + message.destinationName + " | " + message.payloadString);
    		instance.client.send(message);
        }

        return instance;
    }

 	// return the object.
    return iotFoundation;

})()