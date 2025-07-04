function Polynomial($coef)
{
	///////////////
	// Attributs //
	///////////////

	var coef = $coef;

	if (!utils.isset(coef))
		coef = [];

	//////////////
	// Méthodes //
	//////////////

	this.f = function($x)
	{
		var y = 0.0;

		for (var i = 0; i < coef.length; i++)
			y = y + coef[i]*Path.pow($x, coef.length-i-1);

		return y;
	};

	this.roots = function()
	{
		// A implémenter si possible

		return [];
	};

	this.coefFromPoints = function($points, $size)
	{
		coef = [];

		for (var i = 0; i < $size; i++)
			coef.push(0.0);

		// Faudra ajouter un calcul généraliste si c'est possible

		return coef;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getCoef = function() { return coef; };

	// SET

	this.setCoef = function($coef) { coef = $coef; };

	var $this = this;
}

function LinearFunction($a, $b)
{
	///////////////
	// Attributs //
	///////////////

	var polynomial = new Polynomial([$a, $b]);

	//////////////
	// Méthodes //
	//////////////

	this.f = function($x)
	{
		var coef = $this.getCoef();
		var y = 0.0;

		if (coef[0] === "infinity")
			y = NaN;
		else
			y = coef[0]*$x + coef[1];

		return y;
	};

	this.roots = function()
	{
		/*
		a*x + b = 0
		a*x = -b
		x = -b/a
		*/

		var coef = $this.getCoef();
		var roots = [];

		if (coef[0] === "infinity")
			roots = [coef[1]];
		else if (coef[0] !== 0.0)
			roots = [-coef[1]/coef[0]];

		return roots;
	};

	this.coefFromPoints = function($points)
	{
		// Renvoyer une erreur si le nombre de points est différent de 2

		var coef = [0.0, 0.0];
			
		if ($points[0][0] !== $points[1][0])
		{
			coef[0] = ($points[1][1]-$points[0][1])/($points[1][0]-$points[0][0]); 
			coef[1] = $points[0][1] - coef[0]*$points[0][0]; 
		}
		else 
		{
			coef[0] = "infinity"; 
			coef[1] = $points[0][0]; 
		}

		$this.setCoef(coef);
		return coef;
	};

	this.coefFromA = function($a, $point)
	{
		var coef = [$a, 0.0];
		
		if ($a === 'infinity')
			coef[1] = $point[0];
		else
			coef[1] = $point[1] - $a*$point[0];
		
		$this.setCoef(coef);
		return coef;
	};

	this.coefFromTheta = function($theta)
	{
		var coef = [0.0, 0.0];

		if ($theta === Math.PI/2 || $theta === -Math.PI/2)
			coef[0] = "infinity";
		else
			coef[0] = Math.sin($theta)/Math.cos($theta);

		$this.setCoef(coef);
		return coef;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	// SET

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(polynomial, this);
	return $this; 
}

function Polynomial2($a, $b, $c)
{
	///////////////
	// Attributs //
	///////////////

	var polynomial = new Polynomial([$a, $b, $c]);

	//////////////
	// Méthodes //
	//////////////

	this.f = function($x)
	{
		var coef = $this.getCoef();
		var y = coef[0]*$x*$x + coef[1]*$x + coef[2];
		return y;
	};

	this.roots = function()
	{
		var coef = $this.getCoef();

		var rootsR = [];
		var rootsI = [];
		var rootsC = [];
		
		var a = coef[0];
		var b = coef[1];
		var c = coef[2];
		var delta = b*b - 4*a*c;
		
		if (delta >= 0)
		{
			if (a !== 0)
			{
				if (delta === 0)
					rootsR.push(-b/(2*a));
				else
				{
					rootsR.push((-b - Math.sqrt(delta))/(2*a));
					rootsR.push((-b + Math.sqrt(delta))/(2*a));
				}
			}
			else if (b !== 0)
				rootsR.push(-c/b);
		}
		else
		{
			if (b !== 0)
			{
				rootsC.push({ r: -b/(2*a),i: -Math.sqrt(-delta)/(2*a) });
				rootsC.push({ r: -b/(2*a),i: Math.sqrt(-delta)/(2*a) });
			}
			else
			{
				rootsI.push(-Math.sqrt(-delta)/(2*a));
				rootsI.push(Math.sqrt(-delta)/(2*a));
			}
		}

		return rootsR;
	};

	this.coefFromPoints = function($points)
	{
		// Renvoyer une erreur si le nombre de points est différent de 3

		var coef = [0.0, 0.0, 0.0];

		/*
			y1 = ax1*x1 + bx1 + c
			y2 = ax2*x2 + bx2 + c
			y3 = ax3*x3 + bx3 + c
		 */
		
		/*
		if ($points[0][0] !== $points[1][0])
		{
			coef[0] = ($points[1][1]-$points[0][1])/($points[1][0]-$points[0][0]); 
			coef[1] = $points[0][1] - coef[0]*$points[0][0]; 
		}
		else 
		{
			coef[0] = "infinity"; 
			coef[1] = $points[0][0]; 
		}
		//*/

		$this.setCoef(coef);
		return coef;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	// SET

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(polynomial, this);
	return $this; 
}

Polynomials =
{
	linearIntersection: function($linearFunction1, $linearFunction2)
	{
		var output = [];

		var coef1 = $linearFunction1.getCoef();
		var coef2 = $linearFunction2.getCoef();

		// a1*x + b1 = a2*x + b2
		// (a1-a2)*x = b2-b1
		// x = (b2-b1)/(a1-a2)
			
		var x = 0;
		var y = 0;
			
		if (coef1[0] !== coef2[0])
		{
			if (coef1[0] !== "infinity" && coef2[0] !== "infinity")
			{	
				x = (coef2[1]-coef1[1])/(coef1[0]-coef2[0]); 
				y = coef1[0]*x + coef1[1]; 
			}
			else if (coef1[0] === "infinity")
			{
				x = coef1[1]; 
				y = coef2[0]*x + coef2[1]; 
			}
			else if (coef2[0] === "infinity")
			{
				x = coef2[1]; 
				y = coef1[0]*x + coef1[1]; 
			}

			output = [x, y]; 
		}
			
		return output; 
	},
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("polynomial");