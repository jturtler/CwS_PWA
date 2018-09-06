
function Validation( cwsRenderObj, blockObj, pageTag )
{
	var me = this;

	me.cwsRenderObj = cwsRenderObj;
	me.blockObj = blockObj;
	me.pageTag = pageTag;

	me.COLOR_WARNING = "#f19c9c";
	
	// ------------------------------------

	/* me.init = function() {
		me.setUp_isNumberOnly_OlderBrowserSupport( me.pageTag );
	} */
	
    me.setUp_Events = function( formTag )
    {
        formTag.find( "input,select,textarea" ).each( function() {
            var inputTag = $(this);
            inputTag.change( function(){
                me.checkValidations( inputTag );
            });
        });
    }

	// ================================
	// == Tag Validations
	
	me.checkFormEntryTagsData = function( formTag )
	{	
		var allValid = true;

		// If any of the tag is not valid, mark it as invalid.
		formTag.find( "input,select,textarea" ).each( function() {
			if ( !me.checkValidations( $(this) ) )
			{
				allValid = false;
			}
		});
				
		return allValid;
	};
	

   /* me.setUp_isNumberOnly_OlderBrowserSupport = function( formTag ) {

		// Support for older browser number only keypress
		formTag.find("[isNumber='true']").keypress( function(e) {
			return e.charCode >= 48 && e.charCode <= 57;
		});		
	}; */

	me.checkValidations = function( tag )
	{	
		// Validation Initial Setting Clear
		tag.attr( 'valid', 'true' );
		var divTag = tag.closest( "div" );
		divTag.find( "span.errorMsg" ).remove();
		
		if ( tag.is( ':visible' ) )
		{		
			me.performValidationCheck( tag, 'mandatory', divTag );
			me.performValidationCheck( tag, 'minlength', divTag );
			me.performValidationCheck( tag, 'maxlength', divTag );
			me.performValidationCheck( tag, 'maxvalue', divTag );
			me.performValidationCheck( tag, 'isNumber', divTag );
			me.performValidationCheck( tag, 'phoneNumber', divTag );
		}

		var valid = ( tag.attr( 'valid' ) == 'true' );
		
		// If not valid, set the background color.
		tag.css( 'background-color', ( ( valid ) ? '' : me.COLOR_WARNING ) );
		
		return valid;
	};
	
	me.performValidationCheck = function( tag, type, divTag )
	{		
		// check the type of validation (if exists in the tag attribute)
		// , and if not valid, set the tag as '"valid"=false' in the attribute
		var valid = true;
		var validationAttr = tag.attr( type );
		
		// If the validation attribute is present in the tag and not empty string or set to false
		if ( validationAttr && validationAttr !== 'false' )
		{									
			
			if ( type == 'mandatory' ) valid = me.checkRequiredValue( tag, divTag );
			else if ( type == 'minlength' ) valid = me.checkValueLen( tag, divTag, 'min', Number( validationAttr ) );
			else if ( type == 'maxlength' ) valid = me.checkValueLen( tag, divTag, 'max', Number( validationAttr ) );
			else if ( type == 'maxvalue' ) valid = me.checkValueRange( tag, divTag, 0, Number( validationAttr ) );
			else if ( type == 'exactlength' ) valid = me.checkValueLen( tag, divTag, 'exactlength', Number( validationAttr ) );
			else if ( type == 'isNumber' ) valid = me.checkNumberOnly( tag, divTag );
			else if ( type == 'phoneNumber' ) valid = me.checkPhoneNumberValue( tag, divTag );
			
			if ( !valid ) tag.attr( 'valid', false );
		}		
	};
	
	
	// ------------------------------
	// -- Each type validation

	me.checkRequiredValue = function( inputTag, divTag )
	{
		var valid = true;
		var value = inputTag.val();

		if( !value && !me.checkFalseEvalSpecialCase() )
		{
			divTag.append( me.getErrorSpanTag( 'This field is required' ) );
			valid = false;
		}
		
		return valid;
	};
	
	me.checkValueLen = function( inputTag, divTag, type, length )
	{		
		var valid = true;
		var value = inputTag.val();
		
		if ( value && type == 'min' && value.length < length )
		{
			divTag.append( me.getErrorSpanTag( 'Please enter at least ' + length  + ' characters' ) );
			valid = false;
		}
		else if ( value && type == 'max' && value.length > length )
		{
			divTag.append( me.getErrorSpanTag( 'Please enter at most ' + length + ' characters' ) );
			valid = false;
		}
		else if ( value && type == 'exactlength' && value.length != length )
		{
			divTag.append( me.getErrorSpanTag( 'Please enter exactly ' + length + ' characters' ) );
			valid = false;
		}
		

		return valid;
	};


	me.checkValueRange = function( inputTag, divTag, valFrom, valTo )
	{
		var valid = true;
		var value = inputTag.val();
		
		if ( value && ( valFrom > value || valTo < value ) )
		{
			divTag.append( me.getErrorSpanTag( 'The value should be less than or equal to ' + valTo ) );
			valid = false;
		}
		
		return valid;		
	};

	me.checkNumberOnly = function( inputTag, divTag )
	{
		var valid = true;
		var value = inputTag.val();
		var reg = new RegExp( /^\d+$/ );
		
		if ( value && !reg.test( value ) )
		{
			divTag.append( me.getErrorSpanTag( 'Please enter number only' ) );
			valid = false;
		}
		
		return valid;		
	};
	
	me.checkPhoneNumberValue = function( inputTag, divTag )
	{
		var valid = true;
		
		// Check if Phone number is in [ 12, 15 ]
		inputTag.attr( 'altval', '' );

		var validationInfo = me.phoneNumberValidation( inputTag.val() );		
		if ( !validationInfo.success ) 
		{
			divTag.append( me.getErrorSpanTag( validationInfo.msg ) );
			valid = false;			
		}
		else
		{
			// If valid phone number, put the converted phone number as attribute to be used later.
			inputTag.attr( 'altval', validationInfo.phoneNumber );
		}
		
		return valid;
	};
	
	

	me.phoneNumberValidation = function( phoneVal )
	{
		var success = false;
		var finalPhoneNumber = '';
		var msg = '';


		// Trim value
		var value = Util.trim( phoneVal );

		// Starts with '00'
		if ( Util.startsWith( value, "00" ) )
		{
			if ( !( value.length >= 12 && value.length <= 15 ) )
			{
				msg += 'Number should be 9 digits long (w/o country code)';
			}
			else
			{
				// convert first 00 to '+'
				finalPhoneNumber = '+' + value.substring( 2 );
				success = true;
			}
		}
		else if ( Util.startsWith( value, "06" ) || Util.startsWith( value, "07" ) )
		{
			if ( value.length != 10 )
			{
				msg += "Number should start with '+2588' or '002588'";
			}
			else
			{
				var preVal = '';

				if ( Util.startsWith( value, "06" ) )
				{
					preVal = '+2556';
				}
				else if ( Util.startsWith( value, "07" ) )
				{
					preVal = '+2557';
				}

				finalPhoneNumber = preVal + value.substring( 2 );
				success = true;
			}
		}
		else
		{
			msg += "Number should start with '+2588' or '002588'";
		}

		
		return { 'success': success, 'phoneNumber': finalPhoneNumber, 'msg': msg };	
	}

	// -----------------------------
	// -- Others
	
	me.getErrorSpanTag = function( keyword, optionalStr )
	{
		optionalStr = ( optionalStr ) ? optionalStr : '';
		var text = keyword + optionalStr;
		return  $( "<span class='errorMsg' keyword='" + keyword + "'> " + text + "</span>" );
	};
	
	me.clearTagValidations = function( tags )
	{
		tags.css( "background-color", "" ).val( "" ).attr( "altval", "" );
		
		tags.each( function() {
			$( this ).closest( "div" ).find( "span.errorMsg" ).remove();
		});		
	};	
	
	// Some values like string 'false', 'NaN', '-0' '+0' are evaluated as false.
	me.checkFalseEvalSpecialCase = function( value ) {
		return ( value !== undefined && value != null && value.length > 0 );
	};
		
	// -----------------------------------------------------------------------
	// RUN Init method
	// -----------------------------------------------------------------------
	
	// me.init();
	
}