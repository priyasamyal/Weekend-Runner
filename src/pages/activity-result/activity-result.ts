import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
/**
 * Generated class for the ActivityResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google : any;

@IonicPage()
@Component({selector: 'page-activity-result', templateUrl: 'activity-result.html'})
export class ActivityResultPage {
  @ViewChild('map')mapElement : ElementRef;
  map : any;
  current_marker;
  myTrip = [];
  distance = 0;
  time = "00.00.00"
  pace = 0;
  constructor(public navCtrl : NavController, public navParams : NavParams, private geolocation : Geolocation) {

    // this.distance=this.navParams.get("distance")
    // this.time=this.navParams.get("time") this.pace=this.navParams.get("pace")
  }

  ionViewDidLoad() {

    this.myTrip = this
      .navParams
      .get('path')
    console.log("myTrip", this.myTrip);
    console.log('ionViewDidLoad ActivityResultPage');
    console.log('load map page');
    let mapOptions = {
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google
      .maps
      .Map(this.mapElement.nativeElement, mapOptions);
    console.log(this.map);
    this.loadMap();
  }

  loadMap() {
    var options = {
      enableHighAccuracy: true
    };
    this
      .geolocation
      .getCurrentPosition(options)
      .then(resp => {
        let latLng = new google
          .maps
          .LatLng(resp.coords.latitude, resp.coords.longitude);
        console.log(resp, latLng);
        this
          .map
          .setCenter({lat: resp.coords.latitude, lng: resp.coords.longitude});
        //     this.addMarker(latLng);
      })
      .catch(error => {
        console.log('Error getting location', error);
      });
    console.log('loacd');

    //   var pathCovered = new google.maps.Polyline({     path:this.myTrip,
    // strokeColor:"#0000FF",     strokeOpacity:0.8,     strokeWeight:2 });
    // pathCovered.setMap(this.map);
  }

  addMarker(latLng) {
    console.log('Add Marker', latLng);
    this.current_marker = new google
      .maps
      .Marker({
        map: this.map,
        position: this.myTrip[this.myTrip.length - 1],
        icon: new google
          .maps
          .MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png', new google.maps.Size(22, 22), new google.maps.Point(0, 18), new google.maps.Point(11, 11))
      });
    console.log(this.current_marker, "currrent matker", this.myTrip[this.myTrip.length])
    this
      .current_marker
      .setMap(this.map);

    let start_point = new google
      .maps
      .Marker({
        map: this.map,
        title: 'Hellp',
        position: this.myTrip[0],
        icon: new google
          .maps
          .MarkerImage('http://maps.google.com/mapfiles/ms/icons/green-dot.png',)
      });
    start_point.setMap(this.map);

  }
}
