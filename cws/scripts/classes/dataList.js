// -------------------------------------------
// -- BlockList Class/Methods
function DataList( cwsRenderObj, blockObj ) 
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
    me.blockObj = blockObj;
    me.blockJson;        

    me.jsonListData;
	
	
	// TODO: NEED TO IMPLEMENT
	// =============================================
	// === TEMPLATE METHODS ========================



	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function( jsonListData, blockJson ) 
    {
        me.jsonListData = jsonListData;
        me.blockJson = blockJson;
    }

	// -----------------------------------

    me.renderList = function( list, newBlockTag )
	{
		if ( list !== undefined )
		{
			if ( typeof list === 'string' ) 
			{
				if ( list === 'dataList' )
				{
					me.dataList_Display( newBlockTag );
				}
			}
		}
	}

    me.dataList_Display = function( blockTag )
    {
        console.log ( me.jsonListData );
        me.renderDataList( me.jsonListData.displayData, blockTag );	
    }
    

    me.renderDataList = function( jsonList, blockTag )
    {    
        if ( jsonList === undefined || jsonList.length == 0 )
        {
            var divTag = $( '<div class="emptyListDiv" style="min-height: 40px; margin: 10px;"></div>' );
        
            var spanTag = $( '<span style="color: #888; font-weight: bold;">List is empty.</span>' );

            divTag.append( spanTag );

            blockTag.append( divTag );
        }
        else
        {
            for( var i = 0; i < jsonList.length; i++ )
            {
                 var divItemTag = $( '<div class="inputDiv itemBlock" idx="' + i + '"></div>' );
                 //var divLITag = $( '<li itemid="' + i + '"/>' );

                 var divATag = $( '<a class="" idx="' + i + '" itemid="' + i + '"/>' );
                 var itemData = me.convertData( me.jsonListData, i );

                 //blockTag.append( divLITag );                 
                 blockTag.append( divItemTag );
                 divItemTag.append( divATag );
console.log( jsonList[i] );
                 me.renderIconTag( jsonList[i], divATag );
                 me.renderItemTag( jsonList[i], divATag );
                 me.renderButtons( itemData, divATag );

            }	
        }
    }

    me.renderItemTag = function ( itemData, divItemTag )
    {
        //console.log( me.blockJson.displayResult );
        for( var i = 0; i< me.blockJson.displayResult.length; i++ )
        {
            for( var j = 0; j < itemData.length; j++ )
            {
                if( itemData[j].id === me.blockJson.displayResult[i] )
                {
                   
                    me.renderDataValueTag( itemData[j], divItemTag );
                }
            }  
        }
    }
    
    me.renderButtons = function( itemData, blockTag )
    {
        me.blockObj.blockButtonObj.renderBlockButtons( me.blockJson.itemButtons, blockTag, itemData );
    }

    me.renderIconTag = function( valueData, parentItemTag )
    {
        // Set Icons..
        var iconListTag = $( '<div class="icons-status" style="padding:2px;width:100%;"> <small class="voucherIcon"><img src="img/voucher.svg"></small> <small class="statusIcon"><img src="img/open.svg"></small> <strong> ' + ((valueData.length) ? 'VOUCHER ID: '+valueData[0].value : '') +' </strong> </div>' );
        parentItemTag.append( iconListTag );
    }

    me.renderDataValueTag = function( valueData, divItemTag )
    {    
        // Set Text..
        var spanDivTag = $( '<div style="padding:2px;"> ' + valueData.displayName + " : <b>" + valueData.value + '</b></div>' );
        divItemTag.append( spanDivTag );
    }

    me.convertData = function( jsonList, idx )
    {
        var converted = {};
        converted.resultData = JSON.parse( JSON.stringify( jsonList.resultData ) );
        converted.displayData = JSON.parse( JSON.stringify( jsonList.displayData[idx] ) );
        return converted;
    }
    
	// -------------------------------
	
	// me.initialize();
}