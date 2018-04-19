import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MygroupsPage } from '../mygroups/mygroups';
import { AddGroupMembersPage } from '../add-group-members/add-group-members';

import { ContactProvider } from '../../providers/contact/contact';
import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';
import { ToastProvider } from '../../providers/toast/toast';

declare var angular: any;

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  check: any;
  members: any = [];
  contactList: any = [];
  demoCont = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer,
    private socialSharing: SocialSharing,
    public contactProvider: ContactProvider,
    public userProvider: UserProvider,
    public goupProvider: GroupProvider,
    public toastProvider: ToastProvider,
    public loadingCtrl: LoadingController
  ) {
    //   this.contactList = this.contactProvider.friendsContacts;
    console.log(this.contactProvider.friendsContacts);
  }

  ionViewWillEnter() {
    this.contactProvider.friendsContacts.map(c => c.isCheck = 0);
    console.log('ionViewWillEnter ContactsPage');
    //  this.contactProvider.friendsContacts.map(c => c.isCheck = 0);
    let members = this.navParams.get('group_members');
    console.log('members.........', members);
    console.log(members.length);
    this.demoCont = [];
    this.contactProvider.friendsContacts.map(contact => this.demoCont.push(contact));
    //let demoCont = this.contactProvider.friendsContacts;
    // this.contactList = this.contactProvider.friendsContacts;
    console.log(
      'contact withut filter........',
      this.contactProvider.friendsContacts
    );
    console.log(this.contactList.length);

    for (var i = this.demoCont.length - 1; i >= 0; i--) {
      for (var j in members) {
        if (this.demoCont[i] && this.demoCont[i].contact_id === members[j].user_id) {
          this.demoCont.splice(i, 1);
        }
      }
    }
    this.contactList = this.demoCont;
    console.log('contacts after filter........', this.contactList);
  }

  getPicture(image) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }



  addMember(evt) {
    // make array of members
    console.log(evt);
    if (evt.isCheck) {
      this.members.push(evt);
    } else {
      for (let m in this.members) {
        if (evt.contact_id == this.members[m].contact_id) {
          this.members.splice(m, 1);
        }
      }
    }
  }

  onCancel() {
    this.contactList = this.demoCont;
  }

  search(ev) {
    // Reset brnads back to all of the brands
    this.contactList = this.demoCont;

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the brands
    if (val && val.trim() != '') {
      this.contactList = this.contactList.filter(da => {
        return (
          da.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          da.phoneNumbers.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    }
    //     this.contactList.length =1;
  }

  saveMember() {
    // hit api
    console.log(JSON.stringify(this.members));

    if (this.members.length != 0) {
      let y = [];
      this.members.map(g1 => y.push(g1.contact_id));
      let requestParams = {
        group_id: this.navParams.get('_groupId'),
        user_id: y,
        // is_superadmin: this.navParams.get('_superAdmin'),
        token: this.userProvider.token,
      };
      let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
      loading.present();
      this.goupProvider.addGroupMember(requestParams).then(
        data => {
          console.log(JSON.stringify(data));
          loading.dismiss();
          if (data) {
            this.toastProvider.showToast('Members added!');
            this.navCtrl
              .push(AddGroupMembersPage, {
                group: this.navParams.get('group_info'),
              })
              .then(() => {
                const index = this.navCtrl.getActive().index;
                //this.navCtrl.pop();
                this.navCtrl.remove(index - 1);
                this.navCtrl.remove(index - 2);
              });
          }
        },
        err => {
          console.log(err);
          this.toastProvider.showToast('Server not responding!');
        }
      );
    } else {
      this.toastProvider.showToast('Please add member first');
    }
  }

  //share application
  shareApplication() {
    this.socialSharing
      .share(
      'Install Weekend Runner Application',
      null /*Subject*/,
      null /*File*/,
      'http://www.amebasoftwares.com'
      )
      .then(
      () => { },
      () => {
        alert('Sorry there is some issue please try after some time.');
      }
      );
  }

  //
  refreshContacts() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    this.contactProvider.friendsContacts = [];
    this.contactProvider.fetchContactsFromMobile().then(data => {
      let members = this.navParams.get('group_members');
      // let demoCont = this.contactProvider.friendsContacts;
      let demoCont = [];
      this.contactProvider.friendsContacts.map(contact => demoCont.push(contact));
      for (var i = demoCont.length - 1; i >= 0; i--) {
        for (var j in members) {
          if (demoCont[i] && demoCont[i].contact_id === members[j].user_id) {
            demoCont.splice(i, 1);
          }
        }
      }
      this.contactList = demoCont;
      console.log('contacts after filter........', this.contactList);
      loading.dismiss();
    }, err => {
      loading.dismiss();
    });
  }
}
