function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:coords,zoom:13,disableDefaultUI:!0}),$("#submit-city").attr("id","submit-newCity");var o=new google.maps.Geocoder;document.getElementById("submit-newCity").addEventListener("click",function(){geocodeNewCity(o,map)})}function geocodeNewCity(o,e){var t=$("#city").val();o.geocode({address:t},function(o,t){t===google.maps.GeocoderStatus.OK?e.setCenter(o[0].geometry.location):alert("Geocode was not successful for the following reason: "+t)})}function getGeoLocation(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(o){coords.lat=o.coords.latitude,coords.lng=o.coords.longitude,initMap(),getEvents()})}function getLocationManually(){var o="https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAZKV6_aryLoI5q40ikKRJ_Qy-32Hg-3ng&address=",e=$("#city").val(),t=o+e;console.log(e),console.log(t),$.getJSON(t,function(o){pos=o.results[0].geometry.location,coords.lat=pos.lat,coords.lng=pos.lng,initMap(),getEvents()})}function getEvents(){var o="http://api.eventful.com/json/events/search?app_key=",e="VN3TDSXzQdSQK2rD",t="&date=Today&sort_order=popularity&within=25",n="&include=categories,subcategories,popularity",a="&location="+coords.lat+","+coords.lng,c=o+e+t+n+a;console.log(coords.lat),console.log(c),$.ajax({url:c,dataType:"jsonp",success:function(o){console.log(o)}})}var map,coords={};getGeoLocation(),document.getElementById("submit-city").addEventListener("click",function(){getLocationManually()});