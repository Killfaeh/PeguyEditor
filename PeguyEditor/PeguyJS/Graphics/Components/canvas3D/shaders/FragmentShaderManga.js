function FragmentShaderManga()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-manga';
	
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
		
		// Calcul du clipping selon une map alpha
		
		uUseClipping: { uniform: true, matrix: false, size: 1 },
		uUseClippingLine: { uniform: true, matrix: false, size: 1 },
		uClippingTexture: { uniform: true, texture: true, size: 1},
		
		// Calcul de la normale pour le bump mapping
		
		uUseBump: { uniform: true, matrix: false, size: 1 },
		uBumpScale: { uniform: true, matrix: false, size: 1 },
		
		// Rampe pour les high lights
		
		uUseLightRamp: { uniform: true, matrix: false, size: 1 },
		uLightRampTexture: { uniform: true, texture: true, size: 1},
		
		// Rampe pour les ombres noires
		
		uUseShadowRamp: { uniform: true, matrix: false, size: 1 },
		uShadowRampTexture: { uniform: true, texture: true, size: 1},
		
		// Texture de trames
		
		uUseScreentoneTexture: { uniform: true, matrix: false, size: 1 },
		uScreentoneTexture: { uniform: true, texture: true, size: 1},
		uScreenWResolution: { uniform: true, matrix: false, size: 1 },
		uScreenHResolution: { uniform: true, matrix: false, size: 1 },
		uTexWResolution: { uniform: true, matrix: false, size: 1 },
		uTexHResolution: { uniform: true, matrix: false, size: 1 },
		
		// Calcul de la trame points
		
		uUseDotScreentone: { uniform: true, matrix: false, size: 1 },
		
		uDotGridSize: { uniform: true, matrix: false, size: 1 },
		uDotGridAngle: { uniform: true, matrix: false, size: 1 },
		
		uDotConstantSize: { uniform: true, matrix: false, size: 1 },
		uDotSize: { uniform: true, matrix: false, size: 1 },
		
		// Calcul de la trame en lignes
		
		uUseLineScreentone: { uniform: true, matrix: false, size: 1 },
		
		uLineGridSize: { uniform: true, matrix: false, size: 1 },
		uLineGridAngle: { uniform: true, matrix: false, size: 1 },
		
		uLineConstantSize: { uniform: true, matrix: false, size: 1 },
		uLineSize: { uniform: true, matrix: false, size: 1 },
		
		// Calcul des lignes le long de l'objet
		
		uUseWrapLine: { uniform: true, matrix: false, size: 1 },
		
		uWrapLineGridSize: { uniform: true, matrix: false, size: 1 },
		uWrapLineGridAngle: { uniform: true, matrix: false, size: 1 },
		
		uWrapLineConstantSize: { uniform: true, matrix: false, size: 1 },
		uWrapLineSize: { uniform: true, matrix: false, size: 1 },
		
		// Calcul du grattage de la trame
		
		uUseWhiteHatching: { uniform: true, matrix: false, size: 1 },
		
		uWhiteHatchingMinWidth: { uniform: true, matrix: false, size: 1 },
		uWhiteHatchingMaxWidth: { uniform: true, matrix: false, size: 1 },
		uWhiteHatchingGridSize_0: { uniform: true, matrix: false, size: 1 },
		uWhiteHatchingGridSize_1: { uniform: true, matrix: false, size: 1 },
		uWhiteHatchingGridAngle_0: { uniform: true, matrix: false, size: 1 },
		uWhiteHatchingGridAngle_1: { uniform: true, matrix: false, size: 1 },
		
		// Calcul des hachures noires
		
		uUseBlackHatching: { uniform: true, matrix: false, size: 1 },
		
		uBlackHatchingMinWidth: { uniform: true, matrix: false, size: 1 },
		uBlackHatchingMaxWidth: { uniform: true, matrix: false, size: 1 },
		uBlackHatchingGridSize_0: { uniform: true, matrix: false, size: 1 },
		uBlackHatchingGridSize_1: { uniform: true, matrix: false, size: 1 },
		uBlackHatchingGridAngle_0: { uniform: true, matrix: false, size: 1 },
		uBlackHatchingGridAngle_1: { uniform: true, matrix: false, size: 1 }
	};
	
	var code = "precision mediump float; \n\n" + 
	
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
	
	// Calcul du clipping selon une map alpha
	
	"uniform float uUseClipping; \n" + 
	"uniform float uUseClippingLine; \n" + 
	"uniform sampler2D uClippingTexture; \n" + 
	
	// Calcul de la normale pour le bump mapping
	
	"uniform float uUseBump; \n" + 
	"uniform float uBumpScale; \n" + 
	
	// Rampe pour les high lights
	
	"uniform float uUseLightRamp; \n" + 
	"uniform sampler2D uLightRampTexture; \n" + 
	
	// Rampe pour les ombres noires
	
	"uniform float uUseShadowRamp; \n" + 
	"uniform sampler2D uShadowRampTexture; \n" + 
	
	// Texture de trames
	
	"uniform float uUseScreentoneTexture; \n" + 
	"uniform sampler2D uScreentoneTexture; \n" + 
	"uniform float uScreenWResolution; \n" + 
	"uniform float uScreenHResolution; \n" + 
	"uniform float uTexWResolution; \n" + 
	"uniform float uTexHResolution; \n" + 
	
	// Calcul de la trame points
	
	"uniform float uUseDotScreentone; \n" + 
	
	"uniform float uDotGridSize; \n" + 
	"uniform float uDotGridAngle; \n" + 
	
	"uniform float uDotConstantSize; \n" + 
	"uniform float uDotSize; \n" + 
	
	// Calcul de la trame en lignes
	
	"uniform float uUseLineScreentone; \n" + 
	
	"uniform float uLineGridSize; \n" + 
	"uniform float uLineGridAngle; \n" + 
	
	"uniform float uLineConstantSize; \n" + 
	"uniform float uLineSize; \n" + 
	
	// Calcul des lignes le long de l'objet
	
	"uniform float uUseWrapLine; \n" + 
	
	"uniform float uWrapLineGridSize; \n" + 
	"uniform float uWrapLineGridAngle; \n" + 
	
	"uniform float uWrapLineConstantSize; \n" + 
	"uniform float uWrapLineSize; \n" + 
	
	// Calcul du grattage de la trame
	
	"uniform float uUseWhiteHatching; \n" + 
	
	"uniform float uWhiteHatchingMinWidth; \n" + 
	"uniform float uWhiteHatchingMaxWidth; \n" + 
	"uniform float uWhiteHatchingGridSize_0; \n" + 
	"uniform float uWhiteHatchingGridSize_1; \n" + 
	"uniform float uWhiteHatchingGridAngle_0; \n" + 
	"uniform float uWhiteHatchingGridAngle_1; \n" + 
	
	// Calcul des hachures noires
	
	"uniform float uUseBlackHatching; \n" + 
	
	"uniform float uBlackHatchingMinWidth; \n" + 
	"uniform float uBlackHatchingMaxWidth; \n" + 
	"uniform float uBlackHatchingGridSize_0; \n" + 
	"uniform float uBlackHatchingGridSize_1; \n" + 
	"uniform float uBlackHatchingGridAngle_0; \n" + 
	"uniform float uBlackHatchingGridAngle_1; \n" + 
	
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
		
		// Calcul de diffusion sans bump
		
		"float df = diffuseFactor(normal, -uDLightDirection_0)*colorToGreyScale(uDLightColor_0); \n" + 
		"df += diffuseFactor(normal, -uDLightDirection_1)*colorToGreyScale(uDLightColor_1); \n" + 
		"df += colorToGreyScale(uAmbientLight); \n\n" + 
		
		"if (df > 1.0) \n" + 
		"{ \n" + 
			"df = 1.0; \n" + 
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
		
		// Calcul de la normale pour le bump mapping
		
		"float bumpDf = df; \n\n" + 
		
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
	
			"bumpDf = diffuseFactor(wNormal, -uDLightDirection_0)*colorToGreyScale(uDLightColor_0); \n" + 
			"bumpDf += diffuseFactor(wNormal, -uDLightDirection_1)*colorToGreyScale(uDLightColor_1); \n" + 
			"bumpDf += colorToGreyScale(uAmbientLight); \n\n" + 
			
			"if (bumpDf > 1.0) \n" + 
			"{ \n" + 
				"bumpDf = 1.0; \n" + 
			"} \n\n" + 
			
		"} \n\n" + 
		
		// Rampe pour les high lights
		
		"float lightDf = 0.0; \n\n" + 
		
		"if (uUseLightRamp > 0.0) \n" + 
		"{ \n" + 
			"lightDf = ramp(uLightRampTexture, bumpDf); \n" + 
		"} \n\n" + 
		
		// Rampe pour les ombres noires
		
		"float shadowDf = 1.0; \n\n" + 
		
		"if (uUseShadowRamp > 0.0) \n" + 
		"{ \n" + 
			"shadowDf = ramp(uShadowRampTexture, bumpDf); \n\n" + 
		"} \n\n" + 
		
		// Texture de trames
		
		"vec4 screentone = vec4(1.0, 1.0, 1.0, 1.0); \n\n" + 
		
		"if (uUseScreentoneTexture > 0.0) \n" + 
		"{ \n" + 
		
			"vec2 relativeTexCoord = vec2(gl_FragCoord.x/uScreenWResolution, gl_FragCoord.y/uScreenHResolution); \n" + 
			"screentone = texture2D(uScreentoneTexture, vec2(relativeTexCoord.x, relativeTexCoord.y)); \n" + 
			
		"} \n\n" + 
		
		"float screentoneDf = colorToGreyScale(screentone); \n\n" + 
		
		// Calcul de la trame points
		
		"float dotScreentoneDf = 1.0; \n\n" + 
		
		"if (uUseDotScreentone > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec2 pos = rotate(radians(uDotGridAngle)) * gl_FragCoord.xy; \n" + 
			"vec2 grid_pos = mod(pos, uDotGridSize); \n\n" + 
			
			"if (uDotConstantSize <= 0.0) \n" + 
			"{ \n" + 
				"dotScreentoneDf -= circle(grid_pos, vec2(uDotGridSize / 2.0), 0.8 * uDotGridSize * pow(1.0 - df, 2.0)); \n" +
			"} \n" + 
			"else \n" + 
			"{ \n" + 
				"dotScreentoneDf -= circle(grid_pos, vec2(uDotGridSize / 2.0), uDotSize); \n" +
			"} \n" + 
			
			"dotScreentoneDf = clamp(dotScreentoneDf, 0.0, 1.0); \n\n" +
			
		"} \n\n" + 
		
		// Calcul de la trame en lignes
		
		"float lineScreentoneDf = 1.0; \n\n" + 
		
		"if (uUseLineScreentone > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec2 pos = rotate(radians(uLineGridAngle)) * gl_FragCoord.xy; \n" + 
			"vec2 grid_pos = mod(pos, uLineGridSize); \n\n" + 
			
			"if (uLineConstantSize <= 0.0) \n" + 
			"{ \n" + 
				"float line_width = uLineSize * (smoothstep(0.5, 0.0, df)); \n" + 
				"lineScreentoneDf -= horizontalLine(grid_pos, uLineGridSize / 2.0, line_width); \n" +
			"} \n" + 
			"else \n" + 
			"{ \n" + 
				"lineScreentoneDf -= horizontalLine(grid_pos, uLineGridSize / 2.0, uLineSize); \n" +
			"} \n" + 
			
			"lineScreentoneDf = clamp(lineScreentoneDf, 0.0, 1.0); \n\n" +
			
		"} \n\n" + 
		
		// Calcul des lignes le long de l'objet
		
		"float wrapLineScreentoneDf = 1.0; \n\n" + 
		
		"if (uUseWrapLine > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec2 pos = rotate(radians(uWrapLineGridAngle)) * 1000.0*vTexture; \n" + 
			"vec2 grid_pos = vec2(pos.x, mod(pos.y, uWrapLineGridSize)); \n\n" + 
			
			"if (uWrapLineConstantSize <= 0.0) \n" + 
			"{ \n" + 
				"float line_width = uWrapLineSize * (smoothstep(0.8, 0.0, df)); \n" + 
				"float line = horizontalLine(grid_pos, uWrapLineGridSize / 2.0, line_width); \n" + 
				"wrapLineScreentoneDf -= line * (smoothstep(0.0, 0.02, line_width/uWrapLineSize)); \n" + 
			"} \n" + 
			"else \n" + 
			"{ \n" + 
				"float line = horizontalLine(grid_pos, uWrapLineGridSize / 2.0, uWrapLineSize); \n" + 
				"wrapLineScreentoneDf -= line * (smoothstep(0.0, 0.02, 1.0)); \n" + 
			"} \n" + 
			
			"wrapLineScreentoneDf = clamp(wrapLineScreentoneDf, 0.0, 1.0); \n\n" +
			
		"} \n\n" + 
		
		// Calcul du grattage de la trame
		
		"float whiteHatchingDf = 0.0; \n\n" + 
		
		"if (uUseWhiteHatching > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec2 pos = rotate(radians(uWhiteHatchingGridAngle_0)) * gl_FragCoord.xy; \n" + 
			"vec2 grid_pos = mod(pos, uWhiteHatchingGridSize_0); \n\n" + 
			
			// Define the first group of pencil lines
			"float line_width_1 = (uWhiteHatchingMaxWidth-uWhiteHatchingMinWidth) * (smoothstep(0.7, 0.0, 1.0-bumpDf)) + uWhiteHatchingMinWidth; \n" + 
			"grid_pos = vec2(pos.x, mod(pos.y, uWhiteHatchingGridSize_0)); \n" + 
			"float line_1 = horizontalLine(grid_pos, uWhiteHatchingGridSize_0 / 2.0, line_width_1); \n" + 
			
			"float line_width_2 = (uWhiteHatchingMaxWidth-uWhiteHatchingMinWidth) * (smoothstep(0.6, 0.0, 1.0-bumpDf)) + uWhiteHatchingMinWidth; \n" + 
			"grid_pos.y = mod(pos.y + uWhiteHatchingGridSize_0 / 2.0, uWhiteHatchingGridSize_0); \n" + 
			"float line_2 = horizontalLine(grid_pos, uWhiteHatchingGridSize_0 / 2.0, line_width_2); \n\n" + 
			
			"pos = rotate(radians(-uWhiteHatchingGridAngle_0)) * pos; \n" + 
			"pos = rotate(radians(uWhiteHatchingGridAngle_1)) * pos; \n\n" + 
			
			// Define the second group of pencil lines
			"float line_width_3 = (uWhiteHatchingMaxWidth-uWhiteHatchingMinWidth) * (smoothstep(0.5, 0.0, 1.0-bumpDf)) + uWhiteHatchingMinWidth; \n" + 
			"grid_pos = vec2(pos.x, mod(pos.y, uWhiteHatchingGridSize_1)); \n" + 
			"float line_3 = horizontalLine(grid_pos, uWhiteHatchingGridSize_1 / 2.0, line_width_3); \n" + 
			
			"float line_width_4 = (uWhiteHatchingMaxWidth-uWhiteHatchingMinWidth) * (smoothstep(0.4, 0.0, 1.0-bumpDf)) + uWhiteHatchingMinWidth; \n" + 
			"grid_pos.y = mod(pos.y + uWhiteHatchingGridSize_1 / 2.0, uWhiteHatchingGridSize_1); \n" + 
			"float line_4 = horizontalLine(grid_pos, uWhiteHatchingGridSize_1 / 2.0, line_width_4); \n\n" + 
			
			// Calculate the surface color
			"whiteHatchingDf += line_1 * (smoothstep(0.0, 0.02, line_width_1/uWhiteHatchingMaxWidth)); \n" + 
			"whiteHatchingDf += line_2 * (smoothstep(0.0, 0.02, line_width_2/uWhiteHatchingMaxWidth)); \n" + 
			"whiteHatchingDf += line_3 * (smoothstep(0.0, 0.02, line_width_3/uWhiteHatchingMaxWidth)); \n" + 
			"whiteHatchingDf += line_4 * (smoothstep(0.0, 0.02, line_width_4/uWhiteHatchingMaxWidth)); \n" + 
			"whiteHatchingDf = clamp(whiteHatchingDf, 0.0, 1.0); \n\n" + 
			
		"} \n\n" + 
		
		// Calcul des hachures noires
		
		"float blackHatchingDf = 1.0; \n\n" + 
		
		"if (uUseBlackHatching > 0.0) \n" + 
		"{ \n\n" + 
		
			"vec2 pos = rotate(radians(uBlackHatchingGridAngle_0)) * gl_FragCoord.xy; \n" + 
			"vec2 grid_pos = mod(pos, uBlackHatchingGridSize_0); \n\n" + 
			
			// Define the first group of pencil lines
			"float line_width_1 = (uBlackHatchingMaxWidth-uBlackHatchingMinWidth) * (smoothstep(0.6, 0.0, bumpDf)) + uBlackHatchingMinWidth; \n" + 
			"grid_pos = vec2(pos.x, mod(pos.y, uBlackHatchingGridSize_0)); \n" + 
			"float line_1 = horizontalLine(grid_pos, uBlackHatchingGridSize_0 / 2.0, line_width_1); \n" + 
			
			"float line_width_2 = (uBlackHatchingMaxWidth-uBlackHatchingMinWidth) * (smoothstep(0.5, 0.0, bumpDf)) + uBlackHatchingMinWidth; \n" + 
			"grid_pos.y = mod(pos.y + uBlackHatchingGridSize_0 / 2.0, uBlackHatchingGridSize_0); \n" + 
			"float line_2 = horizontalLine(grid_pos, uBlackHatchingGridSize_0 / 2.0, line_width_2); \n\n" + 
			
			"pos = rotate(radians(-uBlackHatchingGridAngle_0)) * pos; \n" + 
			"pos = rotate(radians(uBlackHatchingGridAngle_1)) * pos; \n\n" + 
			
			// Define the second group of pencil lines
			"float line_width_3 = (uBlackHatchingMaxWidth-uBlackHatchingMinWidth) * (smoothstep(0.4, 0.0, bumpDf)) + uBlackHatchingMinWidth; \n" + 
			"grid_pos = vec2(pos.x, mod(pos.y, uBlackHatchingGridSize_1)); \n" + 
			"float line_3 = horizontalLine(grid_pos, uBlackHatchingGridSize_1 / 2.0, line_width_3); \n" + 
			
			"float line_width_4 = (uBlackHatchingMaxWidth-uBlackHatchingMinWidth) * (smoothstep(0.3, 0.0, bumpDf)) + uBlackHatchingMinWidth; \n" + 
			"grid_pos.y = mod(pos.y + uBlackHatchingGridSize_1 / 2.0, uBlackHatchingGridSize_1); \n" + 
			"float line_4 = horizontalLine(grid_pos, uBlackHatchingGridSize_1 / 2.0, line_width_4); \n\n" + 
			
			// Calculate the surface color
			"blackHatchingDf -= line_1 * (smoothstep(0.0, 0.02, line_width_1/uBlackHatchingMaxWidth)); \n" + 
			"blackHatchingDf -= line_2 * (smoothstep(0.0, 0.02, line_width_2/uBlackHatchingMaxWidth)); \n" + 
			"blackHatchingDf -= line_3 * (smoothstep(0.0, 0.02, line_width_3/uBlackHatchingMaxWidth)); \n" + 
			"blackHatchingDf -= line_4 * (smoothstep(0.0, 0.02, line_width_4/uBlackHatchingMaxWidth)); \n" + 
			"blackHatchingDf = clamp(blackHatchingDf, 0.0, 1.0); \n\n" + 
			
		"} \n\n" + 
		
		// Couleur finale
		
		/*
		"float bumpDf = df; \n\n" + 
		"float lightDf = 0.0; \n\n" + 
		"float shadowDf = 1.0; \n\n" + 
		"float screentoneDf = colorToGreyScale(screentone); \n\n" + 
		"float dotScreentoneDf = 1.0; \n\n" + 
		"float lineScreentoneDf = 1.0; \n\n" + 
		"float wrapLineScreentoneDf = 1.0; \n\n" + 
		"float whiteHatchingDf = 0.0; \n\n" + 
		"float blackHatchingDf = 1.0; \n\n" + 
		//*/
		
		"float finalDf = screentoneDf + (dotScreentoneDf-1.0) + (lineScreentoneDf-1.0) + (wrapLineScreentoneDf-1.0) + lightDf + (shadowDf-1.0) + whiteHatchingDf + (blackHatchingDf-1.0); \n\n" + 
		
		"if (finalDf > 1.0) \n" + 
		"{ \n" + 
			"finalDf = 1.0; \n" + 
		"} \n\n" + 
		
		"vec4 surface_color = vec4(finalDf, finalDf, finalDf, 1.0); \n\n" + 
		
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
	Loader.hasLoaded("fragment-manga");