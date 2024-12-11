
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2023 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLMaterial($name)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;

	if (!utils.isset(name) || name === '')
		name = 'default';
	
	var baseColor = [1.0, 1.0, 1.0];
	var specularColor = [0.0, 0.0, 0.0];
	var specular = 0.0;
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	
	this.getName = function() { return name; };
	this.getBaseColor = function() { return baseColor; };
	this.getSpecularColor = function() { return specularColor; };
	this.getSpecular = function() { return specular; };

	this.getCOLLADAdata = function()
	{
		var colladaData = {};

		var effectCode = '		<effect id="' + name + '-effect">\n';
		effectCode = effectCode + '			<profile_COMMON>\n';
		effectCode = effectCode + '				<technique sid="common">\n';
		effectCode = effectCode + '					<lambert>\n';
		effectCode = effectCode + '						<emission>\n';
		effectCode = effectCode + '							<color sid="emission">0 0 0 1</color>\n';
		effectCode = effectCode + '						</emission>\n';
		effectCode = effectCode + '						<diffuse>\n';
		effectCode = effectCode + '							<color sid="diffuse">' + baseColor[0] + ' ' + baseColor[1] + ' ' + baseColor[2] + ' 1</color>\n';
		effectCode = effectCode + '						</diffuse>\n';
		effectCode = effectCode + '						<reflectivity>\n';
		effectCode = effectCode + '							<float sid="specular">' + specular +  '</float>\n';
		effectCode = effectCode + '						</reflectivity>\n';
		effectCode = effectCode + '						<index_of_refraction>\n';
		effectCode = effectCode + '							<float sid="ior">1.45</float>\n';
		effectCode = effectCode + '						</index_of_refraction>\n';
		effectCode = effectCode + '					</lambert>\n';
		effectCode = effectCode + '				</technique>\n';
		effectCode = effectCode + '			</profile_COMMON>\n';
		effectCode = effectCode + '		</effect>\n';

		var materialCode = '		<material id="' + name + '-material" name="' + name + '">\n';
		materialCode = materialCode + '			<instance_effect url="#' + name + '-effect"/>\n';
		materialCode = materialCode + '		</material>\n';

		colladaData.effectCode = effectCode;
		colladaData.materialCode = materialCode;

		return colladaData;
	};
	
	// SET 
	
	this.setBaseColor = function($baseColor) { baseColor = $baseColor; };
	this.setSpecularColor = function($specularColor) { specularColor = $specularColor; };
	this.setSpecular = function($specular) { specular = $specular; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-material");