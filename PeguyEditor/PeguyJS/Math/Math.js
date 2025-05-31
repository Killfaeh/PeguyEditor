
Math.toRad = function($input) { return $input/180.0*Math.PI; };
Math.toDeg = function($input) { return $input/Math.PI*180.0; };

Math.toCartesian = function($r, $theta, $phi)
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
};

Math.toPolar = function($x, $y, $z)
{
	var r = Math.sqrt($x*$x + $y*$y);
	var theta = Math.arctan($y, $x);
	var output = {r: r, theta: theta};

	if (utils.isset($z))
	{
		var phi = Math.arctan($z, r);
		r = Math.sqrt($x*$x + $y*$y + $z*$z);
		output = {r: r, theta: theta, phi: phi};
	}

	return output;
};

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

Math.isometricAngle = Math.atan(0.5)/Math.PI*180;

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
	
Math.arctan = function($y, $x)
{
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
		 
	return output; 
};

Math.getDistance = function($x1, $y1, $x2, $y2)
{
	var dX = $x2-$x1;
	var dY = $y2-$y1;
	
	return Math.sqrt(dX*dX + dY*dY);
};

Math.getAffineEquation = function($x1, $y1, $x2, $y2)
{
	var a = 0; 
	var b = 0; 
		
	if ($x1 !== $x2)
	{
		a = ($y2-$y1)/($x2-$x1); 
		b = $y1 - a*$x1; 
	}
	else 
	{
		a = "infinity"; 
		b = $x1; 
	}
		
	return {a: a, b: b}; 
}; 

Math.getAffineEquationFromA = function($a, $x, $y)
{
	var b = 0;
	
	if ($a === 'infinity')
		b = $x;
	else
		b = $y - $a*$x;
	
	return {a: $a, b: b}; 
};

Math.getAffineEquationFromTheta = function($theta)
{
	var a = 0;

	if ($theta === Math.PI/2 || $theta === -Math.PI/2)
		a = "infinity";
	else
		a = Math.sin($theta)/Math.cos($theta);

	return {a: a, b: 0}; 
};

Math.getAffinePoint = function($a1, $b1, $a2, $b2)
{
	// a1*x + b1 = a2*x + b2
	// (a1-a2)*x = b2-b1
	// x = (b2-b1)/(a1-a2)
		
	var x = 0; 
	var y = 0; 
		
	if ($a1 !== $a2)
	{
		if ($a1 !== "infinity" && $a2 !== "infinity")
		{	
			x = ($b2-$b1)/($a1-$a2); 
			y = $a1*x + $b1; 
		}
		else if ($a1 === "infinity")
		{
			x = $b1; 
			y = $a2*x + $b2; 
		}
		else if ($a2 === "infinity")
		{
			x = $b2; 
			y = $a1*x + $b1; 
		}
	}
	else
	{
		x = "infinity"; 
		y = "infinity"; 
	}
		
	return {x: x, y: y}; 
};

Math.getPolynomialRoots2 = function($polynomial)
{
	var rootsR = [];
	var rootsI = [];
	var rootsC = [];
	
	var a = $polynomial.a;
	var b = $polynomial.b;
	var c = $polynomial.c;
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
	
	return { r: rootsR, i: rootsI, c: rootsC};
};

