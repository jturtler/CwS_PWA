// -------------------------------------------
// -- Block Class/Methods
function Block( cwsRenderObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
		
	// -- Sub class objects -----
	me.actionObj;
	me.blockFormObj;
	me.blockListObj;
	me.dataListObj;
	me.blockButtonObj;
	me.blockMsgObj;

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function()
	{
		me.actionObj = new Action( me.cwsRenderObj, me );
		me.blockFormObj = new BlockForm( me.cwsRenderObj, me );
		me.blockListObj = new BlockList( me.cwsRenderObj, me );		
		me.dataListObj = new DataList( me.cwsRenderObj, me );
		me.blockButtonObj = new BlockButton( me.cwsRenderObj, me );
		me.blockMsgObj = new BlockMsg( me.cwsRenderObj, me );
	}

	me.renderBlock = function( blockJson, blockId, renderBlockTag, passedData )
	{
		if ( blockJson !== undefined )
		{			
			// blockId is a random ID?  or name of the block?
			var newBlockTag = $( '<div class="block" blockId="' + blockId + '"></div>' );

			// TODO: CREATE BLOCKDATA CLASS TO HANDLE ALL THESE..
			me.cwsRenderObj.blockData[ blockId ] = {};

			// Render Form
			me.blockFormObj.renderForm( blockJson.form, newBlockTag, passedData );

			// Render List
			me.blockListObj.renderList( blockJson.list, newBlockTag, passedData );

			// Reder Data List
			me.dataListObj.initialize( passedData, blockJson );
			me.dataListObj.renderList( blockJson.list, newBlockTag );

			// Render Buttons
			me.blockButtonObj.renderBlockButtons( blockJson.buttons, newBlockTag );

			// Render Msg
			me.blockMsgObj.renderMessage( blockJson.message, newBlockTag, passedData );


			renderBlockTag.append( newBlockTag );
		}			
	}

	// -------------------------------
	
	me.initialize();
}