$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCFrRhxyJYPCB01qMXi3zyNTXERl0ArxsQ", function(){
	$.getScript("js/app.js")
})
.fail(function(){
	$("#error").css("display","block");
	$("#error").text("Unable to reach Google Maps. Please try again later.");
});
