var map;
var infowindow;

// Func initMap
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      center: {
         lat: 50.7788432,
         lng: 6.0800873
      },
      zoom: 16,
      styles: [{
            "featureType": "poi.attraction",
            "elementType": "labels.text",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.business",
            "elementType": "labels.text",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.government",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.medical",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.place_of_worship",
            "elementType": "labels.text",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.school",
            "stylers": [{
               "visibility": "off"
            }]
         },
         {
            "featureType": "poi.sports_complex",
            "stylers": [{
               "visibility": "off"
            }]
         }
      ]
   });

   var request = {
      location: map.getCenter(),
      radius: '500',
      types: ['food']
   };

   service = new google.maps.places.PlacesService(map);
   service.nearbySearch(request, callback);

   directionsDisplay = new google.maps.DirectionsRenderer;
   directionsService = new google.maps.DirectionsService;

   directionsDisplay.setMap(map);

   document.getElementById('mode').addEventListener('change', function () {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
   });
}

// Func callback
function callback(results, status) {
   if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
         createMarker(results[i]); // results[i] is a place
      }
   }
}

// Func createMarker
function createMarker(place) {
   var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
   });

   var request = {
      placeId: place.place_id
   };

   service = new google.maps.places.PlacesService(map);

   google.maps.event.addListener(marker, 'click', function () {
      service.getDetails(request, createInfor);
      infowindow.open(map, marker);
   });
}

// Func createInfor
function createInfor(results) {
   infowindow = new google.maps.InfoWindow();
   infowindow.setContent('<div><strong>' + results.name + '</strong><br>' + '<br>' 
      + results.formatted_address + '<br><button value="' + results.geometry.location 
      + '" id="navigation" onclick="calculateAndDisplayRoute()">GO</button></div>');
}

// Func calculateAndDisplayRoute
function calculateAndDisplayRoute() {
   var selectedMode = document.getElementById('mode').value;
   directionsService.route({
      origin: {
         lat: 50.7788432,
         lng: 6.0800873
      },
      destination: document.getElementById("navigation").value,
      travelMode: google.maps.TravelMode[selectedMode]
   }, function (response, status) {
      if (status === 'OK') {
         directionsDisplay.setDirections(response);
      } else {
         window.alert('Directions request failed due to ' + status);
      }
   });
}