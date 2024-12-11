function FragmentShaderMonochrome()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-monochrome';
	
	var param = { uColor: { uniform: true, matrix: false, size: 4 } };
	
	var code = "precision mediump float; \n\n" + 

	"uniform vec4 uColor; \n" +
	
	"void main(void) \n" + 
	"{ \n" + 
		"gl_FragColor = uColor; \n" + 
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-monochrome");