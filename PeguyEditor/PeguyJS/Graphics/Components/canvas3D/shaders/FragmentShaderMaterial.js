function FragmentShaderMaterial()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-material';
	
	var param =
	{
		uAmbientLight: { uniform: true, matrix: false, size: 4 },
		uDLightColor_0: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_0: { uniform: true, matrix: false, size: 3 },
		uDLightColor_1: { uniform: true, matrix: false, size: 4 },
		uDLightDirection_1: { uniform: true, matrix: false, size: 3 },
		uBaseColor: { uniform: true, matrix: false, size: 3 },
		uSpecularColor: { uniform: true, matrix: false, size: 3 },
		uSpecular: { uniform: true, matrix: false, size: 1 }
	};
	
	var code = "precision mediump float; \n\n" + 

	"uniform vec4 uAmbientLight; \n" +
	"uniform vec3 uDLightDirection_0; \n" + 
	"uniform vec3 uDLightDirection_1; \n" + 
	"uniform vec4 uDLightColor_0; \n" +
	"uniform vec4 uDLightColor_1; \n\n" +

	"uniform vec3 uBaseColor; \n" + 
	"uniform vec3 uSpecularColor; \n" + 
	"uniform float uSpecular; \n\n" + 

	"varying mat4 vMVMatrix; \n" + 
	"varying mat4 vCMatrix; \n" + 
	"varying mat4 vPMatrix; \n\n" + 
	
	"varying vec3 vNormal; \n" + 
	"varying vec4 vEyeDirection; \n" + 
	"varying vec3 vEyeNormal; \n\n" + 

	SHADERS_FUNCTIONS.diffuseFactor + 
	
	"void main(void) \n" + 
	"{ \n" + 

		"float lightPower_0 = uDLightColor_0[3]; \n" + 
		"float lightPower_1 = uDLightColor_1[3]; \n\n" + 

		"vec3 baseColor = uBaseColor; \n" + 
		"vec3 specularColor = uSpecularColor; \n" + 
		"float specular = uSpecular; \n\n" + 
		
		"vec3 normal = normalize(vNormal); \n\n" + 
		
		"vec3 diffuseLightColor = lightPower_0 * diffuseFactor(normal, -uDLightDirection_0) * baseColor * uDLightColor_0.rgb; \n" + 
		"diffuseLightColor += lightPower_1 * diffuseFactor(normal, -uDLightDirection_1) * baseColor * uDLightColor_1.rgb; \n\n" + 

		"vec3 vEyeDLightDirection_0 = normalize(mat3(vCMatrix) * mat3(vMVMatrix) * uDLightDirection_0); \n" + 
		"vec3 vEyeDLightDirection_1 = normalize(mat3(vCMatrix) * mat3(vMVMatrix) * uDLightDirection_1); \n\n" + 

		"vec3 R_0 = reflect(-vEyeDLightDirection_0, vEyeNormal); \n" + 
		"vec3 R_1 = reflect(-vEyeDLightDirection_1, vEyeNormal); \n\n" + 

		"float cosAlpha_0 = clamp(dot(vEyeDirection.xyz, R_0), 0.0, 1.0); \n" + 
		"float cosAlpha_1 = clamp(dot(vEyeDirection.xyz, R_1), 0.0, 1.0); \n\n" + 

		"vec3 specularLightColor = lightPower_0 * diffuseFactor(normal, -uDLightDirection_0) * pow(cosAlpha_0, specular)*specular/7.0 * specularColor * uDLightColor_0.rgb; \n" + 
		"specularLightColor += lightPower_1 * diffuseFactor(normal, -uDLightDirection_1) * pow(cosAlpha_1, specular)*specular/7.0 * specularColor * uDLightColor_1.rgb; \n\n" + 

		"gl_FragColor = uAmbientLight + vec4(diffuseLightColor, 1.0) + vec4(specularLightColor, 1.0); \n" + 
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-material");