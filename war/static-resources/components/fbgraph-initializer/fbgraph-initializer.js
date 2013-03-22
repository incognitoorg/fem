define(function(require) {
    // init the FB JS SDK
    FB.init({
      appId      : '175993142548800', // App ID from the App Dashboard
      channelUrl : 'http://testfriendselector.appspot.com/', // Channel File for x-domain communication
      status     : true, // check the login status upon init?
      cookie     : true, // set sessions cookies to allow your server to access the session?
      xfbml      : true  // parse XFBML tags on this page?
    });
});