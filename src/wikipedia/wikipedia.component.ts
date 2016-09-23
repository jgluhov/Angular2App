import {Component, OnInit, OnDestroy} from '@angular/core';
import {WikipediaSearchService} from "./wikipedia-search.service";
import {Subject} from 'rxjs/Subject';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './wikipedia.component.html'
})

export class WikipediaComponent implements OnInit, OnDestroy {
    items: any;
    term$ = new Subject<string>();
    searchSubscription: Subscription;

    constructor(private service: WikipediaSearchService) {};

    ngOnInit() {
        this.searchSubscription = this.service.search(this.term$)
            .subscribe(data => this.items = data);
    }

    ngOnDestroy() {
        this.searchSubscription.unsubscribe();
    }
}
