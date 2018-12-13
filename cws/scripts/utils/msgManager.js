
// -------------------------------------
// -- Static Classes - Message Manager Class

function MsgManager() {}

// --- Messaging ---
MsgManager.divMsgAreaTag;
MsgManager.spanMsgAreaCloseTag;
MsgManager.btnMsgAreaCloseTag;
MsgManager.spanMsgAreaTextTag;
MsgManager.divProgressAreaTag; //added by Greg (2018/12/06)
MsgManager.progressBar;
MsgManager.countDownNumerator = 0;  //added by Greg (2018/12/06)
MsgManager.countDownDenominator = 0; //added by Greg (2018/12/06)
MsgManager.progressBarUpdateTimer = 25; //added by Greg (2018/12/06)
MsgManager.progressCheckCount = 0; //added by Greg (2018/12/06)
MsgManager._autoHide = false; //added by Greg (2018/12/05)
MsgManager._autoHideDelay = 0; //added by Greg (2018/12/05)


MsgManager.initialSetup = function()
{
    MsgManager.divMsgAreaTag = $( '#divMsgArea' );
    MsgManager.spanMsgAreaCloseTag = $( '#spanMsgAreaClose' );
    MsgManager.btnMsgAreaCloseTag = $( '#btnMsgAreaClose' );
    MsgManager.spanMsgAreaTextTag = $( '#spanMsgAreaText' );
    MsgManager.divProgressAreaTag = $( '#divMsgProgress' ); //added by Greg (2018/12/06)

    MsgManager.btnMsgAreaCloseTag.click( function()
    {
        MsgManager.msgAreaClear( 'fast' );
        MsgManager.divProgressAreaTag.empty();
    });
}


MsgManager.msgAreaShow = function( msg, timeoutTime, countDown, ProgressTimerRefresh )
{
    if ( msg )
    {
        /* START > added by Greg (2018/12/05) */
        if ( !MsgManager._autoHide )
        {
            var dcdConf = JSON.parse( localStorage.getItem( JSON.parse( localStorage.getItem('session') ).user ) );

            if ( dcdConf && dcdConf.dcdConfig && dcdConf.dcdConfig.settings && dcdConf.dcdConfig.settings.message )
            {
                MsgManager._autoHide = dcdConf.dcdConfig.settings.message.autoHide;
                MsgManager._autoHideDelay = dcdConf.dcdConfig.settings.message.autoHideTime;
            }
        }
        /* END > added by Greg (2018/12/05) */

        MsgManager.divMsgAreaTag.hide( 'fast' );
        MsgManager.spanMsgAreaTextTag.text( '' );
    
        MsgManager.spanMsgAreaTextTag.text( msg );
        MsgManager.divMsgAreaTag.show( 'fast' );
    
        console.log( ' -- Msg: ' + msg );    

        if ( timeoutTime )
        {
            setTimeout( function() {                
                MsgManager.msgAreaClear( 'slow' );
            }, timeoutTime );
        } /* START > added by Greg (2018/12/05) */
        else
        {
            if ( countDown )
            {
                MsgManager.countDownDenominator = countDown;

                if ( ProgressTimerRefresh )
                {
                    MsgManager.progressBarUpdateTimer = ProgressTimerRefresh;
                }
                else
                {
                    MsgManager.progressBarUpdateTimer = 25;
                }
                //MsgManager.progressBar = $('<div style="background-Color:#3FFF02;width:0;height:10px;"/>'); //&nbsp;</div>
                //MsgManager.divProgressAreaTag.append( MsgManager.progressBar );
                MsgManager.divProgressAreaTag.append( $('<div style="background-Color:#50555a;width:0;height:10px;"/>') );
                MsgManager.divProgressAreaTag.show();

                MsgManager.progressCheckCount = 0

            }
            else
            {
                if ( MsgManager._autoHide )
                {
                    setTimeout( function() {                
                        MsgManager.msgAreaClear( );
                    }, MsgManager._autoHideDelay );
                }
            }
        } /* END > added by Greg (2018/12/05) */

    }
}

/* START > added by Greg (2018/12/06) */
MsgManager.updateProgressbar = function(  )
{
    MsgManager.progressCheckCount += 1;
    //console.log ( 'progressBar timer check ('+MsgManager.progressCheckCount+') : ' + MsgManager.countDownNumerator + ' / ' + MsgManager.countDownDenominator );

    if ( MsgManager.countDownNumerator === MsgManager.countDownDenominator )
    {
        MsgManager.msgAreaClear( );
    }
    else
    {
        MsgManager.divProgressAreaTag.empty();
        MsgManager.divProgressAreaTag.append( $('<div style="background-Color:#50555a;width:'+( (MsgManager.countDownNumerator / MsgManager.countDownDenominator) * 100).toFixed(0) + '%'+';height:10px;"/>') );

        /*setTimeout( function() {                
            MsgManager.updateProgressbar();
        }, MsgManager.progressBarUpdateTimer );*/
    }
}

MsgManager.incrementCounter = function( newMsg, incrementCounter )
{
    if ( newMsg ) MsgManager.spanMsgAreaTextTag.text( newMsg );

    MsgManager.countDownNumerator += incrementCounter;
    //console.log ( 'MsgManager.countDownNumerator: ' + MsgManager.countDownNumerator);

    // initialise progressBar update() timer
    //if (MsgManager.countDownNumerator == 1)
    {   
        MsgManager.updateProgressbar();

    }
    //MsgManager.progressBar.css( 'width', ( (MsgManager.countDownNumerator / MsgManager.countDownDenominator) * 100).toFixed(0) + '%' );

    //MsgManager.divProgressAreaTag.empty();
    //MsgManager.divProgressAreaTag.append( $('<div style="background-Color:#3FFF02;width:'+( (MsgManager.countDownNumerator / MsgManager.countDownDenominator) * 100).toFixed(0) + '%'+';height:10px;"/>') );

    //if ( MsgManager.countDownNumerator === MsgManager.countDownDenominator )  MsgManager.msgAreaClear( );

}
/* END > added by Greg (2018/12/06) */

MsgManager.msgAreaClear = function( speed )
{
    if ( speed ) MsgManager.divMsgAreaTag.hide( speed );
    else MsgManager.divMsgAreaTag.hide();
    if ( MsgManager.countDownNumerator ) 
    {
        MsgManager.divProgressAreaTag.empty();
        MsgManager.divProgressAreaTag.hide();
    }
}


MsgManager.initialSetup();

// -- End of Message Manager Class
// -------------------------------------
