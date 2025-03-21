function ColorPalette($colorsList)
{
	///////////////
	// Attributs //
	///////////////
	
	var colorsList = $colorsList;
	var selected  = null;
	
	var html = '<div class="color-palette" >'
					+ '<table id="color-table" ></table>'
				+ '</div>';
	
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.deselectAll = function()
	{
		var cellList = component.getElementsByTagName('td');
		
		for (var i = 0; i < cellList.length; i++)
			cellList[i].removeAttribute('class');
		
		selected  = null;
	};
	
	this.buildColors = function()
	{
		component.getById('color-table').removeAllChildren();
		
		if (utils.isset(colorsList) && colorsList.length > 0)
		{
			var nbColumns = Math.ceil(Math.sqrt(colorsList.length));
			var nbRows = Math.ceil(colorsList.length/nbColumns);
			
			for (var i = 0; i < nbRows; i++)
			{
				var row = document.createElement('tr');
				
				for (var j = 0; j < nbColumns; j++)
				{
					var cell = document.createElement('td');
					row.appendChild(cell);
					
					if (i*nbColumns + j < colorsList.length)
					{
						var colorPreview = document.createElement('div');
						colorPreview.setAttribute('class', 'color-preview');
						colorPreview.setAttribute('value', colorsList[i*nbColumns + j]);
						colorPreview.style.backgroundColor = colorsList[i*nbColumns + j];
						cell.appendChild(colorPreview);
						
						colorPreview.onClick = function()
						{
							$this.deselectAll();
							selected = this;
							this.parentNode.setAttribute('class', 'selected');
							$this.onChange(this.getAttribute('value'));
						};
					}
				}
				
				component.getById('color-table').appendChild(row);
			}
		}
	};

	this.selectByValue = function($value)
	{
		var cells = component.getElementsByTagName('td');

		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			var value = cell.getElementsByTagName('div')[0].getAttribute('value');

			if (value === $value)
			{
				$this.deselectAll();
				selected = cell.getElementsByTagName('div')[0];
				cell.setAttribute('class', 'selected');
				$this.onChange(value);
				i = cells.length;
			}
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onChange = function($value) {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getColorsList = function() { return colorsList; };
	
	this.getValue = function()
	{
		var value = null;
		
		if (utils.isset(selected))
			value = selected.getAttribute('value');
		
		return value;
	};
	
	// SET
	
	this.setColorsList = function($colorsList)
	{
		colorsList = $colorsList;
		$this.buildColors();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.buildColors();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("colorPalette");