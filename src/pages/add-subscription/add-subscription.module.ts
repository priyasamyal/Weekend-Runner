import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSubscriptionPage } from './add-subscription';

@NgModule({
  declarations: [
    AddSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSubscriptionPage),
  ],
  exports: [
    AddSubscriptionPage,
  ],
})
export class AddSubscriptionPageModule {}
