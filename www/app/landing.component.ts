import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/landing.component.html',
    styleUrls: ['app/landing.component.css']
})
export class LandingComponent {

    constructor(
        private _router: Router
    ) { }

    goToTechnician() {
        this._router.navigate(['JobList', { }]);
    }

}