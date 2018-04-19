import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GifmodalPage } from './gifmodal';

@NgModule({
  declarations: [
    GifmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(GifmodalPage),
  ],
  exports:[GifmodalPage]
  
})
export class GifmodalPageModule {}
