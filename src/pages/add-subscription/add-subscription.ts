import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import { GroupProvider } from '../../providers/group/group';
import { ToastProvider } from '../../providers/toast/toast';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the AddSubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-subscription',
  templateUrl: 'add-subscription.html',
})

export class AddSubscriptionPage {
  subscription:any = {
    description:'',
    amount:'',
    date:new Date().toISOString(),
     };

     groupId:any;
     members:any;
     userId;
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public userProvider: UserProvider,
     public groupProvider: GroupProvider,
     public loadingCtrl: LoadingController,
     public toastProvider: ToastProvider,
    )  {
    let group = this.navParams.get('group_info');
  
    this.groupId = group.group_id;
    this.getGroupMembers(this.groupId);
    this.userId=this.userProvider.user.id
    console.log(group,"group",this.userId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSubscriptionPage');
  }
  getGroupMembers(_groupId) {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    let requestParams = {
      group_id: _groupId,
      token: this.userProvider.token
    }
    this.groupProvider.getGroupMember(requestParams).then(data => {
      console.log(data);
      this.members = data;
      console.log("members", this.members);
      loading.dismiss();
    }, err => {
      this.toastProvider.showToast("Server not responding")
      loading.dismiss();
    })
  }
}
