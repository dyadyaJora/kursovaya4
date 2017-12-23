import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController } from 'ionic-angular';
import { AuthService } from 'ng2-ui-auth';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData, public auth: AuthService, public toast: ToastController) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.username);
      this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  externalLogin(provider: string) {

    this.auth.authenticate(provider)
      .map((resp: Response) => {
        return resp;//.json();
      })
      .subscribe(user => {
        console.log(user);
        //make login
      },
      err =>  {
        console.log('Sehr schlecht', err);
        let t = this.toast.create({
          message: 'Ошибка авторизации',
          duration: 3000,
          position: 'bottom'
        });

      t.present();
      }
      )
  }
}
