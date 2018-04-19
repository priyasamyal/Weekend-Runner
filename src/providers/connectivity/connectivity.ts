import { Injectable } from '@angular/core';

import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
 
declare var Connection;

/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectivityProvider {
  onDevice: boolean;
  constructor(public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
    //console.log('Hello ConnectivityProvider Provider');
  }

  isOnline(){
    if(this.onDevice && Network.type){
      return Network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  offline(){
    if(this.onDevice && Network.type){
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;  
    }
  }
  noConnection() {
    return (Network.type ===  Connection.NONE);
  }

  watchOnline(){
    return Network.onConnect();
  }

  watchoffline(){
    return Network.onDisconnect();
  }

}
