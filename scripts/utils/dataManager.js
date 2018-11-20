// -------------------------------------------
// -- DataManager Class/Methods
//		Currently 'DataManager' uses 'localStorage' for now...
//		Should be move to IndexDB...

function DataManager() {}

// -------------------------------------
// ---- Overall Data Save/Get/Delete ---

DataManager.saveData = function( secName, jsonData ) {
	localStorage[ secName ] = JSON.stringify( jsonData );
};

DataManager.getData = function( secName ) {
	var jsonData;

	var dataStr = localStorage[ secName ];
	if ( dataStr ) jsonData = JSON.parse( dataStr );
	else jsonData = { "list": [] };

	return jsonData;
};

DataManager.deleteData = function( secName ) {
	localStorage.removeItem( secName );
};

// -------------------------------------
// ---- List Item Data Save/Get/Delete ---

DataManager.insertDataItem = function( secName, jsonInsertData ) {

	var jsonMainData = DataManager.getData( secName );

	// We assume that this has 'list' as jsonArray (of data)
	if ( jsonMainData.list === undefined ) jsonMainData.list = [];
	jsonMainData.list.push( jsonInsertData );

	DataManager.saveData( secName, jsonMainData );
};

DataManager.removeItemFromData = function( secName, id ) {

	if ( secName && id )
	{
		var jsonMainData = DataManager.getData( secName );

		// We assume that this has 'list' as jsonArray (of data)
		if ( jsonMainData.list !== undefined ) 
		{
			Util.RemoveFromArray( jsonMainData.list, "id", id )
		}

		DataManager.saveData( secName, jsonMainData );
	}
};

DataManager.getItemFromData = function( secName, id ) 
{
	var itemData;

	if ( secName && id )
	{
		var jsonMainData = DataManager.getData( secName );

		// We assume that this has 'list' as jsonArray (of data)
		if ( jsonMainData.list !== undefined ) 
		{			
			itemData = Util.getFromList( jsonMainData.list, id, "id" );			
		}
	}

	return itemData;
};


DataManager.updateItemFromData = function( secName, id, jsonDataItem ) 
{
	if ( secName && id )
	{
		var jsonMainData = DataManager.getData( secName );

		// We assume that this has 'list' as jsonArray (of data)
		if ( jsonMainData.list !== undefined ) 
		{			
			itemData = Util.getFromList( jsonMainData.list, id, "id" );

			Util.copyProperties( jsonDataItem, itemData );

			DataManager.saveData( secName, jsonMainData );			
		}
	}
};

