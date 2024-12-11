function FragmentShaderNormals()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-normals';
	
	var param =
	{
		uCameraPosition: { uniform: true, matrix: false, size: 3 },
		
		// Calcul du décalage de parallaxes
		
		uHeightTexture: { uniform: true, texture: true, size: 1},
		uHeightTexWResolution: { uniform: true, matrix: false, size: 1 },
		uHeightTexHResolution: { uniform: true, matrix: false, size: 1 },
		
		uUseParallax: { uniform: true, matrix: false, size: 1 },
		uUseParallaxToFindEdges: { uniform: true, matrix: false, size: 1 },
		uParallaxScale: { uniform: true, matrix: false, size: 1 },
		
		// Calcul de la normale pour le bump mapping
		
		uUseBump: { uniform: true, matrix: false, size: 1 },
		uUseBumpToFindEdges: { uniform: true, matrix: false, size: 1 },
		uBumpScale: { uniform: true, matrix: false, size: 1 }
	};
	
	var code = "#extension GL_OES_standard_derivatives : enable \n" + 
	//"#extension GL_OES_standard_derivatives : enable \n" + 
	
	"precision mediump float; \n\n" + 

	"uniform vec3 uCameraPosition; \n" + 
	
	// Calcul du décalage de parallaxes
	
	"uniform sampler2D uHeightTexture; \n" + 
	"uniform float uHeightTexWResolution; \n" + 
	"uniform float uHeightTexHResolution; \n" + 
	
	"uniform float uUseParallax; \n" + 
	"uniform float uUseParallaxToFindEdges; \n" + 
	"uniform float uParallaxScale; \n" + 
	
	// Calcul de la normale pour le bump mapping
	
	"uniform float uUseBump; \n" + 
	"uniform float uUseBumpToFindEdges; \n" + 
	"uniform float uBumpScale; \n" + 
	
	"varying vec3 vCameraPosition; \n" + 
	"varying vec3 vPosition; \n" + 
	"varying vec3 vNormal; \n" + 
	"varying vec3 vTangentX; \n" + 
	"varying vec3 vTangentY; \n" + 
	"varying vec3 vTextureTangentX; \n" + 
	"varying vec3 vTextureTangentY; \n" + 
	"varying vec3 vTextureTangentZ; \n" + 
	"varying vec2 vTexture; \n\n" + 
	
	SHADERS_FUNCTIONS.diffuseFactor + 
	SHADERS_FUNCTIONS.colorToGreyScale + 
	SHADERS_FUNCTIONS.horizontalLine + 
	SHADERS_FUNCTIONS.rotate + 
	SHADERS_FUNCTIONS.ParallaxMapping + 
	
	"void main(void) \n" + 
	"{ \n" + 
	
		"vec3 normal = normalize(vNormal); \n\n" + 
		"vec3 tangentX = normalize(vTangentX); \n" + 
		"vec3 tangentY = normalize(vTangentY); \n" + 
		"vec3 textureTangentX = normalize(vTextureTangentX); \n" + 
		"vec3 textureTangentY = normalize(vTextureTangentY); \n" + 
		"vec3 textureTangentZ = normalize(vTextureTangentZ); \n" + 
		
		// Calcul de diffusion sans bump
		
		"vec3 df = normal; \n" + 
		
		// Calcul du décalage de parallaxes
		
		"float invmax = inversesqrt(max(dot(tangentX, tangentX), dot(tangentY, tangentY))); \n" + 
		"mat3 tm = mat3(tangentX*invmax, tangentY*invmax, normal); \n" + 
		"mat3 tbn_inv = mat3(vec3(tm[0].x, tm[1].x, tm[2].x), vec3(tm[0].y, tm[1].y, tm[2].y), vec3(tm[0].z, tm[1].z, tm[2].z)); \n" + 
		"mat3 localTm = mat3(textureTangentX, textureTangentY, textureTangentZ);\n" + 
		"vec3 view_dir = localTm * tbn_inv * normalize(vPosition - uCameraPosition); \n\n" + 
		
		"vec2 uv = vTexture; \n\n" + 
		
		"if (uUseParallaxToFindEdges > 0.0) \n" + 
		"{ \n" + 
			"uv = ParallaxMapping(uHeightTexture, uParallaxScale, vTexture, view_dir); \n" + 
		"} \n\n" + 
		
		// Calcul de la normale pour le bump mapping
		
		"vec3 bumpDf = df; \n\n" + 
		
		"if (uUseBumpToFindEdges > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec4 texColorXPrevious = texture2D(uHeightTexture, vec2(uv.x - textureTangentX.x/uHeightTexWResolution, uv.y - textureTangentX.y/uHeightTexHResolution)); \n" + 
			"vec4 texColorXNext = texture2D(uHeightTexture, vec2(uv.x + textureTangentX.x/uHeightTexWResolution, uv.y + textureTangentX.y/uHeightTexHResolution)); \n" + 
			"vec4 texColorYPrevious = texture2D(uHeightTexture, vec2(uv.x - textureTangentY.x/uHeightTexWResolution, uv.y - textureTangentY.y/uHeightTexHResolution)); \n" + 
			"vec4 texColorYNext = texture2D(uHeightTexture, vec2(uv.x + textureTangentY.x/uHeightTexWResolution, uv.y + textureTangentY.y/uHeightTexHResolution)); \n\n" + 
			
			"float deltaX = texColorXNext.r-texColorXPrevious.r; \n" + 
			"float deltaY = texColorYNext.r-texColorYPrevious.r; \n" + 
			
			"float deltaZ = sqrt(1.0 - deltaX*deltaX - deltaY*deltaY)/uBumpScale; \n\n" + 
			
			"vec3 texNormal = normalize(vec3(-deltaX, -deltaY, deltaZ)); \n\n" + 
			"vec3 wNormal = tm * texNormal; \n\n" + 
			
			"bumpDf = wNormal; \n\n" + 
			
		"} \n\n" + 
		
		"gl_FragColor = vec4(bumpDf * 0.5 + 0.5, gl_FragCoord.z); \n" + 

	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-normals");