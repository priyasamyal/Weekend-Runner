import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ProfilePage } from '../profile/profile';
import { ToastProvider } from '../../providers/toast/toast';
import { TabsPage } from '../tabs/tabs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


import { GoogleProvider } from '../../providers/google/google';
import { AlertProvider } from '../../providers/alert/alert';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { NativeStorage } from '@ionic-native/native-storage';
import { ContactProvider } from '../../providers/contact/contact';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  tabBarElement: any;
  constructor(private fb: Facebook, public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public toast: ToastProvider,
    public loadingCtrl: LoadingController,
   
    public alert: AlertProvider,
    public googleProvider: GoogleProvider,
    private nativeStorage: NativeStorage,
    private contactProvider: ContactProvider
  ) {
    this.loginForm = new FormGroup({
      email_id: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  doLogin() {
     let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
     loading.present();
    this.user.login(this.loginForm.value).then(data => {
      console.log(data);
      this.user.setLoginType(1);
      this.toast.showToast("Login Successful");
      this.contactProvider.fetchContactsFromMobile();
      this.navCtrl.setRoot(TabsPage);
      loading.dismiss();
    }, err => {
      console.log(err);
      loading.dismiss();
      this.toast.showToast(err);
    })

  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }
  goTosignUp() {
    console.log("sign")
    this.navCtrl.push(SignupPage);
  }
  loginViaFacebook() {
    let userInfo = { auth_id: '', auth_type: '', first_name: '', last_name: '', email_id: '', profile_image: '' }
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        userInfo.auth_id = res.authResponse.userID;
        console.log('Logged into Facebook!', res)
        if (res.status == "connected") {
          this.fb.api('me?fields=id,name,birthday,gender,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
            console.log(profile);
            userInfo.auth_type = "2"
            userInfo.first_name = profile.first_name
            userInfo.last_name = profile.last_name
            userInfo.email_id = profile.email
            userInfo.profile_image = profile.picture_large.data.url
            console.log(userInfo, "result")
            this.user.socialSignIn(userInfo).then((res) => {
              console.log(res, "res");
              this.user.setLoginType(2);
              this.afterSocialLogin(JSON.parse(JSON.stringify(res)));
            })
              .catch(err => {
                console.log(err, "error")
                this.alert.okAlertTitleMsg("Error", err);
              })
          });
        }
      }).catch(e => console.log('Error logging into Facebook', e));
  }

  // Used for google login 
  doGoogleLogin() {
    console.log('doGoogleLogin')
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    let env = this;

    env.googleProvider.trySilentLogin()
      .then(data => {
        console.log('doGoogleLogin success')
        // user is previously logged with Google and we have his data we will let him access the app
        var resJson = JSON.parse(JSON.stringify(data));
        var socialInfo = {
          auth_id: resJson.userId,
          auth_type: 3,
          first_name: resJson.firstName,
          last_name: resJson.lastName,
          profile_image: resJson.image,
          email_id: resJson.email 
        };
        env.user.socialSignIn(socialInfo).then(data => {
          loading.dismiss(); //loading dismiss
          env.user.setLoginType(3);
          env.afterSocialLogin(JSON.parse(JSON.stringify(data)));
        }, err => {
          console.log("social login err")
          console.log(err)
          loading.dismiss(); //loading dismiss
          env.alert.okAlertTitleMsg("Error", err);
        });

      }, error => {
        console.log('doGoogleLogin error')
        //we don't have the user data so we will ask him to log in
        env.googleProvider.doGoogleLogin()
          .then(function (res) {
            var resJson = JSON.parse(JSON.stringify(res));
            var socialInfo = {
              auth_id: resJson.userId,
              auth_type: 3,
              first_name: resJson.firstName,
              last_name: resJson.lastName,
              profile_image: resJson.image,
              email_id: resJson.email
            };
            env.user.socialSignIn(socialInfo).then(data => {
              loading.dismiss(); //loading dismiss
              env.user.setLoginType(3);
              env.afterSocialLogin(JSON.parse(JSON.stringify(data)));
            }, err => {
              console.log("social login err")
              console.log(err)
              loading.dismiss(); //loading dismiss
              env.alert.okAlertTitleMsg("Error", err);
            });

          }, function (err) {
            console.log("Google Login error", err);
            loading.dismiss(); //loading dismiss
          });
      });
  }

    afterSocialLogin(resJson) {
    console.log("afterSocialLogin");
    console.log(resJson);
    this.contactProvider.fetchContactsFromMobile();
    if (!resJson.mobile_number || !resJson.gender) {
      console.log("Profile not filled")
      this.navCtrl.setRoot(EditProfilePage, { 'profile_data': resJson });
    } else {
      console.log("Profile already  filled")
      this.navCtrl.setRoot(TabsPage);
    }
  }
}
