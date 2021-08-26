var map,destination,infowindow,markerList = [],markerValueList = [],markerIndex,mypos,myposIcon,
AsianIcon, ItalianIcon, LebaneseIcon, CafeIcon, SpanishIcon, AmericanIcon, GermanIcon, SwissIcon,
elseIcon,directionsDisplay,directionsService,selectedMode="WALKING",filterCountN = 0,
filterPanel = document.getElementById('filter'),
select = document.getElementById('selectMode');




// -- Func initMap -- //
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      center: {
         lat: 50.774289,
         lng: 6.085889
      }, // Elisenbrunen
      zoom: 16,
      minZoom: 15,
      maxZoom: 20,
      styles: './data-style.js'
   });

   myposIcon = {
      url: 'images/icons/you-are-here-small.png'
   };
   AsianIcon = {
      url: 'images/icons/noodles.png'
   };
   ItalianIcon = {
      url: 'images/icons/pizza.png'
   };
   LebaneseIcon = {
      url: 'images/icons/kebab.png'
   };
   CafeIcon = {
      url: 'images/icons/coffee.png'
   };
   SpanishIcon = {
      url: 'images/icons/seefood.png'
   };
   AmericanIcon = {
      url: 'images/icons/chicken.png'
   };
   GermanIcon = {
      url: 'images/icons/hamburger.png'
   };
   FrenchIcon = {
      url: 'images/icons/muffin.png'
   };
   elseIcon = {
      url: 'images/icons/kebab.png'
   };

   map.fitB

   mypos = new google.maps.Marker({
      map: map,
      position: map.getCenter(),
      icon: myposIcon,
      animation: google.maps.Animation.DROP
   });

   mypos.addListener('click', toggleBounce);


   $.getJSON({"url":"json/restaurants.json"}, function (data) {
      $.each(data, function (i, field) {
         for (var i = 0; i < field.length; i++) {
            markerIndex = i;
            createMarker(field[i], markerIndex);
         }
      });
   });
   


   directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport:true});
   directionsService = new google.maps.DirectionsService;


}

// -- Func filterCount -- //
function filterCount() {
   filterCountN = 5;

   var select1 = $(".cost:checked").length,select2 = $(".payments:checked").length,
		select3 = $(".vegan:checked").length,select4 = $(".reservation:checked").length,
		select5 = $(".cuisine:checked").length,
		selectList = [select1, select2, select3, select4, select5];

   for (i = 0; i < 5; i++) {
      if (selectList[i] === 0) {
         filterCountN = filterCountN - 1;
      }
   }
}

// -- -- Func checkDisplay -- //
function checkDisplay(selected, markerValue) {
   var filterValue = new Array();

   for (var n = 0; n < selected.length; n++) {
      filterValue.push(selected[n].value);
   }

   keep = filterValue.indexOf(markerValue);

   return keep;
}
// -- Func filter -- //
function filter() {
   var select1 = $(".cost:checked");
   var select4 = $(".payments:checked");
   var select2 = $(".vegan:checked");
   var select5 = $(".reservation:checked");
   var select3 = $(".cuisine:checked");

   for (var x = 0; x < markerValueList.length; x++) {
      var keepN = 0;

      keep1 = checkDisplay(select1, markerValueList[x].average_cost);
      keep2 = checkDisplay(select2, markerValueList[x].is_vegan);
      keep3 = checkDisplay(select3, markerValueList[x].cuisine);
      keep4 = checkDisplay(select4, markerValueList[x].cards_accepted);
      keep5 = checkDisplay(select5, markerValueList[x].reservation_required);
      
      var keepList = [keep1, keep2, keep3, keep4, keep5];

      for (i = 0; i < 5; i++) {
         if (keepList[i] === -1) {
            keepN = keepN + 1;
         }
      }

      if (keepN + filterCountN === 5) {
         markerList[x].setMap(map);
      } else {
         markerList[x].setMap(null);
      }
   }

   map.setCenter({
      lat: 50.774289,
      lng: 6.085889
   });

   map.setZoom(15);
}

// -- Func toggleBounce -- //
function toggleBounce() {
   if (mypos.getAnimation() !== null) {
      mypos.setAnimation(null);
   } else {
      mypos.setAnimation(google.maps.Animation.BOUNCE);
   }
}

// -- Func goBack -- //
function goBack() {
   directionsDisplay.setMap(null);
   directionsDisplay.setPanel(null);

   filterPanel.style.display = 'block';
   select.style.display = 'none';

   document.getElementById('goback').style.display = 'none';
   document.getElementById('print').style.display = 'none';

   map.setCenter({
      lat: 50.774289,
      lng: 6.085889
   });
   map.setZoom(15);
}

