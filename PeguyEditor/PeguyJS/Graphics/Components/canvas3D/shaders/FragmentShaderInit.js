function FragmentShaderInit()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-init';
	
	var param = {};
	
	var code = "precision mediump float; \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		"gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); \n" + 
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-init");