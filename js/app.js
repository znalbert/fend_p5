var Event=function(e){this.title=ko.observable(e.title),this.venue=ko.observable(e.venue_name),this.url=ko.observable(e.url),this.venue_address=ko.observable(e.venue_address),this.city_name=ko.observable(e.city_name),this.state=ko.observable(e.region_name),this.lat=ko.observable(e.latitude),this.lng=ko.observable(e.longitude),this.category=ko.observable(e.categories.category[0].name)},ViewModel=function(){var e,o=this;o.eventList=ko.observableArray([]),o.markerList=ko.observableArray([]),o.coords={},o.bounds=new google.maps.LatLngBounds,o.pageNumber=ko.observable(1),o.filter=ko.observable(""),o.pageCount=ko.observable(""),o.prevBtn=ko.observable(!1),o.nextBtn=ko.observable(!0),o.showEventNav=ko.observable(!1),o.needCoords=ko.observable(!0),o.eventVis=ko.observable(!0),o.windowSize=window.innerWidth,o.getGeoLocation=function(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(e){o.coords.lat=e.coords.latitude,o.coords.lng=e.coords.longitude,o.needCoords(!1),o.map(),o.getEvents(o.pageNumber())})},o.getLocationManually=function(){var e="https://maps.googleapis.com/maps/api/geocode/json?",t="key=AIzaSyAZKV6_aryLoI5q40ikKRJ_Qy-32Hg-3ng&address=",n=$("#city").val(),a=e+t+n;o.bounds=new google.maps.LatLngBounds,$.getJSON(a,function(e){pos=e.results[0].geometry.location,o.coords.lat=pos.lat,o.coords.lng=pos.lng,o.map(),o.getEvents(o.pageNumber())}).fail(function(){$("#error").css("display","block"),$("#error").text("Something went wrong. Please check your connection and try again.")})},o.map=function(){map=new google.maps.Map(document.getElementById("map"),{center:o.coords,zoom:13,disableDefaultUI:!0}),e=new google.maps.InfoWindow({content:null,maxWidth:300})},o.getEvents=function(e){var t="https://api.eventful.com/json/events/search?app_key=",n="VN3TDSXzQdSQK2rD",a="&date=Today&sort_order=popularity&within=20",r="&include=categories,popularity",s="&location="+o.coords.lat+","+o.coords.lng,i="&page_number="+e,l=t+n+a+r+i+s;$.ajax({url:l,dataType:"jsonp",success:function(e){o.eventList([]),o.markerList([]),o.pageCount(e.page_count),o.pageCount()>1&&o.showEventNav(!0),e.events.event.forEach(o.eventView),o.eventList().forEach(o.createMarker)}}).fail(function(){$("#error").css("display","block"),$("#error").text("Something went wrong. Unable to get data from Eventful.com. Please try again later.")})},o.getNextEvents=function(){o.map(),o.pageNumber(o.pageNumber()+1),o.getEvents(o.pageNumber()),o.prevBtn(!0),o.pageNumber()==o.pageCount()&&o.nextBtn(!1)},o.getPrevEvents=function(){o.map(),o.pageNumber(o.pageNumber()-1),o.getEvents(o.pageNumber()),1==o.pageNumber&&o.prevBtn(!1)},o.eventView=function(e,t,n){o.eventList.push(new Event(e));var a={lat:Number(e.latitude),lng:Number(e.longitude)},r=new google.maps.LatLng(a);o.bounds.extend(r),map.fitBounds(o.bounds)},o.createMarker=function(t,n,a){var r=new google.maps.LatLng(t.lat(),t.lng()),s=t.title()+"<br><span class='venue'>"+t.venue()+"</span>",i=new google.maps.Marker({position:r,map:map,title:s,animation:google.maps.Animation.DROP}),l=t.title()+"<br><span class='category'>"+t.category()+"</span><br>"+t.venue_address()+"<br>"+t.city_name()+"<br>"+t.state()+"<br><a href="+t.url()+">More info</a>";google.maps.event.addListener(i,"click",function(){var o=this;e.setContent(l),e.open(map,o),map.panTo(o.position)}),google.maps.event.addListener(e,"closeclick",function(){map.panTo(o.bounds.getCenter()),map.fitBounds(o.bounds)}),o.markerList.push(i),i.setMap(map)},o.moveToMarker=function(){google.maps.event.trigger(this,"click"),o.windowSize<650&&o.eventVis(!1)},o.filteredEvents=ko.computed(function(){return ko.utils.arrayFilter(o.markerList(),function(e){return-1!==e.title.toLowerCase().indexOf(o.filter().toLowerCase())})},o),o.filteredEvents.subscribe(function(){var e=ko.utils.compareArrays(o.markerList(),o.filteredEvents());ko.utils.arrayForEach(e,function(e){"deleted"===e.status?e.value.setMap(null):e.value.setMap(map)})}),o.changeCity=function(){o.needCoords()?o.needCoords(!1):o.coords!=={}&&o.needCoords(!0)},o.openCloseEvents=function(){o.eventVis()?o.eventVis(!1):o.eventVis(!0)},o.checkMobile=function(){o.windowSize<650&&o.eventVis(!1)}(),o.getGeoLocation()};ko.applyBindings(new ViewModel);