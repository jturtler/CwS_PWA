// -------------------------------------------
// -- FormUtil Class/Methods

function FormUtil() {}

FormUtil.staticWSName = 'eRefWSDev3';			// Need to be dynamically retrieved

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

// -----------------------------
// ---- Submit Related ----------

FormUtil.submitRedeem = function( url, payloadJson, actionJson, loadingTag, returnFunc )
{
	// Send the POST reqesut
	fetch( url, {  
		method: 'POST',  
		headers: { 'usr': '1004', 'pwd': '1234' },  
		body: JSON.stringify( payloadJson )
	})
	.then( function( response ) 
	{
		if (response) 
		{
			if ( response.ok )
			{
				response.json().then(
					function( returnJson ) 
					{
						if ( actionJson.alertResult === "true" )
						{
							if( returnJson.info.status === "success")
							{
								alert( "Success!" );
							}
							else if ( returnJson.info.status === "fail")
							{
								alert( "Failed!" );
							}
						}			
						
						if ( loadingTag !== undefined ) loadingTag.remove();
						if ( returnFunc !== undefined ) returnFunc( true, returnJson );
						// final call..
						//actionIndex++;
						//passData.push( returnJson );
						//me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );
					}
				);
			}
			else
			{
				alert( 'Response Failed' );
				if ( loadingTag !== undefined ) loadingTag.remove();
				if ( returnFunc !== undefined ) returnFunc( false );
				//actionIndex++;
				//passData.push( {} );
				//me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );					
			}
		}
		else
		{
			alert( 'Response Not available' );
			if ( loadingTag !== undefined ) loadingTag.remove();
			if ( returnFunc !== undefined ) returnFunc( false );
			//actionIndex++;
			//passData.push( {} );
			//me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );				
		}
	});
}