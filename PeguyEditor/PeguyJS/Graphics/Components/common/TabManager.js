function TabManager()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="tabManager" >'
					+ '<ul id="tabs" class="tabs" ></ul>'
					+ '<div id="openHiddenTabs" class="openHiddenTabs" >'
						+ '<span id="hiddenTabsCount" class="hiddenTabsCount" >0</span>'
						+ '<span id="hiddenTabsIcon" class="hiddenTabsIcon" ></span>'
						+ '<div class="wall" ></div>'
					+ '</div>'
					+ '<div id="invisibleFreezeScreen" class="invisibleFreezeScreen" ></div>'
					+ '<ul id="hiddenTabs" class="hiddenTabs" ></ul>'
					+ '<div id="content" class="content" ></div>'
				+ '</div>';

	var component = new Component(html);
	
	// Composants
	
	var openIcon = Loader.getSVG('icons', 'down-double-arrow-icon', 10, 10);
	component.getById('hiddenTabsIcon').appendChild(openIcon);
	
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	component.getById('invisibleFreezeScreen').appendChild(invisibleFreezeScreen);
	
	var hiddenTabs = component.getById('hiddenTabs');
	
	var editMode = false;
	
	// Contenu
	
	var tabList = [];
	var tabListHistory = [];
	var content = null;
	var selected = null;
	
	// Paramètres
	
	var hiddenTabsDisplayed = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.unselectAll = function()
	{
		for (var i = 0; i < tabList.length; i++)
			tabList[tabList.length-1-i].unselect();
		
		updateZindex();
	};
	
	//// Supprimer le style de survole à tout les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		
		for (var i = 0; i < tabList.length; i++)
			tabList[i].dragOut();
	};
	
	this.addTab = function($tab)
	{
		var index = tabList.indexOf($tab);
		
		if (index < 0)
		{
			tabList.push($tab);
			component.getById('tabs').appendChild($tab);
			$tab.setParent($this);
			
		}
		
		$tab.setEditMode(editMode);
		$tab.onDrag = function($x, $y) { return onDragTab($x, $y, $tab); };
		$tab.onRelease = function($tab2, $index) { return onRelease($tab2, $index); };
		$tab.select();
		$this.updateTabs();
	};
	
	this.insertTabInto = function($tab, $index)
	{
		var index = tabList.indexOf($tab);
		
		if (index >= 0)
			tabList.splice(index, 1);
		
		tabList.splice($index, 0, $tab);
		component.getById('tabs').insertAt($tab, $index);
		$tab.setParent($this);
		$tab.setEditMode(editMode);
		$tab.onDrag = function($x, $y) { return onDragTab($x, $y, $tab); };
		$tab.onRelease = function($tab2, $index) { return onRelease($tab2, $index); };
		$tab.select();
		$this.updateTabs();
	};
	
	this.removeTab = function($tab)
	{
		$tab.unselect();
		
		var index = tabList.indexOf($tab);
		
		if (index >= 0)
		{
			tabList.splice(index, 1);
			
			if (utils.isset($tab.parentNode))
				$tab.parentNode.removeChild($tab);
			
			if (content === $tab.getContent())
				component.getById('content').removeAllChildren();
			
			if ($tab === selected && tabList.length > 0)
			{
				if (index > 0)
					tabList[index-1].select();
				else
					tabList[0].select();
			}
		}
		
		$this.removeFromHistory($tab);
		
		$this.updateTabs();
	};
	
	this.removeAllTab = function()
	{
		$this.unselectAll();
		tabList = [];
		tabListHistory = [];
		content = null;
		component.getById('tabs').removeAllChildren();
		hiddenTabs.removeAllChildren();
		component.getById('content').removeAllChildren();
		
		$this.updateTabs();
	};
	
	this.addToHistory = function($tab)
	{
		var index = tabListHistory.indexOf($tab);
		
		if (index >= 0)
			tabListHistory.splice(index, 1);
		
		tabListHistory.push($tab);
	};
	
	this.removeFromHistory = function($tab)
	{
		var index = tabListHistory.indexOf($tab);
		
		if (index >= 0)
			tabListHistory.splice(index, 1);
	};
	
	this.appendContent = function($content)
	{
		content = $content;
		component.getById('content').removeAllChildren();
		component.getById('content').appendChild($content);
		
		if (utils.isset(content) && utils.isset(content.onResize))
			content.onResize();
	};
	
	var updateZindex = function()
	{
		var displayed = component.getById('tabs').childNodes;
		
		for (var i = 0; i < displayed.length; i++)
			displayed[displayed.length-1-i].style.zIndex = i;
	};
	
	this.updateTabs = function()
	{
		component.getById('tabs').removeAllChildren();
		hiddenTabs.removeAllChildren();
		component.getById('openHiddenTabs').style.display = 'block';
		
		var tabsBlockWidth = component.getById('tabs').offsetWidth - component.getById('openHiddenTabs').offsetWidth;
		
		for (var i = 0; i < tabList.length; i++)
			component.getById('tabs').appendChild(tabList[i]);
		
		var totalTabsWidth = 0;
		
		for (var i = 0; i < tabList.length; i++)
			totalTabsWidth = totalTabsWidth + tabList[i].offsetWidth;
		
		if (totalTabsWidth > tabsBlockWidth)
		{
			var rebuildWidth = 0;
			var displayed = [];
			var hidden = [];
			
			for (var i = tabListHistory.length-1; i >= 0; i--)
			{
				rebuildWidth = rebuildWidth + tabListHistory[i].offsetWidth;
				
				if (rebuildWidth >= tabsBlockWidth)
					hidden.push(tabListHistory[i]);
				else
					displayed.push(tabListHistory[i]);
			}
			
			component.getById('tabs').removeAllChildren();
			
			for (var i = displayed.length-1; i >= 0; i--)
				component.getById('tabs').appendChild(displayed[i]);
			
			for (var i = 0; i < hidden.length; i++)
				hiddenTabs.appendChild(hidden[i]);
			
			component.getById('hiddenTabsCount').innerHTML = hidden.length;
		}
		else
			component.getById('openHiddenTabs').style.display = 'none';
		
		updateZindex();
	};
	
	var resize = function()
	{
		var componentPosition = component.getById('openHiddenTabs').position();
		var componentWidth = component.getById('openHiddenTabs').offsetWidth;
		var panelWidth = hiddenTabs.offsetWidth;
		var panelHeight = hiddenTabs.offsetHeight;
		var panelPosition = hiddenTabs.position();
		
		invisibleFreezeScreen.resize(component.getById('tabs'));
		
		hiddenTabs.style.zIndex = "10000000000";
		hiddenTabs.style.minWidth = component.getById('openHiddenTabs').offsetWidth + "px";
		hiddenTabs.style.left = componentPosition.x + 'px';
		hiddenTabs.style.top = (componentPosition.y+component.getById('openHiddenTabs').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			hiddenTabs.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			hiddenTabs.style.height = (Screen.getHeight()-20) + "px";
			hiddenTabs.style.top = "7px";
			hiddenTabs.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('openHiddenTabs').offsetHeight + panelHeight > Screen.getHeight())
			hiddenTabs.style.top = (componentPosition.y-panelHeight) + "px";
	};
	
	this.autoResize = function()
	{
		
		var width = $this.offsetWidth;
		
		if (width <= 0)
			setTimeout(function() { $this.autoResize(); }, 20);
		else
			$this.onResize();
		
	};
	
	this.displayHiddenTabs = function()
	{
		invisibleFreezeScreen.display(component.getById('tabs'));
		document.getElementById('main').appendChild(invisibleFreezeScreen);
		hiddenTabs.style.display = "block";
		document.getElementById('main').appendChild(hiddenTabs);
		
		resize();
		
		hiddenTabsDisplayed = true;
	};
	
	this.hideHiddenTabs = function()
	{
		invisibleFreezeScreen.hide();
		hiddenTabs.style.display = "none";
		
		if (utils.isset(hiddenTabs.parentNode))
			hiddenTabs.parentNode.removeChild(hiddenTabs);
		
		hiddenTabsDisplayed = false;
	};
	
	var onDragTab = function($x, $y, $tab)
	{
		var overLayer = null;
		
		$this.dragOutAll();
		
		for (var i = 0; i < tabList.length; i++)
		{
			if (tabList[i] !== $tab)
			{
				overLayer = tabList[i].getOverLayer($x, $y, $tab);
				
				if (utils.isset(overLayer))
				{
					i = tabList.length;
					//overLayer.dragOver();
				}
			}
		}
		
		if (!utils.isset(overLayer))
			overLayer = $this.getById('tabs');
		
		return overLayer;
	};
	
	var onRelease = function($tab, $index) { $this.insertTabInto($tab, $index); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('openHiddenTabs').onClick = function()
	{
		if (hiddenTabsDisplayed === false)
			$this.displayHiddenTabs();
		else
			$this.hideHiddenTabs();
	};
	
	invisibleFreezeScreen.onClick = function() { $this.hideHiddenTabs(); };
	component.getById('tabs').onClick = function() { $this.hideHiddenTabs(); };
	
	this.onResize = function()
	{
		$this.updateTabs();
		
		if (hiddenTabsDisplayed === true)
			resize();

		if (utils.isset(selected) && utils.isset(selected.getContent().onResize))
			selected.getContent().onResize();
	};
	
	var onMouseMove = function($event)
	{
		for (var i = 0; i < tabList.length; i++)
		{
			if (utils.isset(tabList[i].mouseMove))
				tabList[i].mouseMove($event);
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		for (var i = 0; i < tabList.length; i++)
		{
			if (utils.isset(tabList[i].mouseUp))
				tabList[i].mouseUp($event);
		}
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);

	this.onKeyDown = function($event)
	{
		for (var i = 0; i < tabList.length; i++)
			tabList[i].onKeyDown($event);
		
		if (utils.isset(selected))
			selected.getContent().onKeyDown($event);
	};
	
	this.onKeyUp = function($event)
	{
		for (var i = 0; i < tabList.length; i++)
			tabList[i].onKeyUp($event);
		
		if (utils.isset(selected))
			selected.getContent().onKeyUp($event);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };
	this.getTabList = function() { return tabList; };
	this.getContent = function() { return content; };
	this.getSelected = function() { return selected };
	this.getHiddenTabs = function() { return hiddenTabs; };
	
	// SET
	
	this.setEditMode = function($editMode)
	{ 
		editMode = $editMode;
		
		if (editMode === true)
		{
			component.getById('tabs').addClass('editMode');
			hiddenTabs.addClass('editMode');
		}
		else
		{
			component.getById('tabs').removeClass('editMode');
			hiddenTabs.removeClass('editMode');
		}
	};
	
	this.setSelected = function($selected){ selected = $selected; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	setTimeout(function() { $this.autoResize(); }, 20);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("tabManager");