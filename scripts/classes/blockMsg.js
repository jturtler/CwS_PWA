// -------------------------------------------
// -- BlockMsg Class/Methods
function BlockMsg( cwsRenderObj, blockObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
	me.blockObj = blockObj;

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() { }

	// ------------------------------------
	
	me.renderMessage = function( messageJson, blockTag, passedData )
	{
		formDivSecTag = $( '<div class="formDivSec"></div>' );
		blockTag.append( formDivSecTag );

		if( messageJson != undefined && messageJson.type === "responseMessage" )
		{
			var arrMsg = passedData.resultData.msg.split( "-- " );

			for( var i in arrMsg )
			{
				formDivSecTag.append( arrMsg[i] + "<br>" );
			}
		}
	}
	
	// -------------------------------
	
	me.initialize();
}