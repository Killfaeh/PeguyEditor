function FragmentShaderBump()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-bump';
	
	var param =
	{
		uCameraPosition: { uniform: true, matrix: false, size: 3 },
		
		// Calcul de diffusion sans bump
		
		uAmbientLight: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_0: { uniform: true, matrix: false, size: 3 },
		uDLightDirection_1: { uniform: true, matrix: false, size: 3 },
		uDLightColor_0: { uniform: true, matrix: false, size: 4 },
		uDLightColor_1: { uniform: true, matrix: false, size: 4 },
		
		// Calcul du décalage de parallaxes
		
		uHeightTexture: { uniform: true, texture: true, size: 1},
		uHeightTexWResolution: { uniform: true, matrix: false, size: 1 },
		uHeightTexHResolution: { uniform: true, matrix: false, size: 1 },
		
		uUseParallax: { uniform: true, matrix: false, size: 1 },
		uParallaxScale: { uniform: true, matrix: false, size: 1 },
		
		// Calcul de la normale pour le bump mapping
		
		uUseBump: { uniform: true, matrix: false, size: 1 },
		uBumpScale: { uniform: true, matrix: false, size: 1 }
	};
	
	var code = "#extension GL_OES_standard_derivatives : enable \n" + 
	//"#extension GL_OES_standard_derivatives : enable \n" + 
	
	"precision mediump float; \n\n" + 
	
	"uniform vec3 uCameraPosition; \n" + 
	
	// Calcul de diffusion sans bump
	
	"uniform vec4 uAmbientLight; \n" +
	"uniform vec3 uDLightDirection_0; \n" + 
	"uniform vec3 uDLightDirection_1; \n" + 
	"uniform vec4 uDLightColor_0; \n" +
	"uniform vec4 uDLightColor_1; \n" +
	
	// Calcul du décalage de parallaxes
	
	"uniform sampler2D uHeightTexture; \n" + 
	"uniform float uHeightTexWResolution; \n" + 
	"uniform float uHeightTexHResolution; \n" + 
	
	"uniform float uUseParallax; \n" + 
	"uniform float uParallaxScale; \n" + 
	
	// Calcul de la normale pour le bump mapping
	
	"uniform float uUseBump; \n" + 
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
		
		"vec3 df = diffuseFactor(normal, -uDLightDirection_0)*uDLightColor_0.rgb; \n" + 
		"df += diffuseFactor(normal, -uDLightDirection_1)*uDLightColor_1.rgb; \n" + 
		"df += uAmbientLight.rgb; \n\n" + 
		
		"if (df.r > 1.0) \n" + 
		"{ \n" + 
			"df.r = 1.0; \n" + 
		"} \n\n" +
		
		"if (df.g > 1.0) \n" + 
		"{ \n" + 
			"df.g = 1.0; \n" + 
		"} \n\n" + 
		
		"if (df.b > 1.0) \n" + 
		"{ \n" + 
			"df.b = 1.0; \n" + 
		"} \n\n" + 
		
		// Calcul du décalage de parallaxes
		
		"float invmax = inversesqrt(max(dot(tangentX, tangentX), dot(tangentY, tangentY))); \n" + 
		"mat3 tm = mat3(tangentX*invmax, tangentY*invmax, normal); \n" + 
		"mat3 tbn_inv = mat3(vec3(tm[0].x, tm[1].x, tm[2].x), vec3(tm[0].y, tm[1].y, tm[2].y), vec3(tm[0].z, tm[1].z, tm[2].z)); \n" + 
		"mat3 localTm = mat3(textureTangentX, textureTangentY, textureTangentZ);\n" + 
		"vec3 view_dir = localTm * tbn_inv * normalize(vPosition - uCameraPosition); \n\n" + 
		
		"vec2 uv = vTexture; \n\n" + 
		
		"if (uUseParallax > 0.0) \n" + 
		"{ \n" + 
			"uv = ParallaxMapping(uHeightTexture, uParallaxScale, vTexture, view_dir); \n" + 
		"} \n\n" + 
		
		// Calcul de la normale pour le bump mapping
		
		"vec3 bumpDf = df; \n\n" + 
		
		"if (uUseBump > 0.0) \n" + 
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
			
			"bumpDf = diffuseFactor(wNormal, -uDLightDirection_0)*uDLightColor_0.rgb; \n" + 
			"bumpDf += diffuseFactor(wNormal, -uDLightDirection_1)*uDLightColor_1.rgb; \n" + 
			"bumpDf += uAmbientLight.rgb; \n\n" + 
			
			"if (bumpDf.r > 1.0) \n" + 
			"{ \n" + 
				"bumpDf.r = 1.0; \n" + 
			"} \n\n" + 
			
			"if (bumpDf.g > 1.0) \n" + 
			"{ \n" + 
				"bumpDf.g = 1.0; \n" + 
			"} \n\n" + 
			
			"if (bumpDf.b > 1.0) \n" + 
			"{ \n" + 
				"bumpDf.b = 1.0; \n" + 
			"} \n\n" + 
			
		"} \n\n" + 
		
		"gl_FragColor = vec4(bumpDf, 1.0); \n" + 
		
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-bump");