import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController) {
 //   console.log('Hello Toast Provider');
  }
  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    }).present();
  }
  showToastBack(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
