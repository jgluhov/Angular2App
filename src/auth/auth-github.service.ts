import {Injectable} from '@angular/core';
import {sha256} from 'js-sha256';

@Injectable()
export class AuthGitHub {
    authorizeUrl: string = 'https://github.com/login/oauth/authorize';
    scope = 'user';

    id: string = 'c6af84231105fd56d3b1';
    secret: string = '75795fca8c222575140082360ddd02c4d007c51f';

    get state() {
        return sha256('GitHub Authentication' + new Date().valueOf())
    }
}