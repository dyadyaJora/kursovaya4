import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { MainPage } from '../pages/main/main';
import { ShowRoutePage } from '../pages/show-route/show-route';
import { OrdersPage } from '../pages/orders/orders';
import { SettingsPage } from '../pages/settings/settings';


import { MyMapPage } from '../pages/my-map/my-map';

import { UserData } from '../providers/user-data';
import { OrderDataServiceProvider } from '../providers/order-data-service/order-data-service';

import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { CurrentUserServiceProvider } from '../providers/current-user-service/current-user-service';
//import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
//const config: SocketIoConfig = { url: 'https://localhost', options: {} };
const FACEBOOK_CLIENT_ID = '133793767362782';

@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    MainPage,
    MyMapPage,
    ShowRoutePage,
    OrdersPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: MainPage, name: 'MainPage', segment: 'main' },
        //{ component: SpeakerDetailPage, name: 'SpeakerDetail', segment: 'speakerDetail/:speakerId' },
        { component: OrdersPage, name: 'Orders', segment: 'orders' },
        { component: SettingsPage, name: 'Settings', segment: 'settings' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot(),
    Ng2UiAuthModule.forRoot({providers: {
        facebook: {
            clientId: FACEBOOK_CLIENT_ID,
            url: '/api/auth/facebook',
            redirectUri: 'https://localhost/api/auth/facebook'
        }
    }}),
    //SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    PopoverPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    MainPage,
    MyMapPage,
    ShowRoutePage,
    OrdersPage,
    SettingsPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserData,
    InAppBrowser,
    SplashScreen,
    OrderDataServiceProvider,
    CurrentUserServiceProvider
  ]
})
export class AppModule { }
