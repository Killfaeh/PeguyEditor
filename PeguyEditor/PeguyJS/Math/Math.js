
Math.isPowerOf2 = function($input) 
{ 
	var output = true; 
	var input = $input; 
	
	while (input > 2)
	{
		if (input % 2 !== 0)
		{
			output = false; 
			input = 2; 
		}
		else 
			input = input/2; 
	}
	
	return output; 
};

Math.scie = function($input)
{
	var output = 0.0;
		
	if ($input > Math.PI)
	{
		while ($input > Math.PI)
			$input = $input-2*Math.PI; 
	}
	else if ($input < -Math.PI)
	{
		while ($input < -Math.PI)
			$input = $input+2*Math.PI; 
	}
		
	if ($input > 0.0)
		output = $input/Math.PI - 0.5; 
	else 
		output = -$input/Math.PI - 0.5; 
	
	return output; 
}; 

Math.roundToDigit = function($input, $digit)
{
	return Math.round($input*Math.pow(10, $digit))/Math.pow(10, $digit);
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("math");