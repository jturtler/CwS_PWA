// -------------------------------------------
// -- CwS Render Class/Methods
function cwsRender()
{
	var me = this;

	// Fixed variables
	me.dsConfigLoc = 'data/dsConfig.json?v1';	// 

	// Tags
	me.renderBlockTag = $( '.renderBlock' );
	me.divAppModeConnStatusTag = $( '#divAppModeConnStatus' );

	// global variables
	me.configJson;
	me.definitionBlocks = {};
	me.definitionActions = {};
	me.definitionButtons = {};
	me.definitionForms = {};

	me.storageName_RedeemList = "redeemList";
	me._globalMsg = "";
	me._globalJsonData = undefined;

	// Create separate class for this?
	me.blockData = {};	// "blockId": { "formData": [], "returnData?": {}, "otherAddedData": {} }

	me.blockObj;
	me.LoginObj;

	// =============================================

	me.initialize = function()
	{
		me.blockObj = new Block( me );
		me.LoginObj = new Login( me );

		me.setHeaderEvents();
	}

	// =============================================
	// ---- perform Run --------------
	me.performRun = function()
	{
		// Login starts with 
		me.LoginObj.openForm();
	}

	me.startWithConfigLoad = function( configJson )
	{
		// ------------------- JAMES CODE -------------------------
		// console.log( configJson );
		// me.setUpConfigVars( configJson );

		// me.startBlockExecute();


		// ------------------- TRAN modified to use for development-------------------------
		
		me.getDsConfigJson( function( configDataFile ){
			me.setUpConfigVars( configDataFile );

			me.startBlockExecute();
		});

	}

	me.startBlockExecute = function()
	{
		// Need to clear out all the div ones...
		me.renderBlockTag.find( 'div.block' ).remove();

		me.getStartBlockByStatus( ConnManager.getAppConnMode_Online(), me.configJson, ( startBlock, startBlockName ) => {
			me.blockObj.renderBlock( startBlock, startBlockName, me.renderBlockTag );
		});
	} 
	
	me.setHeaderEvents = function()
	{
		// Connection manual change click event: ask first and manually change it.
		me.divAppModeConnStatusTag.click( function() {
			ConnManager.change_AppConnMode( "switch" );
			return false;
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
		me.definitionForms = configJson.definitionForms;
	}

	me.getStartBlockByStatus = function( bOnline, configJson, returnFunc )
	{
		var startBlockName = ( bOnline ) ? configJson.defaultStartBlockOnline : configJson.defaultStartBlockOffline ;

		if ( startBlockName !== undefined )
		{
			returnFunc( configJson.definitionBlocks[ startBlockName ], startBlockName );
		}
	}

	// ======================================

	me.initialize();
}