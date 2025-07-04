
function Canvas3DEditor($width, $height, $param)
{
	var canvas = new Canvas3D($width, $height);
	
	///////////////
	// Attributs //
	///////////////

	var param = $param;

	if (!utils.isset(param))
	{
		param = 
		{
			defaultView: CAMERA_VIEWS.PERSPECTIVE,

			// Perspective

			defaultCameraDistance: Math.sqrt(200.0),
			theta: 45.0,
			phi: 30.0,
			omega: 0.0,
			targetVertex: [0.0, 0.0, 0.0],

			// Vue orthographique

			screenDistance: 0.0,
			defaultCameraWidth: 10.0,
			orthoDistance: 100.0
		};
	}

	var init = false;

	var currentView = param.defaultView;

	var oldCamera = canvas.getCamera().clone();

	var zoom = false;
	var turnAround = false;
	var translate = false;

	// Paramètres de vue en perspective

	var targetVertex = param.targetVertex;
	var oldTargetVertex = [targetVertex[0], targetVertex[1], targetVertex[2]];
	var defaultCameraDistance = param.defaultCameraDistance;
	var cameraDistance = defaultCameraDistance;

	var thetaRad = param.theta/180.*Math.PI;
	var phiRad = param.phi/180.0*Math.PI;
					
	var z = Math.abs(cameraDistance*Math.sin(phiRad));
	var xyDistance = Math.abs(cameraDistance*Math.cos(phiRad));
	var projDistance = Math.abs(xyDistance*Math.cos(thetaRad));

	// Paramètres de vue orthographique

	var screenDistance = param.screenDistance;
	var defaultCameraWidth = param.defaultCameraWidth;
	var cameraWidth = defaultCameraWidth;
	var orthoDistance = param.orthoDistance;

	// Molette

	var wheelPosition = 0;
	var turnRate = 0.005;

	// Drag & drop
	
	var dragged = false;
	var startX = 0;
	var startY = 0;
	var startCursorVertex = [0.0, 0.0, 0.0];
	var datePreviousMove = new Date();

	//////////////
	// Méthodes //
	//////////////

	this.render = function render()
	{
		if (init === false)
			$this.resetCamera();
		
		this.execSuper('render', [canvas.getContext()], render);

		init = true;
	};

	this.resetCamera = function()
	{
		targetVertex = [0.0, 0.0, 0.0];
		wheelPosition = 0;
		cameraDistance = defaultCameraDistance;
		cameraWidth = defaultCameraWidth;
		
		if (currentView === CAMERA_VIEWS.FRONT || currentView === CAMERA_VIEWS.BACK || currentView === CAMERA_VIEWS.LEFT || currentView === CAMERA_VIEWS.RIGHT || currentView === CAMERA_VIEWS.TOP || currentView === CAMERA_VIEWS.BOTTOM)
		{
			cameraWidth = defaultCameraWidth*Math.exp(wheelPosition);
			perspectiveMatrix = new OrthoMatrix(-cameraWidth, cameraWidth, -cameraWidth/canvas.getRatio(), cameraWidth/canvas.getRatio(), -0.1, 100000.0);
			canvas.setPerspectiveMatrix(perspectiveMatrix);

			switch(currentView)
			{
				case CAMERA_VIEWS.FRONT:
					canvas.getCamera().setX(0.0);
					canvas.getCamera().setY(-orthoDistance);
					canvas.getCamera().setZ(0.0);
					canvas.getCamera().setTheta(0.0);
					canvas.getCamera().setPhi(0.0);
					break;
				
				case CAMERA_VIEWS.BACK:
					canvas.getCamera().setX(0.0);
					canvas.getCamera().setY(orthoDistance);
					canvas.getCamera().setZ(0.0);
					canvas.getCamera().setTheta(180.0);
					canvas.getCamera().setPhi(0.0);
					break;
					
				case CAMERA_VIEWS.LEFT:
					canvas.getCamera().setX(orthoDistance);
					canvas.getCamera().setY(0.0);
					canvas.getCamera().setZ(0.0);
					canvas.getCamera().setTheta(-90.0);
					canvas.getCamera().setPhi(0.0);
					break;
					
				case CAMERA_VIEWS.RIGHT:
					canvas.getCamera().setX(-orthoDistance);
					canvas.getCamera().setY(0.0);
					canvas.getCamera().setZ(0.0);
					canvas.getCamera().setTheta(90.0);
					canvas.getCamera().setPhi(0.0);
					break;
					
				case CAMERA_VIEWS.TOP:
					canvas.getCamera().setX(0.0);
					canvas.getCamera().setY(0.0);
					canvas.getCamera().setZ(orthoDistance);
					canvas.getCamera().setTheta(0.0);
					canvas.getCamera().setPhi(90.0);
					break;
					
				case CAMERA_VIEWS.BOTTOM:
					canvas.getCamera().setX(0.0);
					canvas.getCamera().setY(0.0);
					canvas.getCamera().setZ(-orthoDistance);
					canvas.getCamera().setTheta(0.0);
					canvas.getCamera().setPhi(-90.0);
					break;
			}
		}
		else
		{
			var perspectiveMatrix = new PerspectiveMatrix(45.0, canvas.getRatio(), 0.01, 1000000000.0);
			canvas.setPerspectiveMatrix(perspectiveMatrix);

			//var distance = Math.sqrt(200);
			thetaRad = 45.0/180.*Math.PI;
			phiRad = 5.0/30.0*Math.PI;
			
			z = Math.abs(cameraDistance*Math.sin(phiRad));
			xyDistance = Math.abs(cameraDistance*Math.cos(phiRad));
			projDistance = Math.abs(xyDistance*Math.cos(thetaRad));
			
			canvas.getCamera().setX(projDistance);
			canvas.getCamera().setY(-projDistance);
			canvas.getCamera().setZ(z);
			canvas.getCamera().setTheta(-45.0);
			canvas.getCamera().setPhi(30.0);
		}
		
		canvas.getCamera().setOmega(0.0);
		canvas.getCamera().update();
	};

	this.updateCameraDistance = function()
	{
		if (currentView === CAMERA_VIEWS.FRONT || currentView === CAMERA_VIEWS.BACK || currentView === CAMERA_VIEWS.LEFT || currentView === CAMERA_VIEWS.RIGHT || currentView === CAMERA_VIEWS.TOP || currentView === CAMERA_VIEWS.BOTTOM)
		{
			cameraWidth = defaultCameraWidth*Math.exp(wheelPosition);
			perspectiveMatrix = new OrthoMatrix(-cameraWidth, cameraWidth, -cameraWidth/canvas.getRatio(), cameraWidth/canvas.getRatio(), -0.1, 100000.0);
			canvas.setPerspectiveMatrix(perspectiveMatrix);
		}
		else
		{
			cameraDistance = defaultCameraDistance*Math.exp(wheelPosition);
			
			var deltaX = canvas.getCamera().getX() - targetVertex[0];
			var deltaY = canvas.getCamera().getY() - targetVertex[1];
			var deltaZ = canvas.getCamera().getZ() - targetVertex[2];
			
			var currentDistance = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
			var ratioDistance = cameraDistance/currentDistance;
			
			var newDeltaX = ratioDistance*deltaX;
			var newDeltaY = ratioDistance*deltaY;
			var newDeltaZ = ratioDistance*deltaZ;
			
			canvas.getCamera().setX(targetVertex[0] + newDeltaX);
			canvas.getCamera().setY(targetVertex[1] + newDeltaY);
			canvas.getCamera().setZ(targetVertex[2] + newDeltaZ);
		}
		
		canvas.getCamera().update();
	};

	this.updateCameraTarget = function()
	{
		if (currentView === CAMERA_VIEWS.FRONT || currentView === CAMERA_VIEWS.BACK || currentView === CAMERA_VIEWS.LEFT || currentView === CAMERA_VIEWS.RIGHT || currentView === CAMERA_VIEWS.TOP || currentView === CAMERA_VIEWS.BOTTOM)
		{
			switch(currentView)
			{
				case CAMERA_VIEWS.FRONT:
					canvas.getCamera().setX(targetVertex[0]);
					canvas.getCamera().setZ(targetVertex[2]);
					break;
				
				case CAMERA_VIEWS.BACK:
					canvas.getCamera().setX(targetVertex[0]);
					canvas.getCamera().setZ(targetVertex[2]);
					break;
					
				case CAMERA_VIEWS.LEFT:
					canvas.getCamera().setY(targetVertex[1]);
					canvas.getCamera().setZ(targetVertex[2]);
					break;
					
				case CAMERA_VIEWS.RIGHT:
					canvas.getCamera().setY(targetVertex[1]);
					canvas.getCamera().setZ(targetVertex[2]);
					break;
					
				case CAMERA_VIEWS.TOP:
					canvas.getCamera().setX(targetVertex[0]);
					canvas.getCamera().setY(targetVertex[1]);
					break;
					
				case CAMERA_VIEWS.BOTTOM:
					canvas.getCamera().setX(targetVertex[0]);
					canvas.getCamera().setY(targetVertex[1]);
					break;
			}
		}
		else
		{
			var thetaRad = (-canvas.getCamera().getTheta()-90)/180.0*Math.PI;
			var phiRad = canvas.getCamera().getPhi()/180.0*Math.PI;
			
			var deltaZ = cameraDistance*Math.sin(phiRad);
			var deltaXY = cameraDistance*Math.cos(phiRad);
			var deltaX = deltaXY*Math.cos(thetaRad);
			var deltaY = deltaXY*Math.sin(thetaRad);
			
			canvas.getCamera().setX(targetVertex[0] + deltaX);
			canvas.getCamera().setY(targetVertex[1] + deltaY);
			canvas.getCamera().setZ(targetVertex[2] + deltaZ);
		}
		
		canvas.getCamera().update();
	};

	this.turnAround = function($x, $y)
	{	
		turnRate = 0.5;
		
		var deltaX = $x - startX;
		var deltaY = $y - startY;
		
		var deltaTheta = turnRate * deltaX;
		var deltaPhi = turnRate * deltaY;
		
		var currentPolar = oldCamera.getPolar(targetVertex[0], targetVertex[1], targetVertex[2]);
		
		var newCameraTheta = oldCamera.getTheta() + deltaTheta;
		var newPositionTheta = currentPolar.theta - deltaTheta;
		var newPhi = oldCamera.getPhi() + deltaPhi;
		
		if (newPhi > 90)
			newPhi = 90;
		else if (newPhi < -90)
			newPhi = -90;
		
		var newX = targetVertex[0] + cameraDistance*Math.cos(newPositionTheta/180.0*Math.PI)*Math.cos(newPhi/180.0*Math.PI);
		var newY = targetVertex[1] + cameraDistance*Math.sin(newPositionTheta/180.0*Math.PI)*Math.cos(newPhi/180.0*Math.PI);
		var newZ = targetVertex[2] + cameraDistance*Math.sin(newPhi/180.0*Math.PI);
		
		canvas.getCamera().setX(newX);
		canvas.getCamera().setY(newY);
		canvas.getCamera().setZ(newZ);
		
		canvas.getCamera().setTheta(newCameraTheta);
		canvas.getCamera().setPhi(newPhi);
		
		canvas.getCamera().update();
	};

	this.computeXYcursorTarget = function($x, $y)
	{
		var angleRad = 22.5/180.0*Math.PI;
		var localX = $x - canvas.getWidth()/2;
		var localY = canvas.getHeight()/2 - $y;
		var localZ = -canvas.getHeight()/2/Math.tan(angleRad);

		var cursorPosition = oldCamera.getReverseMatrix().multiplyVect([localX, localY, localZ, 1.0]);
		
		var xLine = new LinearFunction();
		xLine.coefFromPoints([oldCamera.getX(), oldCamera.getZ()], [cursorPosition[0], cursorPosition[2]]);
		var yLine = new LinearFunction();
		yLine.coefFromPoints([oldCamera.getY(), oldCamera.getZ()], [cursorPosition[1], cursorPosition[2]]);

		var xSection = Polynomials.linearIntersection(xLine, new LinearFunction(0, oldTargetVertex[2]));
		var ySection = Polynomials.linearIntersection(yLine, new LinearFunction(0, oldTargetVertex[2]));
		
		var section = [xSection[0], ySection[0], oldTargetVertex[2]];
		
		return section;
	};
	
	this.computeZcursorTarget = function($x, $y)
	{
		var angleRad = 22.5/180.0*Math.PI;
		var localX = $x - canvas.getWidth()/2;
		var localY = canvas.getHeight()/2 - $y;
		var localZ = -canvas.getHeight()/2/Math.tan(angleRad);
		
		var projX = -localX * cameraDistance/localZ;
		var projY = -localY * cameraDistance/localZ;
		var projZ = -cameraDistance;

		var cursorPosition = oldCamera.getReverseMatrix().multiplyVect([projX, projY, projZ, 1.0]);
		
		return cursorPosition;
	};

	var dateLastResize = new Date();
	var width = 800;
	var height = 600;

	var resize = function()
	{
		var now = new Date();

		if (now.getTime()-dateLastResize.getTime() > 100)
		{
			canvas.setSize(width, height);

			var perspectiveMatrix = new PerspectiveMatrix(45.0, canvas.getRatio(), 0.01, 1000000.0);
			
			if (currentView === CAMERA_VIEWS.FRONT || currentView === CAMERA_VIEWS.BACK || currentView === CAMERA_VIEWS.LEFT || currentView === CAMERA_VIEWS.RIGHT || currentView === CAMERA_VIEWS.TOP || currentView === CAMERA_VIEWS.BOTTOM)
				perspectiveMatrix = new OrthoMatrix(-cameraWidth, cameraWidth, -cameraWidth/canvas.getRatio(), cameraWidth/canvas.getRatio(), -0.1, 100000.0);
			else
				screenDistance = canvas.getHeight()/Math.tan(Math.PI/8.0);
			
			canvas.setPerspectiveMatrix(perspectiveMatrix);
			canvas.render();
		}
	};

	this.resize = function($width, $height)
	{
		width = $width;
		height = $height;
		dateLastResize = new Date();
		setTimeout(resize, 100);
	};
	
	this.changeView = function($view)
	{
		currentView = $view;
		$this.resetCamera();
		$this.onChangeView(currentView);
		$this.render();
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onChangeView = function($view) {};

	canvas.onMouseWheel = function($event)
	{
		var delta = $event.wheelDelta;

		wheelPosition = wheelPosition - delta/1000.0;
		$this.updateCameraDistance();
		
		var dateNewMove = new Date();
		
		if (dateNewMove.getTime()-datePreviousMove.getTime() > 40)
		{
			$this.render();
			datePreviousMove = dateNewMove;
		}
	};

	canvas.onMouseDown = function($event)
	{
		zoom = false;
		turnAround = false;
		translate = false;
		dragged = false;

		Events.preventDefault($event);

		var bounds = canvas.getBoundingClientRect();
		var x = $event.clientX - bounds.x;
		var y = $event.clientY - bounds.y;

		if ($event.button === 0)
		{
			startX = x;
			startY = y;
			oldTargetVertex = [targetVertex[0], targetVertex[1], targetVertex[2]];
			oldCamera = canvas.getCamera().clone();

			if (currentView === CAMERA_VIEWS.PERSPECTIVE)
			{
				startCursorVertex = $this.computeXYcursorTarget(x, y);
				turnAround = true;
			}
			else
			{
				startCursorVertex = $this.computeZcursorTarget(x, y);
				translate = true;
			}

			dragged = true;
		}
		else if ($event.button === 1)
		{
			startX = x;
			startY = y;
			oldTargetVertex = [targetVertex[0], targetVertex[1], targetVertex[2]];
			oldCamera = canvas.getCamera().clone();

			startCursorVertex = $this.computeZcursorTarget(x, y);

			dragged = true;
			translate = true;
		}
	};

	document.getElementById('main').onMouseMove.push(function($event)
	{
		var bounds = canvas.getBoundingClientRect();
		var x = $event.clientX - bounds.x;
		var y = $event.clientY - bounds.y;

		if (zoom === true)
		{
			var dateNewMove = new Date();
		}
		else if (turnAround === true && currentView === CAMERA_VIEWS.PERSPECTIVE)
		{
			var dateNewMove = new Date();
			$this.turnAround(x, y);
		}
		else if (translate === true)
		{
			var dateNewMove = new Date();
			var section = $this.computeZcursorTarget(x, y);
			var delta = [section[0]-startCursorVertex[0], section[1]-startCursorVertex[1], section[2]-startCursorVertex[2]];
			targetVertex = [oldTargetVertex[0]-delta[0], oldTargetVertex[1]-delta[1], oldTargetVertex[2]-delta[2]];
			$this.updateCameraTarget();
		}

		if (dragged === true && dateNewMove.getTime()-datePreviousMove.getTime() > 40)
		{
			canvas.render();
			datePreviousMove = dateNewMove;
		}
	});

	document.getElementById('main').onMouseUp.push(function($event)
	{
		zoom = false;
		turnAround = false;
		translate = false;
		dragged = false;
	});

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(canvas, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("canvas3DEditor");