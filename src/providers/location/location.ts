import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationProvider {
  latlng:any

  constructor(public http: Http,private geolocation: Geolocation) {
   // console.log('Hello LocationProvider Provider');
  }

  currentLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
     // console.log(resp,"current location");
      this.latlng=resp.coords;
      return this.latlng;
    
     }).catch((error) => {
      
      // console.log('Error getting location', error);
     });
     
  }

}
