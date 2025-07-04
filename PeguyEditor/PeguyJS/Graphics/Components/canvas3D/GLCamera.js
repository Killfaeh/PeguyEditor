
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var CAMERA_VIEWS = 
{
	PERSPECTIVE: 0,
	FRONT: 1,
	BACK: 2,
	LEFT: 3,
	RIGHT: 4,
	TOP: 5,
	BOTTOM: 6
};

function GLCamera()
{
	///////////////
	// Attributs //
	///////////////
	
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	
	// Sens des éguilles d'une montre
	// Par défaut, regarde le long des y positifs
	var theta = 0.0; // Positif regarde vers la droite
	var phi = 0.0; // Positif regarde vers le bas
	var omega = 0.0;
	
	var matrix = new Matrix();
	matrix.identity();
	
	//////////////
	// Méthodes //
	//////////////
	
	this.update = function()
	{
		var defaultRotationMatrix = new RotateMatrix(1, 0, 0, 90);
		var translateMatrix = new TranslateMatrix(-x, -y, -z);
		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, -theta);
		var rotateMatrixPhi = new RotateMatrix(1, 0, 0, -phi);
		var rotateMatrixOmega = new RotateMatrix(0, 1, 0, -omega);
		
		matrix = new Matrix();
		matrix.identity();
		
		matrix.multiplyLeft(defaultRotationMatrix);
		matrix.multiplyLeft(rotateMatrixPhi);
		matrix.multiplyLeft(rotateMatrixTheta);
		matrix.multiplyLeft(rotateMatrixOmega);
		matrix.multiplyLeft(translateMatrix);
	};
	
	this.clone = function()
	{
		var clone = new GLCamera();
		clone.setX(x);
		clone.setY(y);
		clone.setZ(z);
		clone.setTheta(theta);
		clone.setPhi(phi);
		clone.setOmega(omega);
		clone.update();
		return clone;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getZ = function() { return z; };
	
	this.getTheta = function() { return theta; };
	this.getPhi = function() { return phi; };
	this.getOmega = function() { return omega; };
	
	this.getPolar = function($offsetX, $offsetY, $offsetZ)
	{
		var thetaRad = Trigo.atan(y - $offsetY, x - $offsetX);
		var polarTheta = thetaRad/Math.PI*180.0;
		var distanceXY = Math.sqrt((x - $offsetX)*(x - $offsetX) + (y - $offsetY)*(y - $offsetY));
		var phiRad = Trigo.atan(z - $offsetZ, x - distanceXY);
		var polarPhi = phiRad/Math.PI*180.0;
		var distance = Math.sqrt((x - $offsetX)*(x - $offsetX) + (y - $offsetY)*(y - $offsetY) + (z - $offsetZ)*(z - $offsetZ));
		
		var polar = { r: distance, theta: polarTheta, phi: polarPhi };
		
		return polar;
	};
	
	this.getMatrix = function() { return matrix; };
	
	this.getReverseMatrix = function()
	{
		var defaultRotationMatrix = new RotateMatrix(1, 0, 0, -90);
		var translateMatrix = new TranslateMatrix(x, y, z);
		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
		var rotateMatrixPhi = new RotateMatrix(1, 0, 0, phi);
		var rotateMatrixOmega = new RotateMatrix(0, 1, 0, omega);
		
		var reverseMatrix = new Matrix();
		reverseMatrix.identity();
		
		reverseMatrix.multiplyLeft(translateMatrix);
		reverseMatrix.multiplyLeft(rotateMatrixOmega);
		reverseMatrix.multiplyLeft(rotateMatrixTheta);
		reverseMatrix.multiplyLeft(rotateMatrixPhi);
		reverseMatrix.multiplyLeft(defaultRotationMatrix);

		return reverseMatrix;
	};
	
	this.getRotationMatrix = function()
	{
		var defaultRotationMatrix = new RotateMatrix(1, 0, 0, 90);
		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, -theta);
		var rotateMatrixPhi = new RotateMatrix(1, 0, 0, -phi);
		var rotateMatrixOmega = new RotateMatrix(0, 1, 0, -omega);
		
		var rotationMatrix = new Matrix();
		rotationMatrix.identity();
		
		rotationMatrix.multiplyLeft(defaultRotationMatrix);
		rotationMatrix.multiplyLeft(rotateMatrixPhi);
		rotationMatrix.multiplyLeft(rotateMatrixTheta);
		rotationMatrix.multiplyLeft(rotateMatrixOmega);
		
		return rotationMatrix;
	};
	
	// SET 
	this.setX = function($x) { x = $x; };
	this.setY = function($y) { y = $y; };
	this.setZ = function($z) { z = $z; };
	
	this.setTheta = function($theta)
	{
		theta = $theta;
	};
	
	this.setPhi = function($phi) { phi = $phi; };
	this.setOmega = function($omega) { omega = $omega; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-camera");