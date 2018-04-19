import { ApiProvider } from '../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, Events,LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContactsPage } from '../contacts/contacts';
import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';
import { ToastProvider } from '../../providers/toast/toast';
import { NativeStorage } from '@ionic-native/native-storage';
import { ProfilePage } from '../profile/profile';
import { PopoverController } from 'ionic-angular';
import { ShowOption } from '../add-group-members/showOption';
import { ContactProvider } from '../../providers/contact/contact';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'page-add-group-members',
  templateUrl: 'add-group-members.html',
})
export class AddGroupMembersPage {
  numberOfMembers: any = "No";
  groupName: string;
  groupId: any;
  isSuperAdmin: any;
  checkAdmin: number = 0;
  members: any;
  groupImage: any;
  createDate: any;
  group_image: any;
  userOperation: number
  myId: any
  groupMemberdata;
  userIndex: number;
  popover;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    public groupProvider: GroupProvider,
    public toastProvider: ToastProvider,
    public userProvider: UserProvider,
    private nativeStorage: NativeStorage,
    public contactProvider: ContactProvider,
    public popoverCtrl: PopoverController,
    public api: ApiProvider,
    private events: Events,
    public loadingCtrl: LoadingController,
    
  ) {
    
    let group = this.navParams.get('group');
    console.log(group, "group")
    this.groupName = group.group_name;
    this.groupId = group.group_id;
    this.isSuperAdmin = group.is_superadmin;
    let a = group.date_added.split('T');
    console.log(a);
    this.createDate = group.date_added;
    this.group_image = this.api.imageUrl + group.group_image;
    console.log(this.group_image)
   // this.getGroupMembers(this.groupId);
    console.log("members..........", this.contactProvider.friendsContacts);
  }
  ionViewWillLeave() {
    console.log("leave")
    if(this.popover)
      this.popover.dismiss();
 }    

  ionViewWillEnter() {
    this.getGroupMembers(this.groupId);
    this.myId=this.userProvider.user.id;
    
  }
  addMembers() {
       this.navCtrl.push(ContactsPage, { _groupId: this.groupId, _superAdmin: this.isSuperAdmin, group_members: this.members, group_info: this.navParams.get('group') });
      }
// get group members
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
      this.numberOfMembers = this.members.length;
      console.log("members", this.members);
      this.checkUserAdmin();
      loading.dismiss();
    }, err => {
      this.toastProvider.showToast("Server not responding")
      loading.dismiss();
    })
  }

  checkUserAdmin() {
    console.log("UserItself.call admin")
    for (let member in this.members) {
      if (this.userProvider.user.id == this.members[member].user_id)
        this.checkAdmin = parseInt(this.members[member].is_superadmin);
    }
  }

  getGroupImage() {
    return 'url(' + this.group_image + ')';
  }

  showOptions(data, ev: UIEvent, index) {
    if(data.user_id!=this.userProvider.user.id){
      this.groupMemberdata = data;
      this.groupMemberdata.checkAdmin = this.checkAdmin;
      this.userIndex = index;
      console.log(data)
      this.popover = this.popoverCtrl.create(
        ShowOption, {data:data,group:this.navParams.get('group'),index:index});
        this.popover.present({
        ev: event,
      });
      this.popover.onDidDismiss((popoverData) => {
        console.log(popoverData,"pop  this.viewProfile();")
        if(popoverData=="view"){
          this.viewProfile();
        }else{
          this.getGroupMembers(this.groupId);
        }
     
   
      })
    }
    else{
      console.log("userItself")
    }
   
  }

  getPicture(image) {
    if (image != null) {

      if (image.indexOf('http') >= 0) {
        return image;
      } else {
        return this.api.imageUrl + image
      }

    }
    if (image == null) {
      return "assets/img/default.png"
    }
  }
  exitGroup() {
    this.groupProvider.exitGroup(this.groupId).then(res => {
      console.log(res)
      if (res) {
        this.navCtrl.setRoot("MygroupsPage");
      }
    }).catch(err => {
      console.log(err)
    });

  }

 viewProfile() {
    console.log(this.groupMemberdata)
    this.navCtrl.push(ProfilePage, { 'userId': this.groupMemberdata.user_id });
  }
  update(){
    console.log(this.navParams.get('group'));
    this.navCtrl.push("NewgroupPage",{"group_detail":this.navParams.get('group')})
  }

}
