define(function(require) {
	
	var mode='local';
	
	if(mode==='dev'){
		return {
			API_URL : "https://fem-dev.appspot.com/",
			FB_APP_ID : '605170889512500', 
			GOOGLE_CLIENT_ID : '675356629669.apps.googleusercontent.com',
			GOOGLE_API_KEY : 'AIzaSyCxvFWYp8uk3RxCSEaVEo_FLYeqQVUelpg',
			GOOGLE_API_SCOPE : 'https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds'
			
		};
	} else if(mode==='local'){
		return {
			API_URL : "",
			FB_APP_ID : '476625022390528',
			GOOGLE_CLIENT_ID : '675356629669.apps.googleusercontent.com',
			GOOGLE_API_KEY : 'AIzaSyCxvFWYp8uk3RxCSEaVEo_FLYeqQVUelpg',
			GOOGLE_API_SCOPE : 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds',
			//GOOGLE_API_SCOPE : 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds',
			//https://www.googleapis.com/auth/userinfo.profile
			
		};
	}
});
