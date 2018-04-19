import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
// import {DirectivesModule} from '../../directives/directives.module';
import {GesturesDirective} from '../../directives/gestures/gestures';
import { CommonModule } from "@angular/common";
@NgModule({
  declarations: [
    EventsPage,
    GesturesDirective
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(EventsPage),
    
  ],
})
export class EventsPageModule {}
