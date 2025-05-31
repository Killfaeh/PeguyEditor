function JavascriptWrapper()
{
	////////////////
	// Attributes //
	////////////////

	var name = "Javascript Wrapper";
	var type = 'javascript';

	var plugIn = new PlugIn(name, type);

	plugIn.defaultParam = 
	{
		"className": "Example",
		"attributes":
		[
			{ "name": "nullAttribute", "type": "null", "public": false, "isParam": false, "default": null },
			{ "name": "numberAttribute", "type": "number", "public": true, "isParam": false, "default": 0 },
			{ "name": "stringAttribute", "type": "string", "public": false, "isParam": false, "default": "" },
			{ "name": "boolAttribute", "type": "boolean", "public": false, "isParam": false, "default": false },
			{ "name": "dateAttribute", "type": "date", "public": false, "isParam": false, "default": "0001-01-01" },
			{ "name": "arrayAttribute", "type": "array", "public": true, "isParam": false, "default": [] },
			{ "name": "listAttribute", "type": "list", "public": false, "isParam": false, "default": [] },
			{ "name": "objectAttribute", "type": "object", "public": false, "isParam": false, "default": null }
		],
		"methods":
		[
			{
				"name": "method1",
				"public": false,
				"parameters": [ "param1", "param2" ],
				"toDo": "Do something..."
			},
			{
				"name": "method2",
				"public": true,
				"parameters": [ "param1", "param2" ],
				"toDo": "Do something..."
			}
		]
	};

	/////////////
	// Methods //
	/////////////

	plugIn.createCode = function($json)
	{
		var paramCode = '';
		var attributesCode = '';
		var defaultAttributesCode = '';
		var methodsCode = '';
		var loadFromJSONCode = '';
		var getCode = '';
		var setCode = '';
		var getJSONCode = '';

		var paramIndex = 0;

		for (var i = 0; i < $json.attributes.length; i++)
		{
			var attribute = $json.attributes[i];

			if (attribute.isParam === true)
			{
				if (paramIndex > 0)
					paramCode = paramCode + ', ';

				paramCode = paramCode + '$' + attribute.name;

				if (attribute.public === true)
					attributesCode = attributesCode + '\tthis.' + attribute.name + ' = $' + attribute.name + ';\n';
				else
					attributesCode = attributesCode + '\tvar ' + attribute.name + ' = $' + attribute.name + ';\n';

				defaultAttributesCode = defaultAttributesCode + '\tif (!utils.isset(' + attribute.name + '))\n';
				//defaultAttributesCode = defaultAttributesCode + '\t\t' + attribute.name + ' = ' + attribute.default + ';\n\n';

				var prefixe = '';

				if (attribute.public === true)
					prefixe = 'this.';

				if (attribute.type === 'null')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = null;\n';	
				else if (attribute.type === 'array')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + 'List = [];\n';	
				else if (attribute.type === 'list')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + 'List = [];\n';	
				else if (attribute.type === 'object')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = {};\n';	
				else if (attribute.type === 'boolean')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = ' + attribute.default + ';\n';
				else if (attribute.type === 'date')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = "' + attribute.default + '";\n';
				else if (attribute.default === '')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = "";\n';
				else if (attribute.type === 'string')
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = "' + attribute.default + '";\n';
				else
					defaultAttributesCode = defaultAttributesCode + '\t\t' + prefixe + attribute.name + ' = ' + attribute.default + ';\n';

				paramIndex = paramIndex + 1;
			}
			else
			{
				var prefixe = 'var ';

				if (attribute.public === true)
					prefixe = 'this.';

				if (attribute.type === 'null')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = null;\n';	
				else if (attribute.type === 'array')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + 'List = [];\n';	
				else if (attribute.type === 'list')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + 'List = [];\n';	
				else if (attribute.type === 'object')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = {};\n';	
				else if (attribute.type === 'boolean')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = ' + attribute.default + ';\n';
				else if (attribute.type === 'date')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = "' + attribute.default + '";\n';
				else if (attribute.default === '')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = "";\n';
				else if (attribute.type === 'string')
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = "' + attribute.default + '";\n';
				else
					attributesCode = attributesCode + '\t' + prefixe + attribute.name + ' = ' + attribute.default + ';\n';
			}

			var prefixe = '';

			if (attribute.public === true)
				prefixe = '$this.';

			if (attribute.type === 'array' || attribute.type === 'list')
			{
				if (attribute.type === 'boolean')
					getCode = getCode + '\tthis.is' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function() { return ' + prefixe + attribute.name + 'List; };\n';
				else
					getCode = getCode + '\tthis.get' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function() { return ' + prefixe + attribute.name + 'List; };\n';

				setCode = setCode + '\tthis.set' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function($' + attribute.name + 'List) ' + '{ ' + prefixe + attribute.name + 'List = $' + attribute.name + 'List; };\n';

				setCode = setCode + '\n';
				setCode = setCode + '	this.add' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function($' + attribute.name + ')\n';
				setCode = setCode + '	{\n';
				setCode = setCode + '		var index = ' + prefixe + attribute.name + 'List.indexOf($' + attribute.name + ');\n\n';
				setCode = setCode + '		if (index < 0)\n';
				setCode = setCode + '			' + prefixe + attribute.name + 'List.push($' + attribute.name + ');\n';
				setCode = setCode + '	};\n\n';
					
				setCode = setCode + '	this.insert' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + 'Into = function($' + attribute.name + ', $index)\n';
				setCode = setCode + '	{\n';
				setCode = setCode + '		var index = ' + prefixe + attribute.name + 'List.indexOf($' + attribute.name + ');\n\n';
				setCode = setCode + '		if (index < 0)\n';
				setCode = setCode + '			' + prefixe + attribute.name + 'List.splice(index, 1);\n\n';
				setCode = setCode + '		' + prefixe + attribute.name + 'List.splice(index, 0, $' + attribute.name + ');\n';
				setCode = setCode + '	};\n\n';
				
				setCode = setCode + '	this.remove' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function($' + attribute.name + ')\n';
				setCode = setCode + '	{\n';
				setCode = setCode + '		var index = ' + prefixe + attribute.name + 'List.indexOf($' + attribute.name + ');\n\n';
				setCode = setCode + '		if (index >= 0)\n';
				setCode = setCode + '			' + prefixe + attribute.name + 'List.splice(index, 1);\n\n';
				setCode = setCode + '	};\n\n';
					
				setCode = setCode + '	this.removeAll' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function()\n';
				setCode = setCode + '	{\n';
				setCode = setCode + '		' + prefixe + attribute.name + 'List = [];\n';
				setCode = setCode + '	};\n\n';
			}
			else
			{
				if (attribute.type === 'boolean')
					getCode = getCode + '\tthis.is' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function() { return ' + prefixe + attribute.name + '; };\n';
				else
					getCode = getCode + '\tthis.get' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function() { return ' + prefixe + attribute.name + '; };\n';

				setCode = setCode + '\tthis.set' + attribute.name.charAt(0).toUpperCase() + attribute.name.slice(1) + ' = function($' + attribute.name + ') ' + '{ ' + prefixe + attribute.name + ' = $' + attribute.name + '; };\n';
			}

			loadFromJSONCode = loadFromJSONCode + '\t\t' + prefixe + attribute.name + ' = $json.' + attribute.name + ';\n';
			getJSONCode = getJSONCode + '\t\t\t' + attribute.name + ': ' + prefixe + attribute.name + ',\n';
		}

		getCode = getCode + '\n';
		setCode = setCode + '\n';

		for (var i = 0; i < $json.methods.length; i++)
		{
			var method = $json.methods[i];

			var prefixe = 'var ';

			if (method.public === true)
				prefixe = 'this.';

			methodsCode = methodsCode + '\t' + prefixe + method.name + ' = function(';

			for (var j = 0; j < method.parameters.length; j++)
			{
				if (j > 0)
					methodsCode = methodsCode + ', ';

				methodsCode = methodsCode + method.parameters[j];
			}

			methodsCode = methodsCode + ')\n'
						+ '\t{\n'
						+ '\t\t// ' + method.toDo + '\n'
						+ '\t};\n\n';
		}

		var code = 'function ' + $json.className + '(' + paramCode + ')\n';

		code = code + '{\n';
		code = code + '\t////////////////\n';
		code = code + '\t// Attributes //\n';
		code = code + '\t////////////////\n\n';

		code = code + attributesCode + '\n';
		code = code + defaultAttributesCode;

		code = code + '\t/////////////\n';
		code = code + '\t// Methods //\n';
		code = code + '\t/////////////\n\n';

		code = code + methodsCode;

		code = code + '\tthis.loadFromJSON = function($json)\n\t{\n';
		code = code + loadFromJSONCode;
		code = code + '\t};\n\n';

		code = code + '\t////////////////////////\n';
		code = code + '\t// Getter and setters //\n';
		code = code + '\t////////////////////////\n\n';

		code = code + '\n\t// GET\n\n';

		code = code + '\tthis.getJSON = function()\n\t{\n';
		code = code + '\t\tvar $json = \n\t\t{\n';
		code = code + getJSONCode;
		code = code + '\t\t};\n\n'
		code = code + '\t\treturn $json;\n';
		code = code + '\t};\n\n';

		code = code + getCode;

		code = code + '\n\t// SET\n\n';
		code = code + setCode;

		code = code + '\tvar $this = this;\n';

		code = code + '}\n\n';

		return code;
	};

	/////////////
	// Extends //
	/////////////

	var $this = utils.extend(plugIn, this);
	return $this;
}

JavascriptWrapper();

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("javascriptWrapper");