Math.getAffineEllipseSection = function($affine, $ellipse)
{
	var vertices = [];
	
	if ($ellipse.a === 0 || $ellipse.b === 0)
	{
		if ($ellipse.a === 0)
			vertices.push(Math.getAffinePoint($affine.a, $affine.b, "infinity", 0));
		else
			vertices.push(Math.getAffinePoint($affine.a, $affine.b, 0, $ellipse.offsetY));
	}
	else if ($affine.a === "infinity")
	{
		vertices.push(
		{
			x: $affine.b,
			y: Math.sqrt(1 - $affine.b*$affine.b/($ellipse.a*$ellipse.a))*$ellipse.b + $ellipse.offsetY
		});
		
		vertices.push(
		{
			x: $affine.b,
			y: -Math.sqrt(1 - $affine.b*$affine.b/($ellipse.a*$ellipse.a))*$ellipse.b + $ellipse.offsetY
		});
	}
	else
	{
		var polynomial = 
		{
			a: (-$ellipse.b*$ellipse.b/($ellipse.a*$ellipse.a)-$affine.a*$affine.a),
			b: 2*$affine.a*($ellipse.offsetY - $affine.b),
			c: $ellipse.b*$ellipse.b - $affine.b*$affine.b + 2*$affine.b*$ellipse.offsetY - $ellipse.offsetY*$ellipse.offsetY
		};
		
		var roots = Math.getPolynomialRoots2(polynomial);

		for (var i = 0; i < roots.r.length; i++)
			vertices.push({ x: roots.r[i], y: $affine.a*roots.r[i] + $affine.b });
	}
	
	/*
	
	x*x/(eA*eA) + y*y/(eB*eB) = 1
	y*y/(eB*eB) = 1 - x*x/(eA*eA)
	y*y = (1 - x*x/(eA*eA))*(eB*eB)
	y = Math.sqrt(1 - x*x/(eA*eA))*eB
	
	y = Math.sqrt(1 - x*x/(eA*eA))*eB + offsetY
	
	y = aA*x + aB
	
	Math.sqrt(1 - x*x/(eA*eA))*eB + offsetY = aA*x + aB
	
	Math.sqrt(1 - x*x/(eA*eA))*eB = aA*x + aB - offsetY
	(1 - x*x/(eA*eA))*eB*eB = (aA*x + aB - offsetY)*(aA*x + aB - offsetY)
	eB*eB - x*x*eB*eB/(eA*eA) = aA*aA*x*x + 2*aA*(aB - offsetY)*x + (aB - offsetY)*(aB - offsetY)
	
	(-eB*eB/(eA*eA)-aA*aA)*x*x - 2*aA*(aB - offsetY)*x + eB*eB - (aB - offsetY)*(aB - offsetY)
	
	(-eB*eB/(eA*eA)-aA*aA)*x*x + 2*aA*(offsetY - aB)*x + eB*eB - aB*aB + 2*aB*offsetY - offsetY*offsetY
	
	*/
	
	return vertices;	
};

Math.getPerspectiveFromVertices = function($vertex1, $vertex2, $vertex3, $vertex4)
{
	var persp = {};
	
	var x1 = $vertex1.x;
	var y1 = $vertex1.y;
	var x2 = $vertex2.x;
	var y2 = $vertex2.y;
	var x3 = $vertex3.x;
	var y3 = $vertex3.y;
	var x4 = $vertex4.x;
	var y4 = $vertex4.y;
	
	// Récupération des équations des droites à partir des points
	
	var line1 = Math.getAffineEquation(x1, y1, x2, y2);
	var line2 = Math.getAffineEquation(x3, y3, x4, y4);
	var line3 = Math.getAffineEquation(x1, y1, x3, y3);
	var line4 = Math.getAffineEquation(x2, y2, x4, y4);
	
	persp.wrap = 
	{
		vertex1: $vertex1, vertex2: $vertex2, vertex3: $vertex3, vertex4: $vertex4,
		line1: line1, line2: line2, line3: line3, line4: line4
	};
	
	// Calcul des points de fuite
	
	var vPoint = Math.getAffinePoint(line3.a, line3.b, line4.a, line4.b);
	var hPoint = Math.getAffinePoint(line1.a, line1.b, line2.a, line2.b);
	
	persp.vVertex = vPoint;
	persp.hVertex = hPoint;
	
	// Calcul de la ligne d'horizon
	
	var horizon = {a: "infinity", b: "infinity"}; 
	
	if (vPoint.x !== "infinity" && hPoint.x !== "infinity")
		horizon = Math.getAffineEquation(vPoint.x, vPoint.y, hPoint.x, hPoint.y); 
	
	persp.horizon = horizon;
	
	if (horizon.b !== "infinity")
	{
		// Calculer une droite parallèle à la ligne d'horizon
		
		var ref = {a: horizon.a, b: "infinity"}; 
		
		if (ref.a === "infinity")
			ref.b = x1; 
		else 
			ref.b = y1-ref.a*x1; 
		
		persp.ref = ref;
		
		// Calcul de l'interval de projection des coordonnées verticales
		
		var refPoint3 = Math.getAffinePoint(line3.a, line3.b, ref.a, ref.b); 
		var refPoint4 = Math.getAffinePoint(line4.a, line4.b, ref.a, ref.b); 
		
		// Calcul de l'interval de projection des coordonnées horizontales
		
		var refPoint1 = Math.getAffinePoint(line1.a, line1.b, ref.a, ref.b); 
		var refPoint2 = Math.getAffinePoint(line2.a, line2.b, ref.a, ref.b); 
		
		persp.projection =
		{
			vertical: { vertex1: refPoint3, vertex2: refPoint4 },
			horizontal: { vertex1: refPoint1, vertex2: refPoint2 },
		};
	}
	else if (line1.a !== line2.a || line3.a !== line4.a)
	{
		if (line1.a === line2.a)
		{
			persp.horizon = Math.getAffineEquationFromA(line1.a, vPoint.x, vPoint.y);
			persp.ref = line1;
		}
		else if (line3.a !== line4.a)
		{
			persp.horizon = Math.getAffineEquationFromA(line3.a, hPoint.x, hPoint.y);
			persp.ref = line3;
		}
	}
	
	return persp;
};

