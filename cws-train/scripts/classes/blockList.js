// -------------------------------------------
// -- BlockList Class/Methods
function BlockList( cwsRenderObj, blockObj ) 
{
    var me = this;

    me.cwsRenderObj = cwsRenderObj;
    me.blockObj = blockObj;        

    me.redeemList;

    me.storageName_RedeemList = "redeemList";
    me.status_redeem_submit = "submit";
    me.status_redeem_queued = "queued";
    me.status_redeem_failed = "failed";
	
	
	// TODO: NEED TO IMPLEMENT
	// =============================================
	// === TEMPLATE METHODS ========================



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
                    
                    // Add Event from 'FormUtil'
                    //  - To Enable click
                    FormUtil.setUpTabAnchorUI( newBlockTag.find( 'ul.tab__content_act') );
                                
                    me.setFloatingListMenuIconEvents( newBlockTag.find( '.floatListMenuIcon' ), newBlockTag.find( '.floatListMenuSubIcons' ) );
				}
			}
		}
    }
    
    
    me.redeemList_Display = function( blockTag )
    {
        var jsonStorageData = DataManager.getOrCreateData( me.storageName_RedeemList );
        
        me.renderRedeemList( jsonStorageData.list, blockTag );	
    }
   
    me.renderRedeemList = function( redeemList, blockTag )
    {   
        // Remove any previous render.
        blockTag.find( 'div.listDiv' ).remove();

        // Copy from list html template
        $( '#listTemplateDiv > div.listDiv' ).clone().appendTo( blockTag );

        var listContentUlTag = blockTag.find( '.tab__content_act' );

        console.log( redeemList );
        me.redeemList = redeemList;

        
        // By the list data, populate/render the data/tags
        if ( redeemList === undefined || redeemList.length == 0 )
        {
            var divTag = $( '<div class="emptyListDiv" style="min-height: 40px; margin: 10px;"></div>' );
        
            var spanTag = $( '<span style="color: #888; font-weight: bold;">List is empty.</span>' );

            divTag.append( spanTag );

            blockTag.append( divTag );
        }
        else
        {
            var arrNewFirst = redeemList.reverse();
            for( var i = 0; i < arrNewFirst.length; i++ )
            {
                me.renderRedeemListItemTag( arrNewFirst[i], listContentUlTag );                 
            }	
        }  
    }


    // TODO: Split into HTML frame create and content populate?
    // <-- Do same for all class HTML and data population?  <-- For HTML create vs 'data populate'/'update'

    me.renderRedeemListItemTag = function( itemData, listContentUlTag )
    {    
        var itemAttrStr = 'itemId="' + itemData.id + '"';

        var liContentTag = $( '<li ' + itemAttrStr + '></li>' );

        // Anchor for clickable header info
        var anchorTag = $( '<a class="expandable" ' + itemAttrStr + '></a>' );
        
        var dateTimeStr = $.format.date( itemData.created, "dd MMM yyyy - hh:MM a");

        var dateTimeTag = $( '<div class="icon-row"><img src="img/act.svg">' + dateTimeStr + '</div>' );
        var expandArrowTag = $( '<div class="icon-arrow"><img class="expandable-arrow" src="img/arrow_down.svg"></div>' );

        var statusSecDivTag = $( '<div class="icons-status"><small class="statusName" style="color: #7dd11f;">open</small><small class="statusIcon"><img src="img/open.svg"></small><small><img src="img/sync-n.svg"></small></div>' );

        // me.setStatusOnTag( statusSecDivTag, itemData ); 


        var voucherTag = $( '<div class="act-r"><small><b>ZW12 cc</b> - eVoucher</small></div>' );

        anchorTag.append( dateTimeTag, expandArrowTag, statusSecDivTag, voucherTag );


        // Content that gets collapsed/expanded 
        var contentDivTag = $( '<div class="act-l" ' + itemAttrStr + ' style="position: relative; background-color: beige;"></div>' );
        contentDivTag.append( '<span>' + itemData.title + '</span>' );
        var itemActionButtonsDivTag = $( '<div class="listItemDetailActionButtons"></div>' );
        contentDivTag.append( itemActionButtonsDivTag );

        // Click Events
        me.setContentDivClick( contentDivTag );


        // Append to 'li'
        liContentTag.append( anchorTag, contentDivTag );

        // Append the liTag to ulTag
        listContentUlTag.append( liContentTag );



        // Populate the Item Content
        me.populateData_RedeemItemTag( itemData, liContentTag );

    }


    me.populateData_RedeemItemTag = function( itemData, itemLiTag )
    {    
        var statusSecDivTag = itemLiTag.find( 'div.icons-status' );

        me.setStatusOnTag( statusSecDivTag, itemData ); 

        var itemActionButtonsDivTag = itemLiTag.find( 'div.act-l div.listItemDetailActionButtons');

        // Click Events
        me.submitButtonListUpdate( itemActionButtonsDivTag, itemLiTag, itemData );

    }

    me.setStatusOnTag = function( statusSecDivTag, itemData ) 
    {
        /*
        var statusTag = $( '<div class="icons-status">
                <small class="statusName open-color">open</small>
                <small class="statusIcon"><img src="img/open.svg"></small>
        */

        var smallStatusNameTag = statusSecDivTag.find( 'small.statusName' );
        var imgStatusIconTag = statusSecDivTag.find( 'small.statusIcon img' );

        if ( itemData.status === me.status_redeem_submit )
        {
            smallStatusNameTag.text( 'submitted' ).css( 'color', '#e48825' );
            imgStatusIconTag.attr( 'src', 'img/lock.svg' );
        }
        else if ( itemData.status === me.status_redeem_failed )
        {
            smallStatusNameTag.text( 'failed' ).css( 'color', '#e48825' );
            imgStatusIconTag.attr( 'src', 'img/lock.svg' );
        }
        else
        {
            smallStatusNameTag.text( 'open' ).css( 'color', '#7dd11f' );
            imgStatusIconTag.attr( 'src', 'img/open.svg' );
        }            
    }


    me.setContentDivClick = function( contentDivTag )
    {
        contentDivTag.click( function() {

            contentDivClickedTag = $( this );

            var itemId = contentDivClickedTag.attr( 'itemId' );

            var itemClicked = Util.getFromList( me.redeemList, itemId, "id" );
            console.log( 'itemDiv clicked - ' + JSON.stringify( itemClicked ) ); // + itemAnchorTag.outerHtml() );
        });        
    }


    me.submitButtonListUpdate = function( itemActionButtonsDivTag, itemLiTag, itemData )
    {        
        // remove previous ones
        itemActionButtonsDivTag.find( 'button.actionBtn' ).remove();

        if ( itemData.status == !me.status_redeem_submit )
        {

            // TODO: var syncBtnTag = // $( '.syncBtn' );
            var btnRedeemSubmitTag = $( '<button class="actionBtn btnSubmitRedeem">submit</button>' );

            itemActionButtonsDivTag.append( btnRedeemSubmitTag );


            btnRedeemSubmitTag.click( function(e) {
                e.stopPropagation();                
    
                console.log( ' === itemData: ' );
                console.log( itemData );
    
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
                            
                            // TODO: NEED TO REFERSH THE ITEM INFO/STATUS
                            //me.toggleDetail( itemData, listItemTag );
                        }
                        else 
                        {
                            itemData.status = me.status_redeem_failed;
                        }    
                        
                        DataManager.updateItemFromData( me.storageName_RedeemList, itemData.id, itemData );
    
                        me.populateData_RedeemItemTag( itemData, itemLiTag );
                    } );
                }
            });
        }

        //if ( itemData.status != me.status_redeem_submit ) itemActionButtonsDivTag.append( btnRedeemSubmitTag );
    }

    // -----------------------------
    // Old Toggling Event
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
	// =============================================


	// =============================================
	// === OTHER METHODS ========================
    
    me.renderRedeemListItemTag_Old = function( itemData, divItemTag )
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
    
    me.redeemList_Reload = function( listItemTag )
    {
        var blockTag = listItemTag.closest( 'div.block' );
        blockTag.find( 'div.redeemListDiv' ).remove();
        me.redeemList_Display( blockTag );
        // me.toggleDetail( itemData, listItemTag );
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
	// =============================================


	// =============================================
	// === EVENTS METHODS ========================

    me.setFloatingListMenuIconEvents = function( iconTag, SubIconListTag )
	{
		FormUtil.setClickSwitchEvent( iconTag, SubIconListTag, [ 'on', 'off' ] );		
	}

	// =============================================
	
	me.initialize();
}