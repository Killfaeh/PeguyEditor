function FragmentShaderSobelEdge()
{
	///////////////
	// Attributs //
	///////////////
	
	var name = 'fragment-sobel-edge';
	
	var param =
	{
		uScreenTexture: { uniform: true, texture: true, size: 1},
		uNormalsTexture: { uniform: true, texture: true, size: 1},
		uWResolution: { uniform: true, matrix: false, size: 1 },
		uHResolution: { uniform: true, matrix: false, size: 1 },
		uEdgeColor: { uniform: true, matrix: false, size: 4 }
	};
	
	var code = "precision mediump float; \n\n" + 
	
	"uniform sampler2D uScreenTexture; \n" + 
	"uniform sampler2D uNormalsTexture; \n\n" + 
	
	"uniform float uWResolution; \n" + 
	"uniform float uHResolution; \n\n" + 
	
	"uniform vec4 uEdgeColor; \n\n" +
	
	"mat3 sx = mat3( 1.0, 2.0, 1.0, \n" + 
					"0.0, 0.0, 0.0, \n" + 
					"-1.0, -2.0, -1.0 \n" + 
					"); \n\n" + 
					
	"mat3 sy = mat3( \n" + 
					"1.0, 0.0, -1.0, \n" + 
					"2.0, 0.0, -2.0, \n" + 
					"1.0, 0.0, -1.0 \n" + 
					"); \n\n" + 
	
	"void main(void) \n" + 
	"{ \n" + 
		
		"vec2 relativeTexCoord = vec2(gl_FragCoord.x/uWResolution, gl_FragCoord.y/uHResolution); \n" + 
		
		"vec4 diffuse = texture2D(uScreenTexture, vec2(relativeTexCoord.x, relativeTexCoord.y)); \n" + 
		"vec4 normal = texture2D(uNormalsTexture, vec2(relativeTexCoord.x, relativeTexCoord.y)); \n" + 
		"vec3 I[3]; \n\n" + 
		
		"for (int i = 0; i < 3; i++) \n" + 
		"{ \n" + 
			
			"vec4 normal0 = texture2D(uNormalsTexture, vec2(relativeTexCoord.x + float(i-1)/uWResolution, relativeTexCoord.y - 1.0/uHResolution)); \n" + 
			"vec4 normal1 = texture2D(uNormalsTexture, vec2(relativeTexCoord.x + float(i-1)/uWResolution, relativeTexCoord.y)); \n" + 
			"vec4 normal2 = texture2D(uNormalsTexture, vec2(relativeTexCoord.x + float(i-1)/uWResolution, relativeTexCoord.y + 1.0/uHResolution)); \n" + 
			
			"float sampleValLeft  = dot(normal.rgb, normal0.rgb); \n" + 
			"float sampleValMiddle  = dot(normal.rgb, normal1.rgb); \n" + 
			"float sampleValRight  = dot(normal.rgb, normal2.rgb); \n" + 
			"I[i] = vec3(sampleValLeft, sampleValMiddle, sampleValRight); \n" + 
			
		"} \n\n" + 
		
		"float gx = dot(sx[0], I[0]) + dot(sx[1], I[1]) + dot(sx[2], I[2]); \n" + 
		"float gy = dot(sy[0], I[0]) + dot(sy[1], I[1]) + dot(sy[2], I[2]); \n\n" + 
		
		"float g = sqrt(pow(gx, 2.0) + pow(gy, 2.0)); \n" + 
		"g = smoothstep(0.4, 0.8, g); \n" + 
		
		"if(g > 0.2) \n" + 
		"{ \n" + 
			"gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); \n" + 
		"} \n" + 
		"else \n" +
		"{ \n" + 
			"gl_FragColor = diffuse; \n" + 
		"} \n\n" + 
		
		" float diffuseRate = 1.0 - g; \n" + 
		" float lineRate = g; \n" + 
		
		"gl_FragColor = vec4(diffuse.r * diffuseRate + uEdgeColor.r * lineRate, diffuse.g * diffuseRate + uEdgeColor.g * lineRate, diffuse.b * diffuseRate + uEdgeColor.b * lineRate, 1.0); \n" + 
		
	"} \n";
	
	var shader = new Shader(name, 'fragment', code, param);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fragment-sobel-edge");