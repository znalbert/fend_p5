var Event = function(data) {
	this.title = ko.observable(data.title);
	this.venue = ko.observable(data.venue_name);
	this.url = ko.observable(data.url);
	this.venue_url = ko.observable(data.venue_url);
	this.venue_address = ko.observable(data.venue_address);
	this.city_name = ko.observable(data.city_name);
	this.state = ko.observable(data.region_name);
	this.lat = ko.observable(data.latitude);
	this.lng = ko.observable(data.longitude);
	// this.image = ko.observable(data.image.medium.url);
	this.category = ko.observable(data.categories.category[0].id);
}

var ViewModel = function() {
	var self = this;

	self.eventList = ko.observableArray([]);

	// var map;
	self.coords = {};

	self.map = function () {
		map = new google.maps.Map(document.getElementById('map'), {
			center: self.coords,
			zoom: 10,
			disableDefaultUI: true
		});
	}

	// function geocodeNewCity(geocoder, resultsMap) {
	// 	var city = $('#city').val();
	// 	geocoder.geocode({'address': city}, function(results, status) {
	// 		if (status === google.maps.GeocoderStatus.OK) {
	// 			resultsMap.setCenter(results[0].geometry.location);
	// 		} else {
	// 			alert('Geocode was not successful for the following reason: ' + status);
	// 		}
	// 	});
	// }

	self.getGeoLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				self.coords.lat = position.coords.latitude;
				self.coords.lng = position.coords.longitude;

				self.map();
				self.getEvents(1);
			})
		}
	}

	self.getLocationManually = function() {
		var gcApi = "https://maps.googleapis.com/maps/api/geocode/json?";
		var gcKey = "key=AIzaSyAZKV6_aryLoI5q40ikKRJ_Qy-32Hg-3ng&address=";
		var gcCity = $('#city').val();
		var geocodeUrl = gcApi + gcKey + gcCity;

		self.eventList([]);
		console.log(city);
		console.log(geocodeUrl);

		$.getJSON(geocodeUrl, function( data ) {
			pos = data.results[0].geometry.location;
			self.coords.lat = pos.lat;
			self.coords.lng = pos.lng;
			
			self.map();
			self.getEvents(1);
		});
	}

	self.getEvents = function(page_number) {
		// API for events is coming from eventful.com
		var efApi = "https://api.eventful.com/json/events/search?app_key=";
		var efKey = "VN3TDSXzQdSQK2rD";
		var efSort = "&date=Today&sort_order=popularity&within=20";
		var efInclude = "&include=categories,popularity";
		var efLocation = "&location=" + self.coords.lat + "," + self.coords.lng;
		var efPageNum = "&page_number=" + page_number;

		var efUrl = efApi + efKey + efSort + efInclude + efPageNum + efLocation;
		console.log(efUrl);
		$.ajax({
			url: efUrl,
			dataType: "jsonp",
			success: function( data ) {
				console.log(data);

				data.events.event.forEach(self.eventViews);
			}
		});
	}

	self.eventViews = function(eventObject, index, eventArray) {
		self.eventList.push( new Event(eventObject));
		console.log(self.eventList());
		// console.log(eventObject.venue_name + ", " + eventObject.title);
		
		var myLatlng = {
			lat: Number(eventObject.latitude),
			lng: Number(eventObject.longitude)
		}

		console.log(myLatlng);
		
		marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			animation: google.maps.Animation.DROP
		});
		
		marker.setMap(map);
	}

	// getGeoLocation();
	// $('#getCity').submit(getLocationManually);
	document.getElementById('submit-city').addEventListener('click', function() {
		self.getLocationManually();
	});

	self.getGeoLocation();
}

ko.applyBindings(new ViewModel());
