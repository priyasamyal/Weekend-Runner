import {Component, ViewChild, NgZone,ElementRef} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  Content,
  LoadingController,
  TextInput,
  ActionSheetController,
  Platform,
  ModalController
} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {NativeStorage} from '@ionic-native/native-storage';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Crop} from '@ionic-native/crop';
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';
import * as io from 'socket.io-client';
declare var cordova: any;
import {UserProvider} from '../../providers/user/user';
import {GroupProvider} from '../../providers/group/group';
import {ApiProvider} from '../../providers/api/api';
import {TabsPage} from '../tabs/tabs';
import {SqliteDatabaseProvider} from '../../providers/sqlite-database/sqlite-database';
import  'delivery/lib/client/delivery.js';
// import  'socket.io-file-client/socket.io-file-client.js';
import * as SocketIOFileClient from 'socket.io-file-client/socket.io-file-client.js';
import { FileChooser } from '@ionic-native/file-chooser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ToastProvider } from '../../providers/toast/toast';

declare var require: any;
declare var Delivery:any;
// declare var SocketIOFileClient:any;

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  @ViewChild('content') content: Content;
  @ViewChild('url') url;
  @ViewChild('sendInput') public sendInput: TextInput;
//@ViewChild('fileInput') public fileInput: TextInput;

  @ViewChild('fileInput') myFileInput: ElementRef;
  actionSheet;
  messages: any = [];
  socket: any;
  delivery:any;
  uploader:any;
  chat_input: string;
  chats = [];
  reciver_id: any;
  reciever_name: any;
  group: any;
  groupImage;
  SECERET_KEY = 'secret key 123';

  toggled: boolean = false;
  height = '86%';
  bottom = '0px';
  show: boolean = false;
  segment;
  icon_name = 'happy';
  imagee:any

  imgpath:any;
  posts: any;
  values: any;
  options:Array<any>;
  gifSelected:Boolean=false;
  imageChoose:any;
  previous_upload_id = '';
  caption:string;
  constructor(
   
    public actionSheetCtrl: ActionSheetController,
    private crop: Crop,
    public camera: Camera,
    private file: File,
    private filePath: FilePath,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public zone: NgZone,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public groupservice: GroupProvider,
    public platform: Platform,
    public userProvider: UserProvider,
    public api: ApiProvider,
    public sqliteProvider: SqliteDatabaseProvider,
    public http: Http,
    public modalCtrl: ModalController,
    private fileChooser: FileChooser,
    private element: ElementRef,
    private photoViewer: PhotoViewer,
    public toast: ToastProvider,
  ) {
  
    this.imgpath="http://192.168.88.14:8087/images/chat_files/";
    
    this.chat_input="";
    this.group = this.navParams.get('group_info');
   
    console.log(this.userProvider.user.id);
   
    this.socket = io(this.api.socketUrl);
    console.log(this.socket );
  
     let soc =  io.connect(this.api.socketUrl);
     console.log(soc);

    this.uploader = new SocketIOFileClient(soc);
   
    console.log("uploader",this.uploader)

    this.delivery = new Delivery(soc); // file transfer

  
    this.socket.emit('subscribe', this.group.thread_id);

    this.socket.on('message', x => {
   // this.messages = [];
    this.content.scrollToBottom(300);
      console.log('message', x);
      console.log('else part', x.length);
      if (x.length == undefined) {
        var CryptoJS = require('crypto-js');
        var AES = require('crypto-js/aes');
        var bytes = CryptoJS.AES.decrypt(
          x.message.toString(),
          this.SECERET_KEY
        );
        var dec = bytes.toString(CryptoJS.enc.Utf8);
        console.log(x);
        // single msg
        this.messages.push({
          msg: dec,
          sender_id: x.sender,
          reciever_id: x.receiver,
          first_name: x.first_name,
          last_name: x.last_name,
          thread_id: x.thread_id,
          group_id: this.group.group_id,
          message_image:x.message_image
        });
        console.log(this.messages);
        this.content.scrollToBottom(500);
        //  this.saveToLocalDatabase();
      } else if (x.length > 0) {
        console.log('else part', x.length);
        for (let m in x) {
          var CryptoJS = require('crypto-js');
          var AES = require('crypto-js/aes');
          var bytes = CryptoJS.AES.decrypt(
            x[m].message.toString(),
            this.SECERET_KEY
          );
          var dec = bytes.toString(CryptoJS.enc.Utf8);
          console.log('dec', dec);

          this.messages.push({
            msg: dec,
            sender_id: x[m].sender_id,
            reciever_id: x[m].receiver_id,
            first_name: x[m].first_name,
            last_name: x[m].last_name,
            thread_id: this.group.thread_id,
            group_id: this.group.group_id,
            message_image:x[m].message_image         
          });
        
        }
        console.log(this.messages);
        this.content.scrollToBottom();
        // this.saveToLocalDatabase();
      }
      this.autoScroll();
    });

    this.http.get('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC').map(res => res.json()).subscribe(data => {
      this.values = data.data;
      console.log(this.values);
  });
  this.options=["high five","thumbs up","mic drop","happy","clapping","shrug","no","yes","sad","love","vintage","horror ","sorry","cheers",
  "thank you","wink","angry","nervous","duh","oops","hungry",
  "wow","bored","hugs","good night","awkward","aww","plese",
  "yikes","omg","bye","waiting","eyeroll","kitten","idk",
  "loser","cold","party","dance","agree","SHRUG","excuse me","what","stop","done","miss you","scared","chill out","creep"]

  events.subscribe('close', () => {
    // user and time are the same arguments passed in `events.publish(user, time)`
    console.log('Welcome');
   this. gifSelected=false;
  });
  }

  saveToLocalDatabase() {
    this.sqliteProvider.saveChatByGroupId(this.messages);
  }

  ionViewDidEnter() {
    console.log(this.myFileInput.nativeElement.files[0],"jj");
    console.log(this.url, 'url');
    console.log('ionViewDidEnterionViewDidEnter');
    console.log(this.content);
    }
  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    this.events.subscribe('close', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('unsubsribbe');
  //   this. gifSelected=false;
    });
  }

  ionViewWillLoad() {
    this.group = this.navParams.get('group_info');
    console.log(this.group);
    this.groupImage = this.api.imageUrl + this.group.group_image;
  }

  send(message) {
    console.log(this.sendInput);
    this.sendInput.setFocus();
    console.log(message);
    if (message != undefined && message != '') {
      var CryptoJS = require('crypto-js');
      var AES = require('crypto-js/aes');
      var SHA256 = require('crypto-js/sha256');
      var msg = CryptoJS.AES.encrypt(message, this.SECERET_KEY);
      var msg = msg.toString();
      // console.log('Encrypt', msg.toString());
      console.log('Encrypt', msg);
      console.log('if enter');
      this.socket.emit('send', {
        room: this.group.thread_id,
        message: msg,
        sender: this.userProvider.user.id,
        receiver: 0,
        group_id: this.group.group_id,
        profile_image: this.userProvider.profile_image,
        first_name: this.userProvider.user.first_name,
        last_name: this.userProvider.user.last_name,
      });
      //this.socket.emit('send', { room: '5a9e6260c63b5826769e6deec92ab57b5c76d97444eef7421a504475541b6b17', message: msg, sender: this.phoneNumberRegisterProvider.user_id, receiver: this.reciver_id });
    }
    console.log(this.content);
    this.content.scrollToBottom();
    this.chat_input = '';
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.messages = [];
      this.socket.emit('subscribe', this.group.thread_id);
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

 

  getUserGroupChat() {
    console.log('getUsers groups');
    this.sqliteProvider.getChatByGroupId().then(
      data => {
        console.log(data, 'select result');
      },
      err => {
        console.log(err, 'select error');
      }
    );
  }

  autoScroll() {
    setTimeout(function() {
      var itemList = document.getElementById('chat-autoscroll');
      console.log(itemList, 'itemList');
      console.log(itemList.scrollHeight);
      itemList.scrollTop = itemList.scrollHeight ;
    }, 10);
  }

  handleSelection(event) {
    console.log(event,"event")
    this.chat_input = this.chat_input  + event.char;
  }
  smiley(){
    this.bottom="0px";
    this.height="85%";
   if(this.show==true)
   {
      this.toggled=false;
      this.show=false;
      this.icon_name="happy"
      setTimeout(() => {
       this.sendInput.setFocus();
       this.autoScroll();
     }, 150);
      }
     else{
        this.sendInput.setBlur();
        this.icon_name="keypad"
        setTimeout(() => {
        this.height="37%";
        this.bottom="243px";
        this.autoScroll();
        this.toggled=true;
        this.show=true
        }, 150);
      }
 }
 
focus(ev)
 {
  this.height="70%";
  this.bottom="0px";
  this.icon_name="happy"
  console.log("focus")
   this.show=false;
   this.toggled=false;
   setTimeout(() => {
    
    this.autoScroll();
  }, 550);
}

focusout(tt){
  console.log("focusout",tt)
  this.icon_name="happy"
  this.height="86%";
  this.bottom="0px";  
  }

  search(search){
    console.log(search,"search");
    this.http.get('http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q='+search).map(res => res.json()).subscribe(data => {
          this.values = data.data;
          console.log(this.values);
      });
  }

   fileChange(event){
  //  this.sendImage(event,"test")
  console.log("call file change",event)
  
  console.log("call file change",event)
        let modal = this.modalCtrl.create("GifmodalPage",{"event":event});
        modal.present();
        modal.onDidDismiss(data => {
        
          console.log(data," onDidDismiss");
          if(data){
            this.sendImage(data.file,data.caption);
            event.target.value = null
            console.log("After dismiss",data.caption )
          }else{
            event.target.value = null
          }
     
         });
        
   }
   zoomImage(img){
    console.log(img)
     this.photoViewer.show(img, 'Image', {share: false});
   }

 sendImage(event,caption){
  console.log(caption,"sendImage data");
  this.caption = caption;
  var fileEl = document.getElementById('file');
  console.log("file path",fileEl);
  var uploadIds = this.uploader.upload(fileEl, {
   data: { /* Arbitrary data... */ }
 });

   this.uploader.on('start', (fileInfo) => {
      console.log('Start uploading', fileInfo);
    });

    this.uploader.on('stream', (fileInfo) => {
      console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    });

    this.uploader.on('complete', (fileInfo) => {
       console.log('Upload Complete', fileInfo);
       console.log('Upload Complete', fileInfo.name);
       if(this.previous_upload_id == ''){
         console.log("if enter", this.previous_upload_id);
           this.sendEmit(this.caption,fileInfo);
          
       }else{
           if(this.previous_upload_id == fileInfo.uploadId){
           console.log("else if ", this.previous_upload_id)
         
           }else{
             console.log("else else", this.previous_upload_id);
            this.sendEmit(this.caption,fileInfo);

           }
       }

       this.previous_upload_id = fileInfo.uploadId;
    
    });

    this.uploader.on('error', (err) => {
      this.toast.showToast("Image too large to send. It should be less than 4 GB")
      console.log('Error!', err);
    });

    this.uploader.on('abort', (fileInfo) => {
      console.log('Aborted: ', fileInfo);
    });
    
 }

  sendEmit(caption,fileInfo){
  console.log(caption,"sendEmit caption is")
  var CryptoJS = require('crypto-js');
  var AES = require('crypto-js/aes');
  var SHA256 = require('crypto-js/sha256');
  var msg = CryptoJS.AES.encrypt(caption, this.SECERET_KEY);
  var msg = msg.toString();
  console.log(msg,"dataCation");
   this.socket.emit('send', {
    room: this.group.thread_id,
    message:msg,
    sender: this.userProvider.user.id,
    receiver: 0,
    group_id: this.group.group_id,
    profile_image: this.userProvider.profile_image,
    first_name: this.userProvider.user.first_name,
    last_name: this.userProvider.user.last_name,
    message_image:fileInfo.name
  });
 }

       image(img){
        console.log(img,"image")
   
       let modal = this.modalCtrl.create("GifmodalPage",{"url":img});
        modal.present();
        modal.onDidDismiss(data => {
        this. gifSelected=false;
          
          });
   }
  closegif(){
    console.log("close")
    this.gifSelected=false;
  }
}
