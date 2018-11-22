// -------------------------------------------
// -- CwS Render Class/Methods
function cwsRender()
{
	var me = this;

	// Fixed variables
	me.dsConfigLoc = 'data/dsConfig.json?v22';	// 

	// Tags
	me.renderBlockTag = $( '#renderBlock' );
	me.divAppModeConnStatusTag = $( '#divAppModeConnStatus' );
	me.menuDivTag = $( '#menuDiv' );
	me.menuTopRightIconTag = $( '#menu_e' );

	// This get cloned..  Thus, we should use it as icon class name?
	me.floatListMenuIconTag =  $( '.floatListMenuIcon' );
	me.floatListMenuSubIconsTag = $( '.floatListMenuSubIcons' );

	me.loggedInDivTag = $( '#loggedInDiv' );


	// global variables
	me.configJson;
	me.areaList = [];

	
	me.storageName_RedeemList = "redeemList";
	me._globalMsg = "";
	me._globalJsonData = undefined;

	// Create separate class for this?
	me.blockData = {};	// "blockId": { "formData": [], "returnData?": {}, "otherAddedData": {} }

	//me.blockObj;
	me.LoginObj;

	me._localConfigUse = true;

	// =============================================
	// === TEMPLATE METHODS ========================

	me.initialize = function()
	{
		me.createSubClasses();

		me.setEvents_OnInit();
	}
	
	me.render = function()
	{
		// Open Log Form 
		me.LoginObj.render();
	}

	// ------------------

	me.createSubClasses = function()
	{
		me.LoginObj = new Login( me );
	}

	me.setEvents_OnInit = function()
	{		
		// Set Body vs Set Header..
		me.setPageHeaderEvents();
	}
	// =============================================


	// =============================================
	// === EVENT HANDLER METHODS ===================
	
	me.setPageHeaderEvents = function()
	{
		// Connection manual change click event: ask first and manually change it.
		me.divAppModeConnStatusTag.click( function() {
			ConnManager.change_AppConnMode( "switch" );
			return false;
		});

		// menu click handler
		me.setTopRightMenuClick();

		// loggedIn Name Link Click Event - opens Login Form
		me.loggedInDivTag.click( function() {
			me.LoginObj.openForm();
		});
	}

	// -------------------------

	me.setTopRightMenuClick = function()
	{
		FormUtil.setClickSwitchEvent( me.menuTopRightIconTag, me.menuDivTag, [ 'open', 'close' ] );
	}

	me.setupMenuTagClick = function( menuTag )
	{
		menuTag.click( function() {
					
			var clicked_areaId = $( this ).attr( 'areaId' );			
			me.renderArea( clicked_areaId );
	
			// hide the menu
			//$( '#menu_e:visible' ).click();
			if ( me.menuDivTag.is( ":visible" ) && me.menuTopRightIconTag.is( ":visible" ) )
			{
				me.menuTopRightIconTag.click();
			}
	
		});
	}
	// =============================================


	// =============================================
	// === OTHER INTERNAL/EXTERNAL METHODS =========
	
	me.renderArea = function( areaId )
	{
		// should close current tag/content?
		
		me.areaList = ConfigUtil.getAllAreaList( me.configJson );
	
		var selectedArea = Util.getFromList( me.areaList, areaId, "id" );

		// if menu is clicked,
		// reload the block refresh?
		if ( selectedArea.startBlockName )
		{
			var startBlockObj = new Block( me, me.configJson.definitionBlocks[ selectedArea.startBlockName ], selectedArea.startBlockName, me.renderBlockTag );
			startBlockObj.renderBlock();  // should been done/rendered automatically?  			
		}
	
	}

	// --------------------------------------
	// -- START POINT (FROM LOGIN) METHODS
	me.startWithConfigLoad = function( configJson )
	{
		if ( me._localConfigUse )
		{
			ConfigUtil.getDsConfigJson( me.dsConfigLoc, function( configDataFile ) {

				console.log( 'local config' );
				console.log( configDataFile );
	
				me.configJson = configDataFile;

				me.startBlockExecute( me.configJson );
			});		
		}
		else
		{
			console.log( 'internet config' );
			console.log( configJson );

			me.configJson = configJson;

			me.startBlockExecute( me.configJson );
		}
	}

	me.startBlockExecute = function( configJson )
	{		
		me.areaList = ConfigUtil.getAreaListByStatus( ConnManager.getAppConnMode_Online(), configJson );

		if ( me.areaList )
		{
			var startMenuTag = me.populateMenuList( me.areaList );

			if ( startMenuTag ) startMenuTag.click();
		}
	} 

	// Call 'startBlockExecute' again with in memory 'configJson' - Called from 'ConnectionManager'
	me.startBlockExecuteAgain = function()
	{
		me.startBlockExecute( me.configJson );
	}

	// ----------------------------------

	me.populateMenuList = function( areaList )
	{
		var startMenuTag;

		// clear the list first
		me.menuDivTag.find( 'div.menu-mobile-row' ).remove();

		// Add the menu rows
		if ( areaList )
		{
			for ( var i = 0; i < areaList.length; i++ )
			{
				var area = areaList[i];

				var menuTag = $( '<div class="menu-mobile-row" areaId="' + area.id + '"><div>' + area.name + '</div></div>' );

				me.setupMenuTagClick( menuTag );

				me.menuDivTag.append( menuTag );

				if ( area.startArea ) startMenuTag = menuTag;
			}	
		}

		return startMenuTag;
	}
	// ======================================

	me.initialize();
}