// -- Func getMarker -- //
function getMarker(icon, place){
   return new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: icon
   });
}

// -- Func createMarker -- //
function createMarker(place, mindex) {
   var marker;

   if (place.filters.cuisine === 'Asian') marker = getMarker(AsianIcon, place);
   else if (place.filters.cuisine === 'Italian') marker = getMarker(ItalianIcon, place);
   else if (place.filters.cuisine === 'Lebanese') marker = getMarker(LebaneseIcon, place);
   else if (place.filters.cuisine === 'Cafe') marker = getMarker(CafeIcon, place);

   if (place.filters.cuisine === 'Spanish') marker = getMarker(SpanishIcon, place);
   else if (place.filters.cuisine === 'American') marker = getMarker(AmericanIcon, place);
   else if (place.filters.cuisine === 'German') marker = getMarker(GermanIcon, place);
   else if (place.filters.cuisine === 'French') marker = getMarker(FrenchIcon, place);

   markerList[mindex] = marker;
   markerValueList[mindex] = place.filters;

   google.maps.event.addListener(marker, 'click', function () {
      createInfor(place);
   });
}

// -- Func createInfor -- //
function createInfor(results) {
   if (results.rating <= 1) results.rating = "images/star.png";
   else if (results.rating > 1 && results.rating <= 1.5) results.rating = "images/oneH.png";
   else if (results.rating > 1.5 && results.rating <= 2) results.rating = "images/twoStar.png";
   else if (results.rating > 2 && results.rating <= 2.5) results.rating = "images/twoH.png";
   else if (results.rating > 2.5 && results.rating <= 3) results.rating = "images/three.png";
   else if (results.rating > 3 && results.rating <= 3.5) results.rating = "images/threeH.png";
   else if (results.rating > 3.5 && results.rating <= 4) results.rating = "images/fourStar.png";
   else if (results.rating > 4 && results.rating <= 4.5) results.rating = "images/fourH.png";
   else results.rating = "images/fiveStar.png";

   if (results.filters.average_cost === "less") results.avgCost = "<span class='colorLimegreen'>&#8364; Low</span>";
   else if (results.filters.average_cost === "medium") results.avgCost = "<span class='colorGold'>&#8364;&#8364; Medium</span>";
   else results.avgCost = "<span class='colorTomato'>&#8364;&#8364;&#8364; High</span>";

   if (results.filters.is_vegan !== "vfalse") results.isVegan = '<b>Vegan</b> <img style="max-height:30px;"  src="images/vagan.jpg"><br><br>';
   else results.isVegan = '';

   if (results.filters.cards_accepted === "ctrue") results.cardsAccepted = 'Cards accepted';
   else results.cardsAccepted = 'Cash only';

   if (results.filters.reservation_required === "rtrue") results.reservationRequired = '<b class="colorTomato"><span class="glyphicon glyphicon-exclamation-sign"></span> Reservation required</b><br><br>';
   else results.reservationRequired = '';

   if (results.filters.closing_soon === "true") results.closingSoon = '<b class="colorTomato"><span class="glyphicon glyphicon-exclamation-sign"></span> Closing Soon </b>';
   else results.closingSoon = '<b class="colorLimegreen"><span class="glyphicon glyphicon-ok"></span> Open Now </b>';

   if (results.filters.seats_available === "true") results.seatsAvailable = '<b  class="colorLimegreen"><span class="glyphicon glyphicon-ok"></span> Seats available </b>';
   else results.seatsAvailable = '<b class="colorTomato"><span class="glyphicon glyphicon-exclamation-sign"></span> Fully booked</b>';

   var location = [results.geometry.location.lat, results.geometry.location.lng];

   var contentString = 
		'<div id="infowin"><div class="card maxWidth320"><div class="card-image">' +
		'<img id="resImage" style="max-height:180px;" src="' + results.icon + '">' +
      '<span class="card-title" id="resName">' + results.name + '</span></div>' +
      '<div class="card-content">' +
      ' <img id="resRating" class="ratingImg" src="' + results.rating + '">' +
      ' <div id="resInfo">' +
      ' <p id="resAddress" style="margin-top: 4px">' + results.address + '</p>' +
      ' <h6>Average Cost: <strong><p id="resAvgCost" class="displayInline">'+results.avgCost+'</p></strong></h6>' +
      '<h6>Payments: <strong><p id="resCard" class="displayInline">'+results.cardsAccepted+ '</p></strong></h6>' +
		'<h6>People typically spend: <strong><p id="resSpendTime" class="displayInline">' + results.filters.avg_time_spent + '</p></strong></h6>' +
		'<h6>Must Try: <strong><p id="mustTry" class="displayInline">'+ results.filters.must_try +'</p></strong></h6>' +
      '<h6><strong><p id="closingSoon" class="displayInline">' + results.closingSoon + '&nbsp</p></strong><strong><p id="seatsAvailable" class="displayInline">' + results.seatsAvailable + '</p></strong></h6>' +
      '<span><strong><p id="seatsAvailable" class="displayInline">' + results.reservationRequired + '</p></strong></span>' +
		'<button class="btn btn-block orange white-text" value="' + location + '" id="navigation" onclick="showdirection()">Show Directions </button></div></div></div></div>';

   infowindow = new google.maps.InfoWindow({
      position: results.geometry.location,
      content: contentString
   });

   infowindow.open(map);
}

