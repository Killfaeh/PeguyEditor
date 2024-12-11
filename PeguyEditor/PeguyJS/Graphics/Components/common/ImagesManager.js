function ImagesManager()
{
	///////////////
	// Attributs //
	///////////////

	var popupHTML = '<h2>' + KEYWORDS.imagesLibrary + '</h2>'
						+ '<div id="images-list-block" class="images-list-block" >'
							+ '<ul id="images-list" class="images-list" ></ul>'
						+ '</div>'
						+ '<div id="manageButtons" class="manageButtons" ></div>';
	
	var popup = new ConfirmPopup(popupHTML);
	
	popup.addClass('images-manager-popup');
	
	var addNewButton = new InputFile('image/*', '', '', 'imgFile-' + popup.getId());
	var newIcon = Loader.getSVG('icons', 'plus-icon', 30, 30);
	addNewButton.getById('icon').appendChild(newIcon);
	
	var editButton = new InputFile('image/*', '', '', 'imgFile-' + popup.getId());
	var editIcon = Loader.getSVG('icons', 'edit-icon', 30, 30);
	editButton.getById('icon').appendChild(editIcon);
	editButton.style.display = 'none';
	
	var deleteIcon = Loader.getSVG('icons', 'trash-icon', 30, 30);
	deleteIcon.style.display = 'none';
	
	popup.getById('manageButtons').appendChild(addNewButton);
	popup.getById('manageButtons').appendChild(editButton);
	popup.getById('manageButtons').appendChild(deleteIcon);
	
	var displayFreezeScreen = function() {};
	var hideFreezeScreen = function() {};
	
	var getImagesListRequest = { url: '', method: 'GET', param: [], data: [], response: {id: 'id', url: 'url'} };
	var uploadImageRequest = { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} };
	var editImageRequest = { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} };
	var deleteImageRequest = { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} };
	
	var params = {};
	var imagesList = [];
	var selected = null;
	
	var imagesToUpload = [];
	var imagesUploaded = 0;
	var uploadedUrls = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	var addImage = function($id, $url)
	{
		var token = Math.ceil(Math.random()*10000);
		
		var itemHTML = '<li imgId="' + $id + '" >'
							+ '<img id="img" src="' + $url + '?token=' + token + '" />'
							+ '<div id="magnifying-glass" class="magnifying-glass" ></div>'
							+ '<div class="wall" ></div>'
						+ '</li>';
		
		var item = new Component(itemHTML);
		
		var magnifyingGlassIcon = Loader.getSVG('icons', 'magnifying-glass-icon', 25, 25);
		item.getById('magnifying-glass').appendChild(magnifyingGlassIcon);
		
		item.getById('magnifying-glass').onClick = function()
		{
			var imagePopup = new ImagePopup(this.parentNode.getById('img').src, '');
			document.getElementById('main').appendChild(imagePopup);
		};
		
		item.onMouseOver = function()
		{
			var img = this.getById('img');
			var imgWidth = img.offsetWidth;
			var imgHeight = img.offsetHeight;
			
			if (imgWidth > imgHeight)
				this.getById('magnifying-glass').style.top =  ((imgWidth-imgHeight)/2) + 'px';
			else
				this.getById('magnifying-glass').style.top =  ((imgHeight-imgWidth)/2) + 'px';
			
			this.getById('magnifying-glass').style.display = 'block';
		};
		
		item.onMouseOut = function() { this.getById('magnifying-glass').style.display = 'none'; };
		item.onClick = function() { $this.select(this); };
		
		imagesList.push({ id: $id, url: $url, item: item });
		
		popup.getById('images-list').appendChild(item);
		
		if (utils.isset(popup.getById('images-list-block').scrollTo))
			popup.getById('images-list-block').scrollTo(0, popup.getById('images-list-block').scrollHeight);
		else
			popup.getById('images-list-block').scrollTop = popup.getById('images-list-block').scrollHeight;
		
		return item;
	};
	
	var sendRequest = function($requestInfo, $callback, $data)
	{
		if (utils.isset(displayFreezeScreen))
			displayFreezeScreen();
		
		var request = new HttpRequestJson();
		request.setMethod($requestInfo.method);
		request.setTarget($requestInfo.url);
		
		request.onSuccess = function($status, $response)
		{
			if ($status < 300)
				$callback($status, $response);
			else
				$this.onError($status, $response);
		};
		
		request.onError = function($status, $response)
		{
			if (utils.isset(hideFreezeScreen))
				hideFreezeScreen();
			
			$this.onError($status, $response);
		};
		
		var requestParams = {};
		var requestData = {};
		
		for (var i = 0; i < $requestInfo.param.length; i++)
			requestParams[$requestInfo.param[i]] = params[$requestInfo.param[i]];
		
		for (var i = 0; i < $requestInfo.data.length; i++)
			requestData[$requestInfo.data[i]] = params[$requestInfo.data[i]];
		
		if (utils.isset($data))
		{
			if ($requestInfo.method === 'GET')
			{
				for (var key in $data)
					requestParams[key] = $data[key];
			}
			else
			{
				for (var key in $data)
					requestData[key] = $data[key];
			}
		}
		
		request.send(requestParams, requestData);
	};
	
	this.getImagesList = function()
	{
		sendRequest(getImagesListRequest, function($status, $response)
		{
			if (utils.isset($response) && Array.isArray($response))
			{
				imagesList = [];
				popup.getById('images-list').removeAllChildren();
				
				for (var i = 0; i < $response.length; i++)
				{
					var id = $response[i][getImagesListRequest.response.id];
					var url = $response[i][getImagesListRequest.response.url];
					addImage(id, url);
				}
			}
			else
				$this.onError($status, $response);
			
			if (utils.isset(hideFreezeScreen))
				hideFreezeScreen();
		});
	};
	
	this.onImagesUpload = function($urls) {};
	
	var onImageUpload = function()
	{
		imagesUploaded++;
		
		if (imagesUploaded >= imagesToUpload.length)
		{
			$this.onImagesUpload(uploadedUrls);
			
			if (utils.isset(hideFreezeScreen))
				hideFreezeScreen();
		}
	};
	
	this.uploadImages = function($imagesData)
	{
		imagesToUpload = $imagesData;
		imagesUploaded = 0;
		uploadedUrls = [];
		
		for (var i = 0; i < imagesToUpload.length; i++)
		{
			sendRequest(uploadImageRequest, function($status, $response)
			{
				if (utils.isset($response[getImagesListRequest.response.id]) && utils.isset($response[getImagesListRequest.response.url]))
				{
					var item = addImage($response[getImagesListRequest.response.id], $response[getImagesListRequest.response.url]);
					$this.select(item);
					uploadedUrls.push($response[getImagesListRequest.response.url]);
				}
				else
					$this.onError($status, $response);
				
				onImageUpload();
				
			}, { imgData: imagesToUpload[i] });
		}
	};
	
	this.editImage = function($id, $imgData)
	{
		sendRequest(editImageRequest, function($status, $response)
		{
			if (utils.isset($response[getImagesListRequest.response.id]) && utils.isset($response[getImagesListRequest.response.url]))
			{
				for (var i = 0; i < imagesList.length; i++)
				{
					if (parseInt($response[getImagesListRequest.response.id]) === parseInt(imagesList[i].id))
					{
						var token = Math.ceil(Math.random()*10000);
						imagesList[i].url = $response[getImagesListRequest.response.url];
						imagesList[i].item.getById('img').src = $response[getImagesListRequest.response.url] + '?token=' + token;
						i = imagesList.length;
					}
				}
			}
			else
				$this.onError($status, $response);
			
			if (utils.isset(hideFreezeScreen))
				hideFreezeScreen();
			
		}, { id: $id, imgData: $imgData });
	};
	
	this.deleteImage = function($id)
	{
		sendRequest(deleteImageRequest, function($status, $response)
		{
			if (utils.isset($response[getImagesListRequest.response.id]))
			{
				$this.deselectAll();
				
				for (var i = 0; i < imagesList.length; i++)
				{
					if (parseInt($response[getImagesListRequest.response.id]) === parseInt(imagesList[i].id))
					{
						popup.getById('images-list').removeChild(imagesList[i].item);
						imagesList.splice(i, 1);
						i = imagesList.length;
					}
				}
			}
			else
				$this.onError($status, $response);
			
			if (utils.isset(hideFreezeScreen))
				hideFreezeScreen();
			
		}, { id: $id });
	};
	
	this.deselectAll = function()
	{
		selected = null;
		editButton.style.display = 'none';
		deleteIcon.style.display = 'none';
		
		for (var i = 0; i < imagesList.length; i++)
			imagesList[i].item.removeAttribute('class');
	};
	
	this.select = function($item)
	{
		$this.deselectAll();
		
		var id = $item.getAttribute('imgId');
		
		for (var i = 0; i < imagesList.length; i++)
		{
			if (parseInt(id) === parseInt(imagesList[i].id))
			{
				selected = imagesList[i];
				selected.item.setAttribute('class', 'selected');
				editButton.style.display = 'inline-block';
				deleteIcon.style.display = 'inline-block';
				i = imagesList.length;
			}
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onError = function($status, $response) {};
	
	addNewButton.onChange = function($value)
	{
		if (utils.isset($value) && $value !== '')
		{
			var fileType = addNewButton.getFileType();
			
			if (/^image/.test(fileType))
				$this.uploadImages([$value]);
			else
			{
				var errorHTML = '<p class="error" >' + KEYWORDS.errorNotImage + '</p>';
				var errorPopup = new InfoPopup(errorHTML);
				document.getElementById('main').appendChild(errorPopup);
			}
		}
		
		addNewButton.clear();
	};
	
	editButton.onChange = function($value)
	{
		if (utils.isset(selected) && utils.isset($value) && $value !== '')
		{
			var fileType = editButton.getFileType();
			
			if (/^image/.test(fileType))
				$this.editImage(selected.id, $value);
			else
			{
				var errorHTML = '<p class="error" >' + KEYWORDS.errorNotImage + '</p>';
				var errorPopup = new InfoPopup(errorHTML);
				document.getElementById('main').appendChild(errorPopup);
			}
		}
		
		editButton.clear();
	};
	
	deleteIcon.onClick = function()
	{
		if (utils.isset(selected))
		{
			var confirmPopup = new ConfirmPopup('<div>'
													+ '<p>' + KEYWORDS.confirmDeleteImage + '</p>'
												+ '</div>', true);
												
			confirmPopup.onOk = function() 
			{
				$this.deleteImage(selected.id);
				return true;
			};
			
			document.getElementById('main').appendChild(confirmPopup);
		}
	};
	
	popup.getById('images-list-block').onDragEnter = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(245, 245, 245)'; };
	popup.getById('images-list').onDragEnter = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(245, 245, 245)'; };
	popup.getById('images-list-block').onDragLeave = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)'; };
	popup.getById('images-list').onDragLeave = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)'; };
	popup.getById('images-list-block').onDragEnd = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)'; };
	popup.getById('images-list').onDragEnd = function($event) { popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)'; };
	
	this.onDropFiles = function($event)
	{
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)';
			
			var files = $event.dataTransfer.files;
			
			var filesToSend = [];
			var dataToSend = [];
			var readyFiles = 0;
			
			var onReady = function()
			{
				readyFiles++;
				
				if (readyFiles >= filesToSend.length)
					$this.uploadImages(dataToSend);
			};
			
			for (var i = 0; i < files.length; i++)
			{
				var file = files[i];
				
				if (/^image/.test(file.type) || /^application\/pdf/.test(file.type))
					filesToSend.push(file);
			}
			
			for (var i = 0; i < filesToSend.length; i++)
			{
				var file = filesToSend[i];
				
				reader = new FileReader();
				
				reader.onload = function ($event)
				{
					var fileData = $event.target.result;
					
					if (/data:image\/svg\+xml;base64,/.test(fileData))
					{
						dataManager.svgDataToPNG(fileData, function($pngData)
						{
							dataToSend.push($pngData);
							onReady();
						});
					}
					else
					{
						dataToSend.push(fileData);
						onReady();
					}
				};
				
				reader.readAsDataURL(file);
			}
		}
	};
	
	popup.getById('images-list-block').onDrop = function($event)
	{
		$this.onImagesUpload = function($urls) {};
		$this.onDropFiles($event);
	};
	
	popup.getById('images-list').onDrop = function($event)
	{
		$this.onImagesUpload = function($urls) {};
		$this.onDropFiles($event);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getDisplayFreezeScreen = function() { return displayFreezeScreen; };
	this.getHideFreezeScreen = function() { return hideFreezeScreen; };
	
	this.getGetImagesListRequest = function() { return getImagesListRequest; };
	this.getUploadImageRequest = function() { return uploadImageRequest; };
	this.getEditImageRequest = function() { return editImageRequest; };
	this.getDeleteImageRequest = function() { return deleteImageRequest; };
	
	this.getParams = function() { return params; };
	
	this.getSelected = function() { return selected; };
	
	this.getSelectedUrl = function()
	{
		var selectedUrl = null;
		
		if (utils.isset(selected))
			selectedUrl = selected.url;
		
		return selectedUrl;
	};
	
	// SET
	
	this.setDisplayFreezeScreen = function($displayFreezeScreen) { displayFreezeScreen = $displayFreezeScreen; };
	this.setHideFreezeScreen = function($hideFreezeScreen) { hideFreezeScreen = $hideFreezeScreen; };
	
	this.setGetImagesListRequest = function($getImagesListRequest) { getImagesListRequest = $getImagesListRequest; };
	this.setUploadImageRequest = function($uploadImageRequest) { uploadImageRequest = $uploadImageRequest; };
	this.setEditImageRequest = function($editImageRequest) { editImageRequest = $editImageRequest; };
	this.setDeleteImageRequest = function($deleteImageRequest) { deleteImageRequest = $deleteImageRequest; };
	
	this.setParams = function($params) { params = $params; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("imagesManager");