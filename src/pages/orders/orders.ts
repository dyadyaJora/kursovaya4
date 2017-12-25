import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { CurrentUserServiceProvider } from '../../providers/current-user-service/current-user-service';


@IonicPage()
@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    isLogin: boolean = false;
    orders: Array<any> = [];
    zone: NgZone = new NgZone({enableLongStackTrace: false});

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public currUser: CurrentUserServiceProvider,
        public events: Events
        ) {
        this.currUser.isLoggedIn().then(flag => {
            if (flag) this.onLogin();
        });

        this.events.subscribe('user:login', () => {
            console.log('aaaa login');
            this.onLogin();
        });
        this.events.subscribe('user:logout', () => {
            console.log('aaaa logout');
            this.onLogout();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OrdersPage');
    }

    onLogin() {
        this.zone.run(() => {
            this.isLogin = true;
        });
        this.currUser.getMyOrders(this.currUser.token)
            .subscribe(ordrs => {
                this.zone.run(() => {
                    this.orders = ordrs;
                });
            }, err => {
                console.log(err, 'error getting my orders')
            });
    }

    onLogout() {
        this.zone.run(() => {
            this.isLogin = false;
            this.orders = [];
        });
    }

    printRoadAddresses(arr: Array<any>): string {
        let str = '';
        arr.forEach(item => {
            str += '==> ' + item.addr;
        })
        return str;
    }
}
