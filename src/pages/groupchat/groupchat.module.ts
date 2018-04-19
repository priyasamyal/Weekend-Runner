import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupchatPage } from './groupchat';

import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
@NgModule({
  declarations: [
    GroupchatPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupchatPage),
    EmojiPickerModule
  ],
   exports: [
    GroupchatPage,
  ]
})
export class GroupchatPageModule {}
