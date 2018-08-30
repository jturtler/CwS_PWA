// -------------------------------------------
// -- FormUtil Class/Methods

function FormUtil() {}

FormUtil.staticWSName = 'eRefWSDev3';			// Need to be dynamically retrieved
FormUtil.login_UserName = '';
FormUtil.login_Password = '';
FormUtil.orgUnitData;
FormUtil.dcdConfig;

// ==== Methods ======================

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

FormUtil.getServerUrl = function()
{
	return location.protocol + '//' + location.host;
};

FormUtil.generateUrl = function( inputsJson, actionJson )
{
	var url;

	if ( actionJson.url !== undefined )
	{
		url = FormUtil.getWsUrl( actionJson.url );

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

// -----------------------------
// ---- Submit Related ----------

FormUtil.submitRedeem = function( url, payloadJson, actionJson, loadingTag, returnFunc, asyncCall, syncCall )
{

	FormUtil.wsSubmitGeneral( url, payloadJson, loadingTag, function( success, returnJson )
	{
		if ( success )
		{
			if ( actionJson.alertResult === "true" )
			{
				if ( returnJson.resultData )
				{
					if( returnJson.resultData.status === "success")
					{
						alert( "Success!" );
					}
					else if ( returnJson.resultData.status === "fail")
					{
						alert( "Failed!" );
					}	
				}
			}			
			
			if ( returnFunc ) returnFunc( true, returnJson );
			if ( asyncCall ) asyncCall( returnJson );
		}
		else
		{
			if ( returnFunc ) returnFunc( false );
			if ( syncCall ) syncCall();
		}
	});
}


FormUtil.submitLogin = function( userName, password, loadingTag, returnFunc )
{
	var url = FormUtil.getWsUrl( '/api/loginCheck' );

	// FormUtil.orgUnitData <-- Reset before?
	var payloadJson = { 'submitLogin': true, 'submitLogin_usr': userName, 'submitLogin_pwd': password, 'dcConfigGet': 'Y' };

	FormUtil.wsSubmitGeneral( url, payloadJson, loadingTag, function( success, returnJson )
	{
		if ( success )
		{
			// Check the login success message in content.. ..			
			var loginStatus = ( returnJson && returnJson.loginStatus );
			//var orgUnitData = ( returnJson.orgUnitData ) ? returnJson.orgUnitData : undefined;

			if ( loginStatus )
			{		
				FormUtil.login_UserName = userName;
				FormUtil.login_Password = password;
				FormUtil.orgUnitData = returnJson.orgUnitData;
				FormUtil.dcdConfig = returnJson.dcdConfig;
			}

			if ( returnFunc ) returnFunc( loginStatus, returnJson );
		}
	});
}


// -----------------------------------
// ---- Login And Fetch WS Related ------

FormUtil.setLogin = function( userName, password )
{
	FormUtil.login_UserName = userName;
	FormUtil.login_Password = password;	
}

FormUtil.checkLoginSubmitCase = function( payloadJson )
{
	return ( payloadJson && payloadJson.submitLogin );
}

FormUtil.checkLogin = function()
{
	return ( FormUtil.login_UserName && FormUtil.login_Password );
}

FormUtil.getWsUrl = function( subUrl )
{
	return FormUtil.getServerUrl() + "/" + FormUtil.staticWSName + subUrl;
}

FormUtil.getFetchWSJson = function( payloadJson )
{
	var fetchJson = {
		method: 'POST'
		,headers: { 'usr': '', 'pwd': '' }
		,body: '{}'
	};


	if ( FormUtil.checkLoginSubmitCase( payloadJson ) )
	{
		fetchJson.headers.usr = payloadJson.submitLogin_usr;
		fetchJson.headers.pwd = payloadJson.submitLogin_pwd;	
	}
	else
	{
		fetchJson.headers.usr = FormUtil.login_UserName;
		fetchJson.headers.pwd = FormUtil.login_Password;	
	}
		
	if ( payloadJson ) fetchJson.body = JSON.stringify( payloadJson );
	
	return fetchJson;
}

FormUtil.wsSubmitGeneral = function( url, payloadJson, loadingTag, returnFunc )
{	
	// headers info change? or pass as body??
	if ( !FormUtil.checkLoginSubmitCase( payloadJson ) && !FormUtil.checkLogin() )
	{
		alert( 'Not Loggged In!' );
		returnFunc( false );
	}
	else
	{
		// Send the POST reqesut
		fetch( url, FormUtil.getFetchWSJson( payloadJson ) )
		.then( function( response ) 
		{
			if ( response ) 
			{
				if ( response.ok )
				{
					response.json().then(
						function( returnJson ) 
						{
							if ( loadingTag ) loadingTag.remove();
							if ( returnFunc ) returnFunc( true, returnJson );
						}
					);
				}
				else
				{
					alert( 'Response Failed' );
					if ( loadingTag ) loadingTag.remove();
					if ( returnFunc ) returnFunc( false );
				}
			}
			else
			{
				alert( 'Response Not available' );
				if ( loadingTag ) loadingTag.remove();
				if ( returnFunc ) returnFunc( false );
			}
		});
	}
}