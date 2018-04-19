import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ViewController,
} from 'ionic-angular';

import {UserProvider} from '../../providers/user/user';
import {ApiProvider} from '../../providers/api/api';
/**
 * Generated class for the BuddiesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  userDetails: any;
  url;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public user: UserProvider,
    public api: ApiProvider,
    public viewCtrl: ViewController
  ) {
    this.url = this.api.imageUrl;
    console.log(this.url);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }
  ionViewWillLoad() {
    console.log('UserId', this.navParams.get('data'));
    this.userDetails = this.navParams.get('data');
    console.log('UserId', this.userDetails.index);
  }
  getImage(img) {
    console.log(img);
    if (img) {
      if (img.indexOf('http') != 0) {
        return this.url + img;
      } else {
        return img;
      }
    } else {
      return 'assets/img/default.png';
    }
  }

  close() {
    this.navCtrl.pop();
    //this.viewCtrl.dismiss();
  }
}
