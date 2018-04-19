import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MygroupsPage } from './mygroups';

@NgModule({
  declarations: [
    MygroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(MygroupsPage),
  
  ],
  exports: [
    MygroupsPage,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MygroupsPageModule {}
