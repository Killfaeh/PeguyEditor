function LabelList()
{
	////////////////
	// Attributes //
	////////////////
	
	var html = '<div class="labelList" ></div>';

	var component = new Component(html);
	
	var labelList = [];

	/////////////
	// Methods //
	/////////////

	this.addLabel = function($label)
	{
		var index = labelList.indexOf($label);
		
		if (index < 0)
		{
			labelList.push($label);
			component.appendChild($label);
			$label.setParent($this);
		}
		
		$this.onChange();
	};

	this.insertLabelInto = function($label, $index)
	{
		var index = labelList.indexOf($label);
		
		if (index >= 0)
			labelList.splice(index, 1);
		
		labelList.splice($index, 0, $label);
		component.insertAt($label, $index);
		$label.setParent($this);
		$this.onChange();
	};

	this.removeLabel = function($label)
	{
		var index = labelList.indexOf($label);
		
		if (index >= 0)
		{
			labelList.splice(index, 1);
			
			if (utils.isset($label.parentNode))
				$label.parentNode.removeChild($label);
			
			$this.onChange();
		}
	};

	this.removeAllLabel = function()
	{
		labelList = [];
		component.removeAllChildren();
		$this.onChange();
	};
	

	/////////////////
	// Init events //
	/////////////////

	this.onChange = function() {};

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getLabelList = function() { return labelList; };

	this.getJSON = function()
	{
		var jsonTable = [];

		for (var i = 0; i < labelList.length; i++)
			jsonTable.push(labelList[i].getJSON());

		return jsonTable;
	};

	// SET

	this.setLabelList = function($labelList) { labelList = $labelList; };

	this.loadFromJSON = function($json)
	{
		for (var i = 0; i < $json.length; i++)
		{
			var label = new Label($json[i].label);
			label.loadFromJSON($json[i]);
			$this.addLabel(label);
		}
	};

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("labelList");
