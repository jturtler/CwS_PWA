// -------------------------------------------
// -- Login Class/Methods
function Login( cwsRenderObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
	
	me.loginFormDivTag = $( "#loginFormDiv" );
	me.pageDivTag = $( "#pageDiv" );	// Get it from cwsRender object?
	me.menuTopDivTag = $( '#menuTopDiv' );

	me.loggedInDivTag = $( '#loggedInDiv' );
	me.spanOuNameTag = $( '#spanOuName' );

	// =============================================
	// === TEMPLATE METHODS ========================

	me.initialize = function()
	{
		me.createSubClasses();

		me.setEvents_OnInit();
	}
	
	me.render = function()
	{
		me.openForm();
	}

	// ------------------

	me.createSubClasses = function() { }

	me.setEvents_OnInit = function()
	{
		// Tab & Anchor UI related click events
		FormUtil.setUpTabAnchorUI( me.loginFormDivTag );

		me.setLoginFormEvents();
	}
	// =============================================


	// =============================================
	// === EVENT HANDLER METHODS ===================

	me.setLoginFormEvents = function()
	{
		me.setLoginBtnClick();

		me.setSkipLoginBtnClick();

		//me.setUpEnterKeyLogin(); // Not working, thus, disabled for now
	}

	// ---------------------------

	me.setLoginBtnClick = function()
	{
		// New UI Button click
		$( '.loginBtn' ).click( function() {
			var parentTag = $( this ).parent();
			var loginUserNameVal = parentTag.find( 'input.loginUserName' ).val();
			var loginUserPinVal = parentTag.find( 'input.loginUserPin' ).val();

			me.processLogin( loginUserNameVal, loginUserPinVal, $( this ) );
		});
	}


	me.setSkipLoginBtnClick = function()
	{
		$( '#skipLoginDiv' ).click( function() {
	
			ConfigUtil.getDsConfigJson( me.cwsRenderObj.dsConfigLoc, function( configDataFile ) {

				// Create fake 'loginData'?
				var loginData = {};
				loginData.orgUnitData = {};
				loginData.orgUnitData.userName = "SKIP";
				loginData.orgUnitData.ouName = "SKIP LOGIN - with Cached/Offline config";
				
				loginData.dcdConfig = configDataFile;

				me.loginSuccessProcess( loginData );
			});	

		} );	
	}

	me.setUpEnterKeyLogin = function()
	{
		/*
		me.setUpEnterKeyExecute( me.loginPasswordTag, me.loginBtnTag );
		
		me.getInputBtnPairTags( 'div.loginFormDiv', 'input.loginUserPin', '.loginBtn', function( loginUserPinTag, loginBtnTag )
		{
			me.setUpEnterKeyExecute( loginUserPinTag, loginBtnTag );			
		});
		*/
	}
	// =============================================


	// =============================================
	// === OTHER INTERNAL/EXTERNAL METHODS =========

	me.openForm = function()
	{
		//me.loginFormDivTag.dialog( "open" );	
		me.pageDivTag.hide();		
		me.loginFormDivTag.show( 'fast' );
		me.menuTopDivTag.hide();
	}

	me.closeForm = function()
	{
		me.loginFormDivTag.hide();
		me.pageDivTag.show( 'fast' );
		me.menuTopDivTag.show();
	}


	me.processLogin = function( userName, password, btnTag )
	{
		var parentTag = btnTag.parent();
		parentTag.find( 'div.loadingImg' ).remove();

		//console.log( 'userName: ' + userName + ', password: ' + password );

		// ONLINE vs OFFLINE HANDLING HERE!!!!
		if ( ConnManager.getAppConnMode_Offline() )
		{
			var loginData = DataManager.getData( userName );

			if ( loginData ) 
			{
				//console.log( 'offline data use: ' + JSON.stringify( loginData ) );
				// if data exists, 					
				me.loginSuccessProcess( loginData );
			}
		}
		else
		{
			var loadingTag = FormUtil.generateLoadingTag( btnTag );


			FormUtil.submitLogin( userName, password, loadingTag, function( success, loginData ) 
			{
				if ( success )
				{

					me.loginSuccessProcess( loginData );

					/* START: create 'session' information block  */
					var newSaveObj = Object.assign( {} , loginData);
					var dtmNow = ( new Date() ).toISOString();
					var sessionData = { createdDate: dtmNow, lastUpdated: dtmNow };

					newSaveObj.session = sessionData;

					/* END: create 'session' information block  */

					DataManager.saveData( userName, newSaveObj );						
				}
				else
				{
					alert( 'Login Failed' );
				}
			} );
		}
	}


	me.loginSuccessProcess = function( loginData ) 
	{		
		me.closeForm();

		// Set Logged in orgUnit info
		if ( loginData.orgUnitData )
		{
			me.loggedInDivTag.show();
			me.spanOuNameTag.text( '[' + loginData.orgUnitData.userName + ']' ).attr( 'title', loginData.orgUnitData.ouName );	
		} 

		// Load config and continue the CWS App process
		if ( loginData.dcdConfig ) 
		{
			// call CWS start with this config data..
			me.cwsRenderObj.startWithConfigLoad( loginData.dcdConfig );
		}
	}

	// --------------------------------------
	
	me.getInputBtnPairTags = function( formDivStr, pwdInputStr, btnStr, returnFunc )
	{
		$( formDivStr ).each( function( i ) {
			var formDivTag = $( this );

			var loginUserPinTag = formDivTag.find( pwdInputStr );
			var loginBtnTag = formDivTag.find( btnStr );

			returnFunc( loginUserPinTag, loginBtnTag );
		});	
	}

	me.setUpInputTypeCopy = function( inputTags ) {
		inputTags.keyup( function() {  // keydown vs keypress
			// What about copy and paste?
			var changedVal = $( this ).val();
			console.log( 'changedVal: ' + changedVal );
			inputTags.val( changedVal );
		});	
	};

	me.setUpEnterKeyExecute = function( inputTag, btnTag ) {
		inputTag.keypress( function(e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				btnTag.click();
				return false;
			} else {
				return true;
			}			
		});		
	};

	// ================================

	me.initialize();
}