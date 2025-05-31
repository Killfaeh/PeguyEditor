function SQLdatabase()
{
	////////////////
	// Attributes //
	////////////////

	var name = "SQL database";
	var type = 'sql';

	var plugIn = new PlugIn(name, type);

	plugIn.defaultParam = 
	{
		"databaseName": "myDatabase",
		"tables":
		[
			{
				"tableName": "example1",
				"columns":
				[
					{ "name": "id", "type": "INTEGER", "null": false, "default": "0" },
					{ "name": "textColumn", "type": "TEXT", "null": false, "default": "" },
					{ "name": "tinyintColumn", "type": "TINYINT", "null": false, "default": "0" },
					{ "name": "floatColumn", "type": "FLOAT", "null": false, "default": "0.0" },
					{ "name": "datetimeColumn", "type": "DATETIME(6)", "null": true, "default": null }
				],
				"constraints":
				[
					{ "name": "pk_example1", "type": "pk", "column": "id", "referenceColumn": "id" }
				]
			},
			{
				"tableName": "example2",
				"columns":
				[
					{ "name": "id", "type": "INTEGER", "null": false, "default": "0" },
					{ "name": "id_exemple1", "type": "INTEGER", "null": false, "default": "0" },
					{ "name": "textColumn", "type": "TEXT", "null": false, "default": "" },
					{ "name": "tinyintColumn", "type": "TINYINT", "null": false, "default": "0" },
					{ "name": "floatColumn", "type": "FLOAT", "null": false, "default": "0.0" },
					{ "name": "datetimeColumn", "type": "DATETIME(6)", "null": true, "default": null }
				],
				"constraints":
				[
					{ "name": "pk_example2", "type": "pk", "column": "id", "referenceColumn": "id" },
					{ "name": "fk_example2_example2", "type": "fk", "column": "id_exemple1", "referenceTable": "exemple1", "referenceColumn": "id" }
				]
			}
		]
	};

	/////////////
	// Methods //
	/////////////

	plugIn.createCode = function($json)
	{
		// On regroupe les requêtes par type (DROP, CREATE, SELECT, INSERT, UPDATE, DELETE) et non pas par table

		var dropQuery = ''; // Code des requêtes de suppression des tables si elles existent
		var createTable = ''; // Code des requêtes de création de table
		var selectQuery = ''; // Code des requêtes de lecture
		var insertQuery = ''; // Code des requêtes d'insertion
		var updateQuery = ''; // Code des requêtes de mise à jour
		var deleteQuery = ''; // Code des requêtes de suppression de ligne

		// Boucle sur chaque table
		for (var i = 0; i < $json['tables'].length; i++)
		{
			var tableJSON = $json['tables'][i];

			var insertColumns = 'INSERT INTO ' + $json['databaseName'] + '.' + tableJSON['tableName'] + '('; // Code de la requête d'insertion (colonnes)
			var insertValues = 'VALUES ('; // Code de la requête d'insertion (valeurs)
			
			dropQuery = 'DROP TABLE IF EXISTS ' + $json['databaseName'] + '.' + tableJSON['tableName'] + ' RESTRICT;\n' + dropQuery;
			createTable = createTable + 'CREATE TABLE IF NOT EXISTS ' + $json['databaseName'] + '.' + tableJSON['tableName'] + '\n';
			createTable = createTable + '(id INTEGER AUTO_INCREMENT';
			selectQuery = selectQuery + "SELECT " + tableJSON['tableName'] + ".id AS id";
			updateQuery = updateQuery + 'UPDATE ' + $json['databaseName'] + '.' + tableJSON['tableName'] + '\nSET ';
			deleteQuery = deleteQuery + 'DELETE FROM ' + $json['databaseName'] + '.' + tableJSON['tableName'] + ' WHERE id = :id;\n';

			// Boucle sur chaque colonne
			for (var j = 0; j < tableJSON['columns'].length; j++)
			{
				// Création de table
				createTable = createTable + ',\n';
				createTable = createTable + tableJSON['columns'][j]['name'] + ' ' + tableJSON['columns'][j]['type'];

				if (tableJSON['columns'][j]['default'] !== null)
				{
					if (tableJSON['columns'][j]['type'] === 'TEXT' || tableJSON['columns'][j]['type'] === 'DATETIME')
					{
						createTable = createTable + ' DEFAULT "' + tableJSON['columns'][j]['default'] + '"';
					}
					else
					{
						createTable = createTable + ' DEFAULT ' + tableJSON['columns'][j]['default'];
					}
				}

				if (tableJSON['columns'][j]['null'] === false)
				{
					createTable = createTable + ' NOT NULL';
				}

				// Requête de sélection
				selectQuery = selectQuery + ',\n	';
				selectQuery = selectQuery + tableJSON['tableName'] + "." + tableJSON['columns'][j]['name'] + " AS " + tableJSON['columns'][j]['name'];

				// Requête d'insertion
				if (j > 0)
				{
					insertColumns = insertColumns + ',\n	';
					insertValues = insertValues + ',\n	';
				}

				insertColumns = insertColumns + tableJSON['columns'][j]['name'];
				insertValues = insertValues + ':' + tableJSON['columns'][j]['name'];

				// Requête de mise à jour
				if (j > 0)
				{
					updateQuery = updateQuery + ',\n	';
				}

				updateQuery = updateQuery + tableJSON['columns'][j]['name'] + ' = :' + tableJSON['columns'][j]['name'];
			}

			selectQuery = selectQuery + '\nFROM ' + $json['databaseName'] + '.' + tableJSON['tableName'] + ' ' + tableJSON['tableName'] + ';\n\n';
			insertColumns = insertColumns + ')\n';
			insertValues = insertValues + ');\n\n';
			insertQuery = insertQuery + insertColumns + insertValues;
			updateQuery = updateQuery + '\nWHERE id = :id;\n\n';

			// Boucle sur chaque contrainte
			for (var j = 0; j < tableJSON['constraints'].length; j++)
			{
				createTable = createTable + ',\n';
				createTable = createTable + 'CONSTRAINT ' + tableJSON['constraints'][j]['name'];

				if (tableJSON['constraints'][j]['type'] === 'pk')
				{
					createTable = createTable + ' PRIMARY KEY (' + tableJSON['constraints'][j]['referenceColumn'] + ')';
				}
				else
				{
					createTable = createTable + ' FOREIGN KEY (' + tableJSON['constraints'][j]['column'] + ') REFERENCES ' + tableJSON['constraints'][j]['referenceTable'] + '(' + tableJSON['constraints'][j]['referenceColumn'] + ')';
				}
			}

			createTable = createTable + ')\n';
			createTable = createTable + 'ENGINE = InnoDB;\n\n';
		}

		// Code SQL complet
		var sqlCode = '/* Drop tables query */\n';
		sqlCode = sqlCode + dropQuery;
		sqlCode = sqlCode + '\n/* Create tables query */\n';
		sqlCode = sqlCode + createTable;
		sqlCode = sqlCode + '/* Select query */\n';
		sqlCode = sqlCode + selectQuery;
		sqlCode = sqlCode + '/* Insert query */\n';
		sqlCode = sqlCode + insertQuery;
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

SQLdatabase();

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("sqlDatabase");