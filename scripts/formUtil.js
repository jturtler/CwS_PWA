// -------------------------------------------
// -- FormUtil Class/Methods

function FormUtil() {}

FormUtil.network_Online = true; // current network status.. false if offline.  //  'online';
FormUtil.appConnMode_Online = true; // app mode: Online / Offline 

FormUtil.currIntv_Online = true;
FormUtil.prevIntv_Online = true;
FormUtil.IntvCountBuildUp = 0;
FormUtil.IntvCountCheckPoint = 5;
FormUtil.IntvTime = 500;	// milliseconds - each is .5 sec..
FormUtil._cwsRenderObj;

FormUtil.staticWSName = 'eRefWSDev3';			// Need to be dynamically retrieved

// -------------------------

FormUtil.isOffline = function() {
	//var connStat = $( '#connectionStatus').attr( 'connstat' );
	return !FormUtil.network_Online; // ( connStat !== 'online' );
};

FormUtil.isOnline = function() {
	return FormUtil.network_Online;
}

FormUtil.connStatusStr = function( bOnline ) {
	return (bOnline) ? 'Online': 'Offline';
}

FormUtil.setUp_AppConnModeDetection = function() {

	// In the beginning, match it as current status.
	FormUtil.currIntv_Online = FormUtil.network_Online;
	FormUtil.prevIntv_Online = FormUtil.network_Online;

	setInterval( function() {

		var bNetworkOnline = FormUtil.isOnline();
		FormUtil.currIntv_Online = bNetworkOnline;

		var connStateChanged = ( FormUtil.currIntv_Online != FormUtil.prevIntv_Online );
		
		// if connection has changed..  (from previous state..)
		if ( connStateChanged ) FormUtil.IntvCountBuildUp = 0;
		else FormUtil.IntvCountBuildUp++;


		if ( FormUtil.IntvCountBuildUp == FormUtil.IntvCountCheckPoint )
		{
			// Ask for the appConnMode Change..
			if ( FormUtil.appConnMode_Online != FormUtil.currIntv_Online )
			{
				FormUtil.change_AppConnMode( "interval", FormUtil.currIntv_Online );
			}
		}

		// ---- End of Interval -----
		FormUtil.prevIntv_Online = bNetworkOnline;

	}, FormUtil.IntvTime );
}


FormUtil.change_AppConnMode = function( modeStr, requestConnMode )
{
	var changeConnModeTo = false;
	var questionStr = "Unknown Mode";

	if ( modeStr === "interval" ) 
	{
		if ( requestConnMode !== undefined ) changeConnModeTo = requestConnMode;
		var changeConnStr = FormUtil.connStatusStr( changeConnModeTo );
	
		questionStr = "Network changed to '" + changeConnStr + "'.  Do  you want to switch App Mode to '" + changeConnStr + "'?";
	}
	else if ( modeStr === "switch" ) 
	{
		var currConnStat = FormUtil.appConnMode_Online;
		var currConnStr = FormUtil.connStatusStr( currConnStat );
	
		changeConnModeTo = !currConnStat;	
		var changeConnStr = FormUtil.connStatusStr( changeConnModeTo );

		questionStr = "App Connection Mode is '" + currConnStr + "'.  Do you want to switch to '" + changeConnStr + "'?";
	}

	var reply = confirm( questionStr );

	if ( reply )
	{
		// Switch the mode to ...
		FormUtil.setAppConnMode( changeConnModeTo );

		// This is not being called..
		if ( FormUtil._cwsRenderObj ) 
		{
			//console.log( 'from reply, this is called.' );
			FormUtil._cwsRenderObj.startBlockExecute();
		}

		if ( modeStr === "interval" ) FormUtil.IntvCountBuildUp = 0;
	}	
};

// ----------------------
// --- AppConnMode ----
FormUtil.getAppConnMode_Online = function() {
	return FormUtil.appConnMode_Online;
}

FormUtil.setAppConnMode_Initial = function() {
	// 1. 1st status when coming is the starting status
	FormUtil.setAppConnMode( FormUtil.isOnline() );
}

FormUtil.setAppConnMode = function( bOnline ) {

	FormUtil.appConnMode_Online = bOnline;

	// Top Nav Color Set
	var navBgColor = ( bOnline ) ? '#0D47A1': '#ee6e73';
	$( '#divNav').css( 'background-color', navBgColor );

	// Text set
    var stat = (bOnline) ? 'online': 'offline';
    var displayText = (bOnline) ? '[online mode]': '[offline mode]';
    $( '#appModeConnStatus' ).attr( 'connStat', stat ).text( displayText );	
}


// ======================================================
// ==== Other Form Related Utils ======================

FormUtil.getObjFromDefinition = function( def, definitions )
{
	var objJson;

	if ( def !== undefined && definitions !== undefined )
	{
		if ( typeof def === 'string' )
		{
			//console.log( 'get string object: ' + def );
			// get object from definition
			objJson = definitions[ def ];
		}
		else if ( typeof def === 'object' )
		{
			objJson = def;
		}	
	}

	return objJson;
}

// Temporary solution
FormUtil.getServerUrl = function()
{
	return location.protocol + '//' + location.host;
};


FormUtil.generateUrl = function( inputsJson, actionJson )
{
	var url = FormUtil.getServerUrl() + "/" + FormUtil.staticWSName + actionJson.url;

	if ( actionJson.urlParamNames !== undefined 
		&& actionJson.urlParamInputs !== undefined 
		&& actionJson.urlParamNames.length == actionJson.urlParamInputs.length )
	{
		var paramAddedCount = 0;

		for ( var i = 0; i < actionJson.urlParamNames.length; i++ )
		{
			var paramName = actionJson.urlParamNames[i];
			var inputName = actionJson.urlParamInputs[i];

			if ( inputsJson[ inputName ] !== undefined )
			{
				var value = inputsJson[ inputName ];

				url += ( paramAddedCount == 0 ) ? '?': '&';

				url += paramName + '=' + value;
			}

			paramAddedCount++;
		}
	}

	return url;
}


FormUtil.generateInputJson = function( formDivSecTag )
{
	// Input Tag values
	var inputsJson = {};

	var inputTags = formDivSecTag.find( 'input,select' );

	inputTags.each( function()
	{
		var inputTag = $(this);			
		var nameVal = inputTag.attr( 'name' );
		
		inputsJson[ nameVal ] = inputTag.val();
	});		

	return inputsJson;
}
