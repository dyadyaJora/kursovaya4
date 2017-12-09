import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyMapPage } from '../my-map/my-map';
import { OrderDataServiceProvider } from '../../providers/order-data-service/order-data-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private orderData1: OrderDataServiceProvider) {
  	this.pet = "datatime";
    this.orderData = orderData1;
    this.orderData.fromLoc = {
      lat: 44.952093,
      lon: 34.102473
    }; 
    this.orderData.roadAddresses = [{ addr: ""}];
  	this.choosenTarif = this.tarifs.indexOf(this.tarifs.find((item) => { 
  		return item.name == "Эконом"
  	}));
    console.log(orderData1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  addPoint() {
    this.orderData.roadAddresses.push({ addr: ""});
  }

  deletePoint(index: any) {
  	if (this.orderData.roadAddresses.length > 1) {
  		this.orderData.roadAddresses.splice(index, 1);
  	}
  }

  openFromMap() {
    this.navCtrl.push(MyMapPage, {
      point: 0,
      lat: this.orderData.fromLoc.lat,
      lon: this.orderData.fromLoc.lon
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

}