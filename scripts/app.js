(function() {
  'use strict';

  let _registrationObj;
  const _cwsRenderObj = new cwsRender();
  const _testSection = new testSection();

  window.onload = function() {
    // Create a class that represent the object..
    FormUtil._cwsRenderObj = _cwsRenderObj;
    _cwsRenderObj.performRun();
    _testSection.initSetUp();

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);  
    
    // Set App Connection Mode
    FormUtil.setAppConnMode_Initial();
    FormUtil.setUp_AppConnModeDetection();
  
  }

  // ----------------------------------------------------

//  $( '#swRefresh' ).click( () => {
  $( '.reget' ).click( () => {
    if ( _registrationObj !== undefined )
    {
      _registrationObj.unregister().then(function(boolean) {
        console.log('Service Worker UnRegistered');
        // if boolean = true, unregister is successful
        location.reload(true);
      });
    }
  });

  
  function updateOnlineStatus(event) {
    FormUtil.network_Online = navigator.onLine;
    connStatTagUpdate( FormUtil.network_Online );
  }


  function connStatTagUpdate( bOnline ) {

    var imgSrc = ( bOnline ) ? 'images/online.jpg': 'images/offline.jpg';

    $( '#imgNetworkStatus' ).attr( 'src', imgSrc );

    console.log( '=== Network Online: ' + bOnline );
  }

  // ----------------------------------------------------

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function( registration ) 
      { 
        _registrationObj = registration;
        console.log('Service Worker Registered'); 
      });
  }
})();
