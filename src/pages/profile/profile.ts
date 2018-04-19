import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { LoginPage } from '../login/login';
import { DatePipe } from '@angular/common';
import { ApiProvider } from '../../providers/api/api';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleProvider } from '../../providers/google/google';
import * as moment from 'moment';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  redirect: boolean = false;
  bgImage = "url(assets/img/back.png)"
  profileInfo: any = {
    first_name: "",
    last_name:"",
    dob: "",
    bio: "",
    height: 0,
    weight: 0,
    email_id: "",
    gender: "",
    mobile_number: "",
    profilePic: "assets/img/default.png"
  };
  
  constructor(private fb: Facebook,
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private nativeStorage: NativeStorage,
    public user: UserProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastProvider,
    public app: App,
    private photoViewer: PhotoViewer,
    
    public googleProvider: GoogleProvider

  ) {

  }

  ionViewWillEnter() {
  //  this.fetchprofiledata();
  if(this.navParams.get('userId'))
    this.fetchprofiledata()
  else{
    this.redirect = true;
    this.prepareUserInfo(this.user.user);
  }
  }

  fetchprofiledata() {
    console.log("fetchprofiledata");
    this.redirect = false;

    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();

    this.user.view_user_profile({
      token: this.user.token,
      id: this.navParams.get('userId')
    }).then(data => {
      loading.dismiss();
      console.log(data);
      this.prepareUserInfo(data);
    }, err => {
      loading.dismiss();
      this.toast.showToast(err);
      console.log("data");
    })
  }

  prepareUserInfo(userInfo: any){
    console.log("prepareUserInfo");
    console.log(userInfo);
    this.profileInfo.first_name = userInfo.first_name;
    this.profileInfo.last_name = userInfo.last_name;

  // this.profileInfo.dob = moment(new Date(userInfo.dob).toISOString(), "DD/MM/YYYY");
    this.profileInfo.dob = userInfo.dob;

    this.profileInfo.bio = userInfo.bio;
    this.profileInfo.height = userInfo.height;
    this.profileInfo.weight = userInfo.weight;
    this.profileInfo.email_id = userInfo.email_id;
    this.profileInfo.mobile_number = userInfo.mobile_number;

    if (userInfo.gender==undefined){
      this.profileInfo.gender = "";
    }
     
    else{
      this.profileInfo.gender = userInfo.gender;
      if(this.profileInfo.gender==1){
        this.profileInfo.showGender = "Male";
      }else{
        this.profileInfo.showGender = "Female";
      }
      
    }
     
    if (userInfo.profile_image) {
      if (userInfo.profile_image.indexOf("http") != 0)
        this.profileInfo.profilePic = this.api.imageUrl + userInfo.profile_image;
      else
        this.profileInfo.profilePic = userInfo.profile_image;
    } else {
      this.profileInfo.profilePic = "assets/img/default.png";
    }
    console.log(this.profileInfo)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

  }

  goToProfileEditPage() {
    this.navCtrl.push(EditProfilePage, { 'profile_data': this.user.user });
  }

  logout() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    this.user.logout().then(data=>{
      console.log(data,"resolve");
      loading.dismiss();
      this.user.getLoginType().then(loginType => {
        switch (loginType) {
          case 2:
            this.fb.logout();
            break;
          case 3:
            this.googleProvider.doGoogleLogout();
            break;
        }
      }).then(data => {
        this.nativeStorage.clear();
        this.app.getRootNav().setRoot(LoginPage)
      })

    },err=>{
      loading.dismiss();
      console.log("err",err)
      this.toast.showToast(err)
    })


  }

  getProfileImageStyle() {
    if (this.profileInfo.profile_image) {
      if (this.profileInfo.profile_image.indexOf("http") != 0) {
        return 'url(' + this.api.imageUrl + this.profileInfo.profile_image + ')';
      } else {
        return 'url(' + this.profileInfo.profile_image + ')';
      }

    }
    else {
      return 'url(' + "assets/img/groccery1.png" + ')';
    }
  }

  zoom(image,name){
    if(image.indexOf("http")>=0 ){
   this.photoViewer.show(image,name, {share: false});
   }
}
}
