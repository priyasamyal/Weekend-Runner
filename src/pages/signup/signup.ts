import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { LoginPage } from '../login/login';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TabsPage } from '../tabs/tabs';

import { GoogleProvider } from '../../providers/google/google';
import { AlertProvider } from '../../providers/alert/alert';
import { ContactProvider } from '../../providers/contact/contact';


import { KeyboardEnterDirective } from '../../directives/keyboard-enter/keyboard-enter';
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;
  userinfo:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider, 
    public toast: ToastProvider,
    public loadingCtrl: LoadingController,
    private fb: Facebook,
    public googleProvider: GoogleProvider,
    public alert: AlertProvider,
    private nativeStorage: NativeStorage,
    private contactProvider: ContactProvider
  ) {
    this.signupForm = new FormGroup({
      first_name: new FormControl('',Validators.required),
      last_name: new FormControl('', Validators.required),
      email_id: new FormControl('', Validators.required),
      dob: new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(), Validators.required),
      gender: new FormControl('', Validators.required),
      mobile_no: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  doSignup() {
   
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    var number_validation=/^[0-9]*$/
    var password_REGXP = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{5,}$/;
 // this.signupForm.value.dob = this.signupForm.value.dob.split('T')[0];
    console.log(this.signupForm);  
   
    if(!this.signupForm.value.first_name)
      {
         this.toast.showToast("Please enter first name")
         return false;
       }
    if(!this.signupForm.value.last_name)
       {
        this.toast.showToast("Please enter last name")
        return false;
       }
      if(!this.signupForm.value.email_id)
        {
          this.toast.showToast("Please enter email Id")
          return false;
        }
     if(!EMAIL_REGEXP.test(this.signupForm.value.email_id))
        {
            this.toast.showToast("Please enter valid Email address")
            return false;
        }
        if(!number_validation.test(this.signupForm.value.mobile_no))
        {
            this.toast.showToast("Enter valid mobile number")
            return false;
        }
    if(!this.signupForm.value.mobile_no)
        {
              this.toast.showToast("Please enter Mobile Number")
              return false;
        }
        if(!number_validation.test(this.signupForm.value.mobile_no))
        {
            this.toast.showToast("Enter valid mobile number")
            return false;
        }
    if(this.signupForm.value.mobile_no.length!=10)
       {
              this.toast.showToast("Mobile number should be of 10 digits")
             return false;
       }
    if(!this.signupForm.value.gender)
      {
             this.toast.showToast("Please select gender")
             return false;
      }
     
    if(!this.signupForm.value.password)
      {
            this.toast.showToast("Please enter Password")
            return false;
      }
     if(!password_REGXP.test(this.signupForm.value.password))
        {
           this.toast.showToast("Password must contains atleast 5 characters ,1 digit,1 lowercase letter, 1 uppercase letter 1 special character")
           return false;
        }
     if(this.signupForm.value.confirm_password != this.signupForm.value.password)
        {
              this.toast.showToast("Password and confirm password does not match")
              return false;
         }
         else{
          this.userinfo={
             "type":0,
             "first_name":this.signupForm.value.first_name,
             "last_name":this.signupForm.value.last_name,
             "email_id":this.signupForm.value.email_id,
             "mobile_number":this.signupForm.value.mobile_no,
             "gender":this.signupForm.value.gender,
             "dob":this.signupForm.value.dob.split('T')[0],
             "password":this.signupForm.value.password,
             "bio":""
            }
             this.signup(this.userinfo);
         }
     }
  signup(userinfo)
  {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    this.user.signUp(this.userinfo).then(data=>{
    loading.dismiss();
    console.log(data);
    let response = JSON.stringify(data);
    let res = JSON.parse(response);
   if(res.status==0){
    this.toast.showToast(res.msg);
    }
    else{
      this.toast.showToast(res.msg);
      this.navCtrl.setRoot(LoginPage);
    }
    
  }).catch(err=>{
    loading.dismiss();
    console.log("error")
  })
   }

  dofacebookSignup(){

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
              })
          });
        }
      }).catch(e => console.log('Error logging into Facebook', e));
    // let userInfo={auth_id:'',auth_type:'',first_name:'',last_name:'',email_id:'',profile_image:''}
    // this.fb.login(['public_profile', 'user_friends', 'email','user_birthday'])
    // .then((res: FacebookLoginResponse) => {
    //   userInfo.auth_id=res.authResponse.userID;
    //   console.log('Logged into Facebook!', res)
    //   if(res.status == "connected")
    //     {
    //       this.fb.api('me?fields=id,name,birthday,gender,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
    //       console.log(profile);

    //       userInfo.auth_type="2"
    //       userInfo.first_name=profile.first_name
    //       userInfo.last_name=profile.last_name
    //       userInfo.email_id=profile.email
    //       userInfo.profile_image=profile.picture_large.data.url
    //       console.log(userInfo,"result")
    //       this.user.socialSignIn(userInfo).then((res)=>{
    //         console.log(res)  }).catch(err=>{
    //         console.log(err,"error") 
    //         })
          // this.signupForm.controls['first_name'].setValue(profile.first_name);
          // this.signupForm.controls['last_name'].setValue(profile.last_name);
          // this.signupForm.controls['email_id'].setValue(profile.email);
          // if(profile.gender=="female"){
          //   this.signupForm.controls['gender'].setValue(2);
          // } else{
          //   this.signupForm.controls['gender'].setValue(1);
          // }
          // console.log(this.signupForm,"oo");
    //         });
    //     }
    //   })
    // .catch(e => console.log('Error logging into Facebook', e));
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
          this.user.setLoginType(3);
          this.afterSocialLogin(JSON.parse(JSON.stringify(data)));
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
              this.user.setLoginType(3);
              this.afterSocialLogin(JSON.parse(JSON.stringify(data)));
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
