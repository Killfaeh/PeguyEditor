
function HttpRequestJson()
{
	///////////////
	// Attributs //
	///////////////
	
	var method = 'GET';
	var target = '';
	var encodeURI = true;
	var contentType = "application/json";
	
	var request = null;
	var httpHeader = {};
	
	//////////////
	// Méthodes //
	//////////////
	
	this.send = function($param, $data)
	{
		request = new XMLHttpRequest();
		
		var param = "";
		var i = 0;
		
		for (var key in $param)
		{
			if (i != 0)
				param = param + '&';
			
			if (encodeURI === true)
				param = param + key + '=' + encodeURIComponent($param[key]);
			else
				param = param + key + '=' + $param[key];
			
			i++;
		}
		
		var data = JSON.stringify($data);
		
		if (contentType === 'application/x-www-form-urlencoded')
		{
			data = "";
			i = 0;
			
			for (var key in $data)
			{
				if (i != 0)
					data = data + '&';
				
				if (encodeURI === true)
					data = data + key + '=' + encodeURIComponent($data[key]);
				else
					data = data + key + '=' + $data[key];
				
				i++;
			}
		}
		
		if (param !== "")
			request.open(method, target + "?" + param, true);
		else
			request.open(method, target, true);
		
		for (var key in httpHeader)
			request.setRequestHeader(key, httpHeader[key]);
		
		request.setRequestHeader("Content-Type", contentType);

		request.onreadystatechange = function()
		{
			if (request.readyState === 4)
			{
				if (utils.isset(request.responseText) && request.responseText !== "")
				{
					//console.log("RESPONSE : " + request.responseText);

					if (request.status === 200)
						$this.onSuccess(request.status, dataManager.parseJSON(request.responseText));
					else
						$this.onError(request.status, dataManager.parseJSON(request.responseText));
				}
			}
		};
		
		if (method === 'GET')
			request.send(null);
		else if (method === 'PUT')
			request.send(data);
		else
			request.send(data);
	};
	
	this.addToHttpHeader = function($name, $value) { httpHeader[$name] = $value; };
	this.resetHttpHeader = function() { httpHeader = {}; };
	
	////////////////
	// Evénements //
	////////////////
	
	this.onSuccess = function($status, $data) {};
	this.onError = function($status, $data) {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	this.setMethod = function($method) { method = $method; };
	this.setTarget = function($target) { target = $target; };
	this.setEncodeURI = function($encodeURI) { encodeURI = $encodeURI; };
	this.setContentType = function($contentType) { contentType = $contentType; };
	
	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("httpRequestJson");