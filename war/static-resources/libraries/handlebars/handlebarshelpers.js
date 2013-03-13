
define(function(require) {
	"use strict";
	
		//var Handlebars = require('handlebarshelpers');
		
		Handlebars.registerHelper("ifNotEqualsCondition", function(counter) {
			if(counter=='Hotel'){
				return false;
			}else{
				return true;
			}
		});
	
		Handlebars.registerHelper("extraChargeHelper", function(fare) {
			return 0.02*fare;
		});
		
		Handlebars.registerHelper("isMulti", function(journeyType) {
			return journeyType=='multiCity'?'block':'none';
		});

		Handlebars.registerHelper("isNonMulti", function(journeyType) {
			return journeyType=='multiCity'?'none':'block';
		});
		
		Handlebars.registerHelper("addExtraChargesHelper", function(fare) {
			return 0.02*fare + fare;
		});
	
		Handlebars.registerHelper("formatairTime", function(time) {
			return time.substr(11,14);
		});
		
		Handlebars.registerHelper("valueHelper", function(value) {
			var newValue;
			if(value=="" || value==undefined || value==null){
				newValue=0;
			}
			else{
				newValue=value;
			}
			return newValue;
		});
	
		Handlebars.registerHelper("formatreviewBookingcityname", function(cityname) {
			if(cityname.length > 6){
				return cityname.substring(0,6)+'.';
			}else{
				return cityname;
			}
		});
	
		Handlebars.registerHelper("formatDuration", function(duration) {
			var value = parseInt(duration,10)==0?"00":parseInt(duration,10);
			var hours = parseInt(duration/60,10)<10?"0"+parseInt(duration/60,10):parseInt(duration/60,10); 
			var minutes = duration%60<10?"0"+duration%60:duration%60; 
			return hours + ":" + minutes;
		});
		
		Handlebars.registerHelper("formatDate", function(arrivalDate) {
			//var newArrivalDate = arrivalDate.substr(0,4)+'/'+ arrivalDate.substr(4,2) +'/'+arrivalDate.substr(6,4);   
			var newArrivalDate = (arrivalDate.substr(0,10)).replace(/\-/g,'/');//arrivalDate.substr(0,4)+'/'+ arrivalDate.substr(4,2) +'/'+arrivalDate.substr(6,4);   
			var finalDate = new Date(newArrivalDate).toString().substr(0,15);
			return finalDate.substr(0,3) +', ' + finalDate.substr(8,3) +' ' + finalDate.substr(4,4) +' ' + finalDate.substr(10,11);
		});
		
		Handlebars.registerHelper("resolveAirlineImagePath", function(path) {
			return require.toUrl('modules/air/airdecidepagehandler/images/airlinelogoimages/'+path+'.gif');
		});
		
		Handlebars.registerHelper("resolveImagePath", function(path) {
			return require.toUrl(path);
		});
		
		Handlebars.registerHelper("formatDepartureDate", function(legsList) {
			var departureDate = legsList[0].departureDate;
			var newDepartureDate = departureDate.substr(0,4)+'/'+ departureDate.substr(4,2) +'/'+departureDate.substr(6,4);   
			var finalDate = new Date(newDepartureDate).toString().substr(0,15);
			return finalDate.substr(0,3) +',&nbsp;' + finalDate.substr(8,3) +' ' + finalDate.substr(4,4) +' ' + finalDate.substr(10,11);
		});
		
		Handlebars.registerHelper("formatArriveDate", function(legsList) {
			var arrivalDate = legsList[(legsList.length-1)].arrivalDate;
			var newArrivalDate = arrivalDate.substr(0,4)+'/'+ arrivalDate.substr(4,2) +'/'+arrivalDate.substr(6,4);   
			var finalDate = new Date(newArrivalDate).toString().substr(0,15);
			return finalDate.substr(0,3) +',&nbsp;' + finalDate.substr(8,3) +' ' + finalDate.substr(4,4) +' ' + finalDate.substr(10,11);
		});
		
		Handlebars.registerHelper("getFromCity", function(legsList) {
			  return legsList[0].fromIataModel.cityName;
		});
		
		Handlebars.registerHelper("getToCity", function(legsList) {
			  return legsList[(legsList.length - 1)].toIataModel.cityName;
		});
		
		Handlebars.registerHelper("formatDepTime", function(legsList) {
			return legsList[0].departureTime.substr(0,2) +':'+legsList[0].departureTime.substr(2,4);
		});
		
		Handlebars.registerHelper("formatArrTime", function(legsList) {
			return legsList[(legsList.length - 1)].arrivalTime.substr(0,2) +':'+legsList[(legsList.length - 1)].arrivalTime.substr(2,4);
		});
		
		Handlebars.registerHelper("getFromAirPortName", function(legsList) {
			return legsList[0].fromIataModel.airportName;
		});
		
		Handlebars.registerHelper("getToAirPortName", function(legsList) {
			return legsList[legsList.length-1].toIataModel.airportName;
		});
		
		Handlebars.registerHelper("paxTypeHelper", function(pax) {
			return pax.attributes.paxtype;
		});
		
		Handlebars.registerHelper("ageHelper", function(pax) {
			return pax.attributes.age;
		});
		
		Handlebars.registerHelper("nameHelper", function(pax) {
			return pax.attributes.title+". "+pax.attributes.firstname+" "+pax.attributes.lastname;
		});
		
		Handlebars.registerHelper("passNoHelper", function(pax) {
			return pax.attributes.passno;
		});
		
		Handlebars.registerHelper("licenceNoHelper", function(pax) {
			return pax.attributes.dlicence;
		});
		
		Handlebars.registerHelper("genderHelper", function(pax) {
			var title = pax.attributes.title;
			if(title=="Mr"||title=="Master"){
				gender = "Male";
			}else if (title=="Mrs"||title=="Miss"){
				gender = "Female"
			}
			return gender;
		});
		
		Handlebars.registerHelper("dateHelper", function(pax) {
			return pax.attributes.dob;
		});
		
		Handlebars.registerHelper("countryHelper", function(pax) {
			return pax.attributes.country;
		});
		
		Handlebars.registerHelper("getTotalPax", function(PaxFareInfo) {
			var noOfPax=0;
			for ( var iCounter = 0; iCounter < PaxFareInfo.length; iCounter++) {
				noOfPax = noOfPax + PaxFareInfo[iCounter].passTypQty.quantity;
			}
			if(noOfPax==1){
				return noOfPax + ' Person';
			}else{
				return noOfPax + ' Persons';
			}
		});
		
		Handlebars.registerHelper("formatHotelName", function(hotelName) {
			if(hotelName.length > 35){
				return hotelName.substring(0,35)+'..';
			}else{
				return hotelName;
			}
		});
		
		Handlebars.registerHelper("formatDescription", function(description) {
			if(""===description){
				return 'No Information';
			}else{
				return description;
			}
		});

		Handlebars.registerHelper("formatFacilities", function(amenity) {
			var facilities='';
			if(typeof(amenity) != 'undefined' && amenity.length>0){
				for(var iAmenityCounter=0; iAmenityCounter < amenity.length; iAmenityCounter++){
					facilities = facilities + ''+amenity[iAmenityCounter].amenityName.replace(/\*/g,"<li>");
				}
				if(''===facilities){
					return 'No Information';
				}else{
					return new Handlebars.SafeString('<ul>'+facilities+'</ul>');
				}
			}
			return 'No Information';
		});

		Handlebars.registerHelper("formatPrice", function(totalPrice) {
			return ''+totalPrice.toFixed(2);
		});

		Handlebars.registerHelper("formatPreNightPrice", function(totalPrice) {
			return ''+(totalPrice/2).toFixed(2);
		});
		
		Handlebars.registerHelper("paxTypeHelper", function(pax) {
			return pax.attributes.paxtype;
		});
		
		Handlebars.registerHelper("dateHelper", function(pax) {
			return pax.attributes.dob;
		});
		
		Handlebars.registerHelper("formatCity", function(city) {
			  return city.substr(0,6);
		});
		
		Handlebars.registerHelper("formatStars", function(stars) {
			
			if(stars > 0){
				var starString='';
				for(var iStarCounter=1 ; iStarCounter <= stars;iStarCounter++){
					starString = starString + "<img src='/public/resources/modules/hotel/hotelpagehandler/css/images/ibe_hotel_star_rating_icon.png'>";
				}
				return new Handlebars.SafeString('<span>'+starString+'</span>');
			}else{
				return 'No Ratings';
			}
		});
		
		Handlebars.registerHelper("SearchResultFormatHotelName", function(hotelName) {
			if(hotelName.length > 20){
				return hotelName.substring(0,20)+'..';
			}else{
				return hotelName;
			}
		});
		
		Handlebars.registerHelper("SearchResultFormatAirlineName", function(AirlineName) {
			if(AirlineName.length > 15){
				return AirlineName.substring(0,15)+'..';
			}else{
				return AirlineName;
			}
		});
	
		Handlebars.registerHelper("recentSearchDateFormat", function (ItineraryDetails) {
			var onwordDepartureDate = new Date(ItineraryDetails.onwardDepartureDate);
			var ordinals = {1:'st', 21:'st', 31:'st', 2:'nd', 22:'nd', 3:'rd', 23:'rd'};  
			if(ItineraryDetails.journeyType === 'roundTrip')
			{
				var departureDate = new Date(ItineraryDetails.returnDepartureDate);
				var month = departureDate.getMonthName();
				var day = departureDate.getDate();
				var departureDate =day +'<sup>'+(ordinals[day] || 'th')+'</sup>'+ '&nbsp' + month + ', ' + departureDate.getFullYear() ;
			}
			var month = onwordDepartureDate.getMonthName();
			var day = onwordDepartureDate.getDate();
			var onwordDepartureDate = day +'<sup>'+(ordinals[day] || 'th')+'</sup>'+ '&nbsp' + month + ', ' + onwordDepartureDate.getFullYear() ;
			//console.log("18th Aug, 2012");
			if(departureDate)
			{
				var requiredDate = onwordDepartureDate + " &#8211; " + departureDate;
			}
			else
			{
				var requiredDate = onwordDepartureDate;
			}
			return requiredDate;
		});

		Handlebars.registerHelper("hotelRecentSearchDateFormat", function (inputdate) {
			var requiredDate = new Date(inputdate);
			var ordinals = {1:'st', 21:'st', 31:'st', 2:'nd', 22:'nd', 3:'rd', 23:'rd'};  
			var month = requiredDate.getMonthName();
			var day = requiredDate.getDate();
			var requiredDate = day +'<sup>'+(ordinals[day] || 'th') + '</sup>'+' ' +month + ', ' + requiredDate.getFullYear() ;
			//console.log("18th September, 2012");
			return requiredDate;
		});

		Handlebars.registerHelper("recentSearchArrowFormat", function (ItineraryDetails) {
			if(ItineraryDetails.journeyType === 'roundTrip')
			{
				return '&#8596';
			}
			else
			{
				return '&#8594';
			}
		});
		
		Handlebars.registerHelper('productTypeHelper',function(searchParams){
			var productType=searchParams.productType;
			var templateText = '';
			if(searchParams.searchParamsArray instanceof Array){
				var fromToArray = searchParams.searchParamsArray;
				templateText = templateText+"<div class='tk-myriad-pro row-fluid' style='padding-bottom: 1%;'>We are looking for flights for a Multi City Journey</div>";
				for(var iCounter = 0;iCounter<fromToArray.length;iCounter++){
					var sectorText="";
					var fromIATA = fromToArray[iCounter]['itineraryDetails']['onwardOriginCity'];
					var toIATA = fromToArray[iCounter]['itineraryDetails']['onwardDestinationCity'];
					sectorText=sectorText+"<div class='sector row-fluid' style='padding-top:1%;padding-bottom: 1%;'><span>Route "+(iCounter+1)+" : </span><span class='fromIATA interstitalpage_ItineraryDetails_fromIATA'>"+fromIATA+"</span> to <span class='toIATA interstitalpage_ItineraryDetails_toIATA'>"+toIATA+"</span></div>";
					templateText=templateText+sectorText;
				}
			}else if(productType === 'Air'){
				var fromIATA = searchParams['itineraryDetails']['onwardOriginCity'];
				var toIATA = searchParams['itineraryDetails']['onwardDestinationCity'];
				templateText = templateText+"<span class='tk-myriad-pro'>We are looking for flights from <span class='fromIATA interstitalpage_ItineraryDetails_fromIATA'>"+fromIATA+"</span> to <span class='toIATA interstitalpage_ItineraryDetails_toIATA'>"+toIATA+"</span></span>";
			}
			else if(productType === 'Hotel'){
				var hotelLocation = searchParams.availRqSeg.availRqSeg.htlSrchCritria.Critria.add.ctName;
				templateText = templateText+"<span class='tk-myriad-pro'>We are looking for hotels in <span class='fromIATA interstitalpage_ItineraryDetails_toIATA'>"+hotelLocation+"</span></span>";
			}
			else if (productType === 'Transfer'){
				var fromIATA = searchParams['availRQ']['vehRentalCore']['pikUpLoc'][0]['pickupLocation'];
				var toIATA = searchParams['availRQ']['vehRentalCore']['returnLocation'][0]['dropOffLocation'];
				templateText = templateText+"<div class='tk-myriad-pro row-fluid'>We are looking for car transfers </div>";
				var sectorText="<div class='row-fluid sector' style='padding-top:1%;padding-bottom: 1%;'><span>from </span><span class='fromIATA interstitalpage_ItineraryDetails_fromIATA'>"+fromIATA+"</span> to <span class='toIATA interstitalpage_ItineraryDetails_toIATA'>"+toIATA+"</span></div>";
				templateText=templateText+sectorText;
			}
			else if(searchParams==='Booking in Process'){
				templateText = templateText+"<span class='tk-myriad-pro'>Booking in Process</span>";
			}
			
			return new Handlebars.SafeString(templateText);
		});
		
		Handlebars.registerHelper('selectOptionGenerator',function(paxType){
			var optionsText = '';
			if('Adult'===paxType){
				optionsText=optionsText+'<option>Mr</option><option>Miss</option><option>Mrs</option>';
			}
			else if('Child'===paxType){
				optionsText=optionsText+'<option>Master</option><option>Miss</option>';
			}
			else if('Infant'===paxType){
				optionsText=optionsText+'<option>Infant</option>';
			}
			return new Handlebars.SafeString(optionsText);
		});
		
		Handlebars.registerHelper("checkUpcoming", function (date) {
			var newArrivalDate = date.substr(0,4)+'/'+ date.substr(5,2) +'/'+date.substr(8,2);
			var dateToCompare = new Date(newArrivalDate);
			var today = new Date();
			if(dateToCompare >= today){
				return "upcoming";
			}
			else{
				return 'past';
			}
		});
		
			
		Handlebars.registerHelper("isUpcoming", function (date, isCancelled) {
			console.log(isCancelled,"----------");
			var newArrivalDate = date.substr(0,4)+'/'+ date.substr(5,2) +'/'+date.substr(8,2);
			var dateToCompare = new Date(newArrivalDate);
			var today = new Date();
			if(dateToCompare >= today && isCancelled!=='CANCELLED' && isCancelled!=='c'){
				return '<div class="row-fluid upcomingTrips tk-myriad-pro" style="position: absolute;">Upcoming!</div>';
			}
			else if(isCancelled==='CANCELLED' || isCancelled === 'c'){
				return '<div class="row-fluid cancelledTrips tk-myriad-pro" style="position: absolute;">Cancelled!</div>';
			}else{
				return '';
			}
		});
				
			Handlebars.registerHelper("formatBackHotelName", function(hotelName) {
			if(hotelName.length > 22){
				return hotelName.substring(0,22)+'..';
			}else{
				return hotelName;
			}
		});
		
		Handlebars.registerHelper("formatCityName", function(cityName) {
			if(cityName.length > 8){
				return cityName.substring(0,8)+'..';
			}else{
				return cityName;
			}
		});
		
		Handlebars.registerHelper("formatPhotoViewHotelName", function(hotelName) {
			if(hotelName.length > 6){
				return hotelName.substring(0,6)+'..';
			}else{
				return hotelName;
			}
		});
		
		Handlebars.registerHelper("UpcomingBgColor", function (date) {
			var newArrivalDate = date.substr(0,4)+'/'+ date.substr(5,2) +'/'+date.substr(8,2);
			var dateToCompare = new Date(newArrivalDate);
			var today = new Date();
			if(dateToCompare >= today){
				return "white";
			}
			else{
				return '#e7eaed';
			}
		});
		
		
		Handlebars.registerHelper("myTripsFormatString", function(string) {
			if(string.length > 7){
				return string.substring(0,7)+'..';
			}else{
				return string;
			}
		});
		
		Handlebars.registerHelper("getArrivalDepartureTime", function(string) {
			var time = string.substr(11,5);
			return time;
		});
		
		Handlebars.registerHelper("commissionHelper",function(commissionArray){
			var commission=0;
			for(var iCounter=0;iCounter<commissionArray.length;iCounter++){
				commission+=parseInt(commissionArray[iCounter]["commission"]["flatCommission"]["amount"]);
			}
			return commission;
		});
		
		Handlebars.registerHelper("ifequals",function(item1, item2){
			if(item1===item2){
				return true;
			}else {
				return false;
			}
		});
		
		return Handlebars;
});
