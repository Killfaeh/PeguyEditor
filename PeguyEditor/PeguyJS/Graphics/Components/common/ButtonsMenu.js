function ButtonsMenu($buttonsList)
{
	////////////////
	// Attributes //
	////////////////

    var buttonsList = $buttonsList;

    if (!utils.isset(buttonsList))
    buttonsList = [];

    var map = {};

	var html = '<div class="buttonsMenu" >'
				+ '</div>';

	var component = new Component(html);

	/////////////
	// Methods //
	/////////////
	
    this.createButton = function($param)
    {
        var item = new Button($param.name);

        //if (utils.isset($param.toolTip))
        //    item.onToolTip = $param.toolTip;
        
        item.onAction = $param.action;

        component.appendChild(item);

        map[$param.name] = item;
    };

    this.init = function()
    {
        for (var i = 0; i < buttonsList.length; i++)
            $this.createButton(buttonsList[i]);
    };

    this.addButton = function($param)
    {
        buttonsList.push($param);
        $this.createButton($param);
    };

    this.addButtons = function($buttonsList)
    {
        for (var i = 0; i < $buttonsList.length; i++)
        {
            buttonsList.push(buttonsList[i]);
            $this.createButton(buttonsList[i]);
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
            map[$name].removeAttribute('style');
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
	Loader.hasLoaded("buttonsMenu");
