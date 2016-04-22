# sensortag-poc
App demonstrating connection to IoT sensors via Bluetooth.

This app has a Technician mode and a Client mode:
* The Technician can manage a list of jobs (each job is identified by a policy number) and add sensors to each job. The list of sensors is stored for the client to be able to retrieve. The tech can also take readings from their sensors while they are linked to their sensors. The readings are displayed on a graph according to the type of measurement (humidity, temperature, etc)
* The Client can look up their account using their policy number, and link to all the sensors on that account. Once all the sensors are linked, the client can then also take readings. The readings the client takes will also be visible to the technician when they sign in.

## Initializing the app

* `npm install`

## Running the app

In your browser:
* `npm start`
  * This will compile the TypeScript files to Javascript, then launch your browser using the dev-index.html file. dev-index.html has been configured to simulate the sensors so you can test the app behavior.
 
On your phone:
* `cordova run android` or `cordova build ios`
  * This will let you build and run the app for your phone. You still need to run npm start at least once before deploying it to your phone though. In the case of ios you'll need to go into platforms/ and open the xcode project in order to deploy on your phone.
