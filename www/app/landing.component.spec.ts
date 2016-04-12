// Have to do this in order to mock Router
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Router, RouterOutlet, RouterLink, RouteParams, RouteData, Location, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {RouteRegistry} from 'angular2/src/router/route_registry';
import {DirectiveResolver} from 'angular2/src/core/linker/directive_resolver';
// End of Router imports

import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"
import {BLEService} from "./ble.service"
import {NavService} from "./nav.service"
import {LandingComponent} from "./landing.component"

beforeEachProviders(() => {
	return [
	// Have to do this in order to mock Router
		RouteRegistry,
		provide(Location, { useClass: SpyLocation }),
		provide(ROUTER_PRIMARY_COMPONENT, { useValue: LandingComponent }),
		provide(Router, { useClass: RootRouter }),
	// End of Router config

		BLEService,
		NavService,
		LandingComponent,
		provide('Evothings', {
			useValue: {
				tisensortag: {
					createInstance: function() {
						return {}
					}
				}
			}
		}),
	];
});


describe('on disconnect', () => {

	it('calls BLE Service.disconnect', inject(
		[BLEService, LandingComponent], 
		(_bleService: BLEService, landingComponent: LandingComponent) => 
	{
		spyOn(_bleService, "disconnectAllDevices");
		landingComponent.disconnect();
		expect(_bleService.disconnectAllDevices).toHaveBeenCalled();
	})
	);

});
