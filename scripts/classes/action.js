// -------------------------------------------
// -- Action Class/Methods
function Action( cwsRenderObj, blockObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
	me.blockObj = blockObj;
	
	me.renderBlockTag = cwsRenderObj.renderBlockTag;

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() { }

	// ------------------------------------

	me.handleClickActions = function( btnTag, btnOnClickActions )
	{		
		var blockDivTag = btnTag.closest( '.block' );
		var formDivSecTag = blockDivTag.find( '.formDivSec' );

		var passData = [];

		me.recurrsiveActions( blockDivTag, formDivSecTag, btnOnClickActions, 0, passData, function( finalPassData ) {
		} );
	}

	me.recurrsiveActions = function( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc )
	{
		// If 'recurr' reached the end, call 'returnFunc' with data accumulated?  or last one package..
		if ( actionIndex >= actions.length )
		{
			returnFunc( passData );
		}
		else
		{			
			var asyncCalled = me.clickActionPerform( actions[actionIndex], blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );

			if ( !asyncCalled )	
			{
				// If not already added, add blank object.
				var existingPassData = passData[actionIndex];
				if ( existingPassData === undefined ) passData.push( {} );
				else 
				{
					console.log( 'already added passData case: ' );
					console.log( existingPassData );
				}

				actionIndex++;
				me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );
			}
		}
	}

	me.clickActionPerform = function( actionDef, blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc, passedData )
	{
		var asyncCalled = false;

		var clickActionJson = FormUtil.getObjFromDefinition( actionDef, me.cwsRenderObj.definitionActions );

		if ( clickActionJson !== undefined )
		{
			if ( clickActionJson.actionType === "clearOtherBlocks" )
			{
				var currBlockId = blockDivTag.attr( 'blockId' );

				me.renderBlockTag.find( 'div.block' ).not( '[blockId="' + currBlockId + '"]' ).remove();
			}
			else if ( clickActionJson.actionType === "closeBlock" )
			{
				var closeLevel = Util.getNum( clickActionJson.closeLevel );
				
				var divBlockTotal = me.renderBlockTag.find( 'div.block:visible' ).length;

				var currBlock = blockDivTag;

				for ( var i = 0; i < divBlockTotal; i++ )
				{
					var tempPrevBlock = currBlock.prev( 'div.block' );

					if ( closeLevel >= i ) 
					{
						currBlock.remove();
					}
					else break;

					currBlock = tempPrevBlock;
				}
			}
			else if ( clickActionJson.actionType === "openBlock" )
			{
				if ( clickActionJson.blockId !== undefined )
				{
					var blockJson = FormUtil.getObjFromDefinition( clickActionJson.blockId, me.cwsRenderObj.definitionBlocks );
				
					me.blockObj.renderBlock( blockJson, clickActionJson.blockId, me.renderBlockTag, passedData );	
				}
			}
			else if ( clickActionJson.actionType === "alertMsg" )
			{
				alert( clickActionJson.message );
			}
			else if ( clickActionJson.actionType === "processWSResult" ) 
			{
				// 1. Match the case..
				var passedData_Temp = passData[actionIndex - 1];

				if ( passedData_Temp.resultData !== undefined && clickActionJson.resultCase !== undefined )
				{
					var statusActions = clickActionJson.resultCase[ passedData_Temp.resultData.status ];

					if ( statusActions && statusActions.length > 0 )
					{
						// For now, loop these actions..  rather than recursive calls..
						for ( var i = 0; i < statusActions.length; i++ )
						{
							// NOTE: this should not call 'async' calls?  to webservice?
							me.clickActionPerform( statusActions[i], blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc, passedData_Temp );
						}


					}
				}
			}
			else if ( clickActionJson.actionType === "sendToWS" ) 
			{
				var currBlockId = blockDivTag.attr( 'blockId' );				
				// generate inputsJson
				var inputsJson = FormUtil.generateInputJson( formDivSecTag );
				// generate url
				var url = FormUtil.generateUrl( inputsJson, clickActionJson );


				var submitJson = {};
				submitJson.payloadJson = inputsJson;
				submitJson.url = url;
				submitJson.actionJson = clickActionJson;	


				if ( !ConnManager.getAppConnMode_Online() )
				{
					if ( clickActionJson.redeemListInsert === "true" )
					{
						me.blockObj.blockListObj.redeemList_Add( submitJson, me.blockObj.blockListObj.status_redeem_queued );
					}

					// PUT IT INSIDE OF ABOVE IF CASE?
					var passedData_Temp = passData[actionIndex - 1];
					
					var returnJson = { 'info': { 'status': 'offline' } };					
					passData.push( returnJson );

				}
				else if ( clickActionJson.url !== undefined )
				{					
					// generate url
					var url = FormUtil.generateUrl( inputsJson, clickActionJson );
					//console.log( 'url: ' + url );
					//console.log( 'inputsJson: ' + JSON.stringify( inputsJson ) );
					
					asyncCalled = true;

					var btnDivSecTag = blockDivTag.find( 'div.btnDivSec' );
					var loadingTag = $( '<div class="loadingImg" style="display: inline-block; margin-left: 8px;"><img src="images/loading.gif"></div>' );
					btnDivSecTag.append( loadingTag );


					// NOTE: This form data is saved in owner form block
					// TODO: THIS SHOULD BE ADDED TO 'QUEUE' AND LATER CHANGED TO 'SUBMIT'
					if ( clickActionJson.redeemListInsert === "true" )
					{
						me.blockObj.blockListObj.redeemList_Add( submitJson, me.blockObj.blockListObj.status_redeem_submit );
					}

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
							if ( response.ok )
							{
								response.json().then(
									function( returnJson ) 
									{

										if ( clickActionJson.alertResult === "true" )
										{
											if( returnJson.resultData.status === "success")
											{
												alert( "Success!" );
											}
											else if ( returnJson.resultData.status === "fail")
											{
												alert( "Failed!" );
											}
										}		
										
										loadingTag.remove();

										// final call..
										actionIndex++;
										passData.push( returnJson );
										me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );
									}
								);
							}
							else
							{
								alert( 'Response Failed' );
								loadingTag.remove();
								actionIndex++;
								passData.push( {} );
								me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );					
							}
						}
						else
						{
							alert( 'Response Not available' );
							loadingTag.remove();
							actionIndex++;
							passData.push( {} );
							me.recurrsiveActions( blockDivTag, formDivSecTag, actions, actionIndex, passData, returnFunc );				
						}
					});
				}
			}
		}

		return asyncCalled;
	}
}