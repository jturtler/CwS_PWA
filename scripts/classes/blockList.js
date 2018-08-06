// -------------------------------------------
// -- BlockList Class/Methods
function BlockList( cwsRenderObj, blockObj ) 
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
    me.blockObj = blockObj;        
    
    me.storageName_RedeemList = "redeemList";
    me.status_redeem_submit = "submit";
    me.status_redeem_queued = "queued";

	// -----------------------------
	// ---- Methods ----------------
	
	me.initialize = function() {}

	// -----------------------------------

    me.renderList = function( list, newBlockTag, passedData )
	{
		if ( list !== undefined )
		{
			if ( typeof list === 'string' ) 
			{
				if ( list === 'redeemList' )
				{
					me.redeemList_Display( newBlockTag );
				}
			}
		}
	}

    me.redeemList_Add = function( data, status )
    {
        var dateTimeStr = (new Date() ).toISOString();
    
        var tempJsonData = {};
        tempJsonData.title = "Voucher: " + data.voucherCode + " " + dateTimeStr;
        tempJsonData.created = dateTimeStr;
        tempJsonData.id = Util.generateRandomId();
        tempJsonData.status = status;
        tempJsonData.data = data;
    
        console.log( 'redeemList_Add' );
        console.log( tempJsonData );
    
        DataManager.insertData( me.storageName_RedeemList, tempJsonData );	
    }
    
    me.redeemList_Display = function( blockTag )
    {
        var jsonStorageData = DataManager.getData( me.storageName_RedeemList );
    
        console.log( 'redeemList_Display' );
        console.log( jsonStorageData );
    
        me.renderRedeemList( jsonStorageData.list, blockTag );	
    }
    
    me.renderRedeemList = function( redeemList, blockTag )
    {
        console.log( redeemList );
    
        if ( redeemList !== undefined )
        {
            //for( var i = 0; i < redeemList.length; i++ )
            for( var i = redeemList.length - 1; i >= 0; i-- )
            {
                me.renderRedeemListItem( redeemList[i], blockTag );
            }	
        }
    }
    
    // TODO: NEED TO COLOR THINGS DIFFERENTLY
    //		- DEPENDS ON THE STATUS - GREEN, RED, GRAY, BLUE
    me.renderRedeemListItem = function( itemData, blockTag )
    {
        var divTag = $( '<div class="redeemListDiv"></div>' );
    
        //me.setActionTagAttribute( divTag, itemData, 'id' );
        
        // Set background color of Div
        var divBgColor = "";
        
        if ( itemData.status === me.status_redeem_submit ) divBgColor = 'LightGreen';
        else if ( itemData.status === me.status_redeem_queued ) divBgColor = 'LightGray';
                
        if ( divBgColor != "" ) divTag.css( 'background-color', divBgColor );
    
    
        // Set Text..
        var spanTitleTag = $( '<span class="titleSpan"></span>' );
        spanTitleTag.text( itemData.title );
    
        divTag.append( spanTitleTag );
    
        divTag.click( function() {
            me.submitForListedItem( itemData, $( this ) );
        } );
    
        // TODO: Add click event for display data?
    
    
        blockTag.append( divTag );
    }
    
    /*
    RedeemList.setActionTagAttributes = function( actionTag, actionJson )
    {
        // We could set all the attributes, but for now, just below ones.
        me.setActionTagAttribute( actionTag, actionJson, 'actionId' );
        me.setActionTagAttribute( actionTag, actionJson, 'nextBlock' );
        me.setActionTagAttribute( actionTag, actionJson, 'nextBlock_Offline' );
    }
    
    RedeemList.setActionTagAttribute = function( actionTag, actionJson, propName )
    {
        if ( actionJson[ propName ] !== undefined ) actionTag.attr( propName, actionJson[ propName ] );
    }
    */	
    
    me.submitForListedItem = function( itemData, queueTag )
    {
        console.log( itemData );
        /*
        // TODO: 'isOffline' works?
        if ( FormUtil.isOffline() )
        {
            queueTag.css( 'background-color', 'orange' );
    
            setTimeout( function() {
                alert( 'Not Online!!' );
    
                queueTag.css( 'background-color', '#d6d6e8' );
            }, 200 );
        }
        else
        {
            var url = me.getServerUrl() + "/eRefWSTest/api/submitForQueue";
            
            // TODO: this is part that should be moved to web service..
            queueData.processed = "Processed at " + (new Date() ).toISOString();
            //queueData.id = Util.generateRandomId();
            queueData.status = "processed";					
            var dataId = queueData.id;
            queueTag.css( 'background-color', 'lightGreen' );
    
    
            fetch( url, {  
                method: 'POST',  
                //headers: { 'auth': '1234' },  
                body: JSON.stringify( queueData )
            })
            .then( response => response.json() )  
            .then( responseJson => {
    
                console.log( 'Removal Request success: ', responseJson);  
    
                // This worked..
                DataManager.removeItemFromData( me.storageName_Queue, queueData.id );
                            
                // get the tag...
                //var divTag = $( '#' + dataId ); // '<div class="queueDiv"></div>' );
                queueTag.css( 'background-color', 'yellow' ).hide( 500 );
    
                //me.renderQueueList( responseJson.list, blockTag );
    
                // Queue refresh, etc..
                alert( 'submitted data: ' + JSON.stringify( queueData ) );
    
            })  
            .catch(function (error) {  
            console.log('Request failure: ', error);  
            });			
        }	
        */
    }

	// -------------------------------
	
	me.initialize();
}