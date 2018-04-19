import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityMapPage } from './activity-map';

@NgModule({
  declarations: [
    ActivityMapPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityMapPage),
  ],
  exports:[ActivityMapPage]
})
export class ActivityMapPageModule {}
