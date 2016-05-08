var Event = function(data) {
	this.title = ko.observable(data.title);
	this.venue = ko.observable(data.venue_name);
	this.url = ko.observable(data.url);
	this.venue_address = ko.observable(data.venue_address);
	this.city_name = ko.observable(data.city_name);
	this.state = ko.observable(data.region_name);
	this.lat = ko.observable(data.latitude);
	this.lng = ko.observable(data.longitude);
	this.category = ko.observable(data.categories.category[0].name);
}

var ViewModel = function() {
	var self = this;
	var infowindow;
	self.eventList = ko.observableArray([]);
	self.markerList = ko.observableArray([]);
	self.coords = {};
	self.bounds = new google.maps.LatLngBounds();
	self.pageNumber = ko.observable(1);
	self.filter = ko.observable('');
	self.pageCount = ko.observable('');
	self.prevBtn = ko.observable(false);
	self.nextBtn = ko.observable(true);
	self.showEventNav = ko.observable(false);
	self.needCoords = ko.observable(true);
	self.eventVis = ko.observable(true);
	self.windowSize = window.innerWidth;


	// Determine user coords with geolocation or manually.
	// Geolocation method
	self.getGeoLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				self.coords.lat = position.coords.latitude;
				self.coords.lng = position.coords.longitude;
				self.needCoords(false);

				self.map();
				self.getEvents(self.pageNumber());
			})
		}
	}

	// Manual method
	self.getLocationManually = function() {
		var gcApi = "https://maps.googleapis.com/maps/api/geocode/json?";
		var gcKey = "key=AIzaSyAZKV6_aryLoI5q40ikKRJ_Qy-32Hg-3ng&address=";
		var gcCity = $('#city').val();
		var geocodeUrl = gcApi + gcKey + gcCity;

		self.bounds = new google.maps.LatLngBounds();

		$.getJSON(geocodeUrl, function(data){
			pos = data.results[0].geometry.location;
			self.coords.lat = pos.lat;
			self.coords.lng = pos.lng;
			
			self.map();
			self.getEvents(self.pageNumber());;
		})
		.fail(function(){
			$("#error").css("display","block");
			$("#error").text("Something went wrong. " +
							"Please check your connection and try again.");
		});
	}


	self.map = function () {
		map = new google.maps.Map(document.getElementById('map'), {
			center: self.coords,
			zoom: 13,
			disableDefaultUI: true
		});
		infowindow = new google.maps.InfoWindow({
			content: null,
			maxWidth: 300
		})
	}

	// AJAX request to eventful.com's API
	self.getEvents = function(page_number) {
		var efApi = "https://api.eventful.com/json/events/search?app_key=";
		var efKey = "VN3TDSXzQdSQK2rD";
		var efSort = "&date=Today&sort_order=popularity&within=20";
		var efInclude = "&include=categories,popularity";
		var efLocation = "&location=" + self.coords.lat + "," + self.coords.lng;
		var efPageNum = "&page_number=" + page_number;

		var efUrl = efApi + efKey + efSort + efInclude + efPageNum + efLocation;
		$.ajax({
			url: efUrl,
			dataType: "jsonp",
			success: function( data ) {
				self.eventList([]);
				self.markerList([]);

				self.pageCount(data.page_count);
				if (self.pageCount() > 1) {
					self.showEventNav(true);
				}
				data.events.event.forEach(self.eventView);

				self.eventList().forEach(self.createMarker);
			}
		})
		.fail(function(){
			$("#error").css("display","block");
			$("#error").text("Something went wrong. " +
							"Unable to get data from Eventful.com. " +
							"Please try again later.");
		});
	}

	// Allows the user to reload the map with the next 10 events happening
	// in their area
	self.getNextEvents = function() {
		self.map();
		self.pageNumber(self.pageNumber() + 1);
		self.getEvents(self.pageNumber());
		self.prevBtn(true);
		if (self.pageNumber() == self.pageCount()){
			self.nextBtn(false);
		}
	}

	// Same as above, but goes back to the previous 10 events
	self.getPrevEvents = function() {
		self.map();
		self.pageNumber(self.pageNumber() - 1);
		self.getEvents(self.pageNumber());
		if (self.pageNumber == 1){
			self.prevBtn(false);
		}
	}


	// Creates new Event objects from the Event model, and updates the bounds
	// of the map
	self.eventView = function(eventObject, index, eventArray) {
		self.eventList.push( new Event(eventObject));

		var myLatlng = {
			lat: Number(eventObject.latitude),
			lng: Number(eventObject.longitude)
		}
		var boundsLatLng = new google.maps.LatLng(myLatlng);

		self.bounds.extend(boundsLatLng);
		map.fitBounds(self.bounds);
	}


	// Creates the markers for the events
	self.createMarker = function(event, index, events) {
		var pos = new google.maps.LatLng(
			event.lat(),
			event.lng()
		);

		var title = event.title() + "<br><span class='venue'>" +
				event.venue() + "</span>"

		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: title,
			animation: google.maps.Animation.DROP

		});

		var content = event.title() + "<br><span class='category'>" +
				event.category() + "</span><br>" +
				event.venue_address() + "<br>" +
				event.city_name() + "<br>" +
				event.state() + "<br>" +
				"<a href=" + event.url() + ">More info</a>"


		google.maps.event.addListener(marker, 'click', function() {
			var thisMarker = this;
			infowindow.setContent(content);

			infowindow.open(map, thisMarker);
			map.panTo(thisMarker.position);
		});

		google.maps.event.addListener(infowindow, 'closeclick', function() {
			map.panTo(self.bounds.getCenter());
			map.fitBounds(self.bounds);
		})

		self.markerList.push(marker);
		marker.setMap(map);
	}


	// Centers the map over a marker that has been clicked from the list or
	// the marker itself.
	self.moveToMarker = function() {
		google.maps.event.trigger(this, 'click')
	};


	// Filtering functions to only see items pertinent to what the user types
	self.filteredEvents = ko.computed(function() {
		return ko.utils.arrayFilter(self.markerList(), function(marker) {
			return marker.title.toLowerCase().indexOf(
				self.filter().toLowerCase()) !== -1;
		});
	}, self);


	self.filteredEvents.subscribe(function() {
		var filtered = ko.utils.compareArrays(
			self.markerList(), self.filteredEvents());
		ko.utils.arrayForEach(filtered, function(marker) {
			if (marker.status === 'deleted') {
				marker.value.setMap(null);
			} else {
				marker.value.setMap(map);
			}
		});
	});

	
	// Shows or hides the input box to change the user location
	self.changeCity = function() {
		if (self.needCoords()){
			self.needCoords(false);
		} else if (self.coords !== {}) {
			self.needCoords(true);
		}
	}


	// Shows or hides the event list.
	self.openCloseEvents = function() {
		if (self.eventVis()){
			self.eventVis(false);
		} else {
			self.eventVis(true);
		}
	}


	// Checks for small screen size and auto-hides the event list.
	self.checkMobile = function(){
		if (self.windowSize < 600) {
			self.eventVis(false);
		}
	}();


	self.getGeoLocation();
}

ko.applyBindings(new ViewModel());
