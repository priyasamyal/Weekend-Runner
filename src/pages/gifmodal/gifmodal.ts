import { Component,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { Events } from 'ionic-angular';
/**
 * Generated class for the GifmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gifmodal',
  templateUrl: 'gifmodal.html',
})
export class GifmodalPage {
url;
event;
caption='';
  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public view: ViewController,
     public events: Events,
     public element: ElementRef) {

     this.url= this.navParams.get('url');
     this.event= this.navParams.get('event');
     console.log(this.url,"url",this.event)
   
   }
  
 ionViewWillEnter() {
          console.log('ionViewDidLoad GifmodalPage');
          this.caption=undefined;
    if(this.event){
         var reader = new FileReader();
          var image = this.element
          .nativeElement
          .querySelector('.image');
          reader.onload = function (e) {
           var src = e.target['result'];
           image.src = src;
         };
          reader.readAsDataURL(this.event.target.files[0]);
    }
  }
 closeModal()
  {
    console.log("call close");
    this.view.dismiss();
  }
  onCancel(){
    this.closeModal();
  }
  send(){
    console.log(this.caption,event);
    this.closeModalAfterSend(this.caption,event);
  }

  closeModalAfterSend(caption,event)
  {
    console.log("call close");
    this.view.dismiss({'file':event,'caption':caption});
  }
}
