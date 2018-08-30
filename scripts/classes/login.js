// -------------------------------------------
// -- Login Class/Methods
function Login( cwsRenderObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
	
	me.loginFormDivTag = $( "#loginFormDiv" );
	me.width = me.loginFormDivTag.attr( 'formWidth' );
	me.height = me.loginFormDivTag.attr( 'formHeight' );

	me.loggedInDivTag = $( '#loggedInDiv' );
	me.spanOuNameTag = $( '#spanOuName' );

	me.loginUserNameTag = me.loginFormDivTag.find( '#loginUserName' );
	me.loginPasswordTag = me.loginFormDivTag.find( '#loginPassword' );
	me.loginBtnTag = me.loginFormDivTag.find( '#loginBtn' );
	me.loginBtnDivTag = me.loginFormDivTag.find( '#loginBtnDiv' );

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() 
	{ 
		me.LoginForm_PopupSetup();

		me.setUpEvents();
	}

	// ------------------------------------

	me.LoginForm_PopupSetup = function()
	{
		// Set up the form
		me.loginFormDivTag.dialog({
			resizable: false
			,width: me.width
			,height: "auto"
			,title: "Login"
			//,height: me.height				  
			,modal: true				
			,close: function( event, ui ) 
				{
					$( this ).dialog( "close" );
				}				
		});
	};

	me.openForm = function()
	{
		me.loginFormDivTag.dialog( "open" );		
	}

	me.setUpEvents = function()
	{
		me.loginBtnTag.click( function() 
		{
			me.loginBtnDivTag.find( 'div.loadingImg' ).remove();
			var userName = Util.trim( me.loginUserNameTag.val() );
			var password = Util.trim( me.loginPasswordTag.val() );			

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
				var loadingTag = $( '<div class="loadingImg" style="display: inline-block; margin-left: 8px;"><img src="images/loading.gif"></div>' );
				me.loginBtnDivTag.append( loadingTag );
	
				FormUtil.submitLogin( userName, password, loadingTag, function( success, loginData ) 
				{
					if ( success )
					{							
						//console.log( 'online data use: ' + JSON.stringify( loginData ) );

						me.loginSuccessProcess( loginData );

						DataManager.saveData( userName, loginData );						
					}
					else
					{
						alert( 'Login Failed' );
					}
				} );
			}

		});
		
		me.loginPasswordTag.keypress( function(e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				me.loginBtnTag.click();
				return false;
			} else {
				return true;
			}			
		});

		me.loggedInDivTag.click( function() {

			me.openForm();
		});

	}


	me.loginSuccessProcess = function( loginData ) 
	{
		me.loginFormDivTag.dialog( "close" );

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

	me.initialize();
}