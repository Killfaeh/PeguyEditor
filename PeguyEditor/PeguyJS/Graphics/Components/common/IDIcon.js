function IDIcon($firstname, $name, $img)
{
	////////////////
	// Attributes //
	////////////////

	var firstname = $firstname;
	var name = $name;
	var img = $img;

	var html = '<div class="idIcon" >'
					+ '<div id="name" >' + firstname.charAt(0).toUpperCase() + name.charAt(0).toUpperCase() + '</div>'
					+ '<div id="avatar" class="avatar" ></div>'
					+ '<div class="wall" ></div>'
				+ '</div>';

	var component = new Component(html);

	/////////////
	// Methods //
	/////////////

	var updateName = function()
	{
		component.getById('name').innerHTML = firstname.charAt(0).toUpperCase() + name.charAt(0).toUpperCase();
		component.onToolTip = firstname + ' ' + name;
	};

	var updateAvatar = function()
	{
		if (utils.isset(img))
		{
			component.getById('avatar').empty();
			component.getById('avatar').appendChild(img);
			component.getById('name').style.display = 'none';
			component.getById('avatar').style.display = 'inline-block';
		}
		else
		{
			component.getById('name').style.display = 'inline-block';
			component.getById('avatar').style.display = 'none';
		}
	};
	
	/////////////////
	// Init events //
	/////////////////
	
	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getFirstname = function() { return firstname; };
	this.getName = function() { return name; };
	this.getImg = function() { return img; };

	// SET

	this.setFirstname = function($firstname)
	{
		firstname = $firstname;
		updateName();
	};
	
	this.setName = function($name)
	{
		name = $name;
		updateName();
	};
	
	this.setImg = function($img)
	{
		img = $img;
		updateAvatar();
	};

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	updateName();
	updateAvatar();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("iDIcon");
