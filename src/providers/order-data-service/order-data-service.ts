import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderDataServiceProvider {
  fromLoc: any;
  fromAddress: string = '';
  roadAddresses:  Array<any> = [];
  yandexRoute: any;
  distance: number;
  price: number;
  isChildren: boolean;
  inBaggaje: boolean;
  isAnimal: boolean;
  isGory: boolean;
  message: string = '';
  choosenMoneyType: string = 'nal';
  choosenTarif: number;
  isTimeNow: boolean = true;
  dateTime: string;

  readonly crimeaNord = 46.240364;
  readonly crimeaSouth = 44.377650;
  readonly crimeaWest = 32.479499;
  readonly crimeaEast = 36.651591;


  constructor(
    public http: HttpClient
  ) {
    console.log('Hello OrderDataServiceProvider Provider');
  }

  setFrom(loc, addr) {
  	this.fromLoc = loc;
  	this.fromAddress = addr;
  }

  setTo(loc, addr, ind) {
  	this.roadAddresses[ind-1].lat = loc.lat;
  	this.roadAddresses[ind-1].lon = loc.lon;
  	this.roadAddresses[ind-1].addr = addr;
  }

  isFullRoute() : boolean {
  	return !!this.fromAddress && this.roadAddresses.every( item => {
  		return !!item.addr;
  	});
  }

  isCrimea(lat, lon, addr) : boolean {
  	return (addr.indexOf('Севастополь') !== -1 || addr.indexOf('Республика Крым') !== -1) 
  		&& lat > this.crimeaSouth && lat < this.crimeaNord && lon > this.crimeaWest && lon < this.crimeaEast;
  }

  isAllCrimea() : boolean {
  	let _this = this;
  	return this.isCrimea(this.fromLoc.lat, this.fromLoc.lon, this.fromAddress) && this.roadAddresses.every(item => {
  		return _this.isCrimea(item.lat, item.lon, item.addr);
  	});
  }

  clearAll() {
  	this.fromLoc = {};
  	this.fromAddress = '';
  	this.roadAddresses = [{addr: ''}];
  	this.yandexRoute = undefined;
  	this.distance = undefined;
  	this.price = undefined;
  	this.isChildren = false;
  	this.inBaggaje = false;
  	this.isAnimal = false;
  	this.isGory = false;
  	this.message = '';
  	this.choosenMoneyType = 'nal';
  	this.choosenTarif = 0;
  	this.isTimeNow = true;
  }

  checkData(): string {
    let res = '';

    if (!this.fromAddress) {
      res += 'Отсутствует адресс отправления\n';
    }

    let toLocs = this.roadAddresses.every(val => {
      return !!val.addr;
    });

    if (!toLocs) {
      res += 'Отсутствует адресс(а) путевых точек\n';
    }

    if (!this.distance || !this.price) {
      res += 'Невозможно выполнить рассчет(нет данных о маршруте)\n';
    }

    return res;
  }

  sendOrder(token): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    let data:any = {};

    data.fromLoc = this.fromLoc;
    data.fromAddress = this.fromAddress;
    data.roadAddresses = this.roadAddresses;
    data.distance = this.distance;
    data.price = this.price;
    data.isChildren = this.isChildren;
    data.inBaggaje = this.inBaggaje;
    data.isAnimal = this.isAnimal;
    data.isGory = this.isGory;
    data.message = this.message;
    data.choosenMoneyType = this.choosenMoneyType;
    data.choosenTarif = this.choosenTarif;
    data.isTimeNow = this.isTimeNow;
    data.dateTime = this.dateTime;

    return this.http.post('/order', data, { headers: headers });
  }
}
