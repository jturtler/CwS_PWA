// -------------------------------------------
// -- BlockForm Class/Methods
function BlockForm( cwsRenderObj, blockObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
	me.blockObj = blockObj;

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() { }

	// ------------------------------------
	
	me.renderForm = function( formDef, blockTag, passedData )
	{
		var formJsonArr = FormUtil.getObjFromDefinition( formDef, me.cwsRenderObj.definitionForms );

		if ( formJsonArr !== undefined )
		{
			formDivSecTag = $( '<div class="formDivSec"></div>' );
			blockTag.append( formDivSecTag );

			for( var i = 0; i < formJsonArr.length; i++ )
			{
				me.renderInput( formJsonArr[i], formDivSecTag );
			}

			me.populateFormData( passedData, formDivSecTag );		
		}
	}
	
	// -----------------------------------
	// ---- 2nd level methods -----------
	
	me.renderInput = function( inputJson, divTag )
	{
		var divInputTag = $( '<div class="inputDiv"></div>' );

		var spanTitleTag = $( '<span class="titleSpan"></span>' );
		spanTitleTag.text( inputJson.defaultName );
		var titleDivTag = $( '<div class="titleDiv"></div>' ).append( spanTitleTag );

		divInputTag.append( titleDivTag );

		me.renderInputTag( inputJson, divInputTag );

		divTag.append( divInputTag );
	}
	
	me.renderInputTag = function( inputData, divInputTag )
	{
		if ( inputData !== undefined )
		{
			var entryTag;

			if ( inputData.controlType === "INT"
				|| inputData.controlType === "SHORT_TEXT" )
			{
				entryTag = $( '<input name="' + inputData.id + '" uid="' + inputData.uid + '" />' );
				if( inputData.defaultValue !== undefined )
				{
					// Set default data
					entryTag.val( inputData.defaultValue );	
				}
			}
			else if ( inputData.controlType === "DROPDOWN_LIST" )
			{
				entryTag = $( '<select name="' + inputData.id + '" uid="' + inputData.uid + '" ></select>' );
				Util.populateSelectDefault( entryTag, "Select One", inputData.options, { "name": "defaultName", "val": "value" } );
				if( inputData.defaultValue !== undefined )
				{
					// Set default data
					entryTag.val( inputData.defaultValue );	
				}
			}
			else if( inputData.controlType === "DIV_CONTENT" )
			{
				entryTag = $( '<div name="' + inputData.id + '" uid="' + inputData.uid + '" ></div>' );
				if( inputData.defaultValue !== undefined )
				{
					// Set default data
					entryTag.html( inputData.defaultValue );	
				}
			}
			
			
			var entryDivTag = $( '<div class="entryDiv"></div>' ).append( entryTag );

			if( inputData.display === "none" )
			{
				divInputTag.hide();
			}

			divInputTag.append( entryDivTag );
		}
	}


	me.populateFormData = function( passedData, formDivSecTag )
	{
		//console.log( passedData );

		if ( passedData !== undefined )
		{
			// TODO: On WebService side, we should simply create
			//   a list that holds 'id' and 'value' for population...
			//	regardless of type 'tei attribute val', 'dataElement value'

			var clientId = passedData.resultData.clientId;
			var voucherId = passedData.resultData.voucherId;

			// formDivSecTag.find( '#countryType' ).val( "MZ" );
			// formDivSecTag.find( '#cbdCase' ).val( "Y" );
			formDivSecTag.find( '#clientId' ).val( clientId );
			formDivSecTag.find( '#voucherId' ).val( voucherId );
			// formDivSecTag.find( '#cbdEnrollOuId' ).val( passedData.data.relationships[0].cbdEnrollOu );
			formDivSecTag.find( '#walkInClientCase' ).val( me.getWalkInClientCase ( clientId, voucherId ) );

			try 
			{
				// var attributes = passedData.data.relationships[0].relative.attributes;
				var attributes = passedData.displayData;

				for ( var i = 0; i < attributes.length; i++ )
				{
					var attrJson = attributes[i];

					// populate the attribute value to matching tag
					var matchingTag = formDivSecTag.find( 'input,select' ).filter( '[uid="' + attrJson.id + '"]' );
					matchingTag.val( attrJson.value );

					// populate the attribute value to matching DIV tag
					matchingTag = formDivSecTag.find( 'div,span' ).filter( '[uid="' + attrJson.id + '"]' );
					var message = attrJson.value;
					if( attrJson.breakRule !== undefined )
					{
						matchingTag.html( message.split( attrJson.breakRule ).join("<br>") );
					}
					else
					{
						matchingTag.html( message );
					}
				}
			}
			catch(err) {
			}					
		}
	}
	
	me.getWalkInClientCase = function( clientId, voucherId )
	{
		var walkInClientCase = "3";
		var hasClient = ( clientId !== undefined && clientId !== "" );
		var hasVoucherId = ( voucherId !== undefined && voucherId !== "" );
		
		if ( hasClient && hasVoucherId ) 
		{
			walkInClientCase = "1";
		}
		else if ( hasClient && !hasVoucherId )
		{
			walkInClientCase = "2";
		}
		else
		{
			walkInClientCase = "3";
		}
		
		return walkInClientCase;
	}

	// -------------------------------
	
	me.initialize();
}