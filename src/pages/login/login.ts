import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { AuthService } from 'ng2-ui-auth';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { UserOptions } from '../../interfaces/user-options';

import { CurrentUserServiceProvider } from '../../providers/current-user-service/current-user-service';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public toast: ToastController,
    public storage: Storage,
    public currUserData: CurrentUserServiceProvider
  ) { }

  /*onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.username);
      this.navCtrl.push(TabsPage);
    }
  }*/

  externalLogin(provider: string) {

    this.auth.authenticate(provider)
      .subscribe((user : any) => {
        this.currUserData.login(user);
        //this.storage.set('bearer_token', user.token); // ng2-ui-auth_token тоже есть
      },
      () =>  {
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
