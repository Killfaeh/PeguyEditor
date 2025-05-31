function Calendar($date, $autoresize)
{
	///////////////
	// Attributs //
	///////////////
	
	var dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	var today = new Date();
	var date = $date;
	
	if (!utils.isset(date))
		date = new Date();
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var weekLength = 7;
	var weekStart = 0;
	
	var start = new Date();
	var end = new Date();
	
	var autoresize = $autoresize;
	
	if (!utils.isset(autoresize))
		autoresize = true;
	
	var enable = true;
	var disableFuture = false;
	var shortMode = false;
	var open = false;
	
	var changedByUser = false;
	
	var html = '<div class="calendar" >'
					+ '<p><input type="text" id="selectedDate" class="selectedDate" name="selectedDate" autocomplete="off" readonly="readonly" /></p>'
					+ '<div id="invisibleFreezeScreen" class="invisibleFreezeScreen" ></div>'
					+ '<div id="panel" class="calendarPanel panel" >'
						+ '<p id="navigation" class="navigation" >'
							+ '<span id="previousMonth" class="previousMonth" >◄</span>'
							+ '<span id="month" ></span>'
							+ '<span id="nextMonth" class="nextMonth" >►</span>'
						+ '</p>'
						+ '<table>'
							+ '<thead><tr id="week" ></tr></thead>'
							+ '<tbody id="days" ></tbody>'
						+ '</table>'
						+ '<p><input id="today" class="today" type="button" value="' + KEYWORDS.today + '" /></p>'
					+ '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	component.getById('invisibleFreezeScreen').appendChild(invisibleFreezeScreen);
	var panel = component.getById('panel');
	var navigation = component.getById('navigation');
	var previousMonth = component.getById('previousMonth');
	var currentMonth = component.getById('month');
	var nextMonth = component.getById('nextMonth');
	var week = component.getById('week');
	var days = component.getById('days');
	var todayButton = component.getById('today');
	
	panel.style.display = 'none';
	
	//////////////
	// Méthodes //
	//////////////
	
	var select = function($date)
	{
		if (enable === true)
		{
			date = today;
			
			if (disableFuture === false || (disableFuture === true && $date <= today.getSQLFormat()))
				date = $date.getDate();
			
			year = date.getFullYear();
			month = date.getMonth();
			buildInterface();
			$this.onChange(date.getSQLFormat());
		}
	};
	
	var resize = function()
	{
		var componentPosition = component.getById('selectedDate').position();
		var componentWidth = component.getById('selectedDate').offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();
		
		invisibleFreezeScreen.resize(component.getById('selectedDate'));
		
		panel.style.zIndex = "10000000000";
		panel.style.minWidth = component.getById('selectedDate').offsetWidth + "px";
		panel.style.left = (componentPosition.x + (componentWidth-panelWidth)/2.0) + 'px';
		panel.style.top = (componentPosition.y+component.getById('selectedDate').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('selectedDate').offsetHeight + panelHeight > Screen.getHeight())
			panel.style.top = (componentPosition.y-panelHeight) + "px";
	};
	
	var autoResize = function()
	{
		if (autoresize === true)
		{
			var dateContentSize = utils.getInputTextSize(component.getById('selectedDate'));
			
			if (dateContentSize.width <= 0)
				setTimeout(function() { autoResize(); }, 20);
			else
				component.getById('selectedDate').style.width = (dateContentSize.width+20) + 'px';
		}
		
		invisibleFreezeScreen.resize(component.getById('selectedDate'));
	};
	
	var resizeCircles = function()
	{
		var nums = component.getElementsByClassName('today');
		
		for (var i = 0; i < nums.length; i++)
		{
			if (nums[i].tagName.toLowerCase() !== 'input')
				nums[i].style.width = (nums[i].offsetHeight)-6 + "px";
		}
		
		nums = component.getElementsByClassName('selected');
		
		for (var i = 0; i < nums.length; i++)
			nums[i].style.width = (nums[i].offsetHeight)-6 + "px";
	};
	
	var buildInterface = function()
	{
		//// Réinitialisation ////
		
		currentMonth.removeAllChildren();
		week.removeAllChildren();
		days.removeAllChildren();
		
		//// Construction ////
		
		var displayedDay = date.getDate();
		month = date.getMonth();
		var displayedMonth = month+1;
		year = date.getFullYear();
		
		if (displayedDay < 10)
			displayedDay = "0" + displayedDay;
			
		if (displayedMonth < 10)
			displayedMonth = "0" + displayedMonth;
		
		//component.getById('selectedDate').set("value", DAYNAMES[date.getDay()] + ' ' + date.getDate() + ' ' + MONTHNAMES[month] + ' ' + year);
		
		if (shortMode === true)
			component.getById('selectedDate').set("value", date.toLocaleDateString(undefined));
		else
			component.getById('selectedDate').set("value", date.toLocaleDateString(undefined, dateFormatOptions));
		
		currentMonth.appendChild(utils.createText(" " + MONTHNAMES[month] + " " + year + " "));
		
		// Jours de la semaine
		
		for (var i = 0; i < weekLength; i++)
		{
			var dayNum = i + weekStart;
			
			if (dayNum >= 7)
				dayNum -= 7;
				
			var dayName = DAYNAMES[dayNum].substring(0, 3) + ".";
			var dayHtml = '<th class="dayName" >' + dayName + '</th>';
			var dayNode = component.stringToHtml(dayHtml);
			week.appendChild(dayNode);
		}
		
		//// Jours ////
		
		// Récupération des bornes de la période à afficher 
		
		var startMonth = new Date(year, month, 1);
		var startNum = startMonth.getDay()-weekStart;
		
		if (startNum < 0)
			startNum += 7;
		
		start = new Date();
		start.setTime(startMonth.getTime() - DateUtils.dayToTime(startNum));
		
		var endMonth = new Date(year, month + 1, 0);
		var endNum = endMonth.getDay()-weekStart;
		
		if (endNum < 0)
			endNum += 7;
			
		end = new Date();
		end.setTime(endMonth.getTime() + DateUtils.dayToTime(6-endNum));
		
		var weeksNb = Math.round(DateUtils.timeToDay(end.getTime()-start.getTime())/7);
		
		// Affichage des jours 
		
		var daysHtml = '<table>';
		
		for (var i = 0; i < weeksNb; i++)
		{
			var displayWeek = false;
			var dayHtml = '<tr>';
			
			for (var j = 0; j < weekLength; j++)
			{
				var day = new Date();
				day.setTime(start.getTime() + DateUtils.dayToTime(i*7 + j) + DateUtils.dayToTime(0.5)); // On prend le jour à midi pour gérer le cas des changements d'heure
				var sqlDay = day.getSQLFormat();
				
				if ((j <= 0 || j >= weekLength-1) && day.getMonth() === date.getMonth())
					displayWeek = true;
				
				if (day.getSQLFormat() === today.getSQLFormat() || day.getSQLFormat() === date.getSQLFormat())
				{
					dayHtml += '<td date="' + sqlDay + '" >';
					
					if (day.getSQLFormat() === today.getSQLFormat())
						dayHtml +=	 '<span class="today" >';
					else if (day.getSQLFormat() === date.getSQLFormat())
						dayHtml +=	 '<span class="selected" >';
					
					dayHtml +=		 day.getDate();
					dayHtml +=	 '</span>';
					dayHtml += '</td>';
				}
				else
				{
					if (day.getMonth() !== month)
						dayHtml += '<td class="otherMonth" date="' + sqlDay + '" >';
					else if (day.getDay() === 0 || day.getDay() === 6)
						dayHtml += '<td class="weekend" date="' + sqlDay + '" >';
					else
						dayHtml += '<td date="' + sqlDay + '" >';
					
					dayHtml += day.getDate();
					dayHtml += '</td>';
				}
			}
			
			dayHtml += '</tr>';
			
			if (displayWeek === true)
				daysHtml += dayHtml;
		}
		
		daysHtml += '</table>';

		daysNode = component.stringToHtml(daysHtml);
		
		while (daysNode.firstChild)
			days.appendChild(daysNode.firstChild);
			
		daysNode = days.getElementsByTagName('td');
		
		for (var i = 0; i < daysNode.length; i++)
		{
			daysNode[i].onClick = function()
			{
				var selectedDate = this.getAttribute("date");
				select(selectedDate);
				$this.close();
				changedByUser = true;
			};
		}
		
		//resizeSelectedDate();
		setTimeout(function() { autoResize(); }, 20);
		resizeCircles();
	};
	
	buildInterface();

	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true)
		{
			$this.onOpen();
			panel.setStyle("display", "block");
			var calendarWidth = component.offsetWidth;
			var panelWidth = panel.offsetWidth;
			//panel.style.left = ((calendarWidth-panelWidth)/2) + 'px';
	
			resizeCircles();
			
			// Gérer le cas où la liste sort de l'écran
			//var panelHeight = panel.offsetHeight;
			//var panelPosition = panel.position();
			
			//if (panelPosition.y + panelHeight > Screen.getHeight())
				//panel.setStyle("top", (-panelHeight-component.getById('selectedDate').offsetHeight) + "px");
			
			invisibleFreezeScreen.display(component.getById('selectedDate'));
			document.getElementById('main').appendChild(invisibleFreezeScreen);
			panel.style.display = "block";
			document.getElementById('main').appendChild(panel);
			
			resize();
			
			open = true;
		}
	};
	
	this.close = function()
	{
		if (utils.isset(panel.parentNode))
			panel.parentNode.removeChild(panel);
		
		panel.removeAttribute('style');
		panel.style.display = "none";
		invisibleFreezeScreen.hide();
		//document.getElementById('main').removeChild(invisibleFreezeScreen);
		open = false;
	};
	
	/*
	this.onRemove = function()
	{
		var index = document.getElementById('main').onClick.indexOf(this.close);
		
		if (index >= 0)
			document.getElementById('main').onClick.splice(index, 1);
	};
	//*/
	
	var changeMonth = function($month, $year)
	{
		var dayNum = date.getDate();
		var lastDayOfTheMonth = (new Date($year, $month, 0)).getDate();
		
		if (dayNum > lastDayOfTheMonth)
			dayNum = lastDayOfTheMonth;
			
		if (dayNum < 10)
			dayNum = '0' + dayNum;
			
		$month++;
		
		if ($month < 10)
			$month = '0' + $month;
		
		select($year + '-' + $month + '-' + dayNum);
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	
	component.getById('selectedDate').onClick = function()
	{
		if (enable === true)
		{
			if (panel.style.display === 'block')
				$this.close();
			else
				$this.open();
		}
	};
	
	previousMonth.onClick = function()
	{
		if (enable === true)
		{
			month--;
			
			if (month < 0)
			{
				month = 11;
				year--;
			}
			
			changeMonth(month, year);
			changedByUser = true;
		}
	};
	
	nextMonth.onClick = function()
	{
		if (enable === true)
		{
			month++;
			
			if (month > 11)
			{
				month = 0;
				year++;
			}
			
			changeMonth(month, year);
			changedByUser = true;
		}
	};
	
	todayButton.onClick = function()
	{
		if (enable === true)
		{
			date = new Date();
			select(date.getSQLFormat());
			buildInterface();
			$this.close();
			changedByUser = true;
		}
	};
	
	panel.onClick = function() {}; // Pour empêcher la fermeture quand on clique en dehors des boutons
	//document.getElementById('main').onClick.push(this.close);
	
	invisibleFreezeScreen.onClick = function() { $this.close(); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getDate = function() { return date; };
	this.isEnable = function() { return enable; };
	this.isOpen = function() { return open; };
	this.isChangedByUser = function() { return changedByUser; };
	
	// SET
	
	this.setDate = function($date)
	{
		if (enable === true)
		{
			date = $date;
			buildInterface();
			changedByUser = false;
		}
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable === true)
			component.getById('selectedDate').removeAttribute('disabled');
		else
			component.getById('selectedDate').setAttribute('disabled', 'disabled');
	};
	
	this.setDisableFuture = function($disableFuture) { disableFuture = $disableFuture; };
	this.setShortMode = function($shortMode) { shortMode = $shortMode; };
	this.setChangedByUser = function($changedByUser) { changedByUser = $changedByUser; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("calendar");