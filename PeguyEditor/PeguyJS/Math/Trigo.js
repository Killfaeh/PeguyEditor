Trigo =
{
	rad: function($input) { return $input/180.0*Math.PI; },
	deg: function($input) { return $input/Math.PI*180.0; },
	
	isometricAngle: Math.atan(0.5)/Math.PI*180,

	cartesian: function($r, $theta, $phi)
	{
		var x = $r*Math.cos($theta);
		var y = $r*Math.sin($theta);
		var output = {x: x, y: y};

		if (utils.isset($phi))
		{
			x = x*Math.cos($phi);
			y = y*Math.cos($phi);
			var z = $r*Math.sin($phi);
			output = {x: x, y: y, z: z};
		}

		return output;
	},

	polar: function($x, $y, $z)
	{
		var r = Math.sqrt($x*$x + $y*$y);
		var theta = Trigo.atan($y, $x);
		var output = {r: r, theta: theta};

		if (utils.isset($z))
		{
			var phi = Trigo.atan($z, r);
			r = Math.sqrt($x*$x + $y*$y + $z*$z);
			output = {r: r, theta: theta, phi: phi};
		}

		return output;
	},

	atan: function($y, $x)
	{
		/*
		//console.log("ATAN INPUT : " + $y + ', ' + $x);

		var output = Math.atan($y/$x); 
			
		if ($y <= 0.0 && $x < 0.0)
		{
			output = Math.atan($y/$x)-Math.PI;
			//console.log("ATAN 1 : " + output);
		}
		else if ($y >= 0.0 && $x < 0.0)
		{
			output = Math.atan($y/$x)+Math.PI;
			//console.log("ATAN 2 : " + output);
		}
		else if ($x === 0.0 && $y > 0.0)
		{
			output = Math.PI/2;
			//console.log("ATAN 3 : " + output);
		}
		else if ($x === 0.0 && $y < 0.0)
		{
			output = -Math.PI/2;
			//console.log("ATAN 4 : " + output);
		}

		//console.log("ATAN OUTPUT : " + output);
		//*/

		var output = Math.atan2($y, $x);
			
		return output; 
	},
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("trigo");