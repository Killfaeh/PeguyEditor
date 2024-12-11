Files = 
{
	accept: [],
	dropped: [],
	accepted: [],
	ready: [],
	
	drop: function($event, $callback)
	{
		Files.dropped = [];
		Files.accepted = [];
		Files.ready = [];
		
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			Files.dropped = $event.dataTransfer.files;
			
			// Filtrage sur les types de fichiers
			
			for (var i = 0; i < Files.dropped.length; i++)
			{
				console.log("File type : " + Files.dropped[i].type);
				
				if (Files.accept.length <= 0 || Files.accept.indexOf(Files.dropped[i].type) >= 0)
					Files.accepted.push(Files.dropped[i]);
			}
			
			// Lecture des données
			
			for (var i = 0; i < Files.accepted.length; i++)
			{
				var file = Files.accepted[i];
				
				//console.log(file);

				var reader = new FileReader();
				reader.name = file.name;
				reader.type = file.type;
				reader.path = file.path;
				
				reader.onload = function ($event)
				{
					var fileData = $event.target.result;
					var fileName = this.name;
					var fileType = this.type;
					var filePath = this.path;
					
					Files.ready.push({ name: fileName, path: filePath, type: fileType, data: fileData });
					Files.onReady($callback);
				};
				
				if (/^image/.test(file.type) || /^application\/pdf/.test(file.type))
					reader.readAsDataURL(file);
				else if (/^text/.test(file.type) || file.type === 'application/json')
					reader.readAsText(file);
			}
		}
	},
	
	onReady: function($callback)
	{
		if (Files.ready.length >= Files.accepted.length)
			$callback(Files.ready);
	}
};

if (typeof Loader !== 'undefined' && Loader !== undefined && Loader !== null)
	Loader.hasLoaded("files");