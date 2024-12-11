function Table($nbColumns, $nbRows)
{
	///////////////
	// Attributs //
	///////////////

	var nbColumns = $nbColumns;
	var nbRows = $nbRows;

	var content = '';
	
	for (var i = 0; i < nbRows; i++)
	{
		content = content + '<tr>';
		
		for (var j = 0; j < nbColumns; j++)
			content = content + '<td></td>';
		
		content = content + '</tr>';
	}

	var html = '<table class="table" >' + content + '</table>';
				
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	
	this.getRow = function($row)
	{
		var row = null;
		var rows = [];
		
		for (var i = 0; i < component.childNodes.length; i++)
		{
			if (utils.isset(component.childNodes[i].tagName) && component.childNodes[i].tagName.toLowerCase() === 'tr')
				rows.push(component.childNodes[i]);
		}
		
		if ($row >= 0 && $row < rows.length)
			row = rows[$row];
		
		return row;
	};
	
	this.getCell = function($col, $row)
	{
		var cell = null;
		var row = $this.getRow($row);
		
		if (utils.isset(row))
		{
			var cells = [];
			
			for (var i = 0; i < row.childNodes.length; i++)
			{
				if (utils.isset(row.childNodes[i].tagName) && (row.childNodes[i].tagName.toLowerCase() === 'td' || row.childNodes[i].tagName.toLowerCase() === 'th'))
					cells.push(row.childNodes[i]);
			}
			
			if ($col >= 0 && $col < cells.length)
				cell = cells[i]
		}
		
		return cell;
	};
	
	this.getCellValue = function($col, $row)
	{
		var value = null;
		var cell = $this.getCell($col, $row);
		
		if (utils.isset(cell))
			value = cell.innerHTML;
		
		return value;
	};
	
	// SET
	
	this.setCellValue = function($col, $row, $value)
	{
		var cell = $this.getCell($col, $row);
		
		if (utils.isset(cell))
			cell.innerHTML = $value;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("table");