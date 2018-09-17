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

			var idList = me.getIdList_FormJson( formJsonArr );

			for( var i = 0; i < formJsonArr.length; i++ )
			{
				me.renderInput( formJsonArr[i], formDivSecTag, idList, passedData );
			}

			me.populateFormData( passedData, formDivSecTag );

			// NOTE: TRAN VALIDATION
			me.blockObj.validationObj.setUp_Events( formDivSecTag );
		}
	}
	
	// -----------------------------------
	// ---- 2nd level methods -----------
	
	me.getIdList_FormJson = function( formJsonArr )
	{
		var idList = [];

		for( var i = 0; i < formJsonArr.length; i++ )
		{
			var inputJson = formJsonArr[i];

			if ( inputJson.id ) idList.push( inputJson.id );
		}

		return idList;
	}

	me.renderInput = function( inputJson, formDivSecTag, idList, passedData )
	{
		var divInputTag = $( '<div class="inputDiv"></div>' );

		var spanTitleTag = $( '<span class="titleSpan"></span>' );
		spanTitleTag.text( inputJson.defaultName );
		var titleDivTag = $( '<div class="titleDiv"></div>' ).append( spanTitleTag );

		divInputTag.append( titleDivTag );

		me.renderInputTag( inputJson, divInputTag, formDivSecTag, idList, passedData );

		formDivSecTag.append( divInputTag );
	}
	
	me.renderInputTag = function( inputData, divInputTag, formDivSecTag, idList, passedData )
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


			// Set Tag Visibility
			if ( inputData.display === "none" )
			{
				divInputTag.hide();
			}
			
			if ( passedData !== undefined 
				&& passedData.hideCase !== undefined 
				&& inputData.hideCase !== undefined
				&& inputData.hideCase.indexOf( passedData.hideCase ) >= 0 )
			{
				divInputTag.find("input,select").remove();
				divInputTag.hide();
			}

			if ( passedData !== undefined 
				&& passedData.showCase !== undefined 
				&& inputData.showCase !== undefined
				&& inputData.showCase.indexOf( passedData.showCase ) >= 0 )
			{
				divInputTag.show();
			}

			// Set Event
			entryTag.change( function() {
				me.performEvalActions( $(this).val(), inputData, formDivSecTag, idList );
			});


			// Finally Set/Attach to the parent tag
			divInputTag.append( entryDivTag );

			// NOTE: TRAN VALIDATION
			// Add rules for IMPUT fields
			me.addRuleForField( divInputTag, inputData );
		}
	}

	me.addRuleForField = function( divInputTag, inputData )
	{
		if( inputData.rules !== undefined )
		{
			for( var i in inputData.rules )
			{
				var rule = inputData.rules[i];

				var entryTag = divInputTag.find( "select,input" );
				entryTag.attr( rule.name, rule.value );

				if( rule.name === "mandatory" && rule.value === "true" )
				{
					var titleTag = divInputTag.find( ".titleDiv" );
					titleTag.append("<span style='color:red;'> * </span>")
				}
			}
		}

	}

	// ----------------------------------------------------
	// ---- EVAL Actions Related --------------------------

	me.performEvalActions = function( tagVal, inputData, formDivSecTag, idList )
	{
		if ( inputData.evalActions !== undefined )
		{
			for ( var i = 0; i < inputData.evalActions.length; i++ )
			{
				me.performEvalAction( inputData.evalActions[i], tagVal, formDivSecTag, idList );
			}
		}
	}

	me.performEvalAction = function( evalAction, tagVal, formDivSecTag, idList )
	{
		if ( evalAction !== undefined )
		{
			if ( me.checkCondition( evalAction.condition, tagVal, formDivSecTag, idList ) )
			{
				me.performCondiShowHide( evalAction.shows, formDivSecTag, true );
				me.performCondiShowHide( evalAction.hides, formDivSecTag, false );

				me.performCondiAction( evalAction.actions, formDivSecTag, false );
			}
			else
			{
				if ( evalAction.conditionInverse !== undefined )
				{
					if ( evalAction.conditionInverse.indexOf( "shows" ) >= 0 ) me.performCondiShowHide( evalAction.shows, formDivSecTag, false );
					if ( evalAction.conditionInverse.indexOf( "hides" ) >= 0 ) me.performCondiShowHide( evalAction.hides, formDivSecTag, true );
					if ( evalAction.conditionInverse.indexOf( "actions" ) >= 0 ) me.performCondiAction( evalAction.actions, formDivSecTag, true );
				}
			}			
		}
	}

	me.checkCondition = function( evalCondition, tagVal, formDivSecTag, idList )
	{
		var result = false;

		if ( evalCondition )
		{
			try
			{
				// var afterCondStr = evalCondition.replace( '$$(this)', tagVal );
				var afterCondStr = me.conditionVarIdToVal( evalCondition, tagVal, formDivSecTag, idList )

				result = eval( afterCondStr );	
			}
			catch(ex) 
			{
				console.log( 'Failed during condition eval: ' );
				console.log( ex );
				//alert( 'Failed during ' );
			}
		}

		return result;
	};

	
	me.conditionVarIdToVal = function( evalCondition, tagVal, formDivSecTag, idList )
	{
		// Replace 'this' first.
		evalCondition = Util.replaceAll( evalCondition, '$$(this)', tagVal );
		
		// Replace other tag val cases.
		for ( var i = 0; i < idList.length; i++ )
		{
			var idStr = idList[i];
			var matchKeyStr = '$$(' + idStr + ')';

			var tag = me.getMatchingInputTag( formDivSecTag, idStr );

			evalCondition = Util.replaceAll( evalCondition, matchKeyStr, tag.val() );
		}

		return evalCondition;
	}

	me.performCondiAction = function( actions, formDivSecTag, reset )
	{
		if ( actions )
		{
			for ( var i = 0; i < actions.length; i++ )
			{
				var action = actions[i];
					
				if ( action.id )
				{
					var matchingTag = me.getMatchingInputTag( formDivSecTag, action.id );
	
					if ( matchingTag.length > 0 )
					{
						if ( reset ) matchingTag.val( '' );
						else
						{
							if ( action.value ) matchingTag.val( action.value );
						}	
					}
				}
			}				
		}
	};

	me.performCondiShowHide = function( idList, formDivSecTag, visible )
	{
		if ( idList )
		{
			for ( var i = 0; i < idList.length; i++ )
			{
				var tag = me.getMatchingInputTag( formDivSecTag, idList[i] ).closest( 'div.inputDiv');
				( visible ) ? tag.show( 'fast' ) : tag.hide();
			}
		}
	};

	me.getMatchingInputTag = function( formDivSecTag, idStr )
	{
		return formDivSecTag.find( 'input[name="' + idStr + '"],select[name="' + idStr + '"]' );
	};


	// ---- EVAL Actions Related --------------------------
	// ----------------------------------------------------


	me.populateFormData = function( passedData, formDivSecTag )
	{
		//console.log( passedData );

		if ( passedData !== undefined && passedData.resultData !== undefined )
		{
			// TODO: On WebService side, we should simply create
			//   a list that holds 'id' and 'value' for population...
			//	regardless of type 'tei attribute val', 'dataElement value'

			var clientId = passedData.resultData.clientId;
			clientId = ( clientId === undefined ) ? "" : clientId;
			var voucherId = passedData.resultData.voucherId;
			voucherId = ( voucherId === undefined ) ? "" : voucherId;

			// formDivSecTag.find( '#countryType' ).val( "MZ" );
			// formDivSecTag.find( '#cbdCase' ).val( "Y" );
			formDivSecTag.find( '[name="clientId"]' ).val( clientId );
			formDivSecTag.find( '[name="voucherId"]' ).val( voucherId );
			// formDivSecTag.find( '#cbdEnrollOuId' ).val( passedData.data.relationships[0].cbdEnrollOu );
			formDivSecTag.find( '[name="walkInClientCase"]' ).val( me.getWalkInClientCase ( clientId, voucherId ) );

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