import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrentUserServiceProvider {
    name: string = '';
    id: string = '';
    avatar: string = '';
    nickname: string = '';
    token: string = '';
    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
    BEARER_TOKEN = 'bearerToken';


    constructor(
        public http: HttpClient,
        public storage: Storage,
        public events: Events
    ) { };

    login(user: any) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set(this.BEARER_TOKEN, user.token);
        // TODO: make escape
        this.name = user.name;
        this.id = user.fbId || user.vkId; // || ...
        this.avatar = user.avatar;
        this.nickname = user.nickname;
        this.token = user.token;
        this.events.publish('user:login');
    };

    logout() {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove(this.BEARER_TOKEN);
        // TODO: make escape
        this.name = '';
        this.id = '';
        this.avatar = '';
        this.nickname = '';
        this.token = '';
        this.events.publish('user:logout');
    };

    isLoggedIn(): Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
    };

    checkHasSeenTutorial(): Promise<string> {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
            return value;
        });
    };

    getMe(token: string): any {
        let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('/me', { headers: headers }).subscribe(user => {
            if(user) 
                this.login(user);
            else 
                this.logout();
        }, err => {
            this.logout();
            console.log(err);
        });
    };

    getMyOrders(token: string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('/order/allmy', { headers: headers });
    };

}
