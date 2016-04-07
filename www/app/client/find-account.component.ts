import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {JobService} from '../technician/job.service';
import {NavService} from '../nav.service';
import {SensorComponent} from '../sensor.component';

@Component({
    templateUrl: 'app/client/find-account.component.html',
    directives: [SensorComponent]
})
export class FindAccountComponent implements OnInit {
    status: string;

    constructor(
        private _jobService: JobService,
        private _navService: NavService,
        private _router: Router
    ) { }

    ngOnInit() {
        this._navService.setTitle("Get Account");
    }

    findAccount(policyNumber: string) {
        var job = this._jobService.getJob(policyNumber);
        if (job === undefined) {
            this.status = "ERROR";
        } else {
            this._router.navigate(['AccountDetails', {policyNumber: policyNumber}]);
        }
    }


}