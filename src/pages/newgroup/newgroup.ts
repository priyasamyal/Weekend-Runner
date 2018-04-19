import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ActionSheetController,
  Platform,App
} from 'ionic-angular';
import {GroupProvider} from '../../providers/group/group';
import {Crop} from '@ionic-native/crop'

declare var cordova : any;
import {ToastProvider} from '../../providers/toast/toast';
import {ApiProvider} from '../../providers/api/api';
import {ImagingProvider} from '../../providers/imaging/imaging';
import {TabsPage} from '../tabs/tabs';
//import Cropper from 'cropperjs';


/**
 * Generated class for the NewgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-newgroup', templateUrl: 'newgroup.html'})
export class NewgroupPage {
  imageSelected = 0;
  newgroup = {
    groupName: '',
    groupPic: 'assets/img/default.png'
  }
  actionSheet;
  loaded : boolean;
  group_data = [];
  title = "Add a New Group";
  btn_name = "CREATE";
  useCropperJS : boolean = true;

  width : number = 1024;
  height : number = 820;
  quality : number = 90;
  
  constructor(public groupservice : GroupProvider, public navCtrl : NavController, public navParams : NavParams, public alertCtrl : AlertController, public loadingCtrl : LoadingController, public actionSheetCtrl : ActionSheetController, public platform : Platform, public api : ApiProvider, public toast : ToastProvider, private crop : Crop, public imaging : ImagingProvider,  public app: App,) {}

  ionViewDidLoad() {
    this.group_data = [];
    this.group_data = this
      .navParams
      .get('group_detail');
    console.log(this.group_data, "data of group")
    if (this.group_data != undefined) {
      this.title = "Edit Group";
      this.btn_name = "Edit"
      this.newgroup.groupPic = this.api.imageUrl + this
        .navParams
        .get('group_detail')
        .group_image
      this.newgroup.groupName = this
        .navParams
        .get('group_detail')
        .group_name;
      console.log(this.newgroup);
    }
    console.log('ionViewDidLoad NewgroupPage', this.group_data);

  }
  ionViewWillLeave() {}
  editgroupname() {
    let alert = this
      .alertCtrl
      .create({
        title: 'Edit Group Name',
        inputs: [
          {
            name: 'groupname',
            placeholder: 'Give a new groupname'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {}
          }, {
            text: 'Set',
            handler: data => {
              if (data.groupname) {
                this.newgroup.groupName = data.groupname
              } else {
                this.newgroup.groupName = 'groupName';
              }
            }
          }
        ]
      });
    alert.present();
  }

  creategroup()
  {

    if (this.btn_name == "CREATE") {
      console.log(this.newgroup)
      if (this.newgroup.groupPic == "assets/img/default.png") {

        let loading = this
          .loadingCtrl
          .create({content: 'Please Wait...'})
        loading.present();
        this
          .groupservice
          .createGroupWithoutImage(this.newgroup)
          .then(res => {
            this
              .navCtrl
              .pop();
            loading.dismiss();
          })
          .catch(err => {
            this
              .toast
              .showToast(err);
            loading.dismiss();
          });
      } else {
        console.log("with Image")
        let loading = this
          .loadingCtrl
          .create({content: 'Please Wait...'})
        loading.present();
        this
          .groupservice
          .createGroupWithImage(this.newgroup)
          .then(res => {
            this
              .navCtrl
              .pop();
            loading.dismiss();
          })
          .catch(err => {
            this
              .toast
              .showToast(err);
            loading.dismiss();
          });
      }
    } else {
      let params = {
        group_name: this.newgroup.groupName,
        group_id: this
          .navParams
          .get('group_detail')
          .group_id
      }
      console.log(params, "params")
      if (this.newgroup.groupPic.indexOf("file") != 0) {
        console.log("image not changed")
        let loading = this
          .loadingCtrl
          .create({content: 'Please Wait...'})
        loading.present();
        this
          .groupservice
          .updateGroupWithoutImage(params)
          .then(res => {
            this.app.getRootNav().setRoot(TabsPage);
            // this
            //   .navCtrl
            //   .pop();
            //   this
            //   .navCtrl
            //   .pop();
            loading.dismiss();
          })
          .catch(err => {
            this
              .toast
              .showToast(err);
            loading.dismiss();
          });

      } else {
        let params1 = {
          group_name: this.newgroup.groupName,
          group_image: this.newgroup.groupPic,
          group_id: this
            .navParams
            .get('group_detail')
            .group_id
        }
        console.log("image changed")
        console.log("with Image")
        let loading = this
          .loadingCtrl
          .create({content: 'Please Wait...'})
        loading.present();
        this
          .groupservice
          .updateGroupWithImage(params1)
          .then(res => {
            this.app.getRootNav().setRoot(TabsPage);
            loading.dismiss();
          })
          .catch(err => {
            this
              .toast
              .showToast(err);
            loading.dismiss();
          });
      }

    }

  }

  chooseimage() {
    this
      .imaging
      .getImage(this.width, this.height, this.quality, this.useCropperJS)
      .subscribe(data => {
        console.log(data, "data")
        this.newgroup.groupPic = data;
      }, error => {});
  }

}
