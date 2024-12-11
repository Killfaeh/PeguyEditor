function NotificationsManager()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="notifications" >'
					
				+ '</div>';
				
	var component = new Component(html);
	
	var notifications = [];
	
	//////////////
	// Méthodes //
	//////////////

	this.addNotification = function($notification)
	{
		notifications.push($notification);
		$this.insertAt($notification, 0);
		//$notification.setParent($this);
	};
	
	this.insertNotificationInto = function($notification, $index)
	{
		notifications.splice($index, 0, $notification);
		$this.insertAt($notification, $index);
		//$notification.setParent($this);
	};
	
	this.removeNotification = function($notification)
	{
		var index = notifications.indexOf($notification);
		
		while (index >= 0)
		{
			if (index > -1)
				notifications.splice(index, 1);
			
			index = notifications.indexOf($notification);
		}
		
		var parent = $notification.parentNode;
		
		if (parent === $this)
			$this.removeChild($notification);
		
		return $notification;
	};
	
	this.push = function($html, $persistent)
	{
		new Notification($this, $html, $persistent);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("notificationsManager");