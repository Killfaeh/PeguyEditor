function VertexShaderNormalsTexture()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'vertex-normals-texture';
	
	var param = 
	{
		aVertexPosition: { uniform: false, matrix: false, size: 3 },
		aVertexNormal: { uniform: false, matrix: false, size: 3 },
		aVertexTangentX: { uniform: false, matrix: false, size: 3 },
		aVertexTangentY: { uniform: false, matrix: false, size: 3 },
		aVertexTextureTangentX: { uniform: false, matrix: false, size: 3 },
		aVertexTextureTangentY: { uniform: false, matrix: false, size: 3 },
		aVertexTextureTangentZ: { uniform: false, matrix: false, size: 3 },
		aVertexTexture: { uniform: false, matrix: false, size: 2 },
		uMVMatrix: { uniform: true, matrix: true, size: 4 },
		uCMatrix: { uniform: true, matrix: true, size: 4 },
		uPMatrix: { uniform: true, matrix: true, size: 4 }
	};
	
	var code = "attribute vec3 aVertexPosition; \n" + 
	
	"attribute vec3 aVertexNormal; \n" + 
	"attribute vec3 aVertexBumpNormal; \n" + 
	"attribute vec3 aVertexTangentX; \n" + 
	"attribute vec3 aVertexTangentY; \n" + 
	"attribute vec3 aVertexTextureTangentX; \n" + 
	"attribute vec3 aVertexTextureTangentY; \n" + 
	"attribute vec3 aVertexTextureTangentZ; \n" + 
	"attribute vec2 aVertexTexture; \n\n" + 
	
	"uniform mat4 uMVMatrix; \n" + 
	"uniform mat4 uCMatrix; \n" + 
	"uniform mat4 uPMatrix; \n" + 
	
	"varying vec3 vCameraPosition; \n" + 
	"varying vec3 vPosition; \n" + 
	"varying vec3 vNormal; \n" + 
	"varying vec3 vTangentX; \n" + 
	"varying vec3 vTangentY; \n" + 
	"varying vec3 vTextureTangentX; \n" + 
	"varying vec3 vTextureTangentY; \n" + 
	"varying vec3 vTextureTangentZ; \n" + 
	"varying vec3 vOriginalNormal; \n" + 
	"varying vec2 vTexture; \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		"gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n\n" + 
		
		"vCameraPosition = vec3(uCMatrix * vec4(0.0, 0.0, 0.0, 1.0)); \n" + 
		"vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0)); \n" + 
		"vNormal = mat3(uMVMatrix) * aVertexNormal; \n" + 
		"vTangentX = mat3(uMVMatrix) * aVertexTangentX; \n" + 
		"vTangentY = mat3(uMVMatrix) * aVertexTangentY; \n" + 
		"vTextureTangentX = aVertexTextureTangentX; \n" + 
		"vTextureTangentY = aVertexTextureTangentY; \n" + 
		"vTextureTangentZ = aVertexTextureTangentZ; \n" + 
		"vOriginalNormal = aVertexNormal; \n" + 
		"vTexture = aVertexTexture; \n" + 
	"} \n";
	
	var shader = new Shader(name, 'vertex', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vertex-normals-texture");