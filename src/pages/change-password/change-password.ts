import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;
  email_id:String;
  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public loadingCtrl: LoadingController,
     public view: ViewController,
     public userProvider: UserProvider,
     public toast: ToastProvider
    ) 
    {
      this.changePasswordForm = new FormGroup({
        verification_code:new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
       });
       this.email_id = this.navParams.get('user_data');
       console.log("the value is "+this.email_id);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
 
  doChangePassword()
  {
    console.log(this.changePasswordForm.value);
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present();
    this.changePasswordForm.value.email_id =this.email_id;
    this.userProvider.changePassword(this.changePasswordForm.value).then( data => {
      console.log("this.userProvider.emailVerification success");
      loading.dismiss(); //loading dismiss
      console.log(data);
      this.closeModal();
    }, err => {
      console.log("resetPassword err")
      loading.dismiss(); //loading dismiss
      console.log(err)
      // this.alert.okAlertTitleMsg("Error",err);
    })
  }

  resendEmail()
  {
    let resendEmail={
      email_id: this.email_id
    }
    console.log("resend")
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present();
    this.userProvider.forgotPassword(resendEmail).then(data=>{
     console.log("data"+"skdfh");
      loading.dismiss();
      }, err => {
     console.log(err);
     loading.dismiss();
     this.toast.showToast(err);
 })
  }

  closeModal()
  {
    console.log("call close");
    this.view.dismiss(true);
  }

}
