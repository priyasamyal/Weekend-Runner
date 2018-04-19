import {Component, OnInit} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  Platform,
  LoadingController
} from 'ionic-angular';
import {Crop} from '@ionic-native/crop'
import {AlertProvider} from '../../providers/alert/alert'
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';
import {GroupProvider} from '../../providers/group/group';
import * as moment from 'moment';
import {MapPage} from '../map/map';
import {ToastProvider} from '../../providers/toast/toast';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ApiProvider} from '../../providers/api/api';
import {concat} from 'rxjs/observable/concat';

declare var google : any;
declare var cordova : any;
/**
 * Generated class for the CreateEventsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-create-events', templateUrl: 'create-events.html'})
export class CreateEventsPage {

  groupData : any;
  set : boolean = false
  address : any = {
    location: '',
    title: '',
    date: new Date().toISOString(),
    time: '',
    code: '',
    description: ''
  };
  ImageSrc;
  ImageSrc1 = 'assets/img/add.png';
  imageSelected : boolean = false;
  place;
  placesService : any;
  map : any;
  markers = [];
  placedetails : any;
  actionSheet;

  event_data = [];
  title = "Create Event";

  constructor(public navCtrl : NavController, public navParams : NavParams, public modalCtrl : ModalController, public actionSheetCtrl : ActionSheetController, public camera : Camera, public platform : Platform, private file : File, private filePath : FilePath, public loadingCtrl : LoadingController, public groupService : GroupProvider, public alert : AlertProvider, private crop : Crop, public toast : ToastProvider, public api : ApiProvider,)
  {
    this.groupData = this
      .navParams
      .get('groupData');
    this.address.time = moment(new Date().toISOString())
      .locale('es')
      .format("HH:mm");
    console.log(this.address.time);
    console.log(this.address.date);
    console.log("call");
  }
  ionViewWillLeave() {
    console.log("leave", this.actionSheet);
    if (this.actionSheet) {
      this
        .actionSheet
        .dismiss();
    }
  }
  ionViewWillLoad() {
    this.ImageSrc1 = 'assets/img/add.png';
    this.imageSelected = false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventsPage');
    this.event_data = [];
    this.event_data = this
      .navParams
      .get('event_data');
    console.log(this.event_data, "data of event_data")
    if (this.event_data != undefined) {
      this.imageSelected = true;
      this.title = "Edit Event";
      this.ImageSrc = this.api.imageUrl + this
        .navParams
        .get('event_data')
        .photo;
      console.log(this.ImageSrc, "imgsrc new")
      this.address.title = this
        .navParams
        .get('event_data')
        .title;
      this.address.date = this
        .navParams
        .get('event_data')
        .date
      this.address.time = this
        .navParams
        .get('event_data')
        .time
      this.address.location = this
        .navParams
        .get('event_data')
        .location;
      this.address.code = this
        .navParams
        .get('event_data')
        .code;
      this.address.location = this
        .navParams
        .get('event_data')
        .location;
      this.address.description = this
        .navParams
        .get('event_data')
        .description
      console.log(this.event_data, "event data")
    }
  }

  showModal() {
    console.log("loc send", this.address.location)
    let modal = this
      .modalCtrl
      .create(MapPage, {location: this.place});
    modal.onDidDismiss(data => {
      console.log('page > modal dismissed > data > ', data);
      if (data) {
        if (data.description) {
          console.log(data, "daata")
          this.place = data;
          this.address.location = data.description;
          console.log(this.address.location)
        } else {
          this.address.location = data;
          this.place = data
          console.log(this.address.location, "else")
        }
      }
    })
    modal.present();
  }
  onImageChoose() {
    console.log('acton sheet method call');
    this.actionSheet = this
      .actionSheetCtrl
      .create({
        title: 'Choose Image From',
        buttons: [
          {
            text: 'Camera',
            icon: 'camera',
            handler: () => {
              console.log('Camera clicked');
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          }, {
            text: 'Open Gallery',
            role: 'cancel',
            icon: 'image',
            handler: () => {
              console.log('gallery clicked');
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          }
        ]
      });
    this
      .actionSheet
      .present();
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
      allowEdit: true
    };
    // Get the data of an image
    this
      .camera
      .getPicture(options)
      .then(imagePath => {
        console.log("imagepath", imagePath)
        // Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this
            .filePath
            .resolveNativePath(imagePath)
            .then(filePath => {
              console.log(imagePath);
              let options = {
                quality: 75,
                widthRatio: 2,
                heightRatio: 1,
                targetWidth: 900,
                targetHeight: 100
              };

              this
                .crop
                .crop(imagePath, options)
                .then(newImage => {
                  console.log(newImage, "newImagefilepaath1")
                  this
                    .filePath
                    .resolveNativePath(newImage)
                    .then(filePath1 => {
                      console.log(filePath1, "filepaath1")
                      let correctPath = filePath1.substr(0, filePath.lastIndexOf('/') + 1);
                      let currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
                      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
                });
            });
        } else {
          //  incase crop does not work
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          // this.crop.crop(imagePath, {quality: 75}) .then(   newImage =>{     var
          // currentName = newImage.substr(newImage.lastIndexOf('/') + 1);     var
          // correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
          // this.copyFileToLocalDir(       correctPath,       currentName,
          // this.createFileName()     );   });
        }
      }, err => {
        console.log('Error while selecting image');
      });
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    let loading = this
      .loadingCtrl
      .create({content: 'Please Wait...'}) // loader create
    loading.present(); // loading present
    console.log('copyFileToLocalDir');
    this
      .file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(success => {
        console.log(cordova.file.dataDirectory + newFileName, "name")
        this.ImageSrc = cordova.file.dataDirectory + newFileName
        this.imageSelected = true;
        console.log(this.address.photo);
        loading.dismiss(); // loading dismiss
        console.log(this.address)
      }, error => {
        loading.dismiss(); // loading dismiss
        console.log('Error while storing file');
      });
  }
  private reset() {
    //this.initPlacedetails();
    this.address.location = '';
    this.set = false;
  }

  cancelEvent() {
    this
      .navCtrl
      .pop();
  }
  createEvent() {

    if (!this.address.title) {
      this
        .alert
        .okAlertMsg("Enter event name")
    } else if (!this.address.location) {
      this
        .alert
        .okAlertMsg("Enter event location")
    } else if (!this.address.code) {
      this
        .alert
        .okAlertMsg("Enter event code")
    } else if (!this.address.description) {
      this
        .alert
        .okAlertMsg("Enter event description")
    } else {
      if (this.title == "Create Event") {
        let loading = this
          .loadingCtrl
          .create({content: 'Please Wait...'})
        loading.present(); // loading present

        console.log(this.address);
        console.log(this.groupData);
        this.address.group_id = this.groupData.group_id;

        console.log(this.address.time);
        console.log(this.address.time, "this.address.time")
        if (this.ImageSrc == undefined) {
          console.log("event without image")
          this
            .groupService
            .createEvent(this.address)
            .then(res => {
              if (res) {
                this
                  .navCtrl
                  .pop();
              }
              console.log(res, "res")
              loading.dismiss();
            })
            .catch(err => {
              console.log(err, "err")
              loading.dismiss();
            })
        } else {
          console.log("event with image")
          this
            .groupService
            .CreateEventWithPhoto(this.address, this.ImageSrc)
            .then(res => {
              console.log(res, "res")
              if (res) {
                this
                  .navCtrl
                  .pop();
                loading.dismiss();
              }
            })
            .catch(err => {
              console.log(err, "err")
              // this.toast.showToast(err.source);
              loading.dismiss();
            })
        }
      } else {
        console.log(this.address, this.ImageSrc)
        if (this.ImageSrc.indexOf("http") != 0) {
          this.address.event_id = this
            .navParams
            .get('event_data')
            .id;
          this.address.group_id = this
            .navParams
            .get('event_data')
            .group_id;
          console.log(this.address, "parawwm")
          let loading = this
            .loadingCtrl
            .create({content: 'Please Wait...'})
          loading.present();
          console.log("image chnage")
          this
            .groupService
            .updateEventWithPhoto(this.address, this.ImageSrc)
            .then(res => {
              console.log(res, "res")
              if (res) {
                this
                  .navCtrl
                  .pop();
                loading.dismiss();
              }
            })
            .catch(err => {
              console.log(err, "err") //
              this
                .toast
                .showToast(err.source);
              loading.dismiss();
            })
        } else {
          this.address.event_id = this
            .navParams
            .get('event_data')
            .id;
          this.address.group_id = this
            .navParams
            .get('event_data')
            .group_id;
          console.log(this.address, "param")
          let loading = this
            .loadingCtrl
            .create({content: 'Please Wait...'})
          loading.present(); // loading present
          console.log("same image")
          this
            .groupService
            .updateEvent(this.address, this.ImageSrc)
            .then(res => {
              if (res) {
                this
                  .navCtrl
                  .pop();
              }
              console.log(res, "res")
              loading.dismiss();
            })
            .catch(err => {
              console.log(err, "err")
              loading.dismiss();
            })
        }
      }

    }

  }

}
