(function() {
  'use strict';

  let _registrationObj;
  const _cwsRenderObj = new cwsRender();
  //const _testSection = new testSection();

  window.onload = function() {
    // Create a class that represent the object..
    ConnManager._cwsRenderObj = _cwsRenderObj;
    _cwsRenderObj.render();
    //_testSection.initSetUp();

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);  
    
    // Set App Connection Mode
    ConnManager.setAppConnMode_Initial();
    ConnManager.setUp_AppConnModeDetection();
  
  }

  // ----------------------------------------------------

  $( '#spanVersion' ).text( 'v' + _ver );
  
  $( '.reget' ).click( () => {

    if ( ConnManager.isOffline() )
    {
      alert( 'Only re-register service-worker while online, please.' );
    }
    else
    {
      if ( _registrationObj !== undefined )
      {
        _registrationObj.unregister().then(function(boolean) {
          //console.log('Service Worker UnRegistered');
          // if boolean = true, unregister is successful
          location.reload(true);
        });
      }  
    }

  });

  function updateOnlineStatus( event ) {

    ConnManager.network_Online = navigator.onLine;
    connStatTagUpdate( ConnManager.network_Online );
  };


  function connStatTagUpdate( bOnline ) {

    var imgSrc = ( bOnline ) ? 'images/online.jpg': 'images/offline.jpg';

    $( '#imgNetworkStatus' ).attr( 'src', imgSrc );

    //console.log( '=== Network Online: ' + bOnline );
  };

  // ----------------------------------------------------

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js?v1')
      .then(function( registration ) 
      { 
        _registrationObj = registration;
        console.log('Service Worker Registered'); 
      });
  };
})();
