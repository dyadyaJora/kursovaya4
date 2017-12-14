import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { OrdersPage } from '../orders/orders';
import { MainPage } from '../main/main';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MainPage;
  tab2Root: any = OrdersPage;
  tab3Root: any = SettingsPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
