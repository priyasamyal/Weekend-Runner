import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HaversineService, GeoCoord } from "ng2-haversine";
declare var google :any;
/**
 * Generated class for the ActivityMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activity-map',
  templateUrl: 'activity-map.html',
})
export class ActivityMapPage {
  title = 'START';
  start_button_press: boolean = false;

  hh = 0;
  mm = 0;
  ss = 0;
  time = '00:00:00';
  timeout;
  location_timeout;

  myTrip=[];
  index=0;
  distance:any=0.00;
  total_distance:any=0.00
  total_time:any=0.00
  pace:any=0.00;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private _haversineService: HaversineService ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityMapPage');
  }

  start() {
  
    if (this.start_button_press) {

      this.title = 'START';
      this.start_button_press = false;
      this.stop_time();
      console.log('start activity', this.start_button_press);

    } else {

      this.title = 'STOP';
      this.start_button_press = true;
      console.log('start activity', this.start_button_press);
      this.timer();
      this.startTracking();

    }
}

start_tracking_timeout(){
  this.location_timeout = setTimeout( () => 
  {
  this.startTracking();
  },5000);
 }

 startTracking(){
  var options={
    enableHighAccuracy:true,
    }
    console.log("button Press")
    this.geolocation.getCurrentPosition(options).then((resp) => {
      console.log(resp.coords)
     this.myTrip.push(new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude));
         if(this.index>1){
            console.log("if condition")
            if(this.myTrip[this.index-1].lat()==this.myTrip[this.index].lat()){
                console.log("same location")
            }
            else{
              this.calculate_distance(this.index-1,this.index);
           }
       }
       this.index++;
      console.log(this.myTrip,"location Array")
     }).catch((error) => {
       console.log('Error getting location', error);
     });
      this.start_tracking_timeout();
 }

    calculate_distance(i,j){
      console.log(i,j,"indexes of my trip")
      this.apply_haversine(i,j).then(res=>{
          console.log(res,"response")
          this.distance+=res;
          console.log(this.distance,"total distance");
          this.total_distance=this.distance.toFixed(2);
          console.log(this.total_distance,"float")
         
      },err=>{
        console.log(err,"erro claculating distance")
      })

    }  

 apply_haversine(from,to){

  return new Promise((resolve,reject)=>{
    let madrid: GeoCoord = {
      latitude: this.myTrip[from].lat(),
      longitude:this.myTrip[from].lng()
  };

  let bilbao: GeoCoord = {
      latitude: this.myTrip[to].lat(),
      longitude: this.myTrip[to].lng()
  };
  console.log(madrid,bilbao,"loc");
  let meters = this._haversineService.getDistanceInMeters(madrid, bilbao);
  let kilometers = this._haversineService.getDistanceInKilometers(madrid, bilbao);
  let miles = this._haversineService.getDistanceInMiles(madrid, bilbao);

  console.log(`
      The distance between Madrid and Bilbao is:
          - ${meters} meters
          - ${kilometers} kilometers
          - ${miles} miles
  `);
  resolve(kilometers);
  reject("Error")
  })

 }

  timer() {
    this.timeout = setTimeout(() => {
      this.count();
    }, 1000);
  }

  count() {
    this.ss++;
    if (this.ss >= 60) {
      this.mm++;
      this.ss=0;
      if (this.mm >= 60) {
        this.mm = 0;
        this.hh++;
      }
    }
    this.time =
      (this.hh ? (this.hh > 9 ? this.hh : '0' + this.hh) : '00') +
      ':' +
      (this.mm ? (this.mm > 9 ? this.mm : '0' + this.mm) : '00') +
      ':' +
      (this.ss > 9 ? this.ss : '0' + this.ss);
    this.timer();

    this.total_time=(this.hh)+(this.mm/60)+(this.ss/3600);
    console.log(this.total_time,"total time");
     this.pace=(this.total_distance/this.total_time).toFixed(2);
    console.log(this.pace,"pace");
  }

  stop_time(){
    clearTimeout(this.timeout);
    clearTimeout(this.location_timeout);
    this.navCtrl.push("ActivityResultPage",{path:this.myTrip,time:this.time,distance:this.total_distance,pace:this.pace});
  }
}
