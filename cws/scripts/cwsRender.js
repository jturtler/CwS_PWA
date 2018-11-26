// -------------------------------------------
// -- CwS Render Class/Methods
function cwsRender()
{
	var me = this;

	// Fixed variables
	me.dsConfigLoc = 'data/dsConfig.json';	// 

	// Tags
	me.renderBlockTag = $( '#renderBlock' );
	me.divAppModeConnStatusTag = $( '#divAppModeConnStatus' );
	me.menuDivTag = $( '#menuDiv' );
	me.menuTopRightIconTag = $( '#menu_e' );

	// This get cloned..  Thus, we should use it as icon class name?
	me.floatListMenuIconTag =  $( '.floatListMenuIcon' );
	me.floatListMenuSubIconsTag = $( '.floatListMenuSubIcons' );

	me.loggedInDivTag = $( '#loggedInDiv' );
	me.headerLogoTag = $( '.headerLogo' );
	me.aboutFormDivTag = $( '#aboutFormDiv' );


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

	me._localConfigUse = false;

	// =============================================
	// === TEMPLATE METHODS ========================

	me.initialize = function()
	{
		me.createSubClasses();

		me.setEvents_OnInit();
	}
	
	me.render = function()
	{
		// START > Greg added: 2018/11/23
		var initializeStartBlock = false;

		if ( localStorage.length )
		{
			var lastSession = JSON.parse(localStorage.getItem('session'));
			
			if ( lastSession )
			{
				var loginData = JSON.parse(localStorage.getItem(lastSession.user));

				if ( loginData && loginData.mySession && loginData.mySession.stayLoggedIn ) 
				{
					initializeStartBlock = true;
				}
			}

		}

		if ( initializeStartBlock )
		{
			me.LoginObj.loginFormDivTag.hide();
			me.LoginObj._userName = lastSession.user;
			me.LoginObj.loginSuccessProcess( loginData );
		}
		else
		{
			me.LoginObj.loginFormDivTag.show();
			// Open Log Form
			me.LoginObj.render();
		}
		// END > Greg added: 2018/11/23

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
			// hide menuDiv if visible (when logging out)
			if ( me.menuDivTag.is( ":visible" ) && me.menuTopRightIconTag.is( ":visible" ) )
			{
				me.menuTopRightIconTag.click();
			}
			me.LoginObj.openForm();
		});

		me.headerLogoTag.click(function() {

			me.aboutFormDivTag.find( 'div.aboutListDiv' ).empty();

		  // Greg added: 2018/11/23 -- 'localStorage length check, lastSession, etc..
			if ( localStorage.length )
			{

				var lastSession = JSON.parse(localStorage.getItem('session'));

				if (lastSession)
				{

					var aboutObj = JSON.parse(localStorage.getItem(lastSession.user)).about;
					me.aboutFormDivTag.find( 'div.aboutListDiv' ).append( '<table>' );

					$.each(aboutObj, function(k, v) {
						me.aboutFormDivTag.find( 'div.aboutListDiv' ).append( '<tr><td align=right><strong> '+k+'</strong>: </td><td align=left> ' + v + ' </td></tr>' );
					})

					me.aboutFormDivTag.find( 'div.aboutListDiv' ).append( '</table>' );
					me.aboutFormDivTag.show( 'fast' ).delay(5000).hide( 'fast' );

				}

			}

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
	
			var clicked_area = Util.getFromList( me.areaList, clicked_areaId, "id" );
	
			// if menu is clicked,
			// reload the block refresh?
			if ( clicked_area.startBlockName )
			{
				/* START > Greg added: 2018/11/23 */
				var lastSession = JSON.parse(localStorage.getItem('session'));

				if (lastSession)
				{
					var loginData = JSON.parse(localStorage.getItem(lastSession.user));

					if (loginData)
					{
						var loginData = JSON.parse(localStorage.getItem(lastSession.user));

						if ( ConnManager.getAppConnMode_Online() )
						{
							// for ONLINE > update dcd config for last menu action (default to this page on refresh)
							for ( var i = 0; i < loginData.dcdConfig.areas.online.length; i++ )
							{
								if ( clicked_area.id == loginData.dcdConfig.areas.online[i].id )
								{
									loginData.dcdConfig.areas.online[i].startArea = true;
								}
								else 
								{
									loginData.dcdConfig.areas.online[i].startArea = false;
								}
							}
						}
						else
						{
							// for OFFLINE > update dcd config for last menu action (default to this page on refresh)
							for ( var i = 0; i < loginData.dcdConfig.areas.offline.length; i++ )
							{
								if ( clicked_area.id == loginData.dcdConfig.areas.offline[i].id )
								{
									loginData.dcdConfig.areas.offline[i].startArea = true;
								}
								else 
								{
									loginData.dcdConfig.areas.offline[i].startArea = false;
								}
							}
						}

						//UPDATE lastStorage session for current user (based on last menu selection)
						localStorage[ lastSession.user ] = JSON.stringify( loginData )

					}
				}
				/* END > Greg added: 2018/11/23 */

				var startBlockObj = new Block( me, me.configJson.definitionBlocks[ clicked_area.startBlockName ], clicked_area.startBlockName, me.renderBlockTag );
				startBlockObj.renderBlock();  // should been done/rendered automatically?
			}
			else
			{
				/* START > Greg added: 2018/11/23 */
				if (clicked_areaId === 'logOut')
				{
					var lastSession = JSON.parse(localStorage.getItem('session'));

					if (lastSession)
					{
						var loginData = JSON.parse(localStorage.getItem(lastSession.user));

						if ( loginData.mySession && loginData.mySession.stayLoggedIn ) 
						{
							loginData.mySession.stayLoggedIn = false;
							localStorage[ lastSession.user ] = JSON.stringify( loginData )
						}
					}


					if ( me.menuDivTag.is( ":visible" ) && me.menuTopRightIconTag.is( ":visible" ) )
					{
						me.menuTopRightIconTag.click();
					}

					me.LoginObj.openForm();

				}
				/* END > Greg added: 2018/11/23 */
			}
	
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
		if (areaId === 'logOut')
		{
			me.LoginObj.openForm();
		}
    else
    {  
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
			console.log( 'network config' );
			//console.log( configJson );

			me.configJson = configJson;

			me.startBlockExecute( me.configJson );
		}
	}

	me.startBlockExecute = function( configJson )
	{		
		me.areaList = ConfigUtil.getAreaListByStatus( ConnManager.getAppConnMode_Online(), configJson );

		if ( me.areaList )
		{
		  // Greg added: 2018/11/23 -- 'logOut' check
			if (JSON.stringify(me.areaList).indexOf('logOut') < 0 )
			{
				// 
				/*var newMenuData = { id: "about", name: "About" };
				me.areaList.push ( newMenuData );*/
				var newMenuData = { id: "logOut", name: "Log out" };
				me.areaList.push ( newMenuData );
			}

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