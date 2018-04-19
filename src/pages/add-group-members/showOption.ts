import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,Events,LoadingController} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';
import { ProfilePage } from '../profile/profile';
import { ToastProvider } from '../../providers/toast/toast';
@Component({
  selector: 'showPopup',
  template: `
   <ion-list>
   <ion-item  (click)="choose(1)"> View Profile</ion-item>
   <ion-item  (click)="choose(2)"  *ngIf=" data.checkAdmin=='1' "> Remove User</ion-item>
   <ion-item *ngIf="data.is_superadmin=='0' &&  data.checkAdmin=='1' "  (click)="choose(3)"> Make Admin </ion-item>
   <ion-item *ngIf="data.is_superadmin=='1' &&  data.checkAdmin=='1'"  (click)="choose(4)"> Remove Admin </ion-item>
  </ion-list>
  `,
  styles: ['.list-md {margin: 0px auto;}']
})
export class ShowOption {

    Selectedindex:any;
    data;
    myUser:number


    groupName: string;
    groupId: any;
    isSuperAdmin: any;
    userIndex;
    groupMemberdata

 constructor(private navParams: NavParams,
  public viewCtrl: ViewController,
  public events: Events,
  public userProvider: UserProvider,public navCtrl: NavController,
  public groupProvider: GroupProvider,
  public toastProvider: ToastProvider, 
  public loadingCtrl: LoadingController,) {
    
  this.data=this.navParams.data.data;

  this.groupMemberdata =  this.data;
  console.log(this.navParams.get('group'),"popover group data");
  console.log(this.navParams.data,"popover data");
  this.myUser=this.userProvider.user.id;
  console.log(this.myUser,"myId")


  let group = this.navParams.get('group');
  console.log(group, "group")
  this.groupName = group.group_name;
  this.groupId = group.group_id;
  this.isSuperAdmin = group.is_superadmin;

  this.userIndex = this.navParams.get('index');
  console.log(this.userIndex,"this.userIndex")
  
 }

 backButtonAction(){
   console.log("call")
  this.viewCtrl.dismiss();
 }
  
 close(data) {
    this.viewCtrl.dismiss(data);
  }
choose(index)
  {
    console.log(index)
    // this.events.publish('chooseOption',{index:index});
    // this.close();
    if (index == 1) {
      this.close("view");
    //  this.viewProfile();
    }
    if (index == 2) {
      this.close("getMembers");
      this.removeGroupMember(this.groupMemberdata, this.userIndex);
    }
    if (index == 3) {
      this.close("getMembers");
      this.addAdmin(this.groupMemberdata.user_id)
    }
    if (index == 4) {
      this.close("getMembers");
      this.removeAdmin(this.groupMemberdata.user_id)
    }
  }

  viewProfile() {
    console.log(this.groupMemberdata);
    this.navCtrl.push(ProfilePage,{ 'userId': this.groupMemberdata.user_id });
  }
  
   removeGroupMember(data, i) {
    console.log(data); 
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    this.groupProvider.deleteGroupMember(data, this.groupId).then(res => {
      console.log(res)
      loading.dismiss();
      //this.getGroupMembers(this.groupId);
    }).catch(err => {
      loading.dismiss();
      console.log(err)
    });
  }

    // add admin
    addAdmin(user_id) {
      let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
      loading.present();
      console.log(user_id, "admin")
      let requestParams = {
        group_id: this.groupId,
        user_id: user_id,
        token: this.userProvider.token
      }
      this.groupProvider.makeGroupAdmin(requestParams).then(data => {
        console.log(data);
        if (data) {
          loading.dismiss();
          this.toastProvider.showToast("Group admin added successfully!");
        //  this.getGroupMembers(this.groupId);
        }
      }, err => {
        console.log(err);
        loading.dismiss();
        this.toastProvider.showToast("Server not responding!");
      });
    }

      // remove admin
  removeAdmin(user_id) {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    let requestParams = {
      group_id: this.groupId,
      user_id: user_id,
      token: this.userProvider.token
    }

    this.groupProvider.removeGroupAdmin(requestParams).then(data => {
      console.log(data);
      if (data) {
        loading.dismiss();
        this.toastProvider.showToast("Group admin removed successfully!");
   //     this.getGroupMembers(this.groupId);
      }
    }, err => {
      loading.dismiss();
      console.log(err);
      this.toastProvider.showToast("Server not responding!");
    });
  }
  
  }