function JavaClass()
{
	////////////////
	// Attributes //
	////////////////

	var name = "Java Class";
	var type = 'java';

	var plugIn = new PlugIn(name, type);

	plugIn.defaultParam = 
	{
		"className": "Example",
		"implements": [ "Interface1", "Interface2", "Interface3" ],
		"extends": "MotherClass",
		"attributes":
		[
			{
				"name": "integerVariable",
				"type": "int",
				"default": 0,
				"accessibility": "private",
				"constructorParam": true,
				"isStatic": false,
				"isConst": true
			},
			{
				"name": "floatVariable",
				"type": "float",
				"default": 0.0,
				"accessibility": "protected",
				"constructorParam": false,
				"isStatic": true,
				"isConst": false
			},
			{
				"name": "doubleVariable",
				"type": "double",
				"default": 0.0,
				"accessibility": "public",
				"constructorParam": true,
				"isStatic": false,
				"isConst": true
			},
			{
				"name": "stringVariable",
				"type": "String",
				"default": "Hello world !",
				"accessibility": "private",
				"constructorParam": false,
				"isStatic": true,
				"isConst": false
			},
			{
				"name": "booleanVariable",
				"type": "boolean",
				"default": true,
				"accessibility": "protected",
				"constructorParam": true,
				"isStatic": false,
				"isConst": true
			}
		],
		"methods":
		[
			{
				"name": "method1",
				"returnType": "int",
				"accessibility": "private",
				"isStatic": false,
				"params":
				[
					{ "name": "param1", "type": "int" },
					{ "name": "param2", "type": "float" },
					{ "name": "param3", "type": "double" },
					{ "name": "param4", "type": "String" },
					{ "name": "param5", "type": "boolean" }
				]
			},
			{
				"name": "method2",
				"returnType": "float",
				"accessibility": "protected",
				"isStatic": true,
				"params":
				[
					{ "name": "param1", "type": "int" },
					{ "name": "param2", "type": "float" },
					{ "name": "param3", "type": "double" },
					{ "name": "param4", "type": "String" },
					{ "name": "param5", "type": "boolean" }
				]
			},
			{
				"name": "method3",
				"returnType": "double",
				"accessibility": "public",
				"isStatic": false,
				"params":
				[
					{ "name": "param1", "type": "int" },
					{ "name": "param2", "type": "float" },
					{ "name": "param3", "type": "double" },
					{ "name": "param4", "type": "String" },
					{ "name": "param5", "type": "boolean" }
				]
			}
		]
	};

	/////////////
	// Methods //
	/////////////

	plugIn.createCode = function($json)
	{
		var classCode = '';

		var attributesCode = ''; // Variable qui contient le code de déclaration des attributs.
		var methodsCode = ''; // Variable qui contient le code de déclaration des méthodes.
		var getCode = ''; // Variable qui contient le code des accesseurs GET.
		var setCode = ''; // Variable qui contient le code des accesseurs SET.

		// Création du code qui concerne les attributs.
		for (var i = 0; i < $json["attributes"].length; i++)
		{
			// Déclaration de l'attribut
			attributesCode = attributesCode + '\t' + $json["attributes"][i]["accessibility"];

			if ($json["attributes"][i]["isConst"] === true)
			{
				attributesCode = attributesCode + ' final';
			}

			if ($json["attributes"][i]["isStatic"] === true)
			{
				attributesCode = attributesCode + ' static';
			}

			attributesCode = attributesCode + ' ' + $json["attributes"][i]["type"];
			attributesCode = attributesCode + ' ' + $json["attributes"][i]["name"];

			if ($json["attributes"][i]["default"] !== null)
			{
				if ($json["attributes"][i]["type"] === "String")
				{
					attributesCode = attributesCode + ' = "' + $json["attributes"][i]["default"] + '"';
				}
				else
				{
					attributesCode = attributesCode + ' = ' + $json["attributes"][i]["default"];
				}
			}

			attributesCode = attributesCode + ';\n';

			// Déclaration de la méthode get correspondante
			getCode = getCode + '\tpublic';

			if ($json["attributes"][i]["isStatic"] === true)
			{
				getCode = getCode + ' static';
			}

			getCode = getCode + ' ' + $json["attributes"][i]["type"];

			if ($json["attributes"][i]["type"] === "boolean")
			{
				getCode = getCode + ' is';
			}
			else
			{
				getCode = getCode + ' get';
			}

			getCode = getCode + $json["attributes"][i]["name"].charAt(0).toUpperCase() + $json["attributes"][i]["name"].slice(1) + '() ';
			getCode = getCode + '{ return '

			if ($json["attributes"][i]["isStatic"] === true)
			{
				getCode = getCode + $json["className"] + '.' + $json["attributes"][i]["name"];
			}
			else
			{
				getCode = getCode + 'this.' + $json["attributes"][i]["name"];
			}

			getCode = getCode + '; }\n';

			// Déclaration de la méthode set correspondante
			if ($json["attributes"][i]["isConst"] !== true)
			{
				setCode = setCode + '\tpublic';

				if ($json["attributes"][i]["isStatic"] === true)
				{
					setCode = setCode + ' static';
				}

				setCode = setCode + ' void';
				setCode = setCode + ' set';
				setCode = setCode + $json["attributes"][i]["name"].charAt(0).toUpperCase() + $json["attributes"][i]["name"].slice(1) + '(';
				setCode = setCode + $json["attributes"][i]["type"] + ' ';
				setCode = setCode + $json["attributes"][i]["name"];
				setCode = setCode + ') ';
				setCode = setCode + '{ '

				if ($json["attributes"][i]["isStatic"] === true)
				{
					setCode = setCode + $json["className"] + '.' + $json["attributes"][i]["name"] + ' = ' + $json["attributes"][i]["name"];
				}
				else
				{
					setCode = setCode + 'this.' + $json["attributes"][i]["name"] + ' = ' + $json["attributes"][i]["name"];
				}

				setCode = setCode + '; }\n';
			}
		}

		// Création du code de déclaration des méthodes
		for (var i = 0; i < $json["methods"].length; i++)
		{
			methodsCode = methodsCode + '\t' + $json["methods"][i]["accessibility"];

			if ($json["methods"][i]["isStatic"] === true)
			{
				methodsCode = methodsCode + ' static';
			}

			methodsCode = methodsCode  + ' ' + $json["methods"][i]["returnType"];
			methodsCode = methodsCode + ' ' + $json["methods"][i]["name"] + '(';

			for (var j = 0; j < $json["methods"][i]["params"].length; j++)
			{
				if (j > 0)
				{
					methodsCode = methodsCode + ', ';
				}

				methodsCode = methodsCode + $json["methods"][i]["params"][j]["type"] + ' ';
				methodsCode = methodsCode + $json["methods"][i]["params"][j]["name"];
			}

			methodsCode = methodsCode + ')\n';
			methodsCode = methodsCode + '\t{\n'
			methodsCode = methodsCode + '\t\t// Do something...\n';

			if ($json["methods"][i]["returnType"] === 'int')
			{
				methodsCode = methodsCode + '\n\t\treturn 0;\n';
			}
			else if ($json["methods"][i]["returnType"] === 'float')
			{
				methodsCode = methodsCode + '\n\t\treturn 0.0f;\n';
			}
			else if ($json["methods"][i]["returnType"] === 'double')
			{
				methodsCode = methodsCode + '\n\t\treturn 0.0;\n';
			}
			else if ($json["methods"][i]["returnType"] === 'String')
			{
				methodsCode = methodsCode + '\n\t\treturn "";\n';
			}
			else if ($json["methods"][i]["returnType"] === 'boolean')
			{
				methodsCode = methodsCode + '\n\t\treturn true;\n';
			}

			methodsCode = methodsCode + '\t}\n\n';
		}

		// Création du code complet de la classe

		// Déclaration de la classe
		classCode = 'public class ' + $json["className"];

		// Ajout de l'héritage s'il y en a un
		if ($json["extends"] !== null)
		{
			classCode = classCode + ' extends ' + $json["extends"];
		}

		classCode = classCode + '\n{\n\n';

		// Insertion du code de déclaration des attributs
		classCode = classCode + '\t////////////////\n';
		classCode = classCode + '\t// Attributes //\n';
		classCode = classCode + '\t////////////////\n\n';

		classCode = classCode + attributesCode;

		// Insertion du code de déclaration des méthodes
		classCode = classCode + '\n\t/////////////\n';
		classCode = classCode + '\t// Methods //\n';
		classCode = classCode + '\t/////////////\n\n';

		classCode = classCode + methodsCode;

		// Insertion du code des accesseurs GET
		classCode = classCode + '\n\t/////////////////////\n';
		classCode = classCode + '\t// Getters/Setters //\n';
		classCode = classCode + '\t/////////////////////\n\n';

		classCode = classCode + '\t// GET\n\n';

		classCode = classCode + getCode;

		classCode = classCode + '\n\t// SET\n\n';

		classCode = classCode + setCode;

		classCode = classCode + '}';

		return classCode;
	};

	/////////////
	// Extends //
	/////////////

	var $this = utils.extend(plugIn, this);
	return $this;
}

JavaClass();

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("javaClass");