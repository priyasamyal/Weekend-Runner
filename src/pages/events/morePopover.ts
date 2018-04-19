import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,Events} from 'ionic-angular';

@Component({
  selector: 'more',
  template: `
   <ion-list>
    <ion-item  (click)="create()">  <ion-icon name="calendar" color="danger"></ion-icon> Create Event</ion-item>
  </ion-list>
  `,
  styles: ['.list-md {margin: 0px auto;}']
})
export class morePopover {
  
constructor(private navParams: NavParams,public viewCtrl: ViewController,public events: Events ) {
console.log("morepop")
  }
  close() {
    this.viewCtrl.dismiss();
  }

  create()
  {
    this.events.publish('createEvent');
    this.close();
  }
}