cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-ble/ble.js",
        "id": "cordova-plugin-ble.BLE",
        "pluginId": "cordova-plugin-ble",
        "clobbers": [
            "evothings.ble"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-ble": "1.1.2",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-console": "1.0.4-dev",
    "cordova-plugin-device": "1.1.1"
}
// BOTTOM OF METADATA
});