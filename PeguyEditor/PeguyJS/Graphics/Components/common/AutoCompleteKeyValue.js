function AutoCompleteKeyValue()
{
	///////////////
	// Attributs //
	///////////////
	
	var selectedKey = "";
	
	var autoComplete = new AutoComplete();

	//////////////
	// Méthodes //
	//////////////
	
	// Réimplémentation de la méthode select de l'objet AutoComplete
	this.select = function($index)
	{
		var row = this.getList()[$index];
		selectedKey = row.key;
		autoComplete.setValue(row.value);
		$this['super'].select(row.value);
		$this.onChange(selectedKey);
	};
	
	this.selectByKey = function($key)
	{
		for (var i = 0; i < this.getList().length; i++)
		{
			if ($key === this.getList()[i].key)
			{
				$this.select(i);
				i = this.getList().length;
			}
		}
	};
	
	this.autoSelect = function()
	{
		if ($this.getDisplayedLines().length === 1)
		{
			var row = $this.getList()[0];
			selectedKey = row.key;
			autoComplete.setSelectedIndex(0);
			$this.close();
		}
	};
	
	// Réimplémentation de la méthode buildInterface de l'objet AutoComplete
	this.buildInterface = function($entry, $load)
	{
		this.emptyDisplayedLines();
		var displayNum = 0;
		var displayIndex = null;
		
		for (var i = 0; i < this.getList().length; i++)
		{
			var regex = RegExp($entry.removeAccents().toLowerCase());
			
			if ($entry === "" || regex.test(dataManager.encodeHTMLEntities(this.getList()[i]).value.removeAccents().toLowerCase()))
			{
				this.getList()[i].index = i;
				
				if (this.getList()[i].key === selectedKey)
					displayIndex = displayNum;
				
				var rowHtml = '<tr index="' + i + '" displayNum="' + displayNum + '" key="' + this.getList()[i].key + '" >' 
									+ '<td><p>' + dataManager.encodeHTMLEntities(this.getList()[i].value) + '</p></td>' 
								+ '</tr>';
								
				var rowNode = autoComplete.stringToHtml(rowHtml);
				
				if (autoComplete.isEnable())
				{
					rowNode.onClick = function()
					{
						var rowIndex = this.get('index');
						$this.select(rowIndex);
						this.style.backgroundColor = 'none';
					};
					
					rowNode.onMouseOver = function()
					{
						var rowIndex = this.get('displayNum');
						$this.enlight(rowIndex);
					};
				}
				
				this.addDisplayedLine(this.getList()[i], rowNode);
				displayNum++;
			}
		}
		
		if (this.getDisplayedLines().length <= 0)
		{
			var rowHtml = '<tr class="error" ><td>' + dataManager.encodeHTMLEntities(autoComplete.getEmptyMessage()) + '</td></tr>';
			var rowNode = autoComplete.stringToHtml(rowHtml);
			autoComplete.getById('list').appendChild(rowNode);
		}
		else if (utils.isset($this.enlight))
			$this.enlight(displayIndex);
	};
	
	autoComplete.onClose = function()
	{
		if ($this.isOpen() === true)
		{
			if (!utils.isset($this.getDisplayedLines()) || $this.getDisplayedLines().length <= 0)
			{
				selectedKey = "";
				autoComplete.setValue("");
			}
			
			if (utils.isset($this.enlight))
				$this.enlight(null);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getKey = function() { return selectedKey; };

	// SET
	//this.setKey = function($key){ selectedKey = $key; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(autoComplete, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("autoCompleteKeyValue");