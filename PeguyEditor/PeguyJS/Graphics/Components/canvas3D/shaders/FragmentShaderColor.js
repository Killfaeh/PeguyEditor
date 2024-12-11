function FragmentShaderColor()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-color';
	
	var param = {};
	
	var code = "precision mediump float; \n\n" + 
	
	"varying vec4 vColor; \n\n" + 

	"void main(void) \n" + 
	"{ \n" + 
		"gl_FragColor = vColor; \n" + 
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-color");