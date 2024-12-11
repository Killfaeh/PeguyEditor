function FragmentShaderOutline()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-outline';
	
	var param =
	{
		uColor: { uniform: true, matrix: false, size: 4 },
		
		uCameraPosition: { uniform: true, matrix: false, size: 3 },
		
		// Calcul du décalage de parallaxes
		
		uHeightTexture: { uniform: true, texture: true, size: 1},
		uHeightTexWResolution: { uniform: true, matrix: false, size: 1 },
		uHeightTexHResolution: { uniform: true, matrix: false, size: 1 },
		
		uUseParallax: { uniform: true, matrix: false, size: 1 },
		uParallaxScale: { uniform: true, matrix: false, size: 1 },
		
		// Calcul du clipping selon une map alpha
		
		uUseClipping: { uniform: true, matrix: false, size: 1 },
		uUseClippingLine: { uniform: true, matrix: false, size: 1 },
		uClippingTexture: { uniform: true, texture: true, size: 1}
		
	};
	
	var code = "precision mediump float; \n\n" + 

	"uniform vec4 uColor; \n" +
	
	"uniform vec3 uCameraPosition; \n" + 
	
	// Calcul du décalage de parallaxes
	
	"uniform sampler2D uHeightTexture; \n" + 
	"uniform float uHeightTexWResolution; \n" + 
	"uniform float uHeightTexHResolution; \n" + 
	
	"uniform float uUseParallax; \n" + 
	"uniform float uParallaxScale; \n" + 
	
	// Calcul du clipping selon une map alpha
	
	"uniform float uUseClipping; \n" + 
	"uniform float uUseClippingLine; \n" + 
	"uniform sampler2D uClippingTexture; \n" + 
	
	// Données locales
	
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
	SHADERS_FUNCTIONS.circle + 
	SHADERS_FUNCTIONS.rotate + 
	SHADERS_FUNCTIONS.ParallaxMapping + 
	SHADERS_FUNCTIONS.ramp + 
	
	"void main(void) \n" + 
	"{ \n" + 
	
		"vec3 normal = normalize(vNormal); \n\n" + 
		"vec3 tangentX = normalize(vTangentX); \n" + 
		"vec3 tangentY = normalize(vTangentY); \n" + 
		"vec3 textureTangentX = normalize(vTextureTangentX); \n" + 
		"vec3 textureTangentY = normalize(vTextureTangentY); \n" + 
		"vec3 textureTangentZ = normalize(vTextureTangentZ); \n" + 
		
		// Calcul du décalage de parallaxes
		
		"float invmax = inversesqrt(max(dot(tangentX, tangentX), dot(tangentY, tangentY))); \n" + 
		"mat3 tm = mat3(tangentX*invmax, tangentY*invmax, normal); \n" + 
		"mat3 tbn_inv = mat3(vec3(tm[0].x, tm[1].x, tm[2].x), vec3(tm[0].y, tm[1].y, tm[2].y), vec3(tm[0].z, tm[1].z, tm[2].z)); \n" + 
		"mat3 localTm = mat3(textureTangentX, textureTangentY, textureTangentZ);\n" + 
		"vec3 view_dir = localTm * tbn_inv * normalize(vPosition + uCameraPosition); \n\n" + 
		
		"vec2 uv = vTexture; \n\n" + 
		
		"if (uUseParallax > 0.0) \n" + 
		"{ \n" + 
			"uv = ParallaxMapping(uHeightTexture, uParallaxScale, vTexture, view_dir); \n" + 
		"} \n\n" + 
		
		// Calcul du clipping selon une map alpha
		
		"float clippingDf = 1.0;\n\n" +
	
		"if (uUseClipping > 0.0) \n" + 
		"{ \n" + 
			"vec4 clippingTexColor = texture2D(uClippingTexture, vec2(uv.x, uv.y)); \n\n" + 
			
			"if (uUseClippingLine <= 0.0) \n" + 
			"{ \n" + 
				"if (clippingTexColor.r < 0.5) \n" + 
				"{ \n" + 
					//"discard; \n" + 
					"clippingDf = 0.0; \n" + 
				"} \n" + 
			"} \n" + 
			"else \n" + 
			"{ \n" + 
				"if (clippingTexColor.r <= 0.1) \n" + 
				"{ \n" + 
					//"discard; \n" + 
					"clippingDf = 0.0; \n" + 
				"} \n" + 
				"else if (clippingTexColor.r < 0.9) \n" + 
				"{ \n" + 
					"clippingDf = 0.5; \n" + 
				"} \n" + 
				"else \n" + 
				"{ \n" + 
					"clippingDf = 1.0; \n" + 
				"} \n" + 
			"} \n" + 
		"} \n\n" + 
		
		"vec4 surface_color = uColor; \n\n" + 
		
		"if (clippingDf <= 0.0) \n" + 
		"{ \n" + 
			"surface_color.a = 0.0; \n" + 
		"} \n" + 
		"else if (clippingDf < 1.0) \n" + 
		"{ \n" + 
			"surface_color.r = 0.0; \n" + 
			"surface_color.g = 0.0; \n" + 
			"surface_color.b = 0.0; \n" + 
		"} \n\n" + 
	
		"if (clippingDf <= 0.0) \n" + 
		"{ \n" + 
			"discard; \n" + 
		"} \n" + 
		"else \n" + 
		"{ \n" + 
			"gl_FragColor = surface_color; \n\n" + 
		"} \n\n" +
		
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-outline");