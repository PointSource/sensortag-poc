import {Component, OnInit, ElementRef} from 'angular2/core';
import {Job} from './job'
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/technician/job-list.component.html',
    // styleUrls: ['app/job-list.component.css']
})
export class JobListComponent implements OnInit {
	private jobList: Job[];
    private modalElement: any;

    constructor(
        private _router: Router,
        private myElement: ElementRef
    ) { }

    ngOnInit() {
		this.jobList = [{
			name: "Williams, Randy",
			policyNumber: "95916"
		}, {
    		name: "Gartland, JP",
			policyNumber: "00012"
		}, {
    		name: "Peterson, Jared",
    		policyNumber: "01929"
    	}]
        this.modalElement = $(this.myElement.nativeElement.children[0]);
        var elem = new Foundation.Reveal(this.modalElement);
    }

    addJob() {
        console.log('addJob');

        this.modalElement.foundation('open');
    }
}