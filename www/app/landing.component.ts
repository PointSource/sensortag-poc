import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {NavService} from './nav.service';

@Component({
    templateUrl: 'app/landing.component.html',
    styleUrls: ['app/landing.component.css']
})
export class LandingComponent implements OnInit {

    constructor(
        private _router: Router,
        private _navService: NavService
    ) { }

    ngOnInit() {

        this._navService.setTitle("Sensor Demo");
    }

    goToTechnician() {
        this._router.navigate(['JobList', { }]);
    }

}