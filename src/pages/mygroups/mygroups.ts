import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { GroupProvider } from '../../providers/group/group';
import { NativeStorage } from '@ionic-native/native-storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { EventsPage } from '../events/events';
import { AddGroupMembersPage } from '../add-group-members/add-group-members';
import { GroupchatPage } from '../groupchat/groupchat';
import { ApiProvider } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import {ToastProvider} from '../../providers/toast/toast';
import { SqliteDatabaseProvider } from '../../providers/sqlite-database/sqlite-database';
@IonicPage()
@Component({
  selector: 'page-mygroups',
  templateUrl: 'mygroups.html',
})
export class MygroupsPage {

  loaded :boolean;
  myGroups:any = [];
  src="assets/img/default.png";
  length:number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupservice: GroupProvider,
    private nativeStorage: NativeStorage,
    public alertCtrl: AlertController,
    public connectivity:ConnectivityProvider,
    public events: Events,
    public api: ApiProvider,
    private userProvider: UserProvider,
    private toast: ToastProvider,
    public sqliteProvider:SqliteDatabaseProvider,
    private photoViewer: PhotoViewer
  ) {
       
   
  }
 ionViewWillEnter() {
  this.viewGroup();
  // if(this.connectivity.noConnection()){
  //   console.log("no internet")
  //   this.getGroupFromDatabase();
  // } else{
   
  // }  
   
  }
 viewGroup() {
    this.groupservice.viewGroup({ token:this.userProvider.token, admin_id:this.userProvider.user.id }).then(res => {
      console.log(res)
      this.myGroups = res;
      this.length=this.myGroups.length
    //  this.insertGroupsInDatabase();
    }).catch(err => {
      console.log(err, "err")
    })
  }

 
  warningAlert(item, i) {
    let alert = this.alertCtrl.create({
      message: 'Are you sure you want to permanently delete this group ?',

      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
        }
      },
      {
        text: 'Yes',
        handler: data => {
          this.confirmAlert(item, i)
        }
      }
      ]
    });
    alert.present();
  }

  confirmAlert(item, i) {
    let alert = this.alertCtrl.create({
      message: 'Other group members will also loose all the data and events . Confirm deleting the group ?',

      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
        }
      },
      {
        text: 'Yes',
        handler: data => {
          this.deleteGroup(item, i)
        }
      }
      ]
    });
    alert.present();
  }

 

  ionViewDidLoad() {
    console.log('ionViewDidLoad MygroupsPage');

  }

  creategroup() {
    this.navCtrl.push("NewgroupPage")
  }

  deleteGroup(item, i) {
    console.log(item, i)
    this.groupservice.deleteGroup(item).then(res => {
      this.myGroups.splice(i, 1)
      console.log(res)
    }).catch(err => {
      this.toast.showToast(err);
      console.log(err, "err")
    })

  //  this.sqliteProvider.deleteGroup(item)
  }


  groupInfo(_group) {
    console.log(_group);
    // this.navCtrl.push(AddGroupMembersPage,{group:_group});
    this.navCtrl.push(EventsPage, { group: _group });
  }

  // navigate chat view
  chat(groupInfo) {
    this.navCtrl.push(GroupchatPage,{group_info:groupInfo});
  }

  insertGroupsInDatabase(){
    this.sqliteProvider.saveUsersGroups(this.myGroups)
    .then(
      data => {
        console.log(data, 'insert result');
       },
      err => {
        console.log(err, 'insert error');
      }
    );
  }
 getGroupFromDatabase(){
    this.sqliteProvider.getGroup()
    .then(
      data => {
        console.log(data, 'getGroupFromDatabase result');
        this.myGroups = data;
        console.log(this.myGroups);
       },
      err => {
        console.log(err, 'getGroupFromDatabase error');
      }
    );
  }
zoom(image){
      console.log("image",image);
      this.photoViewer.show(image, 'Group icon', {share: false});
  }

  update(item,index){
      console.log(item,index);
      this.navCtrl.push("NewgroupPage",{"group_detail":item})
  }
 }