Math.getXProjection = function($plan, $vertex)
{
	var projection = { vertex1: $vertex, vertex2: $vertex };
	
	if ($plan.wrap.line1.a === $plan.wrap.line2.a)
	{
		projection.vertex1 = 
		{
			x: ($plan.wrap.vertex2.x-$plan.wrap.vertex1.x)*$vertex.x + $plan.wrap.vertex1.x,
			y: ($plan.wrap.vertex2.y-$plan.wrap.vertex1.y)*$vertex.x + $plan.wrap.vertex1.y
		};
		
		projection.vertex2 = 
		{
			x: ($plan.wrap.vertex4.x-$plan.wrap.vertex3.x)*$vertex.x + $plan.wrap.vertex3.x,
			y: ($plan.wrap.vertex4.y-$plan.wrap.vertex3.y)*$vertex.x + $plan.wrap.vertex3.y
		};
	}
	else
	{
		projection.vertex = 
		{
			x: ($plan.projection.horizontal.vertex2.x - $plan.projection.horizontal.vertex1.x)*$vertex.x + $plan.projection.horizontal.vertex1.x,
			y: ($plan.projection.horizontal.vertex2.y - $plan.projection.horizontal.vertex1.y)*$vertex.x + $plan.projection.horizontal.vertex1.y
		};
	}
	
	return projection;
};

Math.getYProjection = function($plan, $vertex)
{
	var projection = { vertex1: $vertex, vertex2: $vertex };
	
	if ($plan.wrap.line3.a === $plan.wrap.line4.a)
	{
		projection.vertex1 = 
		{
			x: ($plan.wrap.vertex3.x-$plan.wrap.vertex1.x)*$vertex.y + $plan.wrap.vertex1.x,
			y: ($plan.wrap.vertex3.y-$plan.wrap.vertex1.y)*$vertex.y + $plan.wrap.vertex1.y
		};
		
		projection.vertex2 = 
		{
			x: ($plan.wrap.vertex4.x-$plan.wrap.vertex2.x)*$vertex.y + $plan.wrap.vertex2.x,
			y: ($plan.wrap.vertex4.y-$plan.wrap.vertex2.y)*$vertex.y + $plan.wrap.vertex2.y
		};
	}
	else
	{
		projection.vertex = 
		{
			x: ($plan.projection.vertical.vertex2.x - $plan.projection.vertical.vertex1.x)*$vertex.y + $plan.projection.vertical.vertex1.x,
			y: ($plan.projection.vertical.vertex2.y - $plan.projection.vertical.vertex1.y)*$vertex.y + $plan.projection.vertical.vertex1.y
		};
	}
	
	return projection;
};

