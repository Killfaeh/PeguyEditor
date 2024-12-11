function IconsMenu($iconsList, $iconsSize)
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

	var html = '<ul class="iconsMenu" >'
				+ '</ul>';

	var component = new Component(html);

	/////////////
	// Methods //
	/////////////
	
    this.createIcon = function($param)
    {
        var item = new Component('<li id="' + $param.name + '" class="iconsMenuItem" ></li>');
        item.style.width = iconsSize + 'px';
        item.style.height = iconsSize + 'px';
        var icon = Loader.getSVG($param.iconFile, $param.iconName, iconsSize, iconsSize);
        item.appendChild(icon);

        //if (utils.isset($param.toolTip))
        //    item.onToolTip = $param.toolTip;
        
        item.onClick = $param.action;

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

	// SET

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
    $this.init();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("iconsMenu");
