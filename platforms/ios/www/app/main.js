System.register(['angular2/core', 'angular2/platform/browser', 'angular2/router', 'angular2/http', './app.component', './sensor.service', './sensor.factory', './ble.service', './nav.service', './technician/job.service', './technician/reading.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, browser_1, router_1, http_1, app_component_1, sensor_service_1, sensor_factory_1, ble_service_1, nav_service_1, job_service_1, reading_service_1;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (sensor_factory_1_1) {
                sensor_factory_1 = sensor_factory_1_1;
            },
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                sensor_service_1.SensorService,
                sensor_factory_1.SensorFactory,
                nav_service_1.NavService,
                job_service_1.JobService,
                reading_service_1.ReadingService,
                ble_service_1.BLEService,
                core_1.provide('Evothings', { useValue: evothings }),
                core_1.provide('IoTFoundationLib', { useValue: IoTFoundationLib }),
                core_1.provide('ChartJS', { useValue: Chart }),
                core_1.provide('Foundation', { useValue: Foundation }),
                core_1.provide('jQuery', { useValue: jQuery }),
                core_1.provide('CordovaDevice', { useValue: device }),
                core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map