Math.getPerspectivePosition = function($plan, $vertex) // Indiquer les positions du point en fractions du plan
{
	var vertex = { x: 0, y: 0};
	
	// Pas de point de fuite calculable
	if ($plan.wrap.line1.a === $plan.wrap.line2.a && $plan.wrap.line3.a === $plan.wrap.line4.a)
	{
		var vProjections = Math.getYProjection($plan, $vertex);
		var hAffine = Math.getAffineEquation(vProjections.vertex1.x, vProjections.vertex1.y, vProjections.vertex2.x, vProjections.vertex2.y);
		
		var hProjections = Math.getXProjection($plan, $vertex);
		var vAffine = Math.getAffineEquation(hProjections.vertex1.x, hProjections.vertex1.y, hProjections.vertex2.x, hProjections.vertex2.y);
		
		vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
	}
	// Un seul point de fuite, horizontales parallèles
	else if ($plan.wrap.line1.a === $plan.wrap.line2.a)
	{
		var hProjections = Math.getXProjection($plan, $vertex);
		var vAffine = Math.getAffineEquation(hProjections.vertex1.x, hProjections.vertex1.y, hProjections.vertex2.x, hProjections.vertex2.y);

		// Calcul de la composente verticale

		var diag1 = Math.getAffineEquation($plan.wrap.vertex1.x, $plan.wrap.vertex1.y, $plan.wrap.vertex4.x, $plan.wrap.vertex4.y);

		var VhProjections = Math.getXProjection($plan, { x: $vertex.y, y: $vertex.x });
		var VvAffine = Math.getAffineEquation(VhProjections.vertex1.x, VhProjections.vertex1.y, VhProjections.vertex2.x, VhProjections.vertex2.y);
		var diagProjection = Math.getAffinePoint(diag1.a, diag1.b, VvAffine.a, VvAffine.b);

		var hAffine = Math.getAffineEquationFromA($plan.horizon.a, diagProjection.x, diagProjection.y);

		vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
	}
	// Un seul point de fuite, verticales parallèles
	else if ($plan.wrap.line3.a === $plan.wrap.line4.a)
	{
		var vProjections = Math.getYProjection($plan, $vertex);
		var hAffine = Math.getAffineEquation(vProjections.vertex1.x, vProjections.vertex1.y, vProjections.vertex2.x, vProjections.vertex2.y);

		// Calcul de la composente horizontale

		var diag1 = Math.getAffineEquation($plan.wrap.vertex1.x, $plan.wrap.vertex1.y, $plan.wrap.vertex4.x, $plan.wrap.vertex4.y);

		var HvProjections = Math.getYProjection($plan, { x: $vertex.y, y: $vertex.x });
		var HhAffine = Math.getAffineEquation(HvProjections.vertex1.x, HvProjections.vertex1.y, HvProjections.vertex2.x, HvProjections.vertex2.y);
		var diagProjection = Math.getAffinePoint(diag1.a, diag1.b, HhAffine.a, HhAffine.b);

		var vAffine = Math.getAffineEquationFromA($plan.horizon.a, diagProjection.x, diagProjection.y);

		vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
	}
	else
	{
		var vProjectionX = ($plan.projection.vertical.vertex2.x - $plan.projection.vertical.vertex1.x)*$vertex.x + $plan.projection.vertical.vertex1.x;
		var vProjectionY = ($plan.projection.vertical.vertex2.y - $plan.projection.vertical.vertex1.y)*$vertex.x + $plan.projection.vertical.vertex1.y;
		var vAffine = Math.getAffineEquation($plan.vVertex.x, $plan.vVertex.y, vProjectionX, vProjectionY);

		var hProjectionX = ($plan.projection.horizontal.vertex2.x - $plan.projection.horizontal.vertex1.x)*$vertex.y + $plan.projection.horizontal.vertex1.x;
		var hProjectionY = ($plan.projection.horizontal.vertex2.y - $plan.projection.horizontal.vertex1.y)*$vertex.y + $plan.projection.horizontal.vertex1.y;
		var hAffine = Math.getAffineEquation($plan.hVertex.x, $plan.hVertex.y, hProjectionX, hProjectionY);

		vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
	}

	return vertex;
};

