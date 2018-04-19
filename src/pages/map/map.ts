import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";
import { MapProvider } from '../../providers/map/map';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
 autocompleteItems;
  autocomplete;
  map_model: MapsModel = new MapsModel();
  location;
 
  SelectedLocation;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    private geolocation: Geolocation,
    public viewCtrl: ViewController
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    // console.log("constructor");
   
    console.log("location is",this.navParams.get("location")) ;
     this.SelectedLocation=this.navParams.get("location");
     if(this.SelectedLocation){
       if(this.SelectedLocation.description){
        console.log("loc is"+this.SelectedLocation)
        this.autocomplete.query=this.SelectedLocation.description
       }else{
        this.autocomplete.query=this.SelectedLocation
       }
      
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }
  mapReady(ev){
    console.log("Mapready emitter",ev)
      this.map_model.init(ev)
      if(this.SelectedLocation){
        if(this.SelectedLocation.description){
          console.log('location alerad selected');
          this.selectSearchResult(this.SelectedLocation);
        }else{
          this.geolocation.getCurrentPosition().then((resp) => {
            console.log(resp.coords);
           let current_location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            this.map_model.createMapMarker(resp.coords.latitude,resp.coords.longitude);
          }).catch((error) => {
             console.log('Error getting location', error);
           });
        }
       
       }
       else{
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp.coords);
         let current_location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.map_model.createMapMarker(resp.coords.latitude,resp.coords.longitude);
          this.reverseGeoCoder(current_location)
         }).catch((error) => {
           console.log('Error getting location', error);
         });
      }
    }
    clearSearch(){
      
       this.map_model.deleteMarkers();
     }
   
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
      console.log("query") ;
      this.mapProvider.getPlacePredictions(this.autocomplete).subscribe(
       places_predictions => {
       console.log("result",places_predictions)
       this.autocompleteItems =places_predictions
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }
  selectSearchResult(place){
    console.log(place,"place")
    this.autocompleteItems = [];
    this.autocomplete.query=place.description;
    console.log(place.place_id,"place")
    this.mapProvider.geocodePlace(place.place_id).subscribe(
      place_location => {
        console.log(place_location,"place_location")
        console.log(place_location.lat(),"place_location")
        console.log(place_location.lng(),"place_location")
       this.map_model.createMapMarker(place_location.lat(),place_location.lng())
    
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
    this.location=place
 
  }
  reverseGeoCoder(latLng){
      console.log(latLng,"latLng")
      this.mapProvider.reverseGeocode(latLng).subscribe(
      result => {
      console.log("resul",result)
      this.autocomplete.query=result;
      this.location=result;
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

  select(){
     console.log("sec",this.location)
    this.viewCtrl.dismiss(this.location);
  }
 
  dismiss() {
    this.viewCtrl.dismiss();
    }
  ionViewDidEnter() {
    // Use ngOnInit instead
  }

  
}
