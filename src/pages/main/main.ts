import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { MyMapPage } from '../my-map/my-map';
import { ShowRoutePage } from  '../show-route/show-route';
import { OrderDataServiceProvider } from '../../providers/order-data-service/order-data-service';

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
  orderDate: String = new Date().toISOString();
  choosenTarif: number;
  choosenMoneyType: String = "nal";
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
    public events: Events,
    public toast: ToastController) {

    let _this = this;
  	this.pet = "datatime";
    this.orderData = orderData1;
    this.orderData.fromLoc = {};
    this.orderData.roadAddresses = [{ addr: ""}];
  	this.choosenTarif = this.tarifs.indexOf(this.tarifs.find((item) => { 
  		return item.name == "Эконом"
  	}));

    this.events.subscribe('route:change', () => {
      _this.orderData.distance = undefined;
      _this.orderData.yandexRoute = undefined;
      _this.calcRoute();
    });

    this.events.subscribe('route:loading', () => {
      // установить в интерфейсе режим загрузки во время расчета маршрута
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

  openFromMap() {
    this.navCtrl.push(MyMapPage, {
      point: 0,
      lat: this.orderData.fromLoc.lat || 44.952093,
      lon: this.orderData.fromLoc.lon || 34.102473
    }); 
  }

  openToMap(e:any, ind: number) {
    if (e.toElement.className.indexOf('order-loc__actions-close') !== -1)
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
    let _this = this;

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
        _this.events.publish('route:way', route);
        _this.orderData.distance = route.getActiveRoute().properties._data.distance.value;
        _this.orderData.yandexRoute = route;

      })
      .catch( err => {
        console.log(err, 'error');
        _this.events.publish('route:error', err.message);
      });
    }
  }

  showRoute() {
    this.navCtrl.push(ShowRoutePage);
  }

}