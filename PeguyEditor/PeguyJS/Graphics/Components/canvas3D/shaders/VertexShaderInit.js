function VertexShaderInit()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'vertex-init';
	
	var param = 
	{
		aVertexPosition: { uniform: false, matrix: false, size: 3}, 
		uMVMatrix: { uniform: true, matrix: true, size: 4}, 
		uCMatrix: { uniform: true, matrix: true, size: 4}, 
		uPMatrix: { uniform: true, matrix: true, size: 4}
	};
	
	var code = "attribute vec3 aVertexPosition; \n\n" + 
	
	"uniform mat4 uMVMatrix; \n" + 
	"uniform mat4 uCMatrix; \n" + 
	"uniform mat4 uPMatrix; \n\n" + 
		
	"void main(void) \n" + 
	"{ \n" + 
		"gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n" + 
	"} \n";
	
	var shader = new Shader(name, 'vertex', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vertex-init");