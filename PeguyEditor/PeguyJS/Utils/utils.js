
////////////////////////////////////
// Fonctions utilitaires diverses //
////////////////////////////////////

var utils =
{
	isset: function($variable)
	{
		var result = false; 
	
		if ($variable !== undefined && $variable !== null)
			result = true; 
	
		return result; 
	}, 
	
	extend: function($parent, $child)
	{
		var method; 
		
		// Récupérer l'arbre d'héritage
		if (!utils.isset($parent.inheritance))
			$parent.inheritance = [];
		
		var caller = "";
		var callStack = (new Error()).stack;
		var stack = callStack.split('\n')[1];
		
		
		if (/at /.test(stack))
		{
			stack = callStack.split('at ')[2];
			caller = stack.replace(/new /g, '').replace(/ \(.*/g, '').replace(/[^a-zA-Z0-9]/g, '');
		}
		else
			caller = stack.replace(/@.*/g, '').replace(/[^a-zA-Z0-9]/g, '');

		/*
		console.log("HERITAGE");
		console.log('"' + callStack + '"');
		console.log('"' + stack + '"');
		console.log('"' + caller + '"');
		//*/

		$parent.inheritance.push(caller);
	
		// Pour éviter d'écraser les anciennes méthodes 
		var $super = {};
		
		for (method in $parent)
			$super[method] = $parent[method]; 
		
		$super['super'] = $parent['super'];
		$parent['super'] = $super;
		
		// Ajout des méthodes de la classe fille 
		for (method in $child)
		{
			$parent[method] = $child[method]; 
			
			if (utils.isset($parent[method]))
				$parent[method].parentName = caller;
		}

		// Récupérer l'implémentation directement parente à celle appelée
		$parent.execSuper = function($method, $args, $caller)
		{
			if (utils.isset(this[$method]))
			{
				var parentName = this[$method].parentName;
				
				if (utils.isset($caller))
					parentName = $caller.parentName;
				
				var index = this.inheritance.indexOf(parentName);
				
				if (index >= 0)
				{
					var iteration = this.inheritance.length-index-1;
					
					var $super = this['super'];
					
					for (var i = 0; i < iteration; i++)
						$super = $super['super'];
						
					if (utils.isset($super) && utils.isset($super[$method]))
						return $super[$method].apply(this, $args);
				}
			}
		};
	
		return $parent; 
	},
	
	// Raccourcis pour créer un élément
	create: function($tagName, $attributes)
	{
		var node = document.createElement($tagName);
		
		for (var key in $attributes)
			node.setAttribute(key, $attributes[key]);
		
		return node;
	},
	
	// Raccourcis pour ajouter un BR
	createBR: function()
	{
		return document.createElement('br');
	},
	
	// Créer un noeud texte 
	createText: function($text)
	{
		var node = document.createTextNode($text); 
		return node; 
	},

	// Injection et éxection de code 
	scriptToExec: document.createElement('script'),

	execCode: function($code)
	{
		console.log($code);

        code = $code.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

        var scriptParent = utils.scriptToExec.parentNode;

        if (utils.isset(scriptParent))
            scriptParent.removeChild(utils.scriptToExec);

        var scriptHTML = '<script type="text/javascript" >'
                            + 'var scriptToExec = function() { ' + code + '\n};\n '
                            + 'try { scriptToExec();\nutils.emptyExecCodeError(); }\n '
                            + 'catch($error) { utils.displayExecCodeError($error); }\n '
                        + '</script>';

		utils.scriptToExec = new Component(scriptHTML);
        document.getElementById('main').appendChild(utils.scriptToExec);
	},

	displayExecCodeError: function($error) {},
	emptyExecCodeError: function($error) {},
	
	// Récupérer les dimensions d'un texte d'une balise input ou textarea
	getInputTextSize: function($input, $styles)
	{
		var text = $input.value;
		
		//if ($input.tagName === 'text')
		if ($input.tagName.toLowerCase() !== 'input' && $input.tagName.toLowerCase() !== 'textarea')
			text = $input.innerHTML;
		
		text = text.replace(/(?:\r|\n|\r\n)/g, '<br />');
		
		if (/<br \/>$/.test(text))
			text = text + '<br />';
		
		var inputStyle = getComputedStyle($input);
		//console.log(inputStyle);
		
		var tmp = document.createElement('div');
		tmp.innerHTML = text;
		document.getElementById('main').appendChild(tmp);
		
		tmp.style.position = 'absolute';
		tmp.style.left = '-100000000px';
		tmp.style.top = '-100000000px';
		tmp.style.zIndex = '10000000000000000000000';
		
		//tmp.style.left = '100px';
		//tmp.style.top = '100px';
		
		if (utils.isset($styles))
		{
			tmp.style.fontFamily = (utils.isset(inputStyle.fontFamily) && inputStyle.fontFamily !== '') ? inputStyle.fontFamily : $styles.fontFamily;
			tmp.style.fontSize = (utils.isset(inputStyle.fontSize) && inputStyle.fontSize !== '') ? inputStyle.fontSize : $styles.fontSize;
			tmp.style.fontStyle = (utils.isset(inputStyle.fontStyle) && inputStyle.fontStyle !== '') ? inputStyle.fontStyle : $styles.fontStyle;
			tmp.style.fontWeight = (utils.isset(inputStyle.fontWeight) && inputStyle.fontWeight !== '') ? inputStyle.fontWeight : $styles.fontWeight;
		}
		else
		{
			tmp.style.fontFamily = inputStyle.fontFamily;
			tmp.style.fontSize = inputStyle.fontSize;
			tmp.style.fontStyle = inputStyle.fontStyle;
			tmp.style.fontWeight = inputStyle.fontWeight;
		}
		
		var width = tmp.offsetWidth;
		var height = tmp.offsetHeight;
		
		document.getElementById('main').removeChild(tmp);
		
		return { width: width, height: height};
	},
	
	// Enregistrer une image dans le dossier de téléchargement
	downloadImage: function($data, $fileName)
	{
		var link = document.createElement("a");
		link.download = $fileName;
		link.href = $data;
		link.click();
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("utils");