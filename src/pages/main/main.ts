import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  fromAddress: string = "";
  roadAddresses:  Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.roadAddresses.push("");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  addPoint() {
  	this.roadAddresses.push("");
  }

  deletePoint(index: any) {
  	if (this.roadAddresses.length > 1) {
  		this.roadAddresses.splice(index, 1);
  	}
  }

}
