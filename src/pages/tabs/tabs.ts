import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfilePage} from '../profile/profile';

import {EventsPage} from '../events/events';
import {ContactsPage} from '../contacts/contacts';
import {MapPage} from '../map/map';

@IonicPage()
@Component({selector: 'page-tabs', templateUrl: 'tabs.html'})

export class TabsPage {
  tab1Root = ProfilePage;
  tab2Root = ContactsPage;
  tab3Root = "ActivityMapPage";
  tab4Root = EventsPage
  //tab3Root = HomePage;
  tab5Root = "MygroupsPage";
  tab6Root = MapPage;
  constructor(public navCtrl : NavController, public navParams : NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
