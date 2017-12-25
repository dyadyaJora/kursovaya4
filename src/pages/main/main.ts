import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { MyMapPage } from '../my-map/my-map';
import { ShowRoutePage } from  '../show-route/show-route';
import { OrderDataServiceProvider } from '../../providers/order-data-service/order-data-service';
import { CurrentUserServiceProvider } from '../../providers/current-user-service/current-user-service';
//import * as $ from 'jquery';
import moment from 'moment';

declare var ymaps: any;

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  pet: any;
  toLoc: any;
  orderData: any;
  years: string = '';
  price: string = '';
  distance: string = '';
  dopVisible: boolean = false;
  choosenMoneyType: String = "nal";
  zone: NgZone = new NgZone({enableLongStackTrace: false});
  tarifs: Array<any> = [
  	{
  		name: "Эконом",
  		type: "eko",
  		price: 17
  	},
  	{
  		name: "Комфорт",
  		type: "komf",
  		price: 19
  	},
  	{
  		name: "Бизнес",
  		type: "biz",
  		price: 25
  	},
  	{
  		name: "Минивен",
  		type: "mven",
  		price: 25
  	}
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private orderData1: OrderDataServiceProvider,
    public currUserData: CurrentUserServiceProvider,
    public events: Events,
    public toast: ToastController,
    public load: LoadingController,
    public alert: AlertController) {
 
    let _this = this;
  	this.pet = "datatime";
    this.orderData = this.orderData1;
    this.orderData.clearAll();
    this.orderData.dateTime= moment(new Date().toISOString()).locale('es').format();
  	this.orderData.choosenTarif = this.tarifs.indexOf(this.tarifs.find((item) => { 
  		return item.name == "Эконом"
  	}));

    let curYear = new Date().getFullYear(), arrYears: Array<string> = [];
    for (var i = curYear; i < curYear + 3; ++i) {
      arrYears.push(i + '');
    }
    this.years = arrYears.join(',');

    this.events.subscribe('route:change', () => {
      _this.orderData.distance = undefined;
      _this.orderData.yandexRoute = undefined;
      _this.orderData.price = 0;
      _this.calcRoute();
    });

    this.events.subscribe('route:loading', () => {
      // установить в интерфейсе режим загрузки во время расчета маршрута
    });

    this.events.subscribe('route:way', () => {
      //_this.price = _this.orderData.price;
      //_this.test();
    });

    this.events.subscribe('route:error', message => {
      let t = toast.create({
        message: message? 'Ошибка! ' + message : 'Ошибка при построении маршрута',
        duration: 3000,
        position: 'bottom'
      });

      t.present();
    });
  }

  destructor() {
    this.events.unsubscribe('route:change');
    this.events.unsubscribe('route:loading');
    this.events.unsubscribe('route:way');
    this.events.unsubscribe('route:error');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  addPoint() {
    this.orderData.roadAddresses.push({ addr: ""});
    this.events.publish('route:change');
  }

  deletePoint(index: any) {
  	if (this.orderData.roadAddresses.length > 1) {
  		this.orderData.roadAddresses.splice(index, 1);
      this.events.publish('route:change');
  	}
  }

  openFromMap(e: any) {
    if (e.currentTarget.className.indexOf('order-loc__actions-close') !== -1 || e.currentTarget.className.indexOf('order-loc__actions-clear') !== -1)
      return; 

    this.navCtrl.push(MyMapPage, {
      point: 0,
      lat: this.orderData.fromLoc.lat || 44.952093,
      lon: this.orderData.fromLoc.lon || 34.102473
    }); 
  }

  openToMap(e:any, ind: number) {
    if (e.currentTarget.className.indexOf('order-loc__actions-close') !== -1 || e.currentTarget.className.indexOf('order-loc__actions-clear') !== -1)
      return; 
    console.log(ind);
    this.navCtrl.push(MyMapPage, {
      point: ind+1,
      lat: this.orderData.roadAddresses[ind].lat || 44.961980,
      lon: this.orderData.roadAddresses[ind].lon || 34.082336
    }); 
  }

  test() {
    console.log('test'); 
  }

  calcRoute() {
    if (this.orderData.isFullRoute()) {
      let points : Array<any> = [],
        router;

      this.events.publish('route:loading');
      points.push([this.orderData.fromLoc.lat, this.orderData.fromLoc.lon]);
      this.orderData.roadAddresses.forEach( item => {
        points.push([item.lat, item.lon]);
      });

      router = new ymaps.route(points, {
        mapStateAutoApply: true,
        reverseGeocoding: true,
        routingMode: 'auto',
        multiRoute: true
      });

      router
        .then( route => {
        // Добавление маршрута на карту
        console.log(route, 'hfdhjh');
        //_this.myMap.geoObjects.add(route);
        this.orderData.distance = route.getActiveRoute().properties._data.distance.value;
        this.orderData.yandexRoute = route;
        this.orderData.price = this._calcPrice();
        this.events.publish('route:way', route);
        // (Complete) ANGULAR ISSUE: no binding in async 
        //$('.hide-help-button').click(); // == helpUpdateData()
        this.zone.run(() => {
          this.helpUpdateData();
        });
      })
      .catch( err => {
        console.log(err, 'error');
        this.events.publish('route:error', err.message);
        this.zone.run(() => {
          this.helpUpdateData();
        });
      });
    } else {
      this.helpUpdateData();
    }
  }

  showRoute() {
    this.navCtrl.push(ShowRoutePage);
  }

  clearAll() {
    this.orderData.clearAll();
    this.events.publish('route:change');
  }

  clearFrom() {
    this.orderData.fromAddress = '';
    this.orderData.fromLoc = {};
    this.events.publish('route:change');
  }

  clearTo(i: number) {
    this.orderData.roadAddresses[i] = { addr: '' };
    this.events.publish('route:change');
  }

  helpUpdateData() {
    this.price = this.orderData.price? this.orderData.price + ' р.' : '     ';
    this.distance = this.orderData.distance? (this.orderData.distance/1000).toFixed(2) + ' км' : '';
  }

  _calcPrice():number {
    return Math.round(this.orderData.distance/1000 * this.tarifs[this.orderData.choosenTarif].price);
  }

  recalcPrice(e: any) {
    this.orderData.price = this._calcPrice();
    this.helpUpdateData();
    console.log(e);
  }

  triggerDopParamsVisibility() {
    this.dopVisible = !this.dopVisible;
  }

  timeChange() {
    this.orderData.isTimeNow = false;
  }

  makeOrder() {
    this.currUserData.isLoggedIn().then(flag => {
      if(!flag) 
        return;

      let validateStr = this.orderData.checkData();

      if (validateStr) {
        let t = this.toast.create({
          message: 'Ошибка валидации! ' + validateStr,
          duration: 3000,
          position: 'bottom'
        });

        t.present();
        return;
      }

      let l = this.load.create({
        content: 'Идет отправка заказа...'
      });

      l.present();
      this.orderData.sendOrder(this.currUserData.token).subscribe(() => {
        this.clearAll();
        l.dismiss();

        let a = this.alert.create({
          title: 'Заказ успешно отправлен!',
          subTitle: 'Благодарим вас за использование наших авиалиний... ',
          buttons: ['OK']
        });
        a.present();
      }, err => {
        console.log(err, 'Все очень плохо');
      });
    });
  }
}