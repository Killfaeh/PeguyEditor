function VertexShaderMaterial()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'vertex-material';
	
	var param = 
	{
		aVertexPosition: { uniform: false, matrix: false, size: 3 },
		aVertexNormal: { uniform: false, matrix: false, size: 3 },
		uMVMatrix: { uniform: true, matrix: true, size: 4 },
		uCMatrix: { uniform: true, matrix: true, size: 4 },
		uPMatrix: { uniform: true, matrix: true, size: 4 }
	};
	
	var code = "attribute vec3 aVertexPosition; \n" + 
	
	"attribute vec3 aVertexNormal; \n\n" + 
	
	"uniform mat4 uMVMatrix; \n" + 
	"uniform mat4 uCMatrix; \n" + 
	"uniform mat4 uPMatrix; \n\n" + 
	
	"varying mat4 vMVMatrix; \n" + 
	"varying mat4 vCMatrix; \n" + 
	"varying mat4 vPMatrix; \n\n" + 

	"varying vec3 vNormal; \n" + 
	"varying vec4 vEyeDirection; \n" + 
	"varying vec3 vEyeNormal; \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		"vMVMatrix = uMVMatrix; \n" + 
		"vCMatrix = uCMatrix; \n" + 
		"vPMatrix = uPMatrix; \n" + 
		"vEyeDirection = uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n" + 
		"gl_Position = uPMatrix * vEyeDirection; \n" + 
		"vNormal = mat3(uMVMatrix) * aVertexNormal; \n" + 
		"vEyeNormal = normalize(mat3(uCMatrix) * mat3(uMVMatrix) * aVertexNormal); \n" + 
		"vEyeDirection = normalize(vEyeDirection); \n" + 
	"} \n";
	
	var shader = new Shader(name, 'vertex', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vertex-material");