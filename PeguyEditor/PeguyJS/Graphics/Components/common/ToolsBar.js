function ToolsBar($iconsList, $iconsSize)
{
	////////////////
	// Attributes //
	////////////////

    var iconsList = $iconsList;
    var iconsSize = $iconsSize;

    if (!utils.isset(iconsList))
        iconsList = [];

    if (!utils.isset(iconsSize))
        iconsSize = 30;

    var map = {};

	var html = '<ul class="toolsBar" >'
				+ '</ul>';

	var component = new Component(html);

	var selectedName = null;

	/////////////
	// Methods //
	/////////////
	
	this.deselectAll = function()
	{
		var itemList = $this.getElementsByTagName('li');

		for (var i = 0; i < itemList.length; i++)
		    itemList[i].removeClass("selected");

		selectedName = null;
	};

    this.select = function($name)
    {
        $this.deselectAll();

        var itemList = $this.getElementsByTagName('li');

        for (var i = 0; i < itemList.length; i++)
        {
            if (itemList[i].getAttribute('name') === $name && $name !== selectedName)
            {
                itemList[i].addClass("selected");
                selectedName = $name;

                if (utils.isset(itemList[i].onSelect))
				    itemList[i].onSelect();
            }
        }
    };

    this.tmpSelect = function($name)
    {
        var itemList = $this.getElementsByTagName('li');

        for (var i = 0; i < itemList.length; i++)
        {
            if (itemList[i].getAttribute('name') === $name && $name !== selectedName)
                itemList[i].addClass("selected");
        }
    };

    this.tmpDeselect = function($name)
    {
        var itemList = $this.getElementsByTagName('li');

        for (var i = 0; i < itemList.length; i++)
        {
            if (itemList[i].getAttribute('name') === $name && $name !== selectedName)
                itemList[i].removeClass("selected");
        }
    };

    this.createIcon = function($param)
    {
        var item = new Component('<li id="' + $param.name + '" name="' + $param.name + '" class="iconsMenuItem" ></li>');
        item.style.width = iconsSize + 'px';
        item.style.height = iconsSize + 'px';
        var icon = Loader.getSVG($param.iconFile, $param.iconName, iconsSize, iconsSize);
        item.appendChild(icon);
		item.onSelect = $param.onSelect;

        //if (utils.isset($param.toolTip))
        //    item.onToolTip = $param.toolTip;
        
        item.onClick = function()
		{
			$this.deselectAll();

			var name = this.getAttribute('name');
			selectedName = name
			this.addClass('selected');

			if (utils.isset(this.onSelect))
				this.onSelect();
		}

        component.appendChild(item);

        map[$param.name] = item;
    };

    this.init = function()
    {
        for (var i = 0; i < iconsList.length; i++)
            $this.createIcon(iconsList[i]);
    };

    this.addIcon = function($param)
    {
        iconsList.push($param);
        $this.createIcon($param);
    };

    this.addIcons = function($iconsList)
    {
        for (var i = 0; i < $iconsList.length; i++)
        {
            iconsList.push(iconsList[i]);
            $this.createIcon(iconsList[i]);
        }
    };

    this.hide = function($name)
    {
        if (utils.isset(map[$name]))
            map[$name].style.display = 'none';
    };

    this.display = function($name)
    {
        if (utils.isset(map[$name]))
        {
            map[$name].removeAttribute('style');
            map[$name].style.width = iconsSize + 'px';
            map[$name].style.height = iconsSize + 'px';
        }
    };

	/////////////////
	// Init events //
	/////////////////
	
	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getSelected = function() { return selectedName; };

	// SET

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
    $this.init();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("toolsBar");
