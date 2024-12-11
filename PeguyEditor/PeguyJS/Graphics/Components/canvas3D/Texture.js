
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var TEXTURES = {};

function Texture($name, $img)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var img = $img;
	var texture;
	
	var created = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.create = function($context)
	{
		if (created === false)
		{
			//console.log("Créer texture");
			
			texture = $context.createTexture();
			$context.bindTexture($context.TEXTURE_2D, texture);
			$context.texImage2D($context.TEXTURE_2D, 0, $context.RGBA, img.width, img.height, 0, $context.RGBA, $context.UNSIGNED_BYTE, null);
			$context.texImage2D($context.TEXTURE_2D, 0, $context.RGBA, $context.RGBA, $context.UNSIGNED_BYTE, img);
			
			if (Math.isPowerOf2(img.width) && Math.isPowerOf2(img.height))
			{
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_S, $context.REPEAT);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_T, $context.REPEAT);
				//$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MIN_FILTER, $context.LINEAR_MIPMAP_NEAREST);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MAG_FILTER, $context.LINEAR);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MIN_FILTER, $context.LINEAR);
				$context.generateMipmap($context.TEXTURE_2D);
			}
			else 
			{
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MAG_FILTER, $context.LINEAR);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MIN_FILTER, $context.LINEAR);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_S, $context.CLAMP_TO_EDGE);
				$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_T, $context.CLAMP_TO_EDGE);
			}
			
			created = true;
		}
	};
	
	this.enable = function($context, $index)
	{
		$context.activeTexture($index);
		$context.bindTexture($context.TEXTURE_2D, texture);
	};
	
	this.disable = function($context)
	{
		$context.bindTexture($context.TEXTURE_2D, null);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getName = function() { return name; };
	this.getImg = function() { return img; };
	this.getTexture = function() { return texture };
	this.isCreated = function() { return created; };
	
	// SET
	this.setImg = function($img) { img = $img; };
	this.setCreated = function($created) { created = $created; };
	
	TEXTURES[name] = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("texture");