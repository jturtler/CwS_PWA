// -------------------------------------------
// -- CwS Render Class/Methods
function cwsRender()
{
	var me = this;

	// Fixed variables
	me.dsConfigLoc = 'data/dsConfig2.json';	// 
	me.staticWSName = 'eRefWSDev3';			// Need to be dynamically retrieved

	// Tags
	me.renderBlockTag = $( '.renderBlock' );

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
			/*me.getStartBlockByStatus( FormUtil.getAppConnMode_Online(), configJson, ( startBlock, startBlockName ) => {
				me.renderBlock( startBlock, startBlockName, me.renderBlockTag );
			});*/
		});
	}

	me.startBlockExecute = function()
	{
		console.log( ' --- startBlockExecute Called ---' );

		// Need to clear out all the div ones...
		me.renderBlockTag.find( 'div.block' ).remove();

		me.getStartBlockByStatus( FormUtil.getAppConnMode_Online(), me.configJson, ( startBlock, startBlockName ) => {
			me.renderBlock( startBlock, startBlockName, me.renderBlockTag );
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
			// me.renderRenderSec( blockJson.section_Render, newBlockTag );

			renderBlockTag.append( newBlockTag );
		}			
	}

	// ------------------------------------------

	me.renderForm = function( formJsonArr, blockTag, passedData )
	{
		console.log( passedData );

		if ( formJsonArr !== undefined )
		{
			formDivSecTag = $( '<div class="formDivSec"></div>' );
			blockTag.append( formDivSecTag );

			for( var i = 0; i < formJsonArr.length; i++ )
			{
				me.renderInput( formJsonArr[i], formDivSecTag );
			}


			// Use this to populate data...
			// <-- How?  It is just a tei voucher data, no?  <-- we need to format it as array with uid, no?
			// for now, stored in client attribute?
			if ( passedData !== undefined )
			{
				if ( passedData.data !== undefined )
				{
					try {
						var attributes = passedData.data.relationships[0].relative.attributes;

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

		//me.setActionTagAttributes( btnTag, actionJson );

		// Actions...
		//btnTag.click( () => {
		//	console.log( 'btn Clicked..' );
			
		me.setUpBtnClick( btnTag, btnJson );
		//});

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
				console.log( 'get string object: ' + def );
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
			console.log( 'btn Clicked..' );
			
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

		console.log( 'before  recurrsiveActions: ' );

		// *** USE RECURSIVE CALL -> to pass the data to each other..
		me.recurrsiveActions( blockDivTag, formDivSecTag, btnOnClickActions, 0, passData, function( finalPassData ) {
			//console.log( 'recurr finished: ' + JSON.stringify(finalPassData) );
		} );
	}


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
							// TODO: THIS SHOULD BE CALLED WITH REUSE!!!  
							// ONLY AVAILABLE WITH OPENBLOCK FOR NOW!!!!
							if ( statusAction.blockId !== undefined )
							{
								var blockJson = me.getObjFromDefinition( statusAction.blockId, me.definitionBlocks );
							
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
										console.log( returnJson );
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

			divInputTag.append( entryDivTag );
		}
	}


	// -----------

	/*
	me.getObjFromDefinition = function( definitionButtons, btnId )
	{
		return definitionButtons[ btnId ];
	}
	*/

	// -------------------------------------------
	// ---- Old Codes -----


	me.renderRenderSec = function( jsonData, blockTag )
	{
		if ( jsonData !== undefined )
		{
			console.log( jsonData );
			
			if ( jsonData.renderType === "inputList" )
			{
				console.log( 'rendertype inputList ' + jsonData.renderType );

				me.renderInputList( jsonData.inputs, blockTag );

				me.renderActionsList( jsonData.actions, blockTag );				
			}
			else if ( jsonData.renderType === "iconSelectionList" )
			{
				console.log( 'rendertype iconSelectionList ' + jsonData.renderType );

				me.renderSelectionList( jsonData.selections, blockTag );
			}
			else if ( jsonData.renderType === "queueList" )
			{

				var jsonStorageData = DataManager.getData( me.storageName_Queue );

				me.renderQueueList( jsonStorageData.list, blockTag );
				// me.renderQueueList( jsonData.selections, blockTag );

				me.renderActionsList( jsonData.actions, blockTag );					
			}
			else if ( jsonData.renderType === "resultDispaly" )
			{				
				// Result of previous Action..
				// Later, create method for this..
				//if ( jsonData.result !== undefined )
				//{
					
				me.renderResultDisplay( jsonData, blockTag );
				//}
			
				me.renderActionsList( jsonData.actions, blockTag );
			}
		}
	}

	// --------------

	me.renderResultDisplay = function( jsonData, blockTag )
	{
		var divTag = $( '<div class="resultDisplayDiv" style="margin: 7px;"></div>' );

		var spanTitleTag = $( '<span class="titleSpan" style="font-weight: bold;"></span>' );

		if ( me._globalMsg !== undefined ) spanTitleTag.text( me._globalMsg );
		if ( me._globalJsonData !== undefined ) spanTitleTag.append( ' - ' + JSON.stringify( me._globalJsonData ) );

		divTag.append( spanTitleTag );

		blockTag.append( divTag );
	}

	// --------------

	me.renderQueueList = function( queueList, blockTag )
	{
		console.log( queueList );

		if ( queueList !== undefined )
		{
			for( var i = 0; i < queueList.length; i++ )
			{
				me.renderQueueData( queueList[i], blockTag );
			}	
		}
	}

	me.renderQueueData = function( queueData, blockTag )
	{
		var divTag = $( '<div class="queueDiv"></div>' );

		me.setActionTagAttribute( divTag, queueData, 'id' );


		var spanTitleTag = $( '<span class="titleSpan"></span>' );
		spanTitleTag.text( queueData.title );

		divTag.append( spanTitleTag );

		divTag.click( function() {
			me.submitForQueue( queueData, $( this ), blockTag );
		 } );

		blockTag.append( divTag );
	}

	me.submitForQueue = function( queueData, queueTag, blockTag )
	{

		if ( FormUtil.isOffline() )
		{
			queueTag.css( 'background-color', 'orange' );

			setTimeout( function() {
				alert( 'Not Online!!' );

				queueTag.css( 'background-color', '#d6d6e8' );
			}, 200 );
		}
		else
		{
			var url = me.getServerUrl() + "/eRefWSTest/api/submitForQueue";
			
			// TODO: this is part that should be moved to web service..
			queueData.processed = "Processed at " + (new Date() ).toISOString();
			//queueData.id = Util.generateRandomId();
			queueData.status = "processed";					
			var dataId = queueData.id;
			queueTag.css( 'background-color', 'lightGreen' );


			fetch( url, {  
				method: 'POST',  
				//headers: { 'auth': '1234' },  
				body: JSON.stringify( queueData )
			})
			.then( response => response.json() )  
			.then( responseJson => {
	
				console.log( 'Removal Request success: ', responseJson);  

				// This worked..
				DataManager.removeItemFromData( me.storageName_Queue, queueData.id );
							
				// get the tag...
				//var divTag = $( '#' + dataId ); // '<div class="queueDiv"></div>' );
				queueTag.css( 'background-color', 'yellow' ).hide( 500 );

				//me.renderQueueList( responseJson.list, blockTag );

				// Queue refresh, etc..
				alert( 'submitted data: ' + JSON.stringify( queueData ) );

			})  
			.catch(function (error) {  
			console.log('Request failure: ', error);  
			});			
		}	
	}

	// --------------

	// --------------

	me.renderSelectionList = function( selectionList, blockTag )
	{
		console.log( selectionList );

		for( var i = 0; i < selectionList.length; i++ )
		{
			me.renderSelectionData( selectionList[i], blockTag );
		}
	}

	me.renderSelectionData = function( selectionData, blockTag )
	{
		var divTag = $( '<div class="selectionDiv"><img src="' + selectionData.iconSrc + '"></div>' );

		me.setActionTagAttributes( divTag, selectionData );

		divTag.click( me.performBtnClick );

		blockTag.append( divTag );
	}
	// --------------

	me.renderInputList = function( inputList, blockTag )
	{
		for( var i = 0; i < inputList.length; i++ )
		{
			me.renderInputData( inputList[i], blockTag );
		}
	}

	me.renderInputData = function( inputData, blockTag )
	{
		var divInputTag = $( '<div class="inputDiv"></div>' );

		var spanTitleTag = $( '<span class="titleSpan"></span>' );
		spanTitleTag.text( inputData.title );
		var titleDivTag = $( '<div class="titleDiv"></div>' ).append( spanTitleTag );

		divInputTag.append( titleDivTag );

		me.renderDataEntryTag( inputData, divInputTag );

		blockTag.append( divInputTag );
	}

	me.renderDataEntryTag = function( inputData, divInputTag )
	{
		if ( inputData !== undefined )
		{
			var entryTag;

			if ( inputData.type === "textBox" )
			{
				entryTag = $( '<input uid="' + inputData.id + '" />' );
			}
			else if ( inputData.type === "select" )
			{
				entryTag = $( '<select uid="' + inputData.id + '" ></select>' );
				Util.populateSelect( entryTag, inputData.title, inputData.options, "Array" );
			}
			
			var entryDivTag = $( '<div class="entryDiv"></div>' ).append( entryTag );


			divInputTag.append( entryDivTag );
		}
	}

	// ---------------------------

	me.renderActionsList = function( actionList, blockTag )
	{
		if ( actionList !== undefined )
		{
		
			// create one div for actions
			var divActionsTag = $( '<div class="actionsDiv"></div>' );

			for( var i = 0; i < actionList.length; i++ )
			{
				var actionJson = actionList[i];
				if ( actionJson.type === 'button' )
				{
					var btnTag = $( '<button class="actionBtn">' + actionJson.title + '</button>' );
					
					me.setActionTagAttributes( btnTag, actionJson );

					// Perform Btn Click - include action + next block
					btnTag.click( me.performBtnClick );

					divActionsTag.append( btnTag );	
				}
			}

			blockTag.append( divActionsTag );
		}
	}

	me.performBtnClick = function()
	{
		var btnTag = $( this );

		// action
		me.actionPerform( btnTag, function() {

			// render block
			me.redirectBlockRender( btnTag );

		} );
	}


	me.actionPerform = function( btnTag, returnFunc )
	{
		var actionId = btnTag.attr( 'actionId' );

		me._globalMsg = "";
		me._globalJsonData = undefined;

		if ( actionId === 'submitRedeem' )
		{
			// if offline..
			//if ( )
			if ( FormUtil.isOffline() )
			{
				// save to the storage
				console.log( 'offline data asked..' );

				var tempJsonData = {};
				tempJsonData.title = "TestData Queue - " + (new Date() ).toISOString();
				tempJsonData.id = Util.generateRandomId();
				tempJsonData.status = "queued";					

				DataManager.insertData( me.storageName_Queue, tempJsonData );

				returnFunc();
			}
			else
			{
				console.log( 'online submit requested, but not available, yet..' );

				var tempJsonData = {};
				tempJsonData.title = "TestData Submit - " + (new Date() ).toISOString();
				tempJsonData.id = Util.generateRandomId();
				tempJsonData.status = "submitted";	

				me.submitForProcess( tempJsonData, function( returnJson ) {

					console.log( returnJson );

					me._globalMsg = returnJson.msg;
					me._globalJsonData = tempJsonData;
					
					returnFunc();
				} );
			}
		}
		else
		{
			returnFunc();
		}
	}

	me.redirectBlockRender = function( btnTag )
	{
		//var btnTag = $( this );
		var nextBlock = btnTag.attr( 'nextBlock' );
		var nextBlock_Offline = btnTag.attr( 'nextBlock_Offline' );
		var nextBlock_OnOffline = nextBlock;

		// if current status is offline and 'nextBlock_Offline' exists, use that instead of 'nextBlock'
		if ( FormUtil.isOffline() && nextBlock_Offline ) nextBlock_OnOffline = nextBlock_Offline;
		
		if ( nextBlock_OnOffline )
		{
			// Clear the block
			me.renderBlockTag.html( '' );

			console.log( 'nextBlock: ' + nextBlock_OnOffline );
			console.log( me.definitionBlocks[ nextBlock_OnOffline ] );			

			// Render the redirected Block
			me.renderBlock( me.definitionBlocks[ nextBlock_OnOffline ], me.renderBlockTag );
		}
	}

	me.setActionTagAttributes = function( actionTag, actionJson )
	{
		// We could set all the attributes, but for now, just below ones.
		me.setActionTagAttribute( actionTag, actionJson, 'actionId' );
		me.setActionTagAttribute( actionTag, actionJson, 'nextBlock' );
		me.setActionTagAttribute( actionTag, actionJson, 'nextBlock_Offline' );
	}

	me.setActionTagAttribute = function( actionTag, actionJson, propName )
	{
		if ( actionJson[ propName ] !== undefined ) actionTag.attr( propName, actionJson[ propName ] );
	}	


	// ---------------------------
	
	me.submitForProcess = function( jsonData, returnFunc ) //, queueTag, blockTag )
	{
		var url = me.getServerUrl() + "/eRefWSTest/api/submitForQueue";

		
		// TODO: this is part that should be moved to web service..
		jsonData.processed = "Processed at " + (new Date() ).toISOString();
		//queueData.id = Util.generateRandomId();
		jsonData.status = "processed";					


		fetch( url, {  
			method: 'POST',  
			//headers: { 'auth': '1234' },  
			body: JSON.stringify( jsonData )
		})
		.then(function (data) {  
			console.log('Request success: ', data);  
			returnFunc( { 'result': 'success', 'msg': 'data processed successfully' } );
		})  
		.catch(function (error) {  
		  console.log('Request failure: ', error);  
		  returnFunc( { 'result': 'fail', 'msg': 'data process failed' } );		
		});				
	}


	// Temporary solution
	me.getServerUrl = function()
	{
		return location.protocol + '//' + location.host;
	};

	// me.clearDivContent

	// Initial Setup - events handler..
	//me.initSetup();
}