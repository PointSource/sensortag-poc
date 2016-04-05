import {Injectable, EventEmitter} from 'angular2/core';

@Injectable()
export class NavService {
	public titleChanged$ = new EventEmitter();

	constructor(
	) { }

	public setTitle(title: string) {
		this.titleChanged$.emit(title);
	}

}