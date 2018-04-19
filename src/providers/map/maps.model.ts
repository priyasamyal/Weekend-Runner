export class MapsModel {
  map: google.maps.Map;
	map_options: google.maps.MapOptions = {
		center: {lat: 30.733306, lng: 76.778978},
    zoom: 13,
    disableDefaultUI: true
  };
	markers = [];
	map_places: Array<MapPlace> = [];

	search_query: string = '';
	search_places_predictions: Array<google.maps.places.AutocompletePrediction> = [];

	nearby_places: Array<MapPlace> = [];

	directions_origin: MapPlace = new MapPlace();
	directions_display: google.maps.DirectionsRenderer;

	using_geolocation: boolean = false;

	// https://developers.google.com/maps/documentation/javascript/reference#Map
	// init(map: google.maps.Map) {
	// 	this.map = map;
	// 	// https://developers.google.com/maps/documentation/javascript/reference#DirectionsRenderer
	// 	this.directions_display = new google.maps.DirectionsRenderer({
	// 		map: this.map,
	// 		suppressMarkers: true,
	// 		preserveViewport: true
	// 	});
	// }
	init(map: google.maps.Map) {
		this.map = map;
		console.log(this.map,"map in provider")
   
	}
	clearMarkers() {
    this.setMapOnAll(null);
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
	public createMapMarker(lat,lng): void {
    this.deleteMarkers();
  this.map.setCenter({lat: lat, lng: lng})
    console.log("createmarker",this.map)
    var marker = new google.maps.Marker({
      map: this.map,
      position: {lat: lat, lng: lng},
    });
   this.markers.push(marker);
    console.log(this.markers,"marker list")
  }

	
	cleanMap() {
		// Empty nearby places array
		this.nearby_places = [];
// To clear previous directions
		this.directions_display.set('directions', null);
//		this.directions_display.setDirections({routes: []});
//		this.directions_display.setMap(null);

		// To remove all previous markers from the map
		this.map_places.forEach((place) => {
      place.marker.setMap(null);
    });

		// Empty markers array
		this.map_places = [];

		this.using_geolocation = false;
	}

	cleanSearch() {
		// Empty nearby places array
		this.nearby_places = [];

		// Empty markers array
		this.map_places = [];

		this.using_geolocation = false;
	}
// Use for adding places into map
	addPlaceToMap(location: google.maps.LatLng, color: string = '#333333') : MapPlace {
		console.log("add place map call")
		let _map_place = new MapPlace();

		_map_place.location = location;
		_map_place.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: MapPlace.createIcon(color)
    });

		this.map_places.push(_map_place);
console.log(_map_place,"map place")
		return _map_place;
	}
// Use for add places with in nearby by you
	addNearbyPlace(place_result: google.maps.places.PlaceResult) {
		let _map_place = this.addPlaceToMap(place_result.geometry.location, '#666666');
/*
		// This is an extra attribute for nearby places only
		_map_place.details = place_result;
    let getRandom = (min:number, max:number) : number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    // Add a random image
		_map_place.details["image"] = "./assets/images/maps/place-"+getRandom(1, 9)+".jpg";
*/
		this.nearby_places.push(_map_place);
	}

	deselectPlaces() {
		this.nearby_places.forEach((place) => {
      place.deselect();
    });
	}
}

export class MapPlace {
	marker: google.maps.Marker;
	location: google.maps.LatLng;
	selected: boolean = false;
	// This is an extra attribute for nearby places only
	details: google.maps.places.PlaceResult;

	// https://developers.google.com/maps/documentation/javascript/reference#Symbol
	static createIcon(color: string) : google.maps.Symbol {
    let _icon: google.maps.Symbol = {
      path: "M144 400c80 0 144 -60 144 -134c0 -104 -144 -282 -144 -282s-144 178 -144 282c0 74 64 134 144 134zM144 209c26 0 47 21 47 47s-21 47 -47 47s-47 -21 -47 -47s21 -47 47 -47z",
      fillColor: color,
      fillOpacity: .6,
      anchor: new google.maps.Point(0,0),
      strokeWeight: 0,
      scale: 0.08,
      rotation: 180
    }
    return _icon;
  }

	setIcon(color: string) : void {
		this.marker.setIcon(MapPlace.createIcon(color));
	}

	deselect() {
		this.selected = false;
    this.setIcon('#666666');
	}

	select() {
		this.selected = true;
    this.setIcon('#ae75e7');
	}
}
