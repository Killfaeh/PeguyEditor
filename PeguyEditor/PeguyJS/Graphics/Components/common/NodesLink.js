function NodesLink($x1, $y1, $x2, $y2)
{
	///////////////
	// Attributs //
	///////////////
	
	var x1 = $x1;
	var y1 = $y1;
	var x2 = $x2;
	var y2 = $y2;
	var parent = null;
	
	var svgCode = '<g class="nodesLink" >'
						+ '<path id="background" class="background" />'
						+ '<path id="foreground" class="foreground" />'
					+ '</g>';
	
	var component = new Component(svgCode);
	
	//////////////
	// Méthodes //
	//////////////
	
	var update = function()
	{
		var d = 'M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2;
		
		if (x2 > x1)
		{
			d = 'M ' + x1 + ',' + y1 + ' Q ' + (x1+(x2-x1)/4.0) + ',' + y1 + ' ' + ((x1+x2)/2.0) + ',' + ((y1+y2)/2.0) 
				+ ' Q ' + (x1+3.0*(x2-x1)/4.0) + ',' + y2 + ' ' + x2 + ',' + y2;
		}
		else
		{
			var curveSize = 50;
			
			d = 'M ' + x1 + ',' + y1 + ' C ' + (x1+curveSize) + ',' + y1 + ' ' + (x1+curveSize) + ',' + (y1+(y2-y1)/4.0) + ' ' + ((x1+x2)/2.0) + ',' + ((y1+y2)/2.0) 
				+ ' C ' + (x2-curveSize) + ',' + (y1+3.0*(y2-y1)/4.0) + ' ' + (x2-curveSize) + ',' + y2 + ' ' + x2 + ',' + y2;
		}
		
		component.getById('background').setAttributeNS(null, 'd', d);
		component.getById('foreground').setAttributeNS(null, 'd', d);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getParent = function() { return parent; };
	
	// SET
	
	this.setVertex1 = function($x1, $y1)
	{
		x1 = $x1;
		y1 = $y1;
		update();
	};
	
	this.setVertex2 = function($x2, $y2)
	{
		x2 = $x2;
		y2 = $y2;
		update();
	};
	
	this.setParent = function($parent) { parent = $parent; };
	
	update();
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodesLink");