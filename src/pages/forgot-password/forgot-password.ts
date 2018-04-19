import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ModalController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { LoginPage } from '../login/login';

import { ChangePasswordPage } from '../change-password/change-password';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,public user: UserProvider,
      public toast: ToastProvider,
      public modal: ModalController) {
      this.forgotPasswordForm = new FormGroup({
      email_id:new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  recoverPassword()
  {
     console.log("hi")
     let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
     loading.present();
     console.log(this.forgotPasswordForm.value);
     this.user.forgotPassword(this.forgotPasswordForm.value).then(data=>{
     console.log("data"+"skdfh");
     loading.dismiss();
     let modal = this.modal.create(ChangePasswordPage, { 'user_data': this.forgotPasswordForm.value.email_id });
     modal.present();
     modal.onDidDismiss(data => {
     if (data)
      {
        this.navCtrl.setRoot(LoginPage);
        console.log('Helo');
      }
     
     });
     }, err => {
    console.log(err);
    console.log('Helo1');
    loading.dismiss();
    this.toast.showToast(err);
})
  }

}
