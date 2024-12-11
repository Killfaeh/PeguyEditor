function FragmentShaderModeling()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-modeling';
	
	var param =
	{
		uAmbientLight: { uniform: true, matrix: false, size: 4 },
		uDLightColor_0: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_0: { uniform: true, matrix: false, size: 3 },
		uDLightColor_1: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_1: { uniform: true, matrix: false, size: 3 }
	};
	
	var code = "precision mediump float; \n\n" + 

	"uniform vec4 uAmbientLight; \n" +
	"uniform vec3 uDLightDirection_0; \n" + 
	"uniform vec3 uDLightDirection_1; \n" + 
	"uniform vec4 uDLightColor_0; \n" +
	"uniform vec4 uDLightColor_1; \n\n" +
	
	"varying vec3 vNormal; \n\n" + 
	
	SHADERS_FUNCTIONS.diffuseFactor + 
	
	"void main(void) \n" + 
	"{ \n" + 

		"vec3 normal = normalize(vNormal); \n\n" + 
		
		"vec3 reflectedLightColor = diffuseFactor(normal, -uDLightDirection_0) * uDLightColor_0.rgb; \n" + 
		"reflectedLightColor += diffuseFactor(normal, -uDLightDirection_1) * uDLightColor_1.rgb; \n\n" + 

		"gl_FragColor = uAmbientLight + vec4(reflectedLightColor, 1.0); \n" + 
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-modeling");