Math.getPositionOnCylinder = function($cylinder, $vertex)
{
	var vertex = { x: 0, y: 0};
	
	// Calcul de la droite verticale de référence
	
	var angularPosition = Math.PI*$vertex.x;
	var x1 = $cylinder.radius1*Math.cos(angularPosition);
	var x2 = $cylinder.radius2*Math.cos(angularPosition);
	var y1 = -$cylinder.height/2;
	var y2 = $cylinder.height/2;
	var verticalLineRef = Math.getAffineEquation(x1, y1, x2, y2);
	
	// Calcul de la droite horizontale de référence
	
	var y = -$cylinder.height/2 + $cylinder.height*$vertex.y;
	var a = $cylinder.radius1 + ($cylinder.radius2-$cylinder.radius1)*$vertex.y;
	var xLeft = -a;
	var xRight = a;
	var horizontalLineRef = Math.getAffineEquation(xLeft, y, xRight, y);
	
	// Position finale
	
	if ($cylinder.perspective1 === 0 && $cylinder.perspective2 === 0)
		vertex = Math.getAffinePoint(verticalLineRef.a, verticalLineRef.b, horizontalLineRef.a, horizontalLineRef.b);
	else
	{
		var b = $cylinder.perspective1 + ($cylinder.perspective2-$cylinder.perspective1)*$vertex.y;
		var ellipse = {a: a, b: b, offsetY: y};
		var roots = Math.getAffineEllipseSection(verticalLineRef, ellipse);
		
		if (roots.length === 1)
		{
			vertex.x = roots[0].x;
			vertex.y = roots[0].y;
		}
		else if (roots.length > 1)
		{
			if (b < 0)
			{
				if (roots[0].y < roots[1].y)
				{
					vertex.x = roots[0].x;
					vertex.y = roots[0].y;
				}
				else
				{
					vertex.x = roots[1].x;
					vertex.y = roots[1].y;
				}
			}
			else
			{
				if (roots[0].y < roots[1].y)
				{
					vertex.x = roots[1].x;
					vertex.y = roots[1].y;
				}
				else
				{
					vertex.x = roots[0].x;
					vertex.y = roots[0].y;
				}
			}
		}
	}

	return vertex;
};

Math.oppositeVector = function($vector)
{
	var output = [];
	
	if ($vector.length > 0)
	{
		for (var i = 0; i < $vector.length; i++)
			output[i] = -$vector[i];
	}
	else
	{
		output =
		{
			x: -$vector.x,
			y: -$vector.y
		};

		if (utils.isset($vector.z))
			output.z = -$vector.z;
	}
	
	return output;
};

Math.dotProduct = function($vector1, $vector2)
{
	var dot = 1.0;

	if ($vector1.length > 0 && $vector2.length > 0)
	{
		dot = 0.0;

		for (var i = 0; i < Math.min($vector1.length, $vector2.length); i++)
			dot = dot + $vector1[i]*$vector2[i];
	}
	else
	{
		dot = $vector1.x*$vector2.x + $vector1.y*$vector2.y;
	
		if (utils.isset($vector1.z) && utils.isset($vector2.z))
			dot = dot + $vector1.z*$vector2.z;
	}

	return dot;
};

Math.vectorNorm = function($vector)
{
	var norm = 0.0;
	
	var squareSize = 0.0;
	
	if ($vector.length > 0)
	{
		for (var i = 0; i < $vector.length; i++)
			squareSize = squareSize + $vector[i]*$vector[i];
		
		norm = Math.sqrt(squareSize);
	}
	else
	{
		output = {};
		
		if (utils.isset($vector.x))
			squareSize = squareSize + $vector.x*$vector.x;
		
		if (utils.isset($vector.y))
			squareSize = squareSize + $vector.y*$vector.y;
		
		if (utils.isset($vector.z))
			squareSize = squareSize + $vector.z*$vector.z;
		
		norm = Math.sqrt(squareSize);
	}
	
	return norm;
};

Math.vectorAngle = function($vector)
{
	var vector = Math.normalizeVector($vector);
	var angle = 0.0;

	if ($vector.length > 0)
		angle = Math.arctan(vector[1], vector[0]);
	else
		angle = Math.arctan(vector.y, vector.x);

	return angle;
};

Math.normalizeVector = function($vector)
{
	var output = [];
	
	var squareSize = 0.0;
	
	if ($vector.length > 0)
	{
		for (var i = 0; i < $vector.length; i++)
			squareSize = squareSize + $vector[i]*$vector[i];
		
		var size = Math.sqrt(squareSize);
		
		if (size > 0.0)
		{
			for (var i = 0; i < $vector.length; i++)
				output.push($vector[i]/size);
		}
		else
		{
			for (var i = 0; i < $vector.length; i++)
				output.push(0.0);
		}
	}
	else
	{
		output = {};
		
		if (utils.isset($vector.x))
			squareSize = squareSize + $vector.x*$vector.x;
		
		if (utils.isset($vector.y))
			squareSize = squareSize + $vector.y*$vector.y;
		
		if (utils.isset($vector.z))
			squareSize = squareSize + $vector.z*$vector.z;
		
		if (squareSize > 0.0)
		{
			var size = Math.sqrt(squareSize);
			
			if (utils.isset($vector.x))
				output.x = $vector.x/size;
			
			if (utils.isset($vector.y))
				output.y = $vector.y/size;
			
			if (utils.isset($vector.z))
				output.z = $vector.z/size;
		}
		else
		{
			output.x = 0.0;
			output.y = 0.0;
			output.z = 0.0;
		}
	}
	
	return output;
};

Math.crossProduct = function($vector1, $vector2)
{
	var output = [0.0, 0.0, 1.0];
	
	if ($vector1.length > 0 && $vector2.length > 0)
	{
		output[0] = $vector1[1]*$vector2[2] - $vector1[2]*$vector2[1];
		output[1] = $vector1[2]*$vector2[0] - $vector1[0]*$vector2[2];
		output[2] = $vector1[0]*$vector2[1] - $vector1[1]*$vector2[0];
	}
	else
	{
		output = { x: 0.0, y: 0.0, z: 1.0 };
		output.x = $vector1.y*$vector2.z - $vector1.z*$vector2.y;
		output.y = $vector1.z*$vector2.x - $vector1.x*$vector2.z;
		output.z = $vector1.x*$vector2.y - $vector1.y*$vector2.x;
	}

	return output;
}

Math.changeReference = function($reference, $vector)
{
	var output = [0.0, 0.0];

	if ($vector.length > 0)
	{
		for (var i = 0; i < $reference.length; i++)
			output[i] = Math.dotProduct($reference[i], $vector);
	}
	else
	{
		output = { x: 0.0, y: 0.0 };
		output.x = Math.dotProduct($reference.x, $vector);
		output.y = Math.dotProduct($reference.y, $vector);

		if (utils.isset($reference.z))
			output.z = Math.dotProduct($reference.z, $vector);
	}

	return output;
};

Math.vectorsDeterminant2D = function($vector1, $vector2)
{
	var determinant = $vector1.x*$vector2.y - $vector1.y*$vector2.x;
	return determinant;
};

Math.verticesDeterminant2D = function($vertex1, $vertex2, $vertex3)
{
	var vector1 = { x: $vertex2.x - $vertex1.x, y: $vertex2.y - $vertex1.y };
	var vector2 = { x: $vertex3.x - $vertex1.x, y: $vertex3.y - $vertex1.y };
	var determinant = Math.vectorsDeterminant2D(vector1, vector2);
	return determinant;
};

Math.vertexInTriangle = function($vertex, $triangle)
{
	var isInside = true;
	var vector1 = { x: $vertex.x - $triangle[0].x, y: $vertex.y - $triangle[0].y };
	var vector2 = { x: $triangle[1].x - $triangle[0].x, y: $triangle[1].y - $triangle[0].y };
	var previousDet = Math.vectorsDeterminant2D(vector1, vector2);
	
	for (var i = 1; i < $triangle.length; i++)
	{
		if (i === $triangle.length-1)
		{
			vector1 = { x: $vertex.x - $triangle[i].x, y: $vertex.y - $triangle[i].y };
			vector2 = { x: $triangle[0].x - $triangle[i].x, y: $triangle[0].y - $triangle[i].y };
		}
		else
		{
			vector1 = { x: $vertex.x - $triangle[i].x, y: $vertex.y - $triangle[i].y };
			vector2 = { x: $triangle[i+1].x - $triangle[i].x, y: $triangle[i+1].y - $triangle[i].y };
		}
		
		var det = Math.vectorsDeterminant2D(vector1, vector2);
		
		if (previousDet*det <= 0.0)
		{
			isInside = false;
			i = $triangle.length;
		}
	}
	
	return isInside;
};

Math.crossSegment = function($vertex1, $vertex2, $vertex3, $vertex4)
{
	var cross = false;
	
	var affine1 = Math.getAffineEquation($vertex1.x, $vertex1.y, $vertex2.x, $vertex2.y);
	var affine2 = Math.getAffineEquation($vertex3.x, $vertex3.y, $vertex4.x, $vertex4.y);
	var vertex = Math.getAffinePoint(affine1.a, affine1.b, affine2.a, affine2.b);
	
	if (vertex.x !== 'infinity' && vertex.y !== 'infinity')
	{
		if (vertex.x > Math.min($vertex1.x, $vertex2.x) && vertex.x < Math.max($vertex1.x, $vertex2.x)
			&& vertex.y > Math.min($vertex1.y, $vertex2.y) && vertex.y < Math.max($vertex1.y, $vertex2.y)
			&& vertex.x > Math.min($vertex3.x, $vertex4.x) && vertex.x < Math.max($vertex3.x, $vertex4.x)
			&& vertex.y > Math.min($vertex3.y, $vertex4.y) && vertex.y < Math.max($vertex3.y, $vertex4.y))
		{
			cross = true;
		}
		
		if (cross === false)
		{
			if ($vertex1.x === $vertex2.x
				&& vertex.y > Math.min($vertex1.y, $vertex2.y) && vertex.y < Math.max($vertex1.y, $vertex2.y)
				&& vertex.x > Math.min($vertex3.x, $vertex4.x) && vertex.x < Math.max($vertex3.x, $vertex4.x)
				&& vertex.y > Math.min($vertex3.y, $vertex4.y) && vertex.y < Math.max($vertex3.y, $vertex4.y))
			{
				cross = true;
			}
		}
		
		if (cross === false)
		{
			if ($vertex1.y === $vertex2.y
				&& vertex.x > Math.min($vertex1.x, $vertex2.x) && vertex.x < Math.max($vertex1.x, $vertex2.x)
				&& vertex.x > Math.min($vertex3.x, $vertex4.x) && vertex.x < Math.max($vertex3.x, $vertex4.x)
				&& vertex.y > Math.min($vertex3.y, $vertex4.y) && vertex.y < Math.max($vertex3.y, $vertex4.y))
			{
				cross = true;
			}
		}
		
		if (cross === false)
		{
			if ($vertex3.x === $vertex4.x
				&& vertex.x > Math.min($vertex1.x, $vertex2.x) && vertex.x < Math.max($vertex1.x, $vertex2.x)
				&& vertex.y > Math.min($vertex1.y, $vertex2.y) && vertex.y < Math.max($vertex1.y, $vertex2.y)
				&& vertex.y > Math.min($vertex3.y, $vertex4.y) && vertex.y < Math.max($vertex3.y, $vertex4.y))
			{
				cross = true;
			}
		}
		
		if (cross === false)
		{
			if ($vertex3.y === $vertex4.y
				&& vertex.x > Math.min($vertex1.x, $vertex2.x) && vertex.x < Math.max($vertex1.x, $vertex2.x)
				&& vertex.y > Math.min($vertex1.y, $vertex2.y) && vertex.y < Math.max($vertex1.y, $vertex2.y)
				&& vertex.x > Math.min($vertex3.x, $vertex4.x) && vertex.x < Math.max($vertex3.x, $vertex4.x))
			{
				cross = true;
			}
		}
		
		if (cross === false)
		{
			if ($vertex1.x === $vertex2.x && $vertex3.y === $vertex4.y
				&& vertex.y > Math.min($vertex1.y, $vertex2.y) && vertex.y < Math.max($vertex1.y, $vertex2.y)
				&& vertex.x > Math.min($vertex3.x, $vertex4.x) && vertex.x < Math.max($vertex3.x, $vertex4.x))
			{
				cross = true;
			}
		}
		
		if (cross === false)
		{
			if ($vertex1.y === $vertex2.y && $vertex3.x === $vertex4.x
				&& vertex.x > Math.min($vertex1.x, $vertex2.x) && vertex.x < Math.max($vertex1.x, $vertex2.x)
				&& vertex.y > Math.min($vertex3.y, $vertex4.y) && vertex.y < Math.max($vertex3.y, $vertex4.y))
			{
				cross = true;
			}
		}
	}
	
	return cross;
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("math");