// -- Func calculateAndDisplayRoute -- //
function calculateAndDisplayRoute() {
   infowindow.close();

	directionsDisplay.setPanel(document.getElementById('right-panel'));

   document.getElementById('goback').style.display = 'block';

   var latitude = parseFloat(destination.split(',')[0].substring(0));
   var longitude = parseFloat(destination.split(',')[1].substring(0, 15));
   var des = {
      lat: latitude,
      lng: longitude
   };

   directionsDisplay.setMap(map);
   directionsService.route({
      origin: {
         lat: 50.774289,
         lng: 6.085889
      },
      destination: des,
      travelMode: google.maps.TravelMode[selectedMode],
      language: 'en'
   }, function (response, status) {
      if (status === 'OK') {
         directionsDisplay.setDirections(response);
      } else {
         window.alert('Directions request failed due to ' + status);
      }
	
   });

   var bottomPanel = document.getElementById("bottom-panel");

   if (bottomPanel.childElementCount === 0) {
      var printBtn = document.createElement("button");
      var printT = document.createTextNode("Print");

      printBtn.style.fontSize = '20px';
      printBtn.className = 'btn btn-large waves-effect waves-light orange white-text pulse';
      printBtn.id = 'print';

      printBtn.appendChild(printT);
      printBtn.onclick = function () {
	         printBtn.style.display = 'none';
         document.getElementById('goback').style.display = 'none';


         var thankInfo = document.createElement("div");
         var thankInfoI = document.createElement("img");

         thankInfoI.src = 'images/thanks.png';
         thankInfo.id = 'thankInfo';
         thankInfo.appendChild(thankInfoI);
         thankInfoI.style.width = '1005px';

         setTimeout("window.location.href='welcome.html'", 6000);

         var element = document.getElementById("floating-panel");
			
         element.appendChild(thankInfo);
      };

      bottomPanel.appendChild(printBtn);
   }
   document.getElementById('print').style.display = 'block';
}

// -- Func actionJourney -- //
function actionJourney(idJourney){
   	return document.getElementById(idJourney).addEventListener('click', function() {
		selectedMode = this.value;
	    directionsDisplay.setMap(null)
    	directionsDisplay.setDirections({routes: []});
 		directionsDisplay.setPanel(null);
      	calculateAndDisplayRoute();
   });
}
  // -- Func showdirection -- //
function showdirection() {

 	destination = document.getElementById("navigation").value;	
	
  	filterPanel.style.display = 'none';
   	select.style.display = 'block';
	directionsDisplay.setMap(null)
    directionsDisplay.setDirections({routes: []});
 	directionsDisplay.setPanel(null);
   	calculateAndDisplayRoute();
   	actionJourney('walking');
   	actionJourney('driving');
   	actionJourney('transit');


}

// -- Func check -- //
function check(idType, idImg){
   if (document.getElementById(idType).checked === true) {
      document.getElementById(idImg).style.border = '3px solid #ff8800';
      document.getElementById(idImg).style.borderRadius = '45px';
   } else {
      document.getElementById(idImg).style.border = '0px';
      document.getElementById(idImg).style.borderRadius = '0px';
   }
}

// -- Func check -- //
function checkType(inputIdCheck, imgIdCheck) { 
   check(inputIdCheck, imgIdCheck); 
}

// ---- Jquery Script ---- //
$(document).ready(function () {
   $("#selectMode.mybtn").on("click", function () {
      var className = "darken-4";

      if ($(this).hasClass(className)) {
         $(this).removeClass(className);
      } else
         $(this).addClass(className);
   });
});
