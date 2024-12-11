
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2020 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var SHADERS = {};

var SHADERS_FUNCTIONS = 
{
	clamp: "float clamp(float value, float min, float max) \n" + 
	"{ \n" +
	
		"float result = value; \n\n" + 

		"if (result < min) \n" + 
		"{ \n" + 
			"result = min; \n" + 
		"} \n\n" + 

		"if (result > max) \n" + 
		"{ \n" + 
			"result = max; \n" + 
		"} \n\n" + 

		"return result; \n" + 
	
	"} \n\n",

	diffuseFactor: "float diffuseFactor(vec3 normal, vec3 lightDirection) \n" + 
	"{ \n" + 
	
		"float df = dot(normal, lightDirection);" + 
		
		"if (gl_FrontFacing) \n" + 
		"{ \n" + 
			"df = -df; \n" + 
		"} \n\n" + 
		
		"return max(0.0, df); \n" + 
		
	"} \n\n",
	
	colorToGreyScale: "float colorToGreyScale(vec4 color) \n" + 
	"{ \n" + 
		"return (color.r + color.g + color.b)/3.0; \n" + 
	"} \n\n",
	
	circle: "float circle(vec2 pixel, vec2 center, float radius) \n" + 
	"{ \n" + 
		"return 1.0 - smoothstep(radius - 1.0, radius + 1.0, length(pixel - center)); \n" + 
	"} \n\n",
	
	horizontalLine: "float horizontalLine(vec2 pixel, float y_pos, float width) \n" + 
	"{ \n" + 
		"return 1.0 - smoothstep(-1.0, 1.0, abs(pixel.y - y_pos) - 0.5 * width); \n" + 
	"} \n\n",
	
	rotate: "mat2 rotate(float angle) \n" + 
	"{ \n" + 
		"return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)); \n" + 
	"} \n\n",
	
	ParallaxMapping: "vec2 ParallaxMapping(sampler2D texture, float scale, vec2 uv, vec3 view_dir) \n" + 
	"{ \n" + 
		
		"view_dir.y = -view_dir.y; \n" +
		
		"float num_layers = 64.0; \n" + 
		"float depth_scale  = 0.01*scale; \n" + 
		
		//"float scalar = uv.x*view_dir.x + uv.y*view_dir.y; \n" + 
		"float scalar = view_dir.z; \n" + 
		"float determinant = uv.x*view_dir.y - uv.y*view_dir.x; \n" + 
		
		"float layer_depth = 1.0 / num_layers; \n" + 
		"float cur_layer_depth = 0.0; \n" + 
		"vec2 delta_uv = view_dir.xy * depth_scale / (view_dir.z * num_layers); \n" + 
		"vec2 cur_uv = uv; \n" + 
		
		"float depth_from_tex = 1.0 - texture2D(texture, cur_uv).r; \n" + 
		
		"for (int i = 0; i < 64; i++) \n" + 
		"{ \n" + 
			
			"cur_layer_depth += layer_depth; \n" + 
			
			//"cur_uv -= delta_uv; \n" + 
			"cur_uv.x -= delta_uv.x; \n" + 
			"cur_uv.y += delta_uv.y; \n" + 
			
			/*
			"if (scalar > 0.0) \n" + 
			//"if (determinant <= 0.0) \n" + 
			"{ \n" + 
				"cur_uv.x -= delta_uv.x; \n" + 
				"cur_uv.y += delta_uv.y; \n" + 
			"} \n" +
			"else if (scalar < 0.0) \n" + 
			"{ \n" + 
				"cur_uv.x += delta_uv.x; \n" + 
				"cur_uv.y -= delta_uv.y; \n" + 
			"} \n\n" +
			//*/
			
			"depth_from_tex = 1.0 - texture2D(texture, cur_uv).r; \n" + 
			
			"if (depth_from_tex < cur_layer_depth) \n" + 
			"{ \n" + 
				"break; \n" + 
			"} \n\n" +
			
		"} \n\n" +
		
		"vec2 prev_uv = cur_uv + delta_uv; \n" + 
		"float next = depth_from_tex - cur_layer_depth; \n" + 
		"float prev = 1.0 - texture2D(texture, prev_uv).r - cur_layer_depth + layer_depth; \n" + 
		"float weight = next / (next - prev); \n" + 
		"return prev_uv * weight + cur_uv * (1.0 - weight); \n" + 
		
	"} \n\n",
	
	ramp: "float ramp(sampler2D texture, float diffuse) \n" + 
	"{ \n" + 
	
		"float df = diffuse; \n" + 
		
		"if (df < 0.0) { df = 0.0; } \n\n" + 
		"if (df >= 1.0) { df = 1.0; } \n\n" + 
		
		"df = 0.90*df + 0.05; \n" + 
		
		"return texture2D(texture, vec2(df, 0.5)).r; \n" + 
		
	"} \n\n"
};

var initShaders = function()
{
	VertexShaderInit();
	VertexShaderColor();
	VertexShaderMaterial();
	VertexShaderNormals();
	VertexShaderNormalsTexture();
	
	FragmentShaderInit(); // OK
	FragmentShaderMonochrome(); // OK
	FragmentShaderOutline(); // OK
	FragmentShaderColor(); // OK
	FragmentShaderColorRamp();
	FragmentShaderNormals(); // OK
	FragmentShaderSobelEdge(); // OK
	FragmentShaderMaterial();
	FragmentShaderModeling();
	FragmentShaderBump(); // OK
	FragmentShaderManga(); // OK
	
	console.log("SHADERS : ");
	console.log(SHADERS);
};

function Shader($name, $type, $code, $param)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var type = $type;
	
	var param = $param;
	var code = $code;
	
	var shader;
	
	var compile = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.compile = function($context)
	{
		if (utils.isset($context) && compile === false)
		{
			compile = false; 
			
			if (type === 'fragment')
				shader = $context.createShader($context.FRAGMENT_SHADER);
			else
				shader = $context.createShader($context.VERTEX_SHADER);
			
			$context.shaderSource(shader, code); 
			$context.compileShader(shader); 
			
			if (!$context.getShaderParameter(shader, $context.COMPILE_STATUS))
				console.log('Shader "' + name + '" compile log : ' + $context.getShaderInfoLog(shader)); 
			else 
				compile = true; 
		}
	}; 
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getName = function() { return name; };
	this.getType = function() { return type; };
	this.getParam = function() { return param; };
	this.getCode = function() { return code; };
	this.getShader = function() { return shader; };
	this.isCompile = function() { return compile; };
	
	// SET 
	
	SHADERS[name] = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("shader");