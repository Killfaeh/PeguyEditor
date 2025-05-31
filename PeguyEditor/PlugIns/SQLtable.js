function SQLtable()
{
	////////////////
	// Attributes //
	////////////////

	var name = "SQL table";
	var type = 'sql';

	var plugIn = new PlugIn(name, type);

	plugIn.defaultParam = 
	{
		"databaseName": "myDatabase",
		"tableName": "example",
		"columns":
		[
			{ "name": "id", "type": "INTEGER", "null": false, "default": "0" },
			{ "name": "textColumn", "type": "TEXT", "null": false, "default": "" },
			{ "name": "tinyintColumn", "type": "TINYINT", "null": false, "default": "0" },
			{ "name": "id_truc", "type": "INTEGER", "null": false, "default": "0" },
			{ "name": "floatColumn", "type": "FLOAT", "null": false, "default": "0.0" },
			{ "name": "datetimeColumn", "type": "DATETIME(6)", "null": true, "default": null }
		],
		"constraints":
		[
			{ "name": "pk_example", "type": "pk", "column": "id", "referenceColumn": "id" },
			{ "name": "fk_example_truc", "type": "fk", "column": "id_truc", "referenceTable": "truc", "referenceColumn": "id" }
		]
	};

	/////////////
	// Methods //
	/////////////

	plugIn.createCode = function($json)
	{
		var createTable = ""; // Code de la requête de création de table
		var selectQuery = "SELECT " + $json['tableName'] + ".id AS id"; // Code de la requête de lecture
		var insertColumns = 'INSERT INTO ' + $json['databaseName'] + '.' + $json['tableName'] + '('; // Code de la requête d'insertion (colonnes)
		var insertValues = 'VALUES ('; // Code de la requête d'insertion (valeurs)
		var updateQuery = 'UPDATE ' + $json['databaseName'] + '.' + $json['tableName'] + '\nSET '; // Code de la requête de mise à jour
		var deleteQuery = 'DELETE FROM ' + $json['databaseName'] + '.' + $json['tableName'] + ' WHERE id = :id;\n'; // Code de la requête de suppression de ligne

		for (var i = 0; i < $json['columns'].length; i++)
		{
			// Création de table
			createTable = createTable + ',\n';
			createTable = createTable + $json['columns'][i]['name'] + ' ' + $json['columns'][i]['type'];

			if ($json['columns'][i]['default'] !== null)
			{
				if ($json['columns'][i]['type'] === 'TEXT' || $json['columns'][i]['type'] === 'DATETIME')
				{
					createTable = createTable + ' DEFAULT "' + $json['columns'][i]['default'] + '"';
				}
				else
				{
					createTable = createTable + ' DEFAULT ' + $json['columns'][i]['default'];
				}
			}

			if ($json['columns'][i]['null'] === false)
			{
				createTable = createTable + ' NOT NULL';
			}

			// Requête de sélection
			selectQuery = selectQuery + ',\n	';
			selectQuery = selectQuery + $json['tableName'] + "." + $json['columns'][i]['name'] + " AS " + $json['columns'][i]['name'];

			// Requête d'insertion
			if (i > 0)
			{
				insertColumns = insertColumns + ',\n	';
				insertValues = insertValues + ',\n	';
			}

			insertColumns = insertColumns + $json['columns'][i]['name'];
			insertValues = insertValues + ':' + $json['columns'][i]['name'];

			// Requête de mise à jour
			if (i > 0)
			{
				updateQuery = updateQuery + ',\n	';
			}

			updateQuery = updateQuery + $json['columns'][i]['name'] + ' = :' + $json['columns'][i]['name'];
		}

		selectQuery = selectQuery + '\nFROM ' + $json['databaseName'] + '.' + $json['tableName'] + ' ' + $json['tableName'] + ';\n\n';
		insertColumns = insertColumns + ')\n';
		insertValues = insertValues + ');\n\n';
		updateQuery = updateQuery + '\nWHERE id = :id;\n\n';

		// Contraintes
		for (var i = 0; i < $json['constraints'].length; i++)
		{
			createTable = createTable + ',\n';
			createTable = createTable + 'CONSTRAINT ' + $json['constraints'][i]['name'];

			if ($json['constraints'][i]['type'] === 'pk')
			{
				createTable = createTable + ' PRIMARY KEY (' + $json['constraints'][i]['referenceColumn'] + ')';
			}
			else
			{
				createTable = createTable + ' FOREIGN KEY (' + $json['constraints'][i]['column'] + ') REFERENCES ' + $json['constraints'][i]['referenceTable'] + '(' + $json['constraints'][i]['referenceColumn'] + ')';
			}
		}

		// Code SQL complet
		var sqlCode = 'DROP TABLE IF EXISTS ' + $json['databaseName'] + '.' + $json['tableName'] + ' RESTRICT;\n\n';

		sqlCode = sqlCode + '/* Create table query */\n';
		sqlCode = sqlCode + 'CREATE TABLE IF NOT EXISTS ' + $json['databaseName'] + '.' + $json['tableName'] + '\n';
		sqlCode = sqlCode + '(id INTEGER AUTO_INCREMENT';

		sqlCode = sqlCode + createTable;

		sqlCode = sqlCode + ')\n';
		sqlCode = sqlCode + 'ENGINE = InnoDB;\n\n';

		sqlCode = sqlCode + '/* Select query */\n';
		sqlCode = sqlCode + selectQuery;
		sqlCode = sqlCode + '/* Insert query */\n';
		sqlCode = sqlCode + insertColumns;
		sqlCode = sqlCode + insertValues;
		sqlCode = sqlCode + '/* Update query */\n';
		sqlCode = sqlCode + updateQuery;
		sqlCode = sqlCode + '/* Delete query */\n';
		sqlCode = sqlCode + deleteQuery;

		return sqlCode;
	};

	/////////////
	// Extends //
	/////////////

	var $this = utils.extend(plugIn, this);
	return $this;
}

SQLtable();

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("sqlTable");