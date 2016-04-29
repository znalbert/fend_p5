var map;
var coords = {};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: coords,
		zoom: 13,
		disableDefaultUI: true
	});

	$('#submit-city').attr("id", "submit-newCity");

	var geocoder = new google.maps.Geocoder();

	document.getElementById('submit-newCity').addEventListener('click', function() {
	  geocodeNewCity(geocoder, map);
	});
}

function geocodeNewCity(geocoder, resultsMap) {
	var city = $('#city').val();
	geocoder.geocode({'address': city}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
			coords.lat = position.coords.latitude;
			coords.lng = position.coords.longitude;

			initMap();
			getEvents();
		})
	}
}

function getLocationManually() {
	var geocodeApi = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAZKV6_aryLoI5q40ikKRJ_Qy-32Hg-3ng&address=";
	var city = $('#city').val();
	var geocodeUrl = geocodeApi + city;

	console.log(city);
	console.log(geocodeUrl);

	$.getJSON(geocodeUrl, function( data ) {
		pos = data.results[0].geometry.location;
		coords.lat = pos.lat;
		coords.lng = pos.lng;
		
		initMap();
		getEvents();
	});
}

function getEvents() {
	// API for events is coming from eventful.com
	var efApi = "http://api.eventful.com/json/events/search?app_key=";
	var efKey = "VN3TDSXzQdSQK2rD";
	var efSort = "&date=Today&sort_order=popularity&within=25";
	var efInclude = "&include=categories,subcategories,popularity";
	var efLocation = "&location=" + coords.lat + "," + coords.lng;

	var efUrl = efApi + efKey + efSort + efInclude + efLocation;
	
	$.ajax({
		url: efUrl,
		dataType: "jsonp",
		success: function( data ) {
			console.log(data);
		}
	});
}

getGeoLocation();
// $('#getCity').submit(getLocationManually);
document.getElementById('submit-city').addEventListener('click', function() {
	getLocationManually();
});

