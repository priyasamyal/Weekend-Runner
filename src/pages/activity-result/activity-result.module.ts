import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityResultPage } from './activity-result';

@NgModule({
  declarations: [
    ActivityResultPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityResultPage),
  ],
  exports:[ActivityResultPage]
})
export class ActivityResultPageModule {}
