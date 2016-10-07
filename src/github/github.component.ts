import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {GitHubService} from "./github.service";

import {Observable} from 'rxjs';

@Component({
    templateUrl: './github.component.html'
})

export class GitHubComponent implements OnInit{
    repos$: Observable<any[]>;

    constructor(private gitHubService: GitHubService) {
        this.repos$ = this.gitHubService.repos$;
    }

    ngOnInit() {
        this.gitHubService.loadRepos();
    }
}
