function Chart($data, $width, $height)
{
	///////////////
	// Attributs //
	///////////////
	
	var data = $data;
	
	var colors = ['rgb(209, 36, 46)', 'rgb(59, 60, 104)', 'rgb(254, 194, 45)', 'rgb(90, 198, 136)', 'rgb(44, 121, 152)', 'rgb(253, 141, 46)', 'rgb(176, 213, 101)', 'rgb(143, 15, 60)'];
	var svg = SVG($width, $height);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.build = function() {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getData = function() { return data; };
	this.getColors = function() { return colors; };
	
	// SET
	
	this.setData = function($data)
	{
		data = $data;
		$this.build();
	};
	
	this.setColors = function($colors)
	{
		colors = $colors;
		$this.build();
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("chart");