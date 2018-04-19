import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ApiProvider} from '../api/api';
import {ToastProvider} from '../../providers/toast/toast';
import 'rxjs/add/operator/map';
import {NativeStorage} from '@ionic-native/native-storage';
import {LoginPage} from '../../pages/login/login';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { Events, AlertController } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { AlertProvider } from '../alert/alert';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {
  data: any;
  token:any;
  user: any;
  id:any;
  profile_image:any;
  first_name:any;
  last_name:any;
  userdetails;
  myfriends; 
  registrationId;
 
    constructor(
    public http: Http,
    public api: ApiProvider,
    private toast: ToastProvider,
    private nativeStorage: NativeStorage,
    public transfer: Transfer,
    public alertProvider:AlertProvider,
    public connectivity:ConnectivityProvider,
    public events: Events) 
    {
    //console.log('Hello UserProvider Provider');
   // console.log(this.id,this.token,"My credentials")
    }

  signUp(userInfo: any) {

    // console.log('signup');
    // console.log(userInfo);
    // console.log(this.api.authUrl+" 'register'")
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl+'register', userInfo)
        .map(res => res.json())
        .subscribe(
          res => {
           // console.log('signup res');
            console.log(res);
            resolve(res);
         
          },
          err => {
            console.log(err)
            // console.log('signup err');
            // console.log(err.msg);
            if (err.msg) reject(err.msg);
            else reject('Server not responding');
          }
        );
    });
  }
 socialSignIn(userInfo){
//console.log(userInfo);
    userInfo.device_token=this.registrationId;
    console.log(userInfo,'social_signin')
    return new Promise((resolve, reject) => {
    this.api.post(this.api.authUrl + 'social_signin',userInfo).map(res=>res.json()).
    subscribe(res=>{
      if(res.status==1){

        this.setUser(res.data);
        this.setToken(res.token);
        resolve(res.data);

      }
    },err=>{
      if(this.connectivity.noConnection()){
        reject('No internet Connection')
      }{
       // console.log('socialSignIn err')
       // console.log(err)
        if (err.msg && err.msg == "string")
            reject(err.msg);
        else
          reject('Server not responding'); 
      }
   
    })
    });
  }
  
   login(userInfo: any) {
  //  console.log(" internet")
      userInfo.device_token=this.registrationId;
   //   console.log('signup',this.api.authUrl);
//console.log(userInfo);
//console.log(this.api.authUrl + 'signin')
      return new Promise((resolve, reject) => {
        this.api
          .post(this.api.authUrl + 'signin', userInfo)
          .map(res => res.json())
          .subscribe(
            res => {
          //    console.log('login res');
          //    console.log(res);
              if (res.status) {
                this.setUser(res.data[0]);
                this.setToken(res.token);
                resolve(res.data[0]);
              } else if (res.msg.errno == undefined) reject(res.msg);
              else reject('Please enter vaild inputs');
            },
            err => {
              if(this.connectivity.noConnection()){
                reject('No internet Connection')
              }else{
              //  console.log('signup err',err);
              //  console.log(err.msg);
                if (err.msg) reject(err.msg);
                else reject('Server not responding');
              }
             
            }
          );
      });
    
 
  }

   forgotPassword(userInfo: any) {
 //   console.log('forgotPassword');
 //   console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api
        .post(this.api.authUrl + 'forgot_password', userInfo)
        .map(res => res.json())
        .subscribe(
          res => {
        //    console.log('forgotpassword res');
        //    console.log(res);
            if (res.status) {
              resolve(res.msg);
              this.toast.showToast(res.msg);
            } else if (res.msg.errno == undefined) reject(res.msg);
            else reject('Please enter vaild inputs');
          },
          err => {
         //   console.log('signup err');
        //    console.log(err.msg);
            if (err.msg) reject(err.msg);
            else reject('Server not responding');
          }
        );
    });
  }

  changePassword(resetInfo: any) {
   // console.log('forgotPassword');
   // console.log(resetInfo);
    return new Promise((resolve, reject) => {
      this.api
        .post(this.api.authUrl + 'verify_code', resetInfo)
        .map(res => res.json())
        .subscribe(
          res => {
//console.log('forgotpassword res');
        //    console.log(res);
            if (res.status) {
              resolve(res.msg);
              this.toast.showToast(res.msg);
            } else if (res.msg.errno == undefined) reject(res.msg);
            else reject('Please enter vaild inputs');
          },
          err => {
            if(this.connectivity.noConnection()){
              reject('No internet Connection')
            }{
              //console.log('signup err');
           // console.log(err.msg);
            if (err.msg) reject(err.msg);
            else reject('Server not responding');}
            
          }
        );
    });
  }

  //auth
  view_user_profile(userInfo: any) {
   // console.log('view_user_profile');
   // console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api
        .post(this.api.apiUrl + 'view_profile', userInfo)
        .map(res => res.json())
        .subscribe(
          res => {
         //   console.log('forgotpassword res');
         //   console.log(res);
            if (res.status) resolve(res.msg[0]);
            else if (res.msg.errno == undefined) reject(res.msg);
            else reject('Please enter vaild inputs');
          },
          err => {
            if(this.connectivity.noConnection()){
              reject('No internet Connection')
            }{
          //    console.log('signup err');
          //    console.log(err.msg);
              if (err.msg) reject(err.msg);
              else reject('Server not responding');
            }
           
          }
        );
    });
  }

  edit_user_profile(profileInfo: any) {
  //  console.log('edit_user_profile');
   // console.log(profileInfo);
    return new Promise((resolve, reject) => {
      this.api
        .post(this.api.apiUrl + 'edit_profile', profileInfo)
        .map(res => res.json())
        .subscribe(
          res => {
       //     console.log('edit_user_profile res');
       //     console.log(res);
            if (res.status) {
              resolve(res.data[0]);
              this.toast.showToast(res.msg);
            } else if (res.msg.errno == undefined) reject(res.msg);
            else reject('Please enter vaild inputs');
          },
          err => {
            if(this.connectivity.noConnection()){
              reject('No internet Connection')
            }{ 
//console.log('signup err');
          //  console.log(err.msg);
            if (err.msg) reject(err.msg);
            else reject('Server not responding');}
           
          }
        );
    });
  }

  //Used to change the profile image or update it
  updateProfileImage(profilePic: any,token:any,id:any) {
  return new Promise((resolve, reject) => {
      
      const fileTransfer: TransferObject = this.transfer.create();
      var filename = profilePic.split('/').pop();
      var changeScope = this;
      
      var options = {
        fileKey: 'profile_image', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: {id:id},
        headers: {'x-access-token':token},
      };
    
      fileTransfer.upload(profilePic, this.api.apiUrl + 'upload_profile_image', options)
        .then(
          result => {
        
             var res = JSON.parse(result.response);
            if (res.status) {
              this.toast.showToast(res.msg);
               this.user.profile_image=res.data;
          
              this.setUser(this.user);
              resolve(result.response);
            } else reject(res.msg);
          },
          err => {
        reject(err);
          }
        );
    });
  }

  logout() {
//console.log('logout');
    let data={
      user_id:this.user.id,
      token:this.token
    }
    //console.log(data);
    return new Promise((resolve, reject) => {
      this.api
        .post(this.api.apiUrl + 'logout', data)
        .map(res => res.json())
        .subscribe(
          res => {
          //  console.log('logout res');
          //  console.log(res);
            if (res.status) {
              resolve(res.msg);
              this.toast.showToast("Logout Successfully");
            } else if (res.msg.errno == undefined) reject(res.msg);
            else reject('Please enter vaild inputs');
          },
          err => {
            if(this.connectivity.noConnection()){
              reject('No internet Connection')
            }{
              //console.log('logout err');
         //   console.log(err.msg);
            if (err.msg) reject(err.msg);
            else reject('Server not responding');}
            
          }
        );
    });
  }



  postActivity(profilePic: any,token:any,id:any) {
    console.log('updateProfileImage',token,id);
   
    return new Promise((resolve, reject) => {
      
      const fileTransfer: TransferObject = this.transfer.create();
      var filename = profilePic.split('/').pop();
      var changeScope = this;
      
      var options = {
        fileKey: 'profile_image', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: {id:id},
        headers: {'x-access-token':token},
      };
   //   console.log('params' , JSON.stringify(options));
      fileTransfer.upload(profilePic, this.api.authUrl + 'upload_profile_image', options)
        .then(
          result => {
          //  console.log('fileTransfer upload SUCCESS:');
         //   console.log(result);
           
            var res = JSON.parse(result.response);
            if (res.status) {
              this.toast.showToast(res.msg);
            //  console.log('no erro', res);
              //this.setUser(res.data);
              resolve(result.response);
            } else reject(res.msg);
          },
          err => {
          //  console.log('errrrrrr' + JSON.stringify(err));
            reject(err);
          }
        );
    });
  }




  // Used to set the logintype user  
  setToken(token: string) {
    this.token = token;
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('token', token));
    });
  }

  // Used to set the logintype user  
  setUser(user: any) {
    this.user = user;
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('user', user));
    });
  }

  // Used to set the logintype user  
  setLoginType(loginType: number) {
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('login_type', loginType));
    });
  }

  // Used to get the type login user either customer or service provider
  getLoginType() {
    return this.nativeStorage.getItem('login_type');
  }
}
