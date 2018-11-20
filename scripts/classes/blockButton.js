// -------------------------------------------
// -- BlockButton Class/Methods
function BlockButton( cwsRenderObj, blockObj )
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
    me.blockObj = blockObj;
		
	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() {}

	// -----------------------------------

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
	
	// -----------------------------------
	// ---- 2nd level methods -----------

	me.renderBlockButton = function( btnData, divTag )
	{
		var btnJson = FormUtil.getObjFromDefinition( btnData, me.cwsRenderObj.definitionButtons );

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

	me.setUpBtnClick = function( btnTag, btnJson )
	{
		if ( btnJson.onClick !== undefined )
		{			
			btnTag.click( function() {
				me.blockObj.actionObj.handleClickActions( btnTag, btnJson.onClick );
			});
		}
	}


	// -------------------------------
	
	me.initialize();
}