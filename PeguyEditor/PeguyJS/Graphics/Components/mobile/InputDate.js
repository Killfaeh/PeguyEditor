function InputDate($date)
{
	///////////////
	// Attributs //
	///////////////

	var today = new Date();
	var date = $date;
	
	if (!utils.isset(date))
		date = new Date();
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var weekStart = 1;
	var start = new Date();
	var end = new Date();
	
	var disableFuture = false;
	var open = false;
	
	var html = '<div class="inputDate" >'
					+ '<div class="selectedDate" ><input type="date" id="selectedDate" name="selectedDate" /></div>'
					+ '<div class="displayedDate" ><input type="text" id="displayedDate" name="displayedDate" autocomplete="off" readonly="readonly" /></div>'
					+ '<label for="selectedDate" id="mask" class="mask" ></label>'
				+ '</div>';
				
	var component = new Component(html);
	
	if (/android/.test(navigator.userAgent.toLowerCase()))
	{
		component.getById('displayedDate').parentNode.style.display = "none";
	}
	
	//////////////
	// Méthodes //
	//////////////
	
	var select = function($date)
	{
		date = today;
		
		if (disableFuture === false || (disableFuture === true && $date <= today.getSQLFormat()))
			date = $date.getDate();
		
		component.getById('selectedDate').value = date.getSQLFormat();
		
		year = date.getFullYear();
		month = date.getMonth();
		component.getById('displayedDate').set("value", DAYNAMES[date.getDay()] + ' ' + date.getDate() + ' ' + MONTHNAMES[month]);
		
		if (utils.isset($this) && utils.isset($this.onChange))
			$this.onChange();
	};
	
	select(date.getSQLFormat());
	
	this.clear = function()
	{
		date = new Date();
		select(date.getSQLFormat());
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	
	//component.getById('selectedDate').onchange = function()
	component.getById('selectedDate').onChange = function()
	{
		select(component.getById('selectedDate').value);
		$this.onChange(component.getById('selectedDate').value);
	}
	
	component.getById('displayedDate').onClick = function()
	{
		component.getById('selectedDate').focus();
	};
	
	component.getById('displayedDate').onfocus = function()
	{
		component.getById('seletedDate').focus();
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getDate = function() { return date; };
	this.isOpen = function() { return open; };
	
	// SET
	
	this.setDate = function($date)
	{
		date = $date;
		select(date.getSQLFormat());
	};
	
	this.setDisableFuture = function($disableFuture) { disableFuture = $disableFuture; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputDate");