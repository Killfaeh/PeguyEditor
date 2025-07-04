function Vector($values)
{
	///////////////
	// Attributs //
	///////////////

	this.type = 'Vector';

	var values = $values;

	if (!utils.isset(values))
		values = [];

	if (!Array.isArray(values))
	{
		var x = values.x;
		var y = values.y;
		var z = values.z;

		values = [x, y];

		if (utils.isset(z))
			values.push(z);
	}

	//////////////
	// Méthodes //
	//////////////

	var update = function()
	{
		$this.x = values[0];
		$this.y = values[1];
		$this.z = values[2];

		$this.r = values[0];
		$this.theta = values[1];
		$this.phi = values[2];
	};

	this.toCartesian = function()
	{
		var output = values;

		if (values.length === 2)
		{
			var r = values[0];
			var theta = values[1];
			output[0] = r*Math.cos(theta);
			output[1] = r*Math.sin(theta);
		}
		else if (values.length === 3)
		{
			var r = values[0];
			var theta = values[1];
			var phi = values[2];
			output[0] = r*Math.cos(theta)*Math.cos(phi);
			output[1] = r*Math.sin(theta)*Math.cos(phi);
			output[2] = r*Math.sin(phi);
		}

		return new Vector(output);
	};

	this.toPolar = function()
	{
		var output = values;

		if (values.length === 2)
		{
			var x = values[0];
			var y = values[1];
			output[0] = Math.sqrt(x*x + y*y);
			output[1] = Trigo.atan(y, x);
		}
		else if (values.length === 3)
		{
			var x = values[0];
			var y = values[1];
			var z = values[2];
			output[0] = Math.sqrt(x*x + y*y + z*z);
			output[1] = Trigo.atan(y, x);
			output[2] = Trigo.atan(z, output[0]);
		}

		return new Vector(output);
	};

	this.getOpposite = function()
	{
		var outputValues = [];

		for (var i = 0; i < values.length; i++)
			outputValues.push(-values[i]);

		return new Vector(outputValues);
	};

	this.opposite = function() { return $this.getOpposite(); };

	this.getNormal = function()
	{
		var outputValues = [values[1], -values[0]];
		return (new Vector(outputValues)).normalize();
	};

	this.normal = function() { return $this.getNormal(); };

	this.normalize = function()
	{
		var outputValues = [];
		var norm = $this.norm();

		for (var i = 0; i < values.length; i++)
			outputValues.push(values[i]/norm);

		return new Vector(outputValues);
	};

	this.changeReference = function($reference)
	{
		var outputValues = [];

		for (var i = 0; i < $reference.length; i++)
			outputValues[i] = Vectors.dotProduct($reference[i], $this);

		return new Vector(outputValues);
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.x = values[0];
	this.y = values[1];
	this.z = values[2];

	this.r = values[0];
	this.theta = values[1];
	this.phi = values[2];

	this.getValues = function() { return values; };
	this.values = function() { return $this.getValues(); };
	this.array = function() { return $this.getValues(); };

	this.getSize = function() { return values.length; };
	this.size = function() { return $this.getSize(); };

	this.getAngle = function()
	{
		var normVector = $this.normalize();
		var angle = Trigo.atan(normVector.values()[1], normVector.values()[0]);
		return angle;
	};

	this.angle = function() { return $this.getAngle(); };

	this.getNorm = function()
	{
		var norm = 0.0;
		var squareSize = 0.0;
		
		for (var i = 0; i < values.length; i++)
			squareSize = squareSize + values[i]*values[i];
			
		norm = Math.sqrt(squareSize);
		
		return norm;
	};

	this.norm = function() { return $this.getNorm(); };

	// SET

	this.setValues = function($values)
	{
		values = $values;

		if (!utils.isset(values))
			values = [];

		update();

	};

	this.setValue = function($index, $value)
	{
		values[$index] = $value;
		update();
	};

	this.setX = function($x) { $this.setValue(0, $x); };
	this.setY = function($y) { $this.setValue(1, $y); };
	this.setZ = function($z) { $this.setValue(2, $z); };

	this.setR = function($r) { $this.setX($r); };
	this.setTheta = function($theta) { $this.setY($theta); };
	this.setPhi = function($phi) { $this.setZ($phi); };

	var $this = this;
}

function Segment($vector1, $vector2)
{
	///////////////
	// Attributs //
	///////////////

	var vector1 = $vector1;
	var vector2 = $vector2;

	//////////////
	// Méthodes //
	//////////////

	this.inBBox = function($vector)
	{
		var inBBox = true;

		for (var i = 0; i < $vector.values().length; i++)
		{
			if ($vector.values()[i] < Math.min($vector1.values()[i], $vector2.values()[i])
				|| $vector.values()[i] > Math.max($vector1.values()[i], $vector2.values()[i]))
			{
				inBBox = false;
			}
		}

		return inBBox;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getVector1 = function() { return vector1 };
	this.getVector2 = function() { return vector2 };

	var $this = this;
}

Vectors =
{
	equal: function($vector1, $vector2, $precision)
	{
		var precision = $precision;

		if (!utils.isset(precision))
			precision = 0.0;

		var equal = true;

		if ($vector1.size() === $vector2.size())
		{
			for (var i = 0; i < $vector1.values().length; i++)
			{
				if (Math.abs($vector2.values()[i] - $vector1.values()[i]) >= Math.abs(precision))
				{
					equal = false;
					i = $vector1.values().length;
				}
			}
		}
		else
			equal = false;

		return equal;
	},

	distance: function($vector1, $vector2)
	{
		var dist = 0.0;

		if ($vector1.size() === $vector2.size())
		{
			for (var i = 0; i < $vector1.values().length; i++)
			{
				var delta = $vector2.values()[i] - $vector1.values()[i];
				dist = dist + delta+delta;
			}

			dist = Math.sqrt(dist);
		}
		else
		{
			// Renvoyer une exception
		}

		return dist;
	},

	delta: function($vector1, $vector2)
	{
		var deltas = [];

		if ($vector1.size() === $vector2.size())
		{
			for (var i = 0; i < $vector1.values().length; i++)
				deltas.push($vector2.values()[i] - $vector1.values()[i]);
		}
		else
		{
			// Renvoyer une exception
		}

		return new Vector(deltas);
	},

	angle: function($vector1, $vector2)
	{
		var angle = 0.0;

		if ($vector1.size() === $vector2.size())
		{
			if ($vector1.size() > 2)
			{
				var tangent1 = $vector1.normalize();
				var tangent2 = $vector2.normalize();
				var cross = Vectors.crossProduct(tangent1, tangent2);
				var normal1 = Vectors.crossProduct(cross, tangent1);
				var cos = Vectors.dotProduct(tangent1, tangent2);
				var sin = Vectors.dotProduct(normal1, tangent2);
				angle = Trigo.atan(sin, cos);
			}
			else
			{
				var polar1 = $vector1.toPolar();
				var polar2 = $vector2.toPolar();
				angle = polar2.theta-polar1.theta;

				if (angle > Math.PI)
					angle = angle-2.0*Math.PI;
				else if (angle < -Math.PI)
					angle = angle+2.0*Math.PI;
			}
		}
		else
		{
			// Renvoyer une exception
		}

		return angle;
	},

	dotProduct: function($vector1, $vector2)
	{
		var dot = 0.0;

		for (var i = 0; i < Math.min($vector1.size(), $vector2.size()); i++)
			dot = dot + $vector1.values()[i]*$vector2.values()[i];

		return dot;
	},

	crossProduct: function($vector1, $vector2)
	{
		// Envoyer une erreur si les vecteurs ont une taille différente de 2 ou 3

		var output = [0.0, 0.0, 1.0];
		
		var vector1 = new Vector($vector1.values());
		var vector2 = new Vector($vector2.values());

		if (vector1.size() === 2)
			vector1 = new Vector([$vector1.values()[0], $vector1.values()[1], 0.0]);

		if (vector2.size() === 2)
			vector2 = new Vector([$vector2.values()[0], $vector2.values()[1], 0.0]);

		output[0] = vector1.values()[1]*vector2.values()[2] - vector1.values()[2]*vector2.values()[1];
		output[1] = vector1.values()[2]*vector2.values()[0] - vector1.values()[0]*vector2.values()[2];
		output[2] = vector1.values()[0]*vector2.values()[1] - vector1.values()[1]*vector2.values()[0];

		return new Vector(output);
	},

	segmentIntersection: function($segment1, $segment2)
	{
		var f1 = new LinearFunction();
		f1.coefFromPoints([$segment1.getVector1().values(), $segment1.getVector2().values()]);

		var f2 = new LinearFunction();
		f2.coefFromPoints([$segment2.getVector1().values(), $segment2.getVector2().values()]);

		var intersection = new Vector(Polynomials.linearIntersection(f1, f2));
		var inBBox1 = $segment1.inBBox(intersection);
		var inBBox2 = $segment2.inBBox(intersection);

		return { point: intersection, inBBox1: inBBox1, inBBox2: inBBox2, inBothBBox: (inBBox1 && inBBox2) };
	},

	vectorsDeterminant2D: function($vector1, $vector2)
	{
		var determinant = $vector1.values()[0]*$vector2.values()[1] - $vector1.values()[1]*$vector2.values()[0];
		return determinant;
	},

	pointsDeterminant2D: function($vertex1, $vertex2, $vertex3)
	{
		var vector1 = new Vector([$vertex2.values()[0] - $vertex1.values()[0], $vertex2.values()[1] - $vertex1.values()[1]]);
		var vector2 = new Vector([$vertex3.values()[0] - $vertex1.values()[0], $vertex3.values()[1] - $vertex1.values()[1]]);
		var determinant = Vectors.vectorsDeterminant2D(vector1, vector2);
		return determinant;
	},

	pointInTriangle: function($vertex, $triangle)
	{
		var isInside = true;
		var vector1 = new Vector([$vertex.values()[0] - $triangle[0].values()[0], $vertex.values()[1] - $triangle[0].values()[1]]);
		var vector2 = new Vector([$triangle[1].values()[0] - $triangle[0].values()[0], $triangle[1].values()[1] - $triangle[0].values()[1]]);
		var previousDet = Vectors.vectorsDeterminant2D(vector1, vector2);
		
		for (var i = 1; i < $triangle.length; i++)
		{
			if (i === $triangle.length-1)
			{
				vector1 = new Vector([$vertex.values()[0] - $triangle[i].values()[0], $vertex.values()[1] - $triangle[i].values()[1]]);
				vector2 = new Vector([$triangle[0].values()[0] - $triangle[i].values()[0], $triangle[0].values()[1] - $triangle[i].values()[1]]);
			}
			else
			{
				vector1 = new Vector([$vertex.values()[0] - $triangle[i].values()[0], $vertex.values()[1] - $triangle[i].values()[1]]);
				vector2 = new Vector([$triangle[i+1].values()[0] - $triangle[i].values()[0], $triangle[i+1].values()[1] - $triangle[i].values()[1]]);
			}
			
			var det = Vectors.vectorsDeterminant2D(vector1, vector2);
			
			if (previousDet*det <= 0.0)
			{
				isInside = false;
				i = $triangle.length;
			}
		}
		
		return isInside;
	},

	//// Vieux trucs à réimplémenter ////

	getAffineEllipseSection: function($affine, $ellipse)
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
	},

	getPerspectiveFromVertices: function($vertex1, $vertex2, $vertex3, $vertex4)
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
	},

	getXProjection: function($plan, $vertex)
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
	},

	getYProjection: function($plan, $vertex)
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
	},

	getPerspectivePosition: function($plan, $vertex) // Indiquer les positions du point en fractions du plan
	{
		var vertex = { x: 0, y: 0};
		
		// Pas de point de fuite calculable
		if ($plan.wrap.line1.a === $plan.wrap.line2.a && $plan.wrap.line3.a === $plan.wrap.line4.a)
		{
			var vProjections = Vectors.getYProjection($plan, $vertex);
			var hAffine = Math.getAffineEquation(vProjections.vertex1.x, vProjections.vertex1.y, vProjections.vertex2.x, vProjections.vertex2.y);
			
			var hProjections = Vectors.getXProjection($plan, $vertex);
			var vAffine = Math.getAffineEquation(hProjections.vertex1.x, hProjections.vertex1.y, hProjections.vertex2.x, hProjections.vertex2.y);
			
			vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
		}
		// Un seul point de fuite, horizontales parallèles
		else if ($plan.wrap.line1.a === $plan.wrap.line2.a)
		{
			var hProjections = Vectors.getXProjection($plan, $vertex);
			var vAffine = Math.getAffineEquation(hProjections.vertex1.x, hProjections.vertex1.y, hProjections.vertex2.x, hProjections.vertex2.y);

			// Calcul de la composente verticale

			var diag1 = Math.getAffineEquation($plan.wrap.vertex1.x, $plan.wrap.vertex1.y, $plan.wrap.vertex4.x, $plan.wrap.vertex4.y);

			var VhProjections = Vectors.getXProjection($plan, { x: $vertex.y, y: $vertex.x });
			var VvAffine = Math.getAffineEquation(VhProjections.vertex1.x, VhProjections.vertex1.y, VhProjections.vertex2.x, VhProjections.vertex2.y);
			var diagProjection = Math.getAffinePoint(diag1.a, diag1.b, VvAffine.a, VvAffine.b);

			var hAffine = Math.getAffineEquationFromA($plan.horizon.a, diagProjection.x, diagProjection.y);

			vertex = Math.getAffinePoint(vAffine.a, vAffine.b, hAffine.a, hAffine.b);
		}
		// Un seul point de fuite, verticales parallèles
		else if ($plan.wrap.line3.a === $plan.wrap.line4.a)
		{
			var vProjections = Vectors.getYProjection($plan, $vertex);
			var hAffine = Math.getAffineEquation(vProjections.vertex1.x, vProjections.vertex1.y, vProjections.vertex2.x, vProjections.vertex2.y);

			// Calcul de la composente horizontale

			var diag1 = Math.getAffineEquation($plan.wrap.vertex1.x, $plan.wrap.vertex1.y, $plan.wrap.vertex4.x, $plan.wrap.vertex4.y);

			var HvProjections = Vectors.getYProjection($plan, { x: $vertex.y, y: $vertex.x });
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
	},

	getPositionOnCylinder: function($cylinder, $vertex)
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
			var roots = Vectors.getAffineEllipseSection(verticalLineRef, ellipse);
			
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
	},
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vectors");