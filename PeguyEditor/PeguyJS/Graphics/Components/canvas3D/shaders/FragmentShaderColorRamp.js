function FragmentShaderColorRamp()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-color-ramp';
	
	var param =
	{
		uRampTexture: { uniform: true, texture: true, size: 1},
		
		uAmbientLight: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_0: { uniform: true, matrix: false, size: 3 },
		uDLightDirection_1: { uniform: true, matrix: false, size: 3 },
		uDLightColor_0: { uniform: true, matrix: false, size: 4 },
		uDLightColor_1: { uniform: true, matrix: false, size: 4 },
	};
	
	var code = "precision mediump float; \n\n" + 
	
	"uniform sampler2D uRampTexture; \n\n" + 
	
	"uniform vec4 uAmbientLight; \n" +
	"uniform vec3 uDLightDirection_0; \n" + 
	"uniform vec3 uDLightDirection_1; \n" + 
	"uniform vec4 uDLightColor_0; \n" +
	"uniform vec4 uDLightColor_1; \n\n" +
	
	"varying vec3 vNormal; \n\n" + 
	
	SHADERS_FUNCTIONS.diffuseFactor + 
	SHADERS_FUNCTIONS.colorToGreyScale + 
	SHADERS_FUNCTIONS.ramp + 
	
	"void main(void) \n" + 
	"{ \n" + 
		
		"vec3 normal = normalize(vNormal); \n\n" + 
		
		"float df = 0.0; \n" + 
		"df += diffuseFactor(normal, -uDLightDirection_0)*colorToGreyScale(uDLightColor_0); \n" + 
		"df += diffuseFactor(normal, -uDLightDirection_1)*colorToGreyScale(uDLightColor_1); \n" + 
		"df += colorToGreyScale(uAmbientLight); \n\n" + 
		
		"df = ramp(uRampTexture, df); \n\n" + 
	
		"gl_FragColor = vec4(df, df, df, 1.0); \n" + 
		
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-color-ramp");