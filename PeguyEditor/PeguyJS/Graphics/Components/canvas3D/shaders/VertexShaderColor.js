function VertexShaderColor()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'vertex-color';
	
	var param = 
	{
		aVertexPosition: { uniform: false, matrix: false, size: 3}, 
		aVertexColor: { uniform: false, matrix: false, size: 4}, 
		uMVMatrix: { uniform: true, matrix: true, size: 4}, 
		uCMatrix: { uniform: true, matrix: true, size: 4}, 
		uPMatrix: { uniform: true, matrix: true, size: 4}
	};
	
	var code = "attribute vec3 aVertexPosition; \n\n" + 
	"attribute vec4 aVertexColor; \n\n" + 
	
	"uniform mat4 uMVMatrix; \n" + 
	"uniform mat4 uCMatrix; \n" + 
	"uniform mat4 uPMatrix; \n\n" + 
	
	"varying vec4 vColor; \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		"gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n" + 
		"vColor = aVertexColor; \n" + 
	"} \n";
	
	var shader = new Shader(name, 'vertex', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vertex-color");