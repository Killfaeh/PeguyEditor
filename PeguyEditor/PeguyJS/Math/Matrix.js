
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2016 ////
////				  http://suiseipark.com/					////
////			  http://suiseipark.blogspot.fr/				////
////				http://killfaeh.tumblr.com/				 ////
////			 https://www.facebook.com/suiseipark			////
////////////////////////////////////////////////////////////////////

glMatrixArrayType = typeof Float32Array != "undefined" ? Float32Array : typeof WebGLFloatArray != "undefined" ? WebGLFloatArray : Array;

function Matrix()
{
	///////////////
	// Attributs //
	///////////////
	
	var matrix = new Array(); 
	var table = new glMatrixArrayType(16); 
	
	//////////////
	// Méthodes //
	//////////////
	
	// Méthodes de convertion matrices/tableaux
	this.convertToTable = function()
	{
		table = new glMatrixArrayType(16); 
		
		for (var i = 0; i < 4; i++)
		{
			for (var j = 0; j < 4; j++)
				table[ i*4 + j ] = matrix[i][j]; 
		}
	};
	
	this.convertToMatrix = function() 
	{
		matrix = new Array(); 
		
		for (var i = 0; i < 4; i++)
		{
			matrix[i] = new Array(); 
			
			for (var j = 0; j < 4; j++)
			{
				table[ i*4 + j ] = matrix[i][j]; 
				matrix[i][j] = table[ i*4 + j ]; 
			}
		}
	}; 
	
	// Initialisation à l'identité 
	this.identity = function()
	{
		matrix = new Array(); 
		
		for (var i = 0; i < 4; i++)
		{
			matrix[i] = new Array(); 
			
			for (var j = 0; j < 4; j++)
			{
				if (i == j)
					matrix[i][j] = 1; 
				else
					matrix[i][j] = 0; 
			}
		}
		
		this.convertToTable(); 
	};
	
	// Initialisation à 0 
	this.nullMatrix = function()
	{
		matrix = new Array(); 
		
		for (var i = 0; i < 4; i++)
		{
			matrix[i] = new Array(); 
			
			for (var j = 0; j < 4; j++)
				matrix[i][j] = 0;
		}
		
		this.convertToTable();
	};
	
	// Méthodes de multiplication des matrices
	this.multiplyLeft = function($matrix)
	{
		var matrixTmp = matrix;
	
		this.nullMatrix();
	
		for (var i = 0; i < 4; i++)
		{
			for (var j = 0; j < 4; j++)
			{
				matrix[i][j] = 0; 
				
				for (var k = 0; k < 4; k++)
					matrix[i][j] = matrix[i][j] + $matrix.getMatrix()[i][k]*matrixTmp[k][j];
			}
		}
		
		this.convertToTable();

		return $this;
	};
	
	this.multiplyRight = function($matrix)
	{
		var matrixTmp = matrix;
	
		this.nullMatrix();
	
		for (var i = 0; i < 4; i++)
		{
			for (var j = 0; j < 4; j++)
			{
				matrix[i][j] = 0;
				
				for (var k = 0; k < 4; k++)
					matrix[i][j] = matrix[i][j] + matrixTmp[i][k]*$matrix.getMatrix()[k][j];
			}
		}
		
		this.convertToTable();

		return $this;
	};
	
	this.multiplyVect = function(vectorIn)
	{
		var vectorOut = new Array();
		
		if (vectorIn.length != 4)
		{
			console.log("Un vecteur de taille 4 est attendu.");
			vectorOut = vectorIn;
		}
		else
		{
			for (var i = 0; i < 4; i++)
			{
				vectorOut[i] = 0;
			
				for (var j = 0; j < 4; j++)
					vectorOut[i] = vectorOut[i] + matrix[j][i]*vectorIn[j];
			}
		}
		
		return vectorOut; 
	}; 
	
	// Autres opérations
	
	this.transpose = function()
	{
		var matrixTmp = matrix;
		this.nullMatrix();
	
		for (var i = 0; i < 4; i++)
		{
			for (var j = 0; j < 4; j++)
				matrix[i][j] = matrixTmp[j][i];
		}
		
		this.convertToTable();
	};
	
	this.invert = function()
	{
		//      0,  1,  2,  3
		// ------------------
		// 0 |  0,  1,  2,  3, 
		// 1 |  4,  5,  6,  7, 
		// 2 |  8,  9, 10, 11, 
		// 3 | 12, 13, 14, 15
		
		var inv = new Array();
		
		for (var i = 0; i < 4; i++)
			inv[i] = new Array();

		inv[0][0] = matrix[1][1] * matrix[2][2] * matrix[3][3] -
					matrix[1][1] * matrix[2][3] * matrix[3][2] -
					matrix[2][1] * matrix[1][2] * matrix[3][3] +
					matrix[2][1] * matrix[1][3] * matrix[3][2] +
					matrix[3][1] * matrix[1][2] * matrix[2][3] -
					matrix[3][1] * matrix[1][3] * matrix[2][2];
		
		inv[1][0] = -matrix[1][0] * matrix[2][2] * matrix[3][3] +
					 matrix[1][0] * matrix[2][3] * matrix[3][2] +
					 matrix[2][0] * matrix[1][2] * matrix[3][3] -
					 matrix[2][0] * matrix[1][3] * matrix[3][2] -
					 matrix[3][0] * matrix[1][2] * matrix[2][3] +
					 matrix[3][0] * matrix[1][3] * matrix[2][2];

		inv[2][0] = matrix[1][0] * matrix[2][1] * matrix[3][3] -
					matrix[1][0] * matrix[2][3] * matrix[3][1] -
					matrix[2][0] * matrix[1][1] * matrix[3][3] +
					matrix[2][0] * matrix[1][3] * matrix[3][1] +
					matrix[3][0] * matrix[1][1] * matrix[2][3] -
					matrix[3][0] * matrix[1][3] * matrix[2][1];

		inv[3][0] = -matrix[1][0] * matrix[2][1] * matrix[3][2] +
					 matrix[1][0] * matrix[2][2] * matrix[3][1] +
					 matrix[2][0] * matrix[1][1] * matrix[3][2] -
					 matrix[2][0] * matrix[1][2] * matrix[3][1] -
					 matrix[3][0] * matrix[1][1] * matrix[2][2] +
					 matrix[3][0] * matrix[1][2] * matrix[2][1];

		//      0,  1,  2,  3
		// ------------------
		// 0 |  0,  1,  2,  3, 
		// 1 |  4,  5,  6,  7, 
		// 2 |  8,  9, 10, 11, 
		// 3 | 12, 13, 14, 15

		inv[0][1] = -matrix[0][1] * matrix[2][2] * matrix[3][3] +
					 matrix[0][1] * matrix[2][3] * matrix[3][2] +
					 matrix[2][1] * matrix[0][2] * matrix[3][3] -
					 matrix[2][1] * matrix[0][3] * matrix[3][2] -
					 matrix[3][1] * matrix[0][2] * matrix[2][3] +
					 matrix[3][1] * matrix[0][3] * matrix[2][2];

		inv[1][1] = matrix[0][0] * matrix[2][2] * matrix[3][3] -
					matrix[0][0] * matrix[2][3] * matrix[3][2] -
					matrix[2][0] * matrix[0][2] * matrix[3][3] +
					matrix[2][0] * matrix[0][3] * matrix[3][2] +
					matrix[3][0] * matrix[0][2] * matrix[2][3] -
					matrix[3][0] * matrix[0][3] * matrix[2][2];

		inv[2][1] = -matrix[0][0] * matrix[2][1] * matrix[3][3] +
					 matrix[0][0] * matrix[2][3] * matrix[3][1] +
					 matrix[2][0] * matrix[0][1] * matrix[3][3] -
					 matrix[2][0] * matrix[0][3] * matrix[3][1] -
					 matrix[3][0] * matrix[0][1] * matrix[2][3] +
					 matrix[3][0] * matrix[0][3] * matrix[2][1];

		inv[3][1] = matrix[0][0] * matrix[2][1] * matrix[3][2] -
					matrix[0][0] * matrix[2][2] * matrix[3][1] -
					matrix[2][0] * matrix[0][1] * matrix[3][2] +
					matrix[2][0] * matrix[0][2] * matrix[3][1] +
					matrix[3][0] * matrix[0][1] * matrix[2][2] -
					matrix[3][0] * matrix[0][2] * matrix[2][1];
		
		//      0,  1,  2,  3
		// ------------------
		// 0 |  0,  1,  2,  3, 
		// 1 |  4,  5,  6,  7, 
		// 2 |  8,  9, 10, 11, 
		// 3 | 12, 13, 14, 15

		inv[0][2] = matrix[0][1] * matrix[1][2] * matrix[3][3] -
					matrix[0][1] * matrix[1][3] * matrix[3][2] -
					matrix[1][1] * matrix[0][2] * matrix[3][3] +
					matrix[1][1] * matrix[0][3] * matrix[3][2] +
					matrix[3][1] * matrix[0][2] * matrix[1][3] -
					matrix[3][1] * matrix[0][3] * matrix[1][2];

		inv[1][2] = -matrix[0][0] * matrix[1][2] * matrix[3][3] +
					 matrix[0][0] * matrix[1][3] * matrix[3][2] +
					 matrix[1][0] * matrix[0][2] * matrix[3][3] -
					 matrix[1][0] * matrix[0][3] * matrix[3][2] -
					 matrix[3][0] * matrix[0][2] * matrix[1][3] +
					 matrix[3][0] * matrix[0][3] * matrix[1][2];

		inv[2][2] = matrix[0][0] * matrix[1][1] * matrix[3][3] -
					matrix[0][0] * matrix[1][3] * matrix[3][1] -
					matrix[1][0] * matrix[0][1] * matrix[3][3] +
					matrix[1][0] * matrix[0][3] * matrix[3][1] +
					matrix[3][0] * matrix[0][1] * matrix[1][3] -
					matrix[3][0] * matrix[0][3] * matrix[1][1];

		inv[3][2] = -matrix[0][0] * matrix[1][1] * matrix[3][2] +
					 matrix[0][0] * matrix[1][2] * matrix[3][1] +
					 matrix[1][0] * matrix[0][1] * matrix[3][2] -
					 matrix[1][0] * matrix[0][2] * matrix[3][1] -
					 matrix[3][0] * matrix[0][1] * matrix[1][2] +
					 matrix[3][0] * matrix[0][2] * matrix[1][1];
		
		//      0,  1,  2,  3
		// ------------------
		// 0 |  0,  1,  2,  3, 
		// 1 |  4,  5,  6,  7, 
		// 2 |  8,  9, 10, 11, 
		// 3 | 12, 13, 14, 15

		inv[0][3] = -matrix[0][1] * matrix[1][2] * matrix[2][3] +
					 matrix[0][1] * matrix[1][3] * matrix[2][2] +
					 matrix[1][1] * matrix[0][2] * matrix[2][3] -
					 matrix[1][1] * matrix[0][3] * matrix[2][2] -
					 matrix[2][1] * matrix[0][2] * matrix[1][3] +
					 matrix[2][1] * matrix[0][3] * matrix[1][2];

		inv[1][3] = matrix[0][0] * matrix[1][2] * matrix[2][3] -
					matrix[0][0] * matrix[1][3] * matrix[2][2] -
					matrix[1][0] * matrix[0][2] * matrix[2][3] +
					matrix[1][0] * matrix[0][3] * matrix[2][2] +
					matrix[2][0] * matrix[0][2] * matrix[1][3] -
					matrix[2][0] * matrix[0][3] * matrix[1][2];

		inv[2][3] = -matrix[0][0] * matrix[1][1] * matrix[2][3] +
					 matrix[0][0] * matrix[1][3] * matrix[2][1] +
					 matrix[1][0] * matrix[0][1] * matrix[2][3] -
					 matrix[1][0] * matrix[0][3] * matrix[2][1] -
					 matrix[2][0] * matrix[0][1] * matrix[1][3] +
					 matrix[2][0] * matrix[0][3] * matrix[1][1];

		inv[3][3] = matrix[0][0] * matrix[1][1] * matrix[2][2] -
					matrix[0][0] * matrix[1][2] * matrix[2][1] -
					matrix[1][0] * matrix[0][1] * matrix[2][2] +
					matrix[1][0] * matrix[0][2] * matrix[2][1] +
					matrix[2][0] * matrix[0][1] * matrix[1][2] -
					matrix[2][0] * matrix[0][2] * matrix[1][1];
		
		var det = matrix[0][0] * inv[0][0] + matrix[0][1] * inv[1][0] + matrix[0][2] * inv[2][0] + matrix[0][3] * inv[3][0];
		
		if (det === 0)
			return false;

		for (var i = 0; i < 4; i++)
		{
			for (var j = 0; j < 4; j++)
				matrix[i][j] = inv[i][j]/det;
		}
		
		this.convertToTable();
		
		return true;
	};
	
	this.inverse = function()
	{
		var m = [];
		
		var m00 = matrix[0][0];
		var m01 = matrix[0][1];
		var m02 = matrix[0][2];
		var m03 = matrix[0][3];
		var m10 = matrix[1][0];
		var m11 = matrix[1][1];
		var m12 = matrix[1][2];
		var m13 = matrix[1][3];
		var m20 = matrix[2][0];
		var m21 = matrix[2][1];
		var m22 = matrix[2][2];
		var m23 = matrix[2][3];
		var m30 = matrix[3][0];
		var m31 = matrix[3][1];
		var m32 = matrix[3][2];
		var m33 = matrix[3][3];

		var tmp = [];

		tmp[0]  = m22 * m33;
		tmp[1]  = m32 * m23;
		tmp[2]  = m12 * m33;
		tmp[3]  = m32 * m13;
		tmp[4]  = m12 * m23;
		tmp[5]  = m22 * m13;
		tmp[6]  = m02 * m33;
		tmp[7]  = m32 * m03;
		tmp[8]  = m02 * m23;
		tmp[9]  = m22 * m03;
		tmp[10] = m02 * m13;
		tmp[11] = m12 * m03;
		tmp[12] = m20 * m31;
		tmp[13] = m30 * m21;
		tmp[14] = m10 * m31;
		tmp[15] = m30 * m11;
		tmp[16] = m10 * m21;
		tmp[17] = m20 * m11;
		tmp[18] = m00 * m31;
		tmp[19] = m30 * m01;
		tmp[20] = m00 * m21;
		tmp[21] = m20 * m01;
		tmp[22] = m00 * m11;
		tmp[23] = m10 * m01;

		var t0 = (tmp[0] * m11 + tmp[3] * m21 + tmp[4] * m31) - (tmp[1] * m11 + tmp[2] * m21 + tmp[5] * m31);
		var t1 = (tmp[1] * m01 + tmp[6] * m21 + tmp[9] * m31) - (tmp[0] * m01 + tmp[7] * m21 + tmp[8] * m31);
		var t2 = (tmp[2] * m01 + tmp[7] * m11 + tmp[10] * m31) - (tmp[3] * m01 + tmp[6] * m11 + tmp[11] * m31);
		var t3 = (tmp[5] * m01 + tmp[8] * m11 + tmp[11] * m21) - (tmp[4] * m01 + tmp[9] * m11 + tmp[10] * m21);

		var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		var output = [];

		output[0] = d * t0;
		output[1] = d * t1;
		output[2] = d * t2;
		output[3] = d * t3;
		output[4] = d * ((tmp[1] * m10 + tmp[2] * m20 + tmp[5] * m30) - (tmp[0] * m10 + tmp[3] * m20 + tmp[4] * m30));
		output[5] = d * ((tmp[0] * m00 + tmp[7] * m20 + tmp[8] * m30) - (tmp[1] * m00 + tmp[6] * m20 + tmp[9] * m30));
		output[6] = d * ((tmp[3] * m00 + tmp[6] * m10 + tmp[11] * m30) - (tmp[2] * m00 + tmp[7] * m10 + tmp[10] * m30));
		output[7] = d * ((tmp[4] * m00 + tmp[9] * m10 + tmp[10] * m20) - (tmp[5] * m00 + tmp[8] * m10 + tmp[11] * m20));
		output[8] = d * ((tmp[12] * m13 + tmp[15] * m23 + tmp[16] * m33) - (tmp[13] * m13 + tmp[14] * m23 + tmp[17] * m33));
		output[9] = d * ((tmp[13] * m03 + tmp[18] * m23 + tmp[21] * m33) - (tmp[12] * m03 + tmp[19] * m23 + tmp[20] * m33));
		output[10] = d * ((tmp[14] * m03 + tmp[19] * m13 + tmp[22] * m33) - (tmp[15] * m03 + tmp[18] * m13 + tmp[23] * m33));
		output[11] = d * ((tmp[17] * m03 + tmp[20] * m13 + tmp[23] * m23) - (tmp[16] * m03 + tmp[21] * m13 + tmp[22] * m23));
		output[12] = d * ((tmp[14] * m22 + tmp[17] * m32 + tmp[13] * m12) - (tmp[16] * m32 + tmp[12] * m12 + tmp[15] * m22));
		output[13] = d * ((tmp[20] * m32 + tmp[12] * m02 + tmp[19] * m22) - (tmp[18] * m22 + tmp[21] * m32 + tmp[13] * m02));
		output[14] = d * ((tmp[18] * m12 + tmp[23] * m32 + tmp[15] * m02) - (tmp[22] * m32 + tmp[14] * m02 + tmp[19] * m12));
		output[15] = d * ((tmp[22] * m22 + tmp[16] * m02 + tmp[21] * m12) - (tmp[20] * m12 + tmp[23] * m22 + tmp[17] * m02));

		return output;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getMatrix = function() { return matrix; };
	this.getTable = function() { return table; };
	
	this.clone = function()
	{
		var clone = new Matrix();
		clone.setMatrix(matrix);
		return clone;
	};
	
	// SET 
	this.setMatrix = function($matrix)
	{
		if ($matrix.length != 4)
			console.log("La matrice attendue est de taille 4x4.");
		else
		{
			var rightSize = true;
			
			for(var i = 0; i < 4; i++)
			{
				if ($matrix[i].length != 4)
					rightSize = false;
			}
			
			if (rightSize)
			{
				matrix = $matrix;
				this.convertToTable();
			}
			else
				console.log("La matrice attendue est de taille 4x4.");
		}
	};
	
	this.setTable = function($table)
	{
		if ($table.length != 16)
			console.log("Le tableau attendu est de taille 16");
		else
		{
			table = $table;
			this.convertToMatrix();
		}
	};
	
	// Méthodes pour affecter la valeur d'un item à la fois
	this.setItemMatrix = function($i, $j, $value)
	{
		if (($i < 0) || ($i > 4) || ($j < 0) || ($j > 4))
			console.log("Cet item n'existe pas.");
		else
		{
			matrix[$i][$j] = $value;
			this.convertToTable();
		}
	};
	
	this.setItemTable = function($index, $value)
	{
		if( ($index < 0) || ($index > 15) )
			console.log("Cet item n'existe pas.");
		else
		{
			table[$index] = $value;
			this.convertToMatrix();
		}
	}; 

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("matrix");