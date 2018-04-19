import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Platform, App
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop'
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ApiProvider } from '../../providers/api/api';
import { ProfilePage } from '../profile/profile';
import { TabsPage } from '../tabs/tabs';
declare var cordova: any;
import { LoginPage } from '../login/login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { KeyboardEnterDirective } from '../../directives/keyboard-enter/keyboard-enter';
import { GoogleProvider } from '../../providers/google/google';
/**
 * Generated class for the EditProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',

})
export class EditProfilePage {
  value: any;

actionSheet;
    
  heightinFoot: any;
  heightinInch: any;
  token: any;
  userId: any;
  profiledata: any;
  profileinfo: any = {};
  profilePic: any = "assets/img/default.png";
  bgImage = "url(assets/img/back.png)"
  ImageSelected: boolean = false;
  profileForm: FormGroup;
  maxStart: any = new Date().toISOString();
  status: boolean = false;
  constructor(
    private fb: Facebook,
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public user: UserProvider,
    public toast: ToastProvider,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    private file: File,
    private filePath: FilePath,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private statusBar: StatusBar,
    public api: ApiProvider,
    public app: App,
    public googleProvider: GoogleProvider,
    private crop: Crop
  ) {
    this.heightinFoot = 5;
    this.heightinInch = 4;
    this.statusBar.backgroundColorByHexString('#f53d3d');
    this.profiledata = this.navParams.get('profile_data');

    console.log(this.profiledata, 'profdata');

if(this.profiledata.profile_image){
  console.log("has Image",this.profiledata.profile_image.indexOf("https"))
  if(this.profiledata.profile_image.indexOf("https") != 0){
    this.profilePic = this.api.imageUrl + this.profiledata.profile_image
  }
  else{
    this.profilePic=this.profiledata.profile_image
  }
}else{
  this.profilePic="assets/img/default.png"
}
     

    this.profileForm = new FormGroup({
      first_name: new FormControl(
        this.profiledata.first_name,
        Validators.compose([
          Validators.pattern('[a-zA-Z]*'),
          Validators.required,
        ])
      ),
      last_name: new FormControl(
        this.profiledata.last_name ? this.profiledata.last_name : '',
        Validators.compose([
          Validators.pattern('[a-zA-Z]*'),
          Validators.required,
        ])
      ),
      email_id: new FormControl(
        this.profiledata.email_id ? this.profiledata.email_id : '',
        Validators.required
      ),
      mobile_number: new FormControl(
        this.profiledata.mobile_number ? this.profiledata.mobile_number : '',
        Validators.required
      ),
      dob: new FormControl(
        this.profiledata.dob
          ? this.profiledata.dob
          : new Date(
            new Date().setFullYear(new Date().getFullYear() - 20)
          ).toISOString(),
        Validators.required
      ),
      gender: new FormControl(this.profiledata.gender, Validators.required),
      bio: new FormControl(
        this.profiledata.bio ? this.profiledata.bio : '',
        Validators.required
      ),
      height: new FormControl(this.profiledata.height ? this.profiledata.height : '', Validators.required),
      weight: new FormControl(this.profiledata.weight ? this.profiledata.weight : '', Validators.required),
      foot: new FormControl(this.profiledata.height ? this.profiledata.height.split(".")[0] : '', Validators.required),
      inch: new FormControl(this.profiledata.height ? this.profiledata.height.split(".")[1] : '', Validators.required),
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  ionViewWillLeave() {
    console.log("leave",this.actionSheet);
      if(this.actionSheet){
        this.actionSheet.dismiss() ;
      }
  } 
  editProfile() {
    var number_validation=/^[0-9]*$/
    this.profileForm.value.token = this.user.token;
    this.profileForm.value.id = this.user.user.id;
   
    if (this.profileForm.value.inch)
    this.profileForm.value.height = this.profileForm.value.foot + "." + this.profileForm.value.inch;
    else
    this.profileForm.value.height = this.profileForm.value.foot;
    this.profileinfo.bio = this.profileForm.value.bio;
    this.profileinfo.dob = this.profileForm.value.dob.split('T')[0];
    this.profileinfo.email_id = this.profileForm.value.email_id;
    this.profileinfo.first_name = this.profileForm.value.first_name;
    this.profileinfo.gender = this.profileForm.value.gender;
    this.profileinfo.height = this.profileForm.value.height;
    this.profileinfo.id = this.profileForm.value.id;
    this.profileinfo.last_name = this.profileForm.value.last_name;
    this.profileinfo.mobile_number = this.profileForm.value.mobile_number;
    this.profileinfo.token = this.profileForm.value.token;
    this.profileinfo.weight = this.profileForm.value.weight;
    console.log(this.profileinfo);
    console.log("this.profileinfo.weight")
    if(!this.profileinfo.mobile_number){
     this.toast.showToast("Please fill mobile number")
    }
    else if(this.profileinfo.mobile_number.length!=10)
    {
          this.toast.showToast("Mobile number should be of 10 digits")
          return false;
    }
    else if(this.profileinfo.weight.length>2){
     this.toast.showToast("Enter valid weight")
     }
   else  if(this.profileForm.value.foot.length>2){
      this.toast.showToast("Enter valid foot")
    }
    else if(this.profileForm.value.inch.length>2){
      this.toast.showToast("Enter valid inches")
    }
    else if(this.profileinfo.mobile_number.length!=10)
    {
           this.toast.showToast("Mobile number should be of 10 digits")
         
     }
    else if(!number_validation.test(this.profileinfo.mobile_number))
    {
        this.toast.showToast("Enter valid mobile number")
      
    }
    else if(!this.profileinfo.gender){
      this.toast.showToast("Please fill Gender")
      }
    else{
      let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
      loading.present();
      this.user.edit_user_profile(this.profileinfo).then(
        data => {
          loading.dismiss();
          this.user.setUser(data);
          console.log(data);
          this.app.getRootNav().setRoot(TabsPage);
        },
        err => {
          loading.dismiss();
          this.toast.showToast(err);
          console.log('data');
        }
      );
    }
   }
openActionSheet() {
    console.log('acton sheet method call');
    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Image From',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: 'Open Gallery',
          role: 'cancel',
          icon: 'image',
          handler: () => {
            console.log('gallery clicked');
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
      ],
    });

    this.actionSheet.present();
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  public takePicture(sourceType) {
    var options = {
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      allowEdit: true,
    };
    // Get the data of an image
    this.camera.getPicture(options).then(
      imagePath => {
        // Special handling for Android library
        if (
          this.platform.is('android') &&
          sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
        ) {
          this.filePath.resolveNativePath(imagePath).then(filePath => {
            console.log(imagePath);
            this.crop.crop(imagePath, {quality: 75})
            .then(
              newImage =>{
                console.log(newImage,"newImagefilepaath1")
                this.filePath.resolveNativePath(newImage).then(filePath1 => {
                  console.log(filePath1,"filepaath1")
  
            let correctPath = filePath1.substr(0, filePath.lastIndexOf('/') + 1);
             let currentName = newImage.substring(
               newImage.lastIndexOf('/') + 1,
               newImage.lastIndexOf('?')
            );
            this.copyFileToLocalDir(
              correctPath,
              currentName,
              this.createFileName()
            );
          });
              });
            // let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            // let currentName = imagePath.substring(
            //   imagePath.lastIndexOf('/') + 1,
            //   imagePath.lastIndexOf('?')
            // );
            // this.copyFileToLocalDir(
            //   correctPath,
            //   currentName,
            //   this.createFileName()
            // );
          });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        }
      },
      err => {
        console.log('Error while selecting image');
      }
    );
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }) // loader create
    loading.present(); // loading present
    console.log('copyFileToLocalDir');
    this.file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(
      success => {
        this.ImageSelected = true;
        this.profilePic = cordova.file.dataDirectory + newFileName;
        //this.bgImage= 'url(' +this.profilePic+ ')';
        console.log(this.profilePic);
       
        this.user.updateProfileImage(this.profilePic, this.user.token, this.user.user.id).then(data => {
         loading.dismiss(); // loading dismiss
         console.log("this.userProvider.updateProfileImage success");
        }, err => {
         loading.dismiss(); // loading dismiss
          console.log("updateProfileImage err")
          console.log(err)
        })
      },
      error => {
           loading.dismiss(); // loading dismiss
        console.log('Error while storing file');
      }
      );
  }
  getProfileImageStyle() {
    if (this.profiledata.profile_image) {
      if (this.profiledata.profile_image.indexOf("https") != 0) {
        console.log("old image", this.profilePic)
        return this.api.imageUrl + this.profiledata.profile_image;
        //  return 'url(' + this.api.imageUrl+this.profiledata.profile_image + ')';
      } else {
        return this.profiledata.profile_image;
        //  return 'url(' +this.profiledata.profile_image + ')';
      }
    }
    else {
      return "assets/img/default.png";
      // return 'url(' +"assets/img/groccery1.png"+ ')';
    }
  }

  logout() {
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
  }
}
