// -------------------------------------------
// -- CwS Render Class/Methods
function cwsRender()
{
	var me = this;

	// Fixed variables
	me.dsConfigLoc = 'data/dsConfig.json';	// 
	me.staticWSName = 'eRefWSDev3';			// Need to be dynamically retrieved

	// Tags
	me.renderBlockTag = $( '.renderBlock' );
	me.divAppModeConnStatusTag = $( '#divAppModeConnStatus' );

	// global variables
	me.configJson;
	me.definitionBlocks = {};
	me.definitionActions = {};
	me.definitionButtons = {};

	me.storageName_Queue = "queueList";
	me._globalMsg = "";
	me._globalJsonData = undefined;

	// =============================================
	// ---- perform Run --------------
	me.performRun = function()
	{
		me.getDsConfigJson( configJson => {

			me.setUpConfigVars( configJson );

			me.startBlockExecute();

			me.setHeaderEvents();
		});
	}

	me.startBlockExecute = function()
	{
		//console.log( ' --- startBlockExecute Called ---' );

		// Need to clear out all the div ones...
		me.renderBlockTag.find( 'div.block' ).remove();

		me.getStartBlockByStatus( FormUtil.getAppConnMode_Online(), me.configJson, ( startBlock, startBlockName ) => {
			me.renderBlock( startBlock, startBlockName, me.renderBlockTag );
		});
	} 
	
	me.setHeaderEvents = function()
	{
		// Connection manual change click event: ask first and manually change it.
		me.divAppModeConnStatusTag.click( function() {
			FormUtil.change_AppConnMode( "switch" );
		});
	}

	// ---------------------------

	me.getDsConfigJson = function( returnFunc )
	{
		// 1. fetch config json
		fetch( me.dsConfigLoc )
		.then( response => response.json() )
		.then( configJson => {
			returnFunc( configJson );
		});
		/*
		.catch( error => {  
			console.log( 'Failed to load the config file: ', error );  
			//alert( 'Failed to load the config file' );
		});
		*/			
	}


	me.setUpConfigVars = function( configJson )
	{
		me.configJson = configJson;
		me.definitionBlocks = configJson.definitionBlocks;
		me.definitionActions = configJson.definitionActions;
		me.definitionButtons = configJson.definitionButtons;

		console.log( configJson );
	}

	me.getStartBlockByStatus = function( bOnline, configJson, returnFunc )
	{
		var startBlockName = ( bOnline ) ? configJson.defaultStartBlockOnline : configJson.defaultStartBlockOffline ;

		if ( startBlockName !== undefined )
		{
			returnFunc( configJson.definitionBlocks[ startBlockName ], startBlockName );
		}
	}

	// -------------------------------------------

	me.renderBlock = function( blockJson, blockId, renderBlockTag, passedData )
	{
		if ( blockJson !== undefined )
		{			
			var newBlockTag = $( '<div class="block" blockId="' + blockId + '"></div>' );

			// Render Form
			me.renderForm( blockJson.form, newBlockTag, passedData );

			// Render Buttons
			me.renderBlockButtons( blockJson.buttons, newBlockTag );

			// Render Msg
			me.renderRenderMessage( blockJson.message, newBlockTag, passedData );
			// me.renderRenderSec( blockJson.section_Render, newBlockTag );

			renderBlockTag.append( newBlockTag );
		}			
	}

	// ------------------------------------------

	me.renderForm = function( formJsonArr, blockTag, passedData )
	{
		//console.log( passedData );

		if ( formJsonArr !== undefined )
		{
			formDivSecTag = $( '<div class="formDivSec"></div>' );
			blockTag.append( formDivSecTag );

			for( var i = 0; i < formJsonArr.length; i++ )
			{
				me.renderInput( formJsonArr[i], formDivSecTag );
			}

			console.log( passedData );
			
			// Use this to populate data...
			// <-- How?  It is just a tei voucher data, no?  <-- we need to format it as array with uid, no?
			// for now, stored in client attribute?
			if ( passedData !== undefined )
			{
				if ( passedData.data !== undefined )
				{
					var clientId = passedData.data.relationships[0].trackedEntityInstance;
					var voucherId = passedData.data.trackedEntityInstance;

					formDivSecTag.find( '#countryType' ) .val( "MZ" );
					formDivSecTag.find( '#cbdCase' ) .val( "Y" );
					formDivSecTag.find( '#clientId' ) .val( clientId );
					formDivSecTag.find( '#voucherId' ) .val( voucherId );
					formDivSecTag.find( '#cbdEnrollOuId' ) .val( passedData.data.relationships[0].cbdEnrollOu );
					formDivSecTag.find( '#walkInClientCase' ).val( me.getWalkInClientCase ( clientId, voucherId ) );

					try {
						// var attributes = passedData.data.relationships[0].relative.attributes;
						var attributes = passedData.data.attributes;

						for ( var i = 0; i < attributes.length; i++ )
						{
							var attrJson = attributes[i];

							// populate the attribute value to matching tag
							var matchingTag = formDivSecTag.find( 'input,select' ).filter( '[uid="' + attrJson.attribute + '"]' );
							matchingTag.val( attrJson.value );
						}


					}
					catch(err) {
					}					
				}

			}			
		}
	}

	me.renderRenderMessage = function( messageJson, blockTag, passedData )
	{
			formDivSecTag = $( '<div class="formDivSec"></div>' );
			blockTag.append( formDivSecTag );
			if( messageJson != undefined && messageJson.type === "responseMessage" )
			{
				var arrMsg = passedData.data.msg.split( "-- " );
				for( var i in arrMsg )
				{
					formDivSecTag.append( arrMsg[i] + "<br>" );
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

	me.renderBlockButtons = function( buttonsJson, blockTag )
	{
		if ( buttonsJson !== undefined )
		{
			btnDivSecTag = $( '<div class="btnDivSec"></div>' );
			blockTag.append( btnDivSecTag );

			for( var i = 0; i < buttonsJson.length; i++ )
			{
				me.renderBlockButton( buttonsJson[i], btnDivSecTag );
			}
		}
	}

	// ------------------------------------------

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


	me.renderBlockButton = function( btnData, divTag )
	{
		console.log( btnData );

		var btnJson = me.getObjFromDefinition( btnData, me.definitionButtons );

		console.log( btnJson );

		var btnTag = me.generateBtnTag( btnJson, btnData );
			
		me.setUpBtnClick( btnTag, btnJson );

		divTag.append( btnTag );	
	}

	me.generateBtnTag = function( btnJson, btnData )
	{
		var btnTag;

		if ( btnJson !== undefined )
		{
			if ( btnJson.buttonType === 'imageButton' )
			{
				btnTag = $( '<div class="btnType ' + btnJson.buttonType + '"><img src="' + btnJson.imageSrc + '"></div>' );
			}
			else if ( btnJson.buttonType === 'textButton' )
			{
				btnTag = $( '<button class="btnType ' + btnJson.buttonType + '">' + btnJson.defaultLabel + '</button>' );
			}	
		}

		if ( btnTag === undefined )
		{
			var caseNA = ( btnData !== undefined && typeof btnData === 'string' ) ? btnData : "NA";
			btnTag = $( '<div class="btnType unknown">' + caseNA + '</div>' );
		}

		return btnTag;
	}

	// ----------

	me.getObjFromDefinition = function( def, definitions )
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

	me.setUpBtnClick = function( btnTag, btnJson )
	{
		if ( btnJson.onClick !== undefined )
		{
			//console.log( 'btn Clicked..' );
			
			btnTag.click( function() {
				me.handleClickActions( btnTag, btnJson.onClick );
			});
		}
	}

	// ---- MAIN PART ----
	me.handleClickActions = function( btnTag, btnOnClickActions )
	{
		//console.log( 'handleClickActions: ' + JSON.stringify( btnOnClickActions ) );
		
		var blockDivTag = btnTag.closest( '.block' );
		var formDivSecTag = blockDivTag.find( '.formDivSec' );

		var passData = [];

		//console.log( 'before  recurrsiveActions: ' );

		// *** USE RECURSIVE CALL -> to pass the data to each other..
		me.recurrsiveActions( blockDivTag, formDivSecTag, btnOnClickActions, 0, passData, function( finalPassData ) {
			//console.log( 'recurr finished: ' + JSON.stringify(finalPassData) );
		} );
	}


	// TODO: NEED TO BREAK DOWN AND CLEAN IT UP!!
	me.recurrsiveActions = function( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc )
	{
		//console.log( 'recurrsiveAction, index: ' + actionIndex );
		//console.log( actions );

		// If 'recurr' reached the end, call 'returnFunc' with data accumulated?  or last one package..
		if ( actionIndex >= actions.length )
		{
			//console.log( 'returnFunc case' );
			returnFunc( passData );
		}
		else
		{
			var clickActionJson = me.getObjFromDefinition( actions[actionIndex], me.definitionActions );
			var asyncCalled = false;
			
			//console.log( 'clickActionJson' );
			//console.log( clickActionJson );


			if ( clickActionJson !== undefined )
			{
				if ( clickActionJson.actionType === "clearOtherBlocks" )
				{
					var currBlockId = blockDivTag.attr( 'blockId' );

					me.renderBlockTag.find( 'div.block' ).not( '[blockId="' + currBlockId + '"]' ).remove();
				}
				else if ( clickActionJson.actionType === "closeCurrentBlock" )
				{
					blockDivTag.remove();
					//var currBlockId = blockDivTag.attr( 'blockId' );
					//me.renderBlockTag.find( 'div.block[blockId="' + currBlockId + '"]' ).remove();
				}
				else if ( clickActionJson.actionType === "openBlock" )
				{
					if ( clickActionJson.blockId !== undefined )
					{
						var blockJson = me.getObjFromDefinition( clickActionJson.blockId, me.definitionBlocks );
					
						me.renderBlock( blockJson, clickActionJson.blockId, me.renderBlockTag );	
					}
				}
				else if ( clickActionJson.actionType === "processWSResult" ) 
				{
					// 1. Match the case..
					var passedData = passData[actionIndex - 1];

					if ( passedData.info !== undefined && clickActionJson.resultCase !== undefined )
					{
						var statusAction = clickActionJson.resultCase[ passedData.info.status ];

						if ( statusAction )
						{
							var blockJson = me.getObjFromDefinition( statusAction.blockId, me.definitionBlocks );
									
							if( passedData.info.status === "success")
							{
								/* if ( statusAction.blockId !== undefined )
								{
									me.renderBlock( blockJson, statusAction.blockId, me.renderBlockTag, passedData );	
								} */
								alert("Redeem success !");
							}
							else if ( passedData.info.status === "fail")
							{
								if( bockJson.actionType === "alertMsg" )
								{
									alert( bockJson.message );
								}
							}
							// TODO: THIS SHOULD BE CALLED WITH REUSE!!!  
							// ONLY AVAILABLE WITH OPENBLOCK FOR NOW!!!!
							else if ( statusAction.blockId !== undefined )
							{
								me.renderBlock( blockJson, statusAction.blockId, me.renderBlockTag, passedData );	
							}
						}
					}
				}				
				else if ( clickActionJson.actionType === "sendToWS" ) 
				{
					if ( clickActionJson.url !== undefined )
					{					
						// generate inputsJson
						var inputsJson = me.generateInputJson( formDivSecTag );

						// generate url
						var url = me.generateUrl( inputsJson, clickActionJson );
						//console.log( 'url: ' + url );
						//console.log( 'inputsJson: ' + JSON.stringify( inputsJson ) );
						
						asyncCalled = true;

						var btnDivSecTag = blockDivTag.find( 'div.btnDivSec' );

						var loadingTag = $( '<div class="loadingImg" style="display: inline-block; margin-left: 8px;"><img src="images/loading.gif"></div>' );

						btnDivSecTag.append( loadingTag );

						// Send the POST reqesut
						fetch( url, {  
							method: 'POST',  
							headers: { 'usr': '1004', 'pwd': '1234' },  
							body: JSON.stringify( inputsJson )
						})
						.then( function( response ) 
						{
							if (response) 
							{
								response.json().then(
									function( returnJson ) 
									{
										//console.log( 'returned data: ' )
										//console.log( returnJson );
										loadingTag.remove();

										// final call..
										actionIndex++;
										passData.push( returnJson );
										//console.log( 'before calling me.recurrsiveActions, actionIndex: ' + actionIndex );
										me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );
									}
								);
							}
						});
					}
				}
			}

			if ( !asyncCalled )	
			{
				console.log( 'non asyncCall, recurrsiveAction called ' );
				// final call..
				actionIndex++;
				passData.push( {} );
				me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );				
			}
		}
	}


	me.generateInputJson = function( formDivSecTag )
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

	me.generateUrl = function( inputsJson, actionJson )
	{
		var url = me.getServerUrl() + "/" + me.staticWSName + actionJson.url;

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

	// -------------------------------
	
	me.renderInputTag = function( inputData, divInputTag )
	{
		if ( inputData !== undefined )
		{
			var entryTag;

			if ( inputData.controlType === "INT"
				|| inputData.controlType === "SHORT_TEXT" )
			{
				entryTag = $( '<input name="' + inputData.id + '" uid="' + inputData.uid + '" />' );
			}
			else if ( inputData.controlType === "DROPDOWN_LIST" )
			{
				entryTag = $( '<select name="' + inputData.id + '" uid="' + inputData.uid + '" ></select>' );
				Util.populateSelectDefault( entryTag, "Select One", inputData.options, { "name": "defaultName", "val": "value" } );
			}
			
			var entryDivTag = $( '<div class="entryDiv"></div>' ).append( entryTag );

			if( inputData.display === "none" )
			{
				divInputTag.hide();
			}

			divInputTag.append( entryDivTag );
		}
	}

	// ---------------------------
	// ---------------------------

	// Temporary solution
	me.getServerUrl = function()
	{
		return location.protocol + '//' + location.host;
	};

	// ---------------------------
	// ---------------------------

	// me.clearDivContent

	// Initial Setup - events handler..
	//me.initSetup();
}