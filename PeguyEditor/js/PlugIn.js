function PlugIn($name, $type)
{
	////////////////
	// Attributes //
	////////////////

	var name = $name;
	var type = $type;
	this.defaultParam = {};

	if (!utils.isset(name))
		name = "plug-in";

	/////////////
	// Methods //
	/////////////

	this.createCode = function($json)
	{
		// A surcharger

		return "";
	};

	this.loadFromJSON = function($json)
	{
		name = $json.name;
		$this.defaultParam = $json.defaultParam;
	};

	////////////////////////
	// Getter and setters //
	////////////////////////


	// GET

	this.getJSON = function()
	{
		var $json = 
		{
			name: name,
			defaultParam: $this.defaultParam,
		};

		return $json;
	};

	this.getName = function() { return name; };
	this.getType = function() { return type; };
	this.getDefaultParam = function() { return $this.defaultParam; };

	// SET

	this.setName = function($name) { name = $name; };
	this.setType = function($type) { type = $type; };
	this.setDefaultParam = function($defaultParam) { $this.defaultParam = $defaultParam; };

	var $this = this;

	viewManager.addPlugInToMenu($this);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("plugin");