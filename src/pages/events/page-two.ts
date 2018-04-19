import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,Events} from 'ionic-angular';

@Component({
  selector: 'page-api-radio-popover',
  template: `
   <ion-list>

   <ion-item  (click)="choose(1)">  <ion-icon name="calendar"></ion-icon> Interested</ion-item>
   <ion-item  (click)="choose(2)">  <ion-icon name="checkmark-circle-outline"></ion-icon> Going</ion-item>
   <ion-item  (click)="choose(3)">  <ion-icon name="thumbs-down"></ion-icon> Not-going</ion-item>
   </ion-list>
  `,
})
export class PageTwo {
    Selectedindex:any;
 constructor(private navParams: NavParams,public viewCtrl: ViewController,public events: Events ) {

  }
  close() {
    this.viewCtrl.dismiss();
  }
  choose(index)
  {
    this.events.publish('selectPopoverValue',{index:index});
    this.close();
  }


}