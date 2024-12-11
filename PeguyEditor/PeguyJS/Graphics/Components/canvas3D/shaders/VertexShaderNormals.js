function VertexShaderNormals()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'vertex-normals';
	
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
	"uniform mat4 uPMatrix; \n" + 
	
	"varying vec3 vNormal; \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		"gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n" + 
		"vNormal = mat3(uMVMatrix) * aVertexNormal; \n" + 
	"} \n";
	
	var shader = new Shader(name, 'vertex', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vertex-normals");