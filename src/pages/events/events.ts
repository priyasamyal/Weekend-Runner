import { Component, ElementRef, ViewChild, Renderer, Directive } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, PopoverController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { GroupProvider } from '../../providers/group/group';
import { PageTwo } from '../events/page-two';
import { morePopover } from '../events/morePopover';
import { EventDetailPage } from '../event-detail/event-detail';
import { AddGroupMembersPage } from '../add-group-members/add-group-members';
import { GroupchatPage } from '../groupchat/groupchat';
import {UserProvider} from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
 
})
export class EventsPage {
  defaultPage='events';
  
  eventList = [];
  selectIndex: any = 0;
  listIndex: any = 0;
  group;
  color = "black";
  popover;
  groupImage;
  status:string;
  shareIcon: boolean = false;
  isEvent: boolean;
  data: Array<any> = [];
  showContent: boolean = false;
  myId;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private _renderer: Renderer,
    private elementRef: ElementRef,
    public events: Events,
    public groupservice: GroupProvider,
    public platform: Platform,
    public api: ApiProvider,
    public userProvider: UserProvider,
    
   
  ) {
    this.myId=this.userProvider.user.id;

    this.status='not over'
    this.group = this.navParams.get('group');
    console.log("th", this.group)
    this.groupImage = this.api.imageUrl + this.group.group_image;
    console.log(this.groupImage);
  //this.getEventList();
  }
  getEventList() {
    this.groupservice.getEventsByGroup_id(this.group.group_id).then(res => {
      this.eventList = JSON.parse(JSON.stringify(res));
      if (this.eventList.length > 0) {
        this.showContent = true;
        this.isEvent = true;

      } else {
        this.showContent = true;
        this.isEvent = false;

      }

      for (let i in this.eventList) {
        if (this.eventList[i].user_status == null || this.eventList[i].user_status == 3) {
          this.eventList[i].icon = "calendar"
        }
        else if (this.eventList[i].user_status == 0) {
          this.eventList[i].icon = "star-outline"
        }
        else if (this.eventList[i].user_status == 1) {
          this.eventList[i].icon = "checkmark-circle-outline"
        }
        else if (this.eventList[i].user_status == 2) {
          this.eventList[i].icon = "thumbs-down"
        }

      }
      console.log(this.eventList)
    }).catch(err => {
      console.log(err, "err")
    })
  }

  ionViewWillEnter() {
    console.log("willennter")
    this.getEventList()
  }
  ionViewDidLeave() {


    // if (this.popover) {
    //   this.popover.dismiss();
    // }
    console.log("ionViewDidLeave");
  //  this.events.unsubscribe('createEvent')
  }
  editEvent(item){
console.log(item,"item")
this.navCtrl.push("CreateEventsPage", { event_data: item });
}

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    // this.events.subscribe('createEvent', () => {
    //   console.log("create event call")
    //   this.navCtrl.push("CreateEventsPage", { groupData: this.group });
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

  showEventDetails(details) {
    console.log(details, "idex");
    this.navCtrl.push(EventDetailPage, { "eventDetails": details });
  }

  createEvent(ev: UIEvent) {
    console.log("create",ev)
    this.navCtrl.push("CreateEventsPage", { groupData: this.group });
 
  }
  groupInfo() {
    console.log("groupInfo")
    this.navCtrl.push(AddGroupMembersPage, { group: this.group });
  }
  // navigate chat view
  chat() {
    this.navCtrl.push(GroupchatPage, { group_info: this.group });

  }
  unselectItem(ev) {
    console.log(this.data, "unselect",ev)
  
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].id == ev.id) {
          this.data.splice(i, 1);
        
        }
        if (this.data.length == 0) {
       
          console.log("Length",this.shareIcon)
          this.shareIcon = false;
          console.log("Length",this.shareIcon)
          this.events.publish('selectionStop', "user", Date.now());
        }
      }
   
  
    console.log(this.data, "after",this.data.length)
   
  }

  selectItem(ev) {
  
    console.log(this.data, "select",)
    console.log( "select",ev)
    this.shareIcon = true;
    this.data.push(ev);
    console.log(this.data, "afterselect",)
   

  }

  goToSubscription(){
    console.log("sub")
    this.navCtrl.push("AddSubscriptionPage",{ group_info: this.group });
  } 
}
