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

	// Determine user coords with geolocation or manually.
	// Geolocation method
	self.getGeoLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				self.coords.lat = position.coords.latitude;
				self.coords.lng = position.coords.longitude;

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
		// self.eventList([]);
		// self.markerList([]);

		$.getJSON(geocodeUrl, function( data ) {
			pos = data.results[0].geometry.location;
			self.coords.lat = pos.lat;
			self.coords.lng = pos.lng;
			
			self.map();
			self.getEvents(self.pageNumber());
		});
	}


	self.map = function () {
		map = new google.maps.Map(document.getElementById('map'), {
			center: self.coords,
			zoom: 13,
			disableDefaultUI: true
		});
		infowindow = new google.maps.InfoWindow({
			content: null
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
		console.log(efUrl);
		$.ajax({
			url: efUrl,
			dataType: "jsonp",
			success: function( data ) {
				self.eventList([]);
				self.markerList([]);
				console.log(data);
				// self.filteredEvents([]);
				self.pageCount(data.page_count);
				if (self.pageCount() > 1) {
					self.showEventNav(true);
				}
				console.log(self.pageCount());
				console.log(self.showEventNav());
				data.events.event.forEach(self.eventView);

				// console.log(self.eventList());
				self.eventList().forEach(self.createMarker);
			}
			
		});
	}

	self.getNextEvents = function() {
		// self.markerList([]);
		self.map();
		self.pageNumber(self.pageNumber() + 1);
		self.getEvents(self.pageNumber());
		self.prevBtn(true);
		if (self.pageNumber() == self.pageCount()){
			self.nextBtn(false);
		}
	}

	self.getPrevEvents = function() {
		// self.markerList([]);
		self.map();
		self.pageNumber(self.pageNumber() - 1);
		self.getEvents(self.pageNumber());
		if (self.pageNumber == 1){
			self.prevBtn(false);
		}
	}


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

	self.createMarker = function(event, index, events) {
		var pos = new google.maps.LatLng(
			event.lat(),
			event.lng()
		);

		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: event.venue(),
			animation: google.maps.Animation.DROP
		});

		google.maps.event.addListener(marker, 'click', function() {
			var thisMarker = this;
			console.log(self.filteredEvents());
			infowindow.setContent(
				event.title() + "<br>" + 
				event.category() + "<br>" +
				"<a href=" + event.url() + ">Link</a>"
			);

			infowindow.open(map, thisMarker);
			map.panTo(thisMarker.position);
		});

		google.maps.event.addListener(infowindow, 'closeclick', function() {
			map.panTo(self.bounds.getCenter());
			map.fitBounds(self.bounds);
		})

		self.markerList.push(marker);
	}


	self.moveToMarker = function() {
		google.maps.event.trigger(this, 'click')
	};


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

	self.getGeoLocation();
}

ko.applyBindings(new ViewModel());
