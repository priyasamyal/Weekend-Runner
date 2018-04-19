import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {AlertProvider} from '../../providers/alert/alert'
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the EventDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  metadata;
  intersested=0;going=0;notgoing=0;
  eventDetail;
  eventImage;
  iconColor="black";
  iconColor1="black";
  iconColor2="black";
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    public groupservice: GroupProvider,
    public userProvider: UserProvider,
    public modalCtrl: ModalController,
    public alert:AlertProvider) {
    
    }
  getEventMetadata(){
    this.groupservice.getEventMeta(this.eventDetail).then(res=>{
      console.log(res,"res")
      this.metadata=res;
      for(let i in this.metadata){
        if(this.metadata[i].meta_value==0){
          this.intersested++;
          if(this.userProvider.user.id==this.metadata[i].user_id){
            this.iconColor="red"
          }
        
          console.log(this.intersested)
        }
        else if(this.metadata[i].meta_value==1){
          this.going++;
          if(this.userProvider.user.id==this.metadata[i].user_id){
            this.iconColor1="red"
          }
         
         
          console.log(this.intersested)
        }
        else if(this.metadata[i].meta_value==2){
          this.notgoing++;
          if(this.userProvider.user.id==this.metadata[i].user_id){
            this.iconColor2="red"
          }
         
          console.log(this.notgoing)
        }
       }}).catch(err=>{
      
         })
  }

  ionViewWillLoad() {
    this.eventDetail = this.navParams.get('eventDetails');
    console.log(this.eventDetail,"this.willeventDetail")
    this.eventImage=this.api.imageUrl+this.eventDetail.photo;
    console.log(this.eventImage)
    this.getEventMetadata();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailPage');
  }
  OnUserInterest(index){
    this.groupservice.OnEventSelectionAction(this.eventDetail,index).then(res=>{
      this.intersested=0;
      this.going=0;
      this.notgoing=0;
      this.getEventMetadata();
      console.log(res)
         }).catch(err=>{
      
         })
  }

  showList(index,_count){
    if(_count==0){
      this.alert.okAlertMsg("No user available")
    }else{
      console.log(index,this.metadata,"showList")
      this.metadata.index=index;
      this.navCtrl.push("BuddiesPage",{data:this.metadata})
      //  let modal = this.modalCtrl.create("BuddiesPage",{data:this.metadata});
      //  modal.onDidDismiss(data => {
      //      console.log('page > modal dismissed > data > ', data);
                        
      //  })
      //  modal.present();
    }
   }
  toggleSign(index)
  {
    let count=0;
    console.log(count,"count");
  if(index==0)
      { 
        console.log(index)
        if(this.iconColor=="black")
          {
            count=count+1;
            console.log("toggle")
            this.iconColor="red"
            this.iconColor1="black"
            this.iconColor2="black"
            this.OnUserInterest(index);
            console.log(count,"inner");
          }
          else{
            this.iconColor="black"
            this.OnUserInterest(3);
          }
      }
      else if(index==1)
        {
        console.log(index)
        
          if(this.iconColor1=="black")
            {
              console.log("toggle")
              this.iconColor1="red"
              this.iconColor="black"
              this.iconColor2="black"
              this.OnUserInterest(index);
             
            }
            else{
              this.iconColor1="black"
              this.OnUserInterest(3);
            }
        }
        else{
        console.log(index)
        
          if(this.iconColor2=="black")
            {
              console.log("toggle")
              this.iconColor2="red"
              this.iconColor1="black"
              this.iconColor="black"
              this.OnUserInterest(index);
             
            }
            else{
              this.iconColor2="black";
              this.OnUserInterest(3);
            }
        }
      
  }
}
