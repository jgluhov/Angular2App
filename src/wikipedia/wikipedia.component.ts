import {Component, OnInit, OnDestroy} from '@angular/core';
import {WikipediaSearchService} from "./wikipedia-search.service";
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './wikipedia.component.html'
})

export class WikipediaComponent implements OnInit, OnDestroy {
    items: Array<string>;
    term$ = new Subject<string>();
    searchSubscription: Subscription;

    constructor(private service: WikipediaSearchService) {};

    ngOnInit() {
        this.searchSubscription = this.service.search(this.term$)
            .subscribe(results => this.items = results);
    }

    ngOnDestroy() {
        this.searchSubscription.unsubscribe();
    }
}
