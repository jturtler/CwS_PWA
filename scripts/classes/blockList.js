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
    me.status_redeem_failed = "failed";

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

    me.redeemList_Add = function( submitJson, status )
    {
        var dateTimeStr = (new Date() ).toISOString();

        var tempJsonData = {};
        tempJsonData.title = "Voucher: " + submitJson.payloadJson.voucherCode + " - " + dateTimeStr;
        tempJsonData.created = dateTimeStr;
        tempJsonData.id = Util.generateRandomId();
        tempJsonData.status = status;
        tempJsonData.data = submitJson;
    
        DataManager.insertDataItem( me.storageName_RedeemList, tempJsonData );	
    }
    
    me.redeemList_Display = function( blockTag )
    {
        var jsonStorageData = DataManager.getOrCreateData( me.storageName_RedeemList );
        
        me.renderRedeemList( jsonStorageData.list, blockTag );	
    }
    
    me.redeemList_Reload = function( listItemTag )
    {
        var blockTag = listItemTag.closest( 'div.block' );
        blockTag.find( 'div.redeemListDiv' ).remove();
        me.redeemList_Display( blockTag );
        // me.toggleDetail( itemData, listItemTag );
    }

    me.renderRedeemList = function( redeemList, blockTag )
    {    
        if ( redeemList === undefined || redeemList.length == 0 )
        {
            var divTag = $( '<div class="emptyListDiv" style="min-height: 40px; margin: 10px;"></div>' );
        
            var spanTag = $( '<span style="color: #888; font-weight: bold;">List is empty.</span>' );

            divTag.append( spanTag );

            blockTag.append( divTag );
        }
        else
        {
            //for( var i = 0; i < redeemList.length; i++ )
            for( var i = redeemList.length - 1; i >= 0; i-- )
            {
                me.renderRedeemListItem( redeemList[i], blockTag );
            }	
        }
    }
    
    me.renderRedeemListItem = function( itemData, blockTag )
    {
        var divItemTag = $( '<div class="redeemListDiv" expand="false"></div>' );
        
        blockTag.append( divItemTag );

        me.renderRedeemListItemTag( itemData, divItemTag );
    }

    me.renderRedeemListItemTag = function( itemData, divItemTag )
    {    
        // Set status color
        me.updateDivStatusColor( itemData.status, divItemTag );
       
        // Set Text..
        var spanTitleTag = $( '<span class="titleSpan"></span>' );
        spanTitleTag.text( itemData.title );
    
        divItemTag.append( spanTitleTag );
    
        divItemTag.off( 'click' ).click( function() {
            me.toggleDetail( itemData, $( this ) );
            // me.submitForListedItem( itemData, $( this ) );
        } );
    }

    me.updateDivStatusColor = function( status, divTag )
    {
        // Set background color of Div
        var divBgColor = "";
            
        if ( status === me.status_redeem_submit ) divBgColor = 'LightGreen';
        else if ( status === me.status_redeem_queued ) divBgColor = 'LightGray';
        else if ( status === me.status_redeem_failed ) divBgColor = 'Tomato';
                
        if ( divBgColor != "" ) divTag.css( 'background-color', divBgColor );         
    }

    
    me.toggleDetail = function( itemData, listItemTag )
    {
        var expandStr = listItemTag.attr( 'expand' );

        if ( expandStr === 'true' )
        {
            // collapse - if found
            listItemTag.find( 'div.listItemDetail' ).hide( 'fast' );

            listItemTag.attr( 'expand', 'false' );
        }
        else
        {
            // expand - if not exists, create one..
            listItemTag.find( 'div.listItemDetail' ).remove();

            divListItemDetailTag = $( '<div class="listItemDetail"></div>' ); 
            listItemTag.append( divListItemDetailTag ).attr( 'expand', 'true' );

            var spanDetailTag = $( '<span></span>' ); 
            spanDetailTag.text( JSON.stringify( itemData.data.payloadJson ) );

            divListItemDetailTag.append( spanDetailTag );


            // Add buttons - 'close' and 'submit'?
            var divButtonsTag = $( '<div class="listItemDetailActionButtons" style="margin-top: 5px;"></div>' );

            var btnCloseTag = $( '<button class="actionBtn btnCloseListItemDetail">Close</button>' );
            var btnRemoveTag = $( '<button class="actionBtn btnRemoveListItemDetail">Remove</button>' );
            var btnRedeemSubmitTag = $( '<button class="actionBtn btnSubmitRedeem">Redeem Submit</button>' );

            btnCloseTag.click( function(e) {
                e.stopPropagation();
                me.toggleDetail( itemData, listItemTag );
            });

            btnRemoveTag.click( function(e) {
                e.stopPropagation();                
                DataManager.removeItemFromData( me.storageName_RedeemList, itemData.id );                
                me.redeemList_Reload( listItemTag );
            });
            
            btnRedeemSubmitTag.click( function(e) {
                e.stopPropagation();                

                // if offline, alert it!!
                if ( ConnManager.isOffline() )
                {
                    alert( 'Currently in offline.  Need to be in online for this.' );
                }
                else
                {
                    var loadingTag = $( '<div class="loadingImg" style="display: inline-block; margin-left: 8px;"><img src="images/loading.gif"></div>' );
                    divButtonsTag.append( loadingTag );
                    FormUtil.submitRedeem( itemData.data.url, itemData.data.payloadJson, itemData.data.actionJson, loadingTag, function( success, returnJson )
                    {
                        console.log( 'Redeem submittion isSucccess: ' + success );
    
                        if ( success )
                        {
                            itemData.status = me.status_redeem_submit;
                            itemData.returnJson = returnJson;
                            
                            me.toggleDetail( itemData, listItemTag );
                        }
                        else 
                        {
                            itemData.status = me.status_redeem_failed;
                        }    
                        
                        DataManager.updateItemFromData( me.storageName_RedeemList, itemData.id, itemData );
                            
                        me.renderRedeemListItemTag( itemData, listItemTag );
                    } );
                }
            });


            divButtonsTag.append( btnCloseTag );
            divButtonsTag.append( btnRemoveTag );
            if ( itemData.status != me.status_redeem_submit ) divButtonsTag.append( btnRedeemSubmitTag );
            
            divListItemDetailTag.append( divButtonsTag );

        }
    }


    me.submitForListedItem = function( itemData, queueTag )
    {
        console.log( itemData );
        /*
        // TODO: 'isOffline' works?
        if ( ConnManager.isOffline() )
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