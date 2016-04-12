import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Router, RouterOutlet, RouterLink, RouteParams, RouteData, Location, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {RouteRegistry} from 'angular2/src/router/route_registry';
import {DirectiveResolver} from 'angular2/src/core/linker/directive_resolver';

import {provide} from "angular2/core"
import {BLEService} from "./ble.service"
import {NavService} from "./nav.service"
import {LandingComponent} from "./landing.component"

beforeEachProviders(() => {
	return [
		RouteRegistry,
		provide(Location, { useClass: SpyLocation }),
		provide(ROUTER_PRIMARY_COMPONENT, { useValue: LandingComponent }),
		provide(Router, { useClass: RootRouter }),
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
		spyOn(_bleService, "disconnect");
		landingComponent.disconnect();
		expect(_bleService.disconnect).toHaveBeenCalled();
	})
	);

});
