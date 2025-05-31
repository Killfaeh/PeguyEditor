function ContentEditable()
{
	///////////////
	// Attributs //
	///////////////
	
	// Données
	
	var bold = true;
	var italic = true;
	var underline = true;
	var strike = true;
	var fontSize = true;
	var title = true;
	var textColor = true;
	var font = true;
	var quote = true;
	var code = true;
	var align = true;
	var lists = true;
	var tables = true;
	var links = true;
	var images = true;
	var addAnchor = false;
	var keepBR = false;
	
	var defaultColor = 'rgb(0, 0, 0)';
	var colorsList = [];
	
	var fontList = [
					{ value: 'Arial', label: 'Arial' },
					{ value: 'Times New Roman', label: 'Times New Roman' },
					{ value: 'Courier New', label: 'Courier New' },
					{ value: 'Géorgie', label: 'Géorgie' },
					{ value: 'Helvetica', label: 'Helvetica' },
					{ value: 'Verdana', label: 'Verdana' }
					];
					
	var languagesList = [];
	
	var imagesUploadModes =
	{
		url: true,
		hosted: false
	};
	
	var imagesLibraryConfig = 
	{
		params: {},
		displayFreezeScreen: function() {},
		hideFreezeScreen: function() {},
		onError: function(status, $response) {},
		getImagesListRequest: { url: '', method: 'GET', param: [], data: [], response: {id: 'id', url: 'url'} },
		uploadImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} },
		editImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} },
		deleteImageRequest: { url: '', method: 'POST', param: [], data: [], response: {id: 'id', url: 'url'} }
	};
	
	var imgSecureURL = '';
	
	var detectCaretStr = "ChaineDeCaracteresAlaConQuePersonneNeTaperaJamais";
	var scrollY = 0;
	
	// Eléments affichables
	
	var html = '<div class="contentEditable" >'
				+ '<div id="buttons" class="buttons" >'
					+ '<div class="buttonsSubBlock" >'
						+ '<p class="undoRedo" id="undoRedo" >'
							+ '<a id="undo" href="#" ></a>'
							+ '<a id="redo" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="format" id="format" >'
							+ '<a id="bold" href="#" style="font-weight: bold; " >B</a>'
							+ '<a id="italic" href="#" style="font-style: italic; " >I</a>'
							+ '<a id="underline" href="#" style="text-decoration: underline; " >U</a>'
							+ '<a id="strike" href="#" style="text-decoration: line-through; " >S</a>'
							+ '<a id="font-size" href="#" ></a>'
							+ '<a id="title" class="title" href="#" >T</a>'
							+ '<a id="text-color" href="#" ></a>'
							+ '<a id="font" class="font" href="#" >F</a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="block" id="block" >'
							+ '<a id="quote" href="#" >“…”</a>'
							+ '<a id="code" href="#" >&lt;/&gt;</a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="align" id="align" >'
							+ '<a id="align-left" href="#" ></a>'
							+ '<a id="align-center" href="#" ></a>'
							+ '<a id="align-right" href="#" ></a>'
							+ '<a id="align-justify" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="list" id="list" >'
							+ '<a id="unorder-list" href="#" ></a>'
							+ '<a id="order-list" href="#" ></a>'
							+ '<a id="table" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="links" id="links" >'
							+ '<a id="url" href="#" ></a>'
							+ '<a id="img" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
						+ '<p class="remove-format-block" id="remove-format-block" >'
							+ '<a id="remove-format" href="#" ></a>'
							+ '<div class="wall" ></div>'
						+ '</p>'
					+ '</div>'
				+ '</div>'
				+ '<div id="editor" class="editor" contenteditable="true" ></div>'
				+ '<textarea id="bbEditor" class="bbEditor" ></textarea>'
			+ '</div>';
		
	var component = new Component(html);
	
	var undoIcon = Loader.getSVG('icons', 'undo-icon', 16, 16);
	var redoIcon = Loader.getSVG('icons', 'redo-icon', 16, 16);
	var fontSizeIcon = Loader.getSVG('icons', 'font-size-icon', 16, 16);
	var textColorIcon = Loader.getSVG('icons', 'text-color-icon', 16, 16);
	var alignLeftIcon = Loader.getSVG('icons', 'align-left-icon', 16, 16);
	var alignCenterIcon = Loader.getSVG('icons', 'align-center-icon', 16, 16);
	var alignRightIcon = Loader.getSVG('icons', 'align-right-icon', 16, 16);
	var alignJustifyIcon = Loader.getSVG('icons', 'align-justify-icon', 16, 16);
	var unorderListIcon = Loader.getSVG('icons', 'unorder-list-icon', 16, 16);
	var orderListIcon = Loader.getSVG('icons', 'order-list-icon', 16, 16);
	var tableIcon = Loader.getSVG('icons', 'table-icon', 16, 16);
	var urlIcon = Loader.getSVG('icons', 'url-icon', 16, 16);
	var imgIcon = Loader.getSVG('icons', 'picture-icon', 16, 16);
	var removeTextFormatIcon = Loader.getSVG('icons', 'remove-text-format-icon', 16, 16);
	
	component.getById('undo').appendChild(undoIcon);
	component.getById('redo').appendChild(redoIcon);
	component.getById('font-size').appendChild(fontSizeIcon);
	component.getById('text-color').appendChild(textColorIcon);
	component.getById('align-left').appendChild(alignLeftIcon);
	component.getById('align-center').appendChild(alignCenterIcon);
	component.getById('align-right').appendChild(alignRightIcon);
	component.getById('align-justify').appendChild(alignJustifyIcon);
	component.getById('unorder-list').appendChild(unorderListIcon);
	component.getById('order-list').appendChild(orderListIcon);
	component.getById('table').appendChild(tableIcon);
	component.getById('url').appendChild(urlIcon);
	component.getById('img').appendChild(imgIcon);
	component.getById('remove-format').appendChild(removeTextFormatIcon);
	
	// Données de fonctionnement
	
	var htmlContent = "";
	var bbContent = "";
	var selection = null;
	var caretPosition = { node: component.getById('editor'), offset: 0 };
	var changeDate = new Date();
	var changeTimer = null;
	var arrowDate = new Date();
	var arrowTimer = null;
	var history = [];
	var historyIndex = 0;
	var mode = 'wysiwyg';

	//////////////
	// Méthodes //
	//////////////
	
	this.saveSelection = function()
	{
		selection = null;
		
		if (window.getSelection)
		{
			var sel = window.getSelection();
			
			if (sel.getRangeAt && sel.rangeCount)
				selection = sel.getRangeAt(0);
		}
		else if (document.selection && document.selection.createRange)
			selection = document.selection.createRange();
		
		return selection;
	};
	
	this.restoreSelection = function($range)
	{
		if ($range)
		{
			if (window.getSelection)
			{
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange($range);
			}
			else if (document.selection && range.select)
				$range.select();
		}
	};
	
	this.nextNode = function($node)
	{
		var nextNode = null;
		var node = $node;
		
		if ($node.hasChildNodes())
			nextNode = $node.firstChild;
		else
		{
			while (node && !utils.isset(node.nextSibling))
				node = node.parentNode;
			
			if (utils.isset(node))
				nextNode = node.nextSibling;
		}
		
		return nextNode;
	};
	
	this.getSelectedNodes = function($range)
	{
		var node = $range.startContainer;
		var endNode = $range.endContainer;
		var nodesList = [];
		
		// Special case for a range that is contained within a single node
		if (node === endNode)
			nodesList = [node];
		else
		{
			// Iterate nodes until we hit the end container
			while (node && node != endNode)
			{
				node = $this.nextNode(node);
				nodesList.push(node);
			}
			
			// Add partially selected nodes at the start of the range
			node = $range.startContainer;
			
			while (node && node != $range.commonAncestorContainer)
			{
				nodesList.unshift(node);
				node = node.parentNode;
			}
		}
		
		return nodesList;
	};
	
	//// Vérifier si la sélection contient ou est dans un bloc de code ou de citation ////
	
	this.isThereCodeOrQuoteTag = function()
	{
		var isThere = false;
		//*
		$this.saveSelection();
		
		console.log(selection);
		
		if (utils.isset(selection))
		{
			var commonParent = selection.commonAncestorContainer;
			var ancestor = commonParent;
			
			while (utils.isset(ancestor))
			{
				//console.log(ancestor);
				
				if (utils.isset(ancestor.tagName) 
					&& (ancestor.tagName.toUpperCase() === 'PRE' 
						|| ancestor.tagName.toUpperCase() === 'CODE' 
						|| ancestor.tagName.toUpperCase() === 'BLOCKQUOTE'))
				{
					isThere = true;
					ancestor = null;
				}
				else
					ancestor = ancestor.parentNode;
			}
			
			if (isThere === false)
			{
				var selectedNodes = $this.getSelectedNodes(selection);
				
				for (var i = 0; i < selectedNodes.length; i++)
				{
					if (utils.isset(selectedNodes[i].tagName) && (selectedNodes[i].tagName.toUpperCase() === 'PRE' 
						|| selectedNodes[i].tagName.toUpperCase() === 'CODE' 
						|| selectedNodes[i].tagName.toUpperCase() === 'BLOCKQUOTE'))
					{
						isThere = true;
						i = selectedNodes.length;
					}
					else if (utils.isset(selectedNodes[i].getElementsByTagName))
					{
						var preNodes = selectedNodes[i].getElementsByTagName('pre');
						var codeNodes = selectedNodes[i].getElementsByTagName('code');
						var quoteNodes = selectedNodes[i].getElementsByTagName('blockquote');
						
						if (preNodes.length > 0 || codeNodes.length > 0 || quoteNodes.length > 0)
						{
							isThere = true;
							i = selectedNodes.length;
						}
					}
				}
			}
		}
		//*/
		
		console.log("Is there ? " + isThere);
		
		return isThere;
	};
	
	this.getNbCharBeforeCaret = function($caretNode, $node)
	{
		var nb = 0;
		var next = true;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node === $caretNode)
			{
				i = childNodes.length;
				next = false;
			}
			else if (node.nodeType === Node.TEXT_NODE)
				nb = nb + node.textContent.length;
			else
			{
				var response = $this.getNbCharBeforeCaret($caretNode, node);
				nb = nb + response.nb;
				
				if (response.next === false)
				{
					i = childNodes.length;
					next = false;
				}
			}
		}
		
		return { nb: nb, next: next };
	};
	
	this.getCaretPosition = function()
	{
		var position = 0;
		
		var sel = null;
		
		if (window.getSelection)
			sel = window.getSelection();
		else if (document.selection)
			sel = document.selection;
		
		if (utils.isset(sel))
		{
			var nbCharBeforeCaret = $this.getNbCharBeforeCaret(sel.anchorNode, component.getById('editor')).nb;
			position = nbCharBeforeCaret + sel.anchorOffset;
		}
		
		return position;
	};
	
	this.getNodeAtPosition = function($node, $offset, $position)
	{
		var nodeToReturn = null;
		var currentPosition = $offset;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node.nodeType === Node.TEXT_NODE)
			{
				currentPosition = currentPosition + node.textContent.length;
				
				console.log("Current position : " + currentPosition);
				console.log(node.textContent);
				
				if (currentPosition > $position)
				{
					i = childNodes.length;
					nodeToReturn = node;
				}
			}
			else
			{
				var response = $this.getNodeAtPosition(node, currentPosition, $position);
				
				if (utils.isset(response.nodeToReturn))
				{
					i = childNodes.length;
					nodeToReturn = response.nodeToReturn;
				}
				else
					currentPosition = response.currentPosition;
			}
		}
		
		return { nodeToReturn: nodeToReturn, currentPosition: currentPosition };
	};
	
	//// Retourner le noeud où l'on a inséré la chaîne de sauvegarde de la position du curseur. ////
	
	this.getInsertNode = function($node)
	{
		var nodeToReturn = null;
		
		var childNodes = $node.childNodes;
		
		for (var i = 0; i < childNodes.length; i++)
		{
			var node = childNodes[i];
			
			if (node.nodeType === Node.TEXT_NODE)
			{
				if (node.textContent.indexOf(detectCaretStr) >= 0)
				{
					i = childNodes.length;
					nodeToReturn = node;
				}
			}
			else
			{
				var response = $this.getInsertNode(node);
				
				if (utils.isset(response))
				{
					i = childNodes.length;
					nodeToReturn = response;
				}
			}
		}
		
		return nodeToReturn;
	};
	
	//// Repositionner le curseur ////
	
	this.restoreCaret = function($moveScroll)
	{
		var caretNode = $this.getInsertNode(component.getById('editor'));
		
		if (utils.isset(caretNode))
		{
			var bbCaretPosition = bbContent.indexOf(detectCaretStr);
			bbContent = bbContent.replace(detectCaretStr, '');
			
			var saltPosition = caretNode.textContent.indexOf(detectCaretStr);
			var textContent = caretNode.textContent.replace(detectCaretStr, '');
			//console.log('Restore text content : "' + textContent + '"');
			caretNode.textContent = textContent;
			//console.log('Restored text content : "' + caretNode.textContent + '"');
			
			component.getById('bbEditor').value = bbContent;
			
			if (mode === 'text')
			{
				component.getById('bbEditor').setCaret(bbCaretPosition);
				component.getById('bbEditor').blur();
				component.getById('bbEditor').focus();
			}
			else
			{
				var sel = null;
				
				if (window.getSelection)
					sel = window.getSelection();
				else if (document.selection)
					sel = document.selection;
				
				if (utils.isset(sel))
				{
					sel.deleteFromDocument();
					
					var range = new Range();
					range.setStart(caretNode, saltPosition);
					
					sel.removeAllRanges();
					sel.addRange(range);
				}
				
				// Repositionnement de l'ascenceur
				if ($moveScroll === true)
				{
					var span = document.createElement("span");
					
					if (utils.isset(span.getClientRects))
					{
						span.appendChild(document.createTextNode("\u200b"));
						range.insertNode(span);
						rect = span.getClientRects()[0];
						
						var newScrollY = scrollY;
						var editorPosition = component.getById('editor').position();
						var spanPosition = span.position();
						
						if (spanPosition.y - editorPosition.y < scrollY)
							newScrollY = spanPosition.y - editorPosition.y - span.offsetHeight;
						else if (spanPosition.y - editorPosition.y > scrollY + component.getById('editor').offsetHeight)
							newScrollY = spanPosition.y - editorPosition.y - component.getById('editor').offsetHeight + 3*span.offsetHeight;
						
						if (utils.isset(component.getById('editor').scrollTo))
							component.getById('editor').scrollTo(0, newScrollY);
						else
							component.getById('editor').scrollTop = newScrollY;
						
						var spanParent = span.parentNode;
						spanParent.removeChild(span);
					}
				}
			}
			
			//console.log('Restored text content : "' + caretNode.textContent + '"');
		}
	};
	
	this.getConfig = function()
	{
		var config = 
		{
			bold: bold,
			italic: italic,
			underline: underline,
			strike: strike,
			fontSize: fontSize,
			title: title,
			textColor: textColor,
			font: font,
			quote: quote,
			code: code,
			align: align,
			lists: lists,
			tables: tables,
			links: links,
			images: images,
			addAnchor: addAnchor,
			keepBR: keepBR,
			defaultColor: defaultColor,
			colorsList: colorsList,
			fontList: fontList,
			imagesUploadModes: imagesUploadModes,
			imgSecureURL: imgSecureURL
		};
		
		return config;
	};
	
	this.updateBBCode = function()
	{
		//console.log("HTML");
		//console.log(component.getById("editor").innerHTML);
		htmlContent = component.getById("editor").innerHTML;
		bbContent = Format.nodeToBBCode(component.getById("editor"), $this.getConfig());
		bbContent = bbContent.replace(/^\n+/, '');
		component.getById("bbEditor").value = bbContent;
		//bbContent = bbContent.replace(/\n+$/, '');
		//console.log("BB CODE");
		//console.log(bbContent);
		return bbContent;
	};
	
	this.updateHTMLCode = function()
	{
		bbContent = component.getById("bbEditor").value;
		//console.log("BB CODE");
		//console.log(bbContent);
		htmlContent = Format.bbCodeToHTML(bbContent, $this.getConfig());
		//console.log("HTML");
		//console.log(htmlContent);
		component.getById("editor").innerHTML = htmlContent;
		return htmlContent;
	};
	
	this.updateCode = function()
	{
		if (mode === 'text')
			$this.updateHTMLCode();
		else
			$this.updateBBCode();
	};
	
	this.makeImagesDraggable = function()
	{
		/*
		var imagesList = component.getById("editor").getElementsByTagName('img');
		
		for (var i = 0; i < imagesList.length; i++)
			imagesList[i].setAttribute('draggable', 'true');
		//*/
	};
	
	//// Gestion de l'historique ////
	
	var updateUndoRedoButtons = function()
	{
		if (history.length > 1)
		{
			component.getById('undoRedo').style.display = 'inline-block';
			
			if (historyIndex <= 0)
				component.getById('undo').style.display = 'none';
			else
				component.getById('undo').style.display = 'inline-block';
			
			if (historyIndex >= history.length-1)
				component.getById('redo').style.display = 'none';
			else
				component.getById('redo').style.display = 'inline-block';
		}
		else
			component.getById('undoRedo').style.display = 'none';
	};
	
	var currentCaretNode = null;
	
	this.cloneForHistory = function($node)
	{
		var clone; 
	
		if ($node.tagName !== undefined)
		{
			// Création du clone
			clone = document.createElement($node.tagName); 
			
			// Attributs du noeuds
			var attributes = $node.attributes; 
			
			//console.log(this.attributes); 
			
			for (var i = 0; i < attributes.length; i++)
				clone.setAttribute(attributes[i].name, $node.getAttribute(attributes[i].name)); 
			
			// Parcours des enfants du noeud
			var children = $node.childNodes; 
		
			for (var i = 0; i < children.length; i++)
				clone.appendChild($this.cloneForHistory(children[i])); 
		}
		else 
			clone = document.createTextNode($node.nodeValue);
		
		if ($node === currentCaretNode.anchorNode)
		{
			//console.log("Insert node : " + $node.tagName);
			//console.log($node);
			var caretIndex = currentCaretNode.anchorOffset;
			
			if (utils.isset($node.tagName))
			{
				clone.insertAt(document.createTextNode(detectCaretStr), caretIndex);
			}
			else
				clone.textContent = $node.textContent.insertAt(detectCaretStr, caretIndex);
			
			//clone.innerHTML = $node.innerHTML.insertAt(detectCaretStr, caretIndex);
		}
		
		return clone; 
	};
	
	this.cloneBBCodeForHistory = function()
	{
		var cloneBBCode = "";
		
		if (component.getById('bbEditor').setSelectionRange)
		{
			cloneBBCode = component.getById('bbEditor').value.substring(0, component.getById('bbEditor').selectionStart)
							+ component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionStart, component.getById('bbEditor').selectionEnd)
							+ detectCaretStr + component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionEnd, component.getById('bbEditor').value.length);
		}
		else
		{
			var range = document.selection.createRange();
			
			cloneBBCode = component.getById('bbEditor').value.substring(0, range.startOffset)
							+ range.text 
							+ detectCaretStr + component.getById('bbEditor').value.substring(range.endOffset, component.getById('bbEditor').value.length);
		}
		
		return cloneBBCode;
	};
	
	this.addToHistory = function()
	{
		console.log("ADD TO HISTORY");
		
		var cloneBBCode = bbContent;
		
		if (mode === 'text')
			cloneBBCode = $this.cloneBBCodeForHistory();
		else
		{
			if (window.getSelection)
				currentCaretNode = window.getSelection();
			else if (document.selection)
				currentCaretNode = document.selection;
			
			var clone = $this.cloneForHistory(component.getById('editor'));
			
			//var htmlCode = clone.innerHTML + "";
			
			//console.log(component.getById('editor').innerHTML);
			//console.log(clone.innerHTML);
			
			cloneBBCode =  Format.nodeToBBCode(clone, $this.getConfig());
			cloneBBCode = cloneBBCode.replace(/^\n+/, '');
		}
		
		//console.log(cloneBBCode);
		
		if (cloneBBCode !== history[history.length-1])
			history.push(cloneBBCode);
		
		historyIndex = history.length-1;
		updateUndoRedoButtons();
	};
	
	this.updateCursorInHistory = function($index)
	{
		var cloneBBCode = bbContent;
		
		if (mode === 'text')
			cloneBBCode = $this.cloneBBCodeForHistory();
		else
		{
			if (window.getSelection)
				currentCaretNode = window.getSelection();
			else if (document.selection)
				currentCaretNode = document.selection;
			
			var clone = $this.cloneForHistory(component.getById('editor'));
			
			//var htmlCode = clone.innerHTML + "";
			
			cloneBBCode =  Format.nodeToBBCode(clone, $this.getConfig());
			cloneBBCode = cloneBBCode.replace(/^\n+/, '');
		}
		
		history[$index] = cloneBBCode;
		updateUndoRedoButtons();
	};
	
	this.emptyHistoryFrom = function($index)
	{
		if ($index < history.length-1)
		{
			history.splice($index+1);
			updateUndoRedoButtons();
			console.log("Vidage de l'historique après " + $index);
			console.log(history);
		}
	};
	
	this.emptyHistory = function()
	{
		history = [];
		history.push(bbContent);
		historyIndex = 0;
		updateUndoRedoButtons();
	};
	
	this.undo = function()
	{
		console.log("UNDO " + historyIndex);
		
		historyIndex--;
		
		if (historyIndex < 0)
			historyIndex = 0;
		else
		{
			//console.log("UNDO " + historyIndex + ' : ' + history[historyIndex]);
			
			bbContent = history[historyIndex];
			component.getById('bbEditor').value = bbContent;
			$this.updateHTMLCode();
			
			//component.getById('editor').innerHTML = history[historyIndex];
			$this.makeImagesDraggable();
			$this.restoreCaret(false);
			updateUndoRedoButtons();
		}
	};
	
	this.redo = function()
	{
		historyIndex++;
		
		if (historyIndex >= history.length)
			historyIndex = history.length-1;
		else
		{
			bbContent = history[historyIndex];
			component.getById('bbEditor').value = bbContent;
			$this.updateHTMLCode();
			
			//component.getById('editor').innerHTML = history[historyIndex];
			$this.makeImagesDraggable();
			$this.restoreCaret(false);
			updateUndoRedoButtons();
		}
	};

	this.restoreScroll = function()
	{
		component.getById('editor').scrollLeft = scrollX;
		component.getById('editor').scrollTop = scrollY;
	};
	
	//// Future fonctione de formatage pour remplacer la native ////
	
	this.format = function($command, $param)
	{
		var inlineList = ['bold', 'italic', 'underline', 'strike', 'fontSize', 'foreColor', 'fontName', 'createLink', 'insertImage'];
		
		var blockList = ['formatBlock', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];

		/*
		const strongElement = document.createElement("strong");
	    const userSelection = window.getSelection();
    	const selectedTextRange = userSelection.getRangeAt(0);
    	selectedTextRange.surroundContents(strongElement);
		//*/
	};
	
	//// Formatage du bb code ////
	
	var surroundBBCodeWithTag = function($tagStart, $tagEnd)
	{
		var caretPosition = component.getById('bbEditor').getCaret();
		var innerTextLength = 0;
		
		if (component.getById('bbEditor').setSelectionRange)
		{
			component.getById('bbEditor').value = component.getById('bbEditor').value.substring(0, component.getById('bbEditor').selectionStart) 
													+ $tagStart + component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionStart, component.getById('bbEditor').selectionEnd) + $tagEnd 
													+ component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionEnd, component.getById('bbEditor').value.length);
			
			innerTextLength = component.getById('bbEditor').selectionEnd - component.getById('bbEditor').selectionStart;
		}
		else
		{
			var selectedText = document.selection.createRange().text; 
			 
			if (selectedText != "")
			{
				innerTextLength = selectedText.length;
				var newText = $tagStart + selectedText + $tagEnd;
				document.selection.createRange().text = newText;
			}
		}
		
		component.getById('bbEditor').setCaret(caretPosition + $tagStart.length + innerTextLength);
	};
	
	var replaceBBCodeWidth = function($newStr)
	{
		var caretPosition = component.getById('bbEditor').getCaret();
		
		if (component.getById('bbEditor').setSelectionRange)
		{
			component.getById('bbEditor').value = component.getById('bbEditor').value.substring(0, component.getById('bbEditor').selectionStart) 
													+ $newStr
													+ component.getById('bbEditor').value.substring(component.getById('bbEditor').selectionEnd, component.getById('bbEditor').value.length);
		}
		else
		{
			var selectedText = document.selection.createRange().text; 
			 
			if (selectedText != "")
				document.selection.createRange().text = $newStr;
		}
		
		component.getById('bbEditor').setCaret(caretPosition + $newStr.length);
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('undo').onClick = function() { $this.onUndo(); };
	component.getById('undo').onToolTip = KEYWORDS.undo;
	
	component.getById('redo').onClick = function() { $this.onRedo(); };
	component.getById('redo').onToolTip = KEYWORDS.redo;
	
	component.getById('bold').onClick = function()
	{
		if (bold === true && !$this.isThereCodeOrQuoteTag())
		{
			if (mode === 'text')
				surroundBBCodeWithTag('[b]', '[/b]');
			else
				document.execCommand('bold', false, null);
			
			onChange();
		}
	};
	
	component.getById('bold').onToolTip = KEYWORDS.bold;
	
	component.getById('italic').onClick = function()
	{
		if (italic === true && !$this.isThereCodeOrQuoteTag())
		{
			if (mode === 'text')
				surroundBBCodeWithTag('[i]', '[/i]');
			else
				document.execCommand('italic', false, null);
			
			onChange();
		}
	};
	
	component.getById('italic').onToolTip = KEYWORDS.italic;
	
	component.getById('underline').onClick = function()
	{
		if (underline === true && !$this.isThereCodeOrQuoteTag())
		{
			if (mode === 'text')
				surroundBBCodeWithTag('[u]', '[/u]');
			else
				document.execCommand('underline', false, null);
			
			onChange();
		}
	};
	
	component.getById('underline').onToolTip = KEYWORDS.underline;
	
	component.getById('strike').onClick = function()
	{
		if (strike === true && !$this.isThereCodeOrQuoteTag())
		{
			if (mode === 'text')
				surroundBBCodeWithTag('[s]', '[/s]');
			else
				document.execCommand('strikeThrough', false, null);
			
			onChange();
		}
	};
	
	component.getById('strike').onToolTip = KEYWORDS.strike;
	
	var applyFontSize = function($size)
	{
		var sizeList = 
		{
			'0': 20,
			'2': 50,
			'3': 100,
			'5': 150,
			'7': 200
		};
		
		$this.restoreSelection(selection);
		
		if (mode === 'text')
			surroundBBCodeWithTag('[size=' + sizeList[$size] + ']', '[/size]');
		else
		{
			document.execCommand('fontSize', false, $size);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var size = fontList[i].getAttribute('size');
				
				if (utils.isset(size) && size !== '')
				{
					fontList[i].removeAttribute("size");
					fontList[i].style.fontSize = sizeList[$size] + "%";
				}
			}
		}
		
		onChange();
	};
	
	component.getById('font-size').onclick = function()
	{
		if (fontSize === true)
		{
			var sizes =
			[
				{ value: 0, label: '<span style="font-size: 20%" >' + KEYWORDS.verySmall + '</span>' },
				{ value: 2, label: '<span style="font-size: 50%" >' + KEYWORDS.small + '</span>' },
				{ value: 3, label: '<span style="font-size: 100%" >' + KEYWORDS.normal + '</span>' },
				{ value: 5, label: '<span style="font-size: 150%" >' + KEYWORDS.big + '</span>' },
				{ value: 7, label: '<span style="font-size: 200%" >' + KEYWORDS.veryBig + '</span>' }
			];
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popupHTML = '<h2>' + KEYWORDS.fontSize + '</h2>'
								+ '<div id="size-selector-block" >'
								+ '</div>';
				
				var popup = new ConfirmPopup(popupHTML);
				
				var sizeSelector = new RadioList('size-selector', sizes, 3, 1, true);
			
				popup.getById('size-selector-block').appendChild(sizeSelector);
				
				popup.onCancel = function() { $this.restoreSelection(selection); };
				
				popup.onOk = function()
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						var fontSize = sizeSelector.getCurrentValue();
						applyFontSize(fontSize);
					}
					
					return true;
				};
				
				document.getElementById('main').appendChild(popup);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
				{
					var buttonPosition = component.getById('font-size').position();

					var contextMenu = ContextMenu(buttonPosition.x, buttonPosition.y + component.getById('font-size').offsetHeight);
				
					for (var i = 0; i < sizes.length; i++)
					{
						var itemSize = new MenuItem(sizes[i].label);
						itemSize.setAttribute('sizeValue', sizes[i].value);
						itemSize.onAction = function() { applyFontSize(this.getAttribute('sizeValue')); };
						contextMenu.addElement(itemSize);
					}
					
					contextMenu.onCancel = function() { $this.restoreSelection(selection); };
				}
			}
		}
	};
	
	component.getById('font-size').onToolTip = KEYWORDS.fontSize;
	
	var applyTitle = function($headTag)
	{
		$this.restoreSelection(selection);
		
		if (mode === 'text')
			surroundBBCodeWithTag('\n\n[' + $headTag + ']', '[/' + $headTag + ']\n\n');
		else
			document.execCommand('formatBlock', false, $headTag);
		
		onChange();
	};
	
	component.getById('title').onclick = function()
	{
		if (title === true)
		{
			var titles =
			[
				{ value: 'h1', label: '<h1 style="display: inline" >' + KEYWORDS.title + ' 1</h1>' },
				{ value: 'h2', label: '<h2 style="display: inline" >' + KEYWORDS.title + ' 2</h2>' },
				{ value: 'h3', label: '<h3 style="display: inline" >' + KEYWORDS.title + ' 3</h3>' },
				{ value: 'h4', label: '<h4 style="display: inline" >' + KEYWORDS.title + ' 4</h4>' },
				{ value: 'h5', label: '<h5 style="display: inline" >' + KEYWORDS.title + ' 5</h5>' },
				{ value: 'h6', label: '<h6 style="display: inline" >' + KEYWORDS.title + ' 6</h6>' }
			];
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popupHTML = '<h2>' + KEYWORDS.title + '</h2>'
								+ '<div id="title-selector-block" >'
								+ '</div>';
				
				var popup = new ConfirmPopup(popupHTML);
				
				var titleSelector = new RadioList('title-selector', titles, 'h3', 2, true);
			
				popup.getById('title-selector-block').appendChild(titleSelector);
				
				popup.onCancel = function() { $this.restoreSelection(selection); };
				
				popup.onOk = function()
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						var headTag = titleSelector.getCurrentValue();
						applyTitle(headTag);
					}
					
					return true;
				};
				
				document.getElementById('main').appendChild(popup);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
				{
					var buttonPosition = component.getById('title').position();

					var contextMenu = new ContextMenu(buttonPosition.x, buttonPosition.y + component.getById('title').offsetHeight);
				
					for (var i = 0; i < titles.length; i++)
					{
						var itemHead = new MenuItem(titles[i].label);
						itemHead.setAttribute('headValue', titles[i].value);
						itemHead.onAction = function() { applyTitle(this.getAttribute('headValue')); };
						contextMenu.addElement(itemHead);
					}
					
					contextMenu.onCancel = function() { $this.restoreSelection(selection); };
				}
			}
		}
	};
	
	component.getById('title').onToolTip = KEYWORDS.title;
	
	var applyColor = function($color)
	{
		$this.restoreSelection(selection);
		
		if (mode === 'text')
			surroundBBCodeWithTag('[color=#'+ $color + ']', '[/color]');
		else
		{
			document.execCommand('foreColor', false, $color);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var color = fontList[i].getAttribute('color');
				
				if (utils.isset(color) && color !== '')
				{
					fontList[i].removeAttribute("color");
					fontList[i].style.color = color;
				}
			}
		}
		
		onChange();
	};
	
	component.getById('text-color').onclick = function()
	{
		if (textColor === true)
		{
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (utils.isset(colorsList) && colorsList.length > 0)
			{
				if (Loader.getMode() === 'mobile')
				{
					var popupHTML = '<h2>' + KEYWORDS.selectColor + '</h2>'
							+ '<div id="color-palette-selector-block" >'
							+ '</div>';
				
					var popup = new ConfirmPopup(popupHTML);
					
					var colorPalette = new ColorPalette(colorsList);
					
					popup.getById('color-palette-selector-block').appendChild(colorPalette);
					
					popup.onCancel = function() { $this.restoreSelection(selection); };
					
					popup.onOk = function()
					{
						if (mode === 'text' || !isThereCodeOrQuoteTag)
						{
							var color = colorPalette.getValue();
							
							if (utils.isset(color))
							{
								color = color.replace(/ /gi, '');
								
								if (/^rgb/.test(color))
								{
									var rgb = color.match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
									var color = Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
								}
								else
									color = color.replace('#', '');
								
								applyColor(color);
							}
						}
						
						return true;
					};
					
					document.getElementById('main').appendChild(popup);
				}
				else
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						var buttonPosition = component.getById('text-color').position();

						var contextPalette = new ContextPalette(buttonPosition.x, buttonPosition.y + component.getById('text-color').offsetHeight, colorsList);
						
						contextPalette.onAction = function($color)
						{
							var color = $color.replace(/ /gi, '');
							
							if (/^rgb/.test(color))
							{
								var rgb = color.match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
								var color = Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
							}
							else
								color = color.replace('#', '');
							
							applyColor(color);
						};
						
						contextPalette.onCancel = function() { $this.restoreSelection(selection); };
					}
				}
			}
			else
			{
				var colorPopup = new SelectColorPopup(null);
				
				colorPopup.onCancel = function() { $this.restoreSelection(selection); };
				
				colorPopup.onOk = function()
				{
					if (mode === 'text' || !isThereCodeOrQuoteTag)
					{
						var rgb = colorPopup.getRGB();
						applyColor(colorPopup.getHex());
					}
					
					return true;
				};
				
				document.getElementById('main').appendChild(colorPopup);
			}
		}
	};
	
	component.getById('text-color').onToolTip = KEYWORDS.color;
	
	var applyFont = function($fontName)
	{
		$this.restoreSelection(selection);
		
		if (mode === 'text')
			surroundBBCodeWithTag('[font=' + $fontName + ']', '[/font]');
		else
		{
			document.execCommand('fontName', false, $fontName);
			
			var fontList = component.getById('editor').getElementsByTagName('font');
			
			for (var i = 0; i < fontList.length; i++)
			{
				var fontName = fontList[i].getAttribute('face');
				
				if (utils.isset(fontName) && fontName !== '')
				{
					fontList[i].removeAttribute("face");
					fontList[i].style.fontFamily = fontName;
				}
			}
		}
		
		onChange();
	};
	
	component.getById('font').onclick = function()
	{
		if (font === true)
		{
			var fonts = fontList;
			
			if (fonts.length <= 0)
			{
				fonts =
				[
					{ value: 'Arial', label: '<span style="font-family: \'Arial\'" >Arial</span>' },
					{ value: 'Times New Roman', label: '<span style="font-family: \'Times New Roman\'" >Times New Roman</span>' },
					{ value: 'Courier New', label: '<span style="font-family: \'Courier New\'" >Courier New</span>' },
					{ value: 'Géorgie', label: '<span style="font-family: \'Géorgie\'" >Géorgie</span>' },
					{ value: 'Helvetica', label: '<span style="font-family: \'Helvetica\'" >Helvetica</span>' },
					{ value: 'Verdana', label: '<span style="font-family: \'Verdana\'" >Verdana</span>' }
				];
			}
			else
			{
				for (var i = 0; i < fonts.length; i++)
					fonts[i].label = '<span style="font-family: \'' + fonts[i].value + '\'" >' + fonts[i].label + '</span>';
			}
			
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			if (Loader.getMode() === 'mobile')
			{
				var popupHTML = '<h2>' + KEYWORDS.font + '</h2>'
								+ '<div id="font-selector-block" >'
								+ '</div>';
				
				var popup = new ConfirmPopup(popupHTML);
				
				var fontSelector = new RadioList('font-selector', fonts, 'Arial', 2, true);
			
				popup.getById('font-selector-block').appendChild(fontSelector);
				
				popup.onCancel = function() { $this.restoreSelection(selection); };
				
				popup.onOk = function()
				{
					if (!isThereCodeOrQuoteTag)
					{
						var fontName = fontSelector.getCurrentValue();
						applyFont(fontName);
					}
					
					return true;
				};
				
				document.getElementById('main').appendChild(popup);
			}
			else
			{
				if (mode === 'text' || !isThereCodeOrQuoteTag)
				{
					var buttonPosition = component.getById('font').position();

					var contextMenu = new ContextMenu(buttonPosition.x, buttonPosition.y + component.getById('font').offsetHeight);
				
					for (var i = 0; i < fonts.length; i++)
					{
						var itemFont = new MenuItem(fonts[i].label);
						itemFont.setAttribute('fontValue', fonts[i].value);
						itemFont.onAction = function() { applyFont(this.getAttribute('fontValue')); };
						contextMenu.addElement(itemFont);
					}
					
					contextMenu.onCancel = function() { $this.restoreSelection(selection); };
				}
			}
		}
	};
	
	component.getById('font').onToolTip = KEYWORDS.font;
	
	component.getById('quote').onclick = function()
	{
		if (mode === 'text')
		{
			surroundBBCodeWithTag('\n\n[quote]', '[/quote]\n\n');
			onChange();
		}
		else if (quote === true && !$this.isThereCodeOrQuoteTag())
		{
			document.execCommand('formatBlock', false, 'blockquote');
			onChange();
		}
	};
	
	component.getById('quote').onToolTip = KEYWORDS.insertQuote;
	
	var insertCode = function($language)
	{
		$this.restoreSelection(selection);
		
		if (mode === 'text')
		{
			if ($language !== '' && $language !== 'plain-text')
				surroundBBCodeWithTag('\n\n[code=' + $language + ']', '[/code]\n\n');
			else
				surroundBBCodeWithTag('\n\n[code]', '[/code]\n\n');
		}
		else
		{
			document.execCommand('formatBlock', false, 'pre');
			
			var sel = null;
			
			if (window.getSelection)
				sel = window.getSelection();
			else if (document.selection)
				sel = document.selection;
			
			if (utils.isset(sel) && $language !== '' && $language !== 'plain-text')
			{
				var block = window.getSelection().focusNode.parentNode;
				block.setAttribute('class', "language-" + $language);
			}
		}
		
		onChange();
	};
	
	component.getById('code').onclick = function()
	{
		var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
		
		if (code === true && !isThereCodeOrQuoteTag)
		{
			if (languagesList.length > 0)
			{
				var options = [{ value: 'plain-text', label: 'Texte' }];
				
				for (var i = 0; i < languagesList.length; i++)
					options.push(languagesList[i]);
				
				if (Loader.getMode() === 'mobile')
				{
					var popupHTML = '<h2>' + 'Bloc de code' + '</h2>'
									+ '<div id="language-selector-block" >'
									+ '</div>';
					
					var popup = new ConfirmPopup(popupHTML);
					
					//var nbColumns = 1;
					var nbColumns = Math.ceil(Math.sqrt(options.length));
					
					var languageSelector = new RadioList('language-selector', options, 'plain-text', nbColumns);
					
					popup.getById('language-selector-block').appendChild(languageSelector);
					
					popup.onCancel = function() { $this.restoreSelection(selection); };
					
					popup.onOk = function()
					{
						if (!isThereCodeOrQuoteTag)
						{
							var language = languageSelector.getCurrentValue();
							insertCode(language);
						}
						
						return true;
					};
					
					document.getElementById('main').appendChild(popup);
				}
				else
				{
					var buttonPosition = component.getById('code').position();

					var contextMenu = new ContextMenu(buttonPosition.x, buttonPosition.y + component.getById('code').offsetHeight);
			
					for (var i = 0; i < options.length; i++)
					{
						var itemLanguage = new MenuItem(options[i].label);
						itemLanguage.setAttribute('languageValue', options[i].value);
						
						itemLanguage.onAction = function()
						{
							if (!isThereCodeOrQuoteTag)
								insertCode(this.getAttribute('languageValue'));
						};
						
						contextMenu.addElement(itemLanguage);
					}
					
					contextMenu.onCancel = function() { $this.restoreSelection(selection); };
				}
			}
			else
				insertCode('plain-text');
		}
	};
	
	component.getById('code').onToolTip = KEYWORDS.insertCode;
	
	component.getById('align-left').onclick = function()
	{
		if (align === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				surroundBBCodeWithTag('\n\n[left]', '[/left]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('justifyLeft', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('align-left').onToolTip = KEYWORDS.alignLeft;
	
	component.getById('align-center').onclick = function()
	{
		if (align === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				surroundBBCodeWithTag('\n\n[center]', '[/center]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('justifyCenter', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('align-center').onToolTip = KEYWORDS.center;
	
	component.getById('align-right').onclick = function()
	{
		if (align === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				surroundBBCodeWithTag('\n\n[right]', '[/right]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('justifyRight', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('align-right').onToolTip = KEYWORDS.alignRight;
	
	component.getById('align-justify').onclick = function()
	{
		if (align === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				surroundBBCodeWithTag('\n\n[justify]', '[/justify]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('justifyFull', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('align-justify').onToolTip = KEYWORDS.justify;
	
	component.getById('unorder-list').onclick = function()
	{
		if (lists === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				replaceBBCodeWidth('\n\n[list]\n[*]\n[/list]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('insertUnorderedList', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('unorder-list').onToolTip = KEYWORDS.insertList;
	
	component.getById('order-list').onclick = function()
	{
		if (lists === true)
		{
			var apply = false;
			
			if (mode === 'text')
			{
				replaceBBCodeWidth('\n\n[list=1]\n[*]\n[/list]\n\n');
				apply = true;
			}
			else if (!$this.isThereCodeOrQuoteTag())
			{
				document.execCommand('insertOrderedList', false, null);
				apply = true;
			}
			
			if (apply === true)
				onChange();
		}
	};
	
	component.getById('order-list').onToolTip = KEYWORDS.insertOrderedList;
	
	component.getById('table').onclick = function()
	{
		if (tables === true && (!$this.isThereCodeOrQuoteTag() || mode === 'text'))
		{
			$this.saveSelection();
			
			var popupHTML = '<h2>' + KEYWORDS.insertTable + '</h2>'
							+ '<table>'
								+ '<tr>'
									+ '<th><label for="columns" >' + KEYWORDS.columns + '</label></th>'
									+ '<th><label for="rows" >' + KEYWORDS.rows + '</label></th>'
								+ '</tr>'
								+ '<tr>'
									+ '<td>'
										+ '<input id="columns" type="number" value="2" />'
									+ '</td>'
									+ '<td>'
										+ '<input id="rows" type="number" value="2" />'
									+ '</td>'
								+ '</tr>'
							+ '</table>';
			
			var popup = new ConfirmPopup(popupHTML);
			
			popup.onCancel = function() { $this.restoreSelection(selection); };
			
			popup.onOk = function()
			{
				var isOk = true;
				var nbColumns = popup.getById('columns').value;
				var nbRows = popup.getById('rows').value;
				
				if (nbColumns < 1)
				{
					var errorHTML = '<p class="error" >' + KEYWORDS.errorNbColumns + '</p>';
					var errorPopup = new InfoPopup(errorHTML);
					document.getElementById('main').appendChild(errorPopup);
					isOk = false;
				}
				else if (nbRows < 1)
				{
					var errorHTML = '<p class="error" >' + KEYWORDS.errorNbRows + '</p>';
					var errorPopup = new InfoPopup(errorHTML);
					document.getElementById('main').appendChild(errorPopup);
					isOk = false;
				}
				else
				{
					$this.restoreSelection(selection);
					
					if (mode === 'text')
					{
						var str = '\n\n[table]\n';
						
						for (var i = 0; i < nbRows; i++)
						{
							str = str + '[tr]\n';
							
							for (var j = 0; j < nbColumns; j++)
								str = str + '[td][/td]\n';
							
							str = str + '[/tr]\n';
						}
						
						str = str + '[/table]\n\n';
						
						replaceBBCodeWidth(str);
					}
					else
					{
						var newTable = new Table(nbColumns, nbRows);
						
						var sel = null;
						
						if (window.getSelection)
							sel = window.getSelection();
						else if (document.selection)
							sel = document.selection;
			
						if (utils.isset(sel))
						{
							sel.deleteFromDocument();
							sel.getRangeAt(0).insertNode(newTable);
							
							var range = new Range();
							range.setStart(newTable, newTable.childNodes.length);
							
							sel.removeAllRanges();
							sel.addRange(range);
						}
					}
					
					onChange();
				}
				
				return isOk;
			};
			
			document.getElementById('main').appendChild(popup);
			
			popup.getById('columns').focus();
		}
	};
	
	component.getById('table').onToolTip = KEYWORDS.insertTable;
	
	component.getById('url').onclick = function()
	{
		if (links === true && (!$this.isThereCodeOrQuoteTag() || mode === 'text'))
		{
			$this.saveSelection();
			
			var popupHTML = '<h2>' + KEYWORDS.insertLink + '</h2>'
							+ '<p class="insert-url-input" >'
								+ '<input name="url-input" id="url-input" type="text" placeholder="' + KEYWORDS.link + '" />'
							+ '</p>';
			
			var popup = new ConfirmPopup(popupHTML);
			
			popup.onCancel = function() { $this.restoreSelection(selection); };
			
			popup.onOk = function()
			{
				var isOk = true;
				var url = popup.getById('url-input').value;
				
				if (utils.isset(DataFilter.url(url)))
				{
					$this.restoreSelection(selection);
					
					if (mode === 'text')
						surroundBBCodeWithTag('[url=' + url + ']', '[/url]');
					else
						document.execCommand('createLink', false, url);
					
					onChange();
				}
				else
				{
					var errorHTML = '<p class="error" >' + KEYWORDS.errorURL + '</p>';
					var errorPopup = new InfoPopup(errorHTML);
					document.getElementById('main').appendChild(errorPopup);
					isOk = false;
				}
				
				return isOk;
			};
			
			document.getElementById('main').appendChild(popup);
			
			popup.getById('url-input').focus();
		}
	};
	
	component.getById('url').onToolTip = KEYWORDS.insertLink;
	
	var insertImage = function($url)
	{
		$this.restoreSelection(selection);
		
		if (mode === 'text')
			replaceBBCodeWidth('[img]' + $url + '[/img]');
		else
		{
			document.execCommand('insertImage', true, $url);
			
			var imgList = component.getById('editor').getElementsByTagName('img');
			
			//for (var i = 0; i < imgList.length; i++)
				//imgList[i].style.maxWidth = "500px";
		}
		
		onChange();
	};
	
	var openUrlPopup = function()
	{
		//var inputFile = new InputFile('image/*', '', KEYWORDS.selectImgOnHD, 'imgFile-' + $this.getId());
		
		var popupHTML = '<h2>' + KEYWORDS.insertImg + '</h2>'
						+ '<p id="inputs" class="select-img-inputs" >'
							+ '<input name="url-input" id="url-input" type="text" placeholder="url" />'
						+ '</p>';
		
		var popup = new ConfirmPopup(popupHTML);
		
		popup.onOk = function()
		{
			var isOk = false;
			
			var url = popup.getById('url-input').value;
			
			if (utils.isset(DataFilter.url(url)))
				isOk = true;

			if (isOk === true)
			{
				$this.restoreSelection(selection);
				
				if (!$this.isThereCodeOrQuoteTag())
					insertImage(url);
			}
			else
			{
				var errorHTML = '<p class="error" >' + KEYWORDS.errorURL + '</p>';
				var errorPopup = new InfoPopup(errorHTML);
				document.getElementById('main').appendChild(errorPopup);
			}
			
			return isOk;
		};
		
		document.getElementById('main').appendChild(popup);
		
		popup.getById('url-input').focus();
	};
	
	var initImagesLibrary = function()
	{
		var imagesLibrary = new ImagesManager();
		
		imagesLibrary.setParams(imagesLibraryConfig.params);
		
		imagesLibrary.setDisplayFreezeScreen(imagesLibraryConfig.displayFreezeScreen);
		imagesLibrary.setHideFreezeScreen(imagesLibraryConfig.hideFreezeScreen);
		
		imagesLibrary.setGetImagesListRequest(imagesLibraryConfig.getImagesListRequest);
		imagesLibrary.setUploadImageRequest(imagesLibraryConfig.uploadImageRequest);
		imagesLibrary.setEditImageRequest(imagesLibraryConfig.editImageRequest);
		imagesLibrary.setDeleteImageRequest(imagesLibraryConfig.deleteImageRequest);
		
		imagesLibrary.onError = imagesLibraryConfig.onError;
		
		imagesLibrary.onCancel = function() { $this.restoreSelection(selection); };
		
		imagesLibrary.onOk = function()
		{
			var url = imagesLibrary.getSelectedUrl();
			
			$this.restoreSelection(selection);
			
			if (utils.isset(url) && !$this.isThereCodeOrQuoteTag())
				insertImage(url);
			
			return true;
		};
		
		imagesLibrary.getImagesList();
		
		return imagesLibrary;
	};
	
	var openImagesLibrary = function()
	{
		var imagesLibrary = initImagesLibrary();
		document.getElementById('main').appendChild(imagesLibrary);
	};
	
	component.getById('img').onclick = function()
	{
		if (images === true)
		{
			var countOptions = 0;
			
			if (imagesUploadModes.url === true)
				countOptions++;
			
			if (imagesUploadModes.inlineData === true)
				countOptions++;
			
			if (imagesUploadModes.hosted === true)
				countOptions++;
			
			if (countOptions > 0)
			{
				$this.saveSelection();
				
				if (countOptions === 1)
				{
					if (imagesUploadModes.url === true)
						openUrlPopup();
					else if (imagesUploadModes.hosted === true)
						openImagesLibrary();
				}
			}
		}
	};
	
	component.getById('img').onToolTip = KEYWORDS.insertImage;
	
	component.getById('remove-format').onclick = function()
	{
		document.execCommand('removeFormat', false, null);
		document.execCommand('formatBlock', false, 'div');
		onChange();
	};
	
	component.getById('remove-format').onToolTip = KEYWORDS.removeStyle;

	component.getById('editor').onscroll = function($event)
	{
		scrollX = component.getById('editor').scrollLeft;
		scrollY = component.getById('editor').scrollTop;
	};
	
	component.getById('editor').onDragEnter = function($event) { component.getById('editor').style.backgroundColor = 'rgb(245, 245, 245)'; };
	component.getById('editor').onDragLeave = function($event) { component.getById('editor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	component.getById('editor').onDragEnd = function($event) { component.getById('editor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	
	component.getById('editor').onDragOver = function($event)
	{
		//console.log('DRAG OVER');
	};
	
	component.getById('editor').onDrop = function($event)
	{
		console.log('ON DROP');
		console.log($event);
		
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			//$this.saveSelection();
			var isThereCodeOrQuoteTag = $this.isThereCodeOrQuoteTag();
			
			var imagesLibrary = initImagesLibrary();
			
			imagesLibrary.onImagesUpload = function($urls)
			{
				if (!isThereCodeOrQuoteTag && utils.isset($urls) && Array.isArray($urls))
				{
					for (var i = 0; i < $urls.length; i++)
					{
						$this.restoreSelection(selection);
						document.execCommand('insertImage', true, $urls[i]);
						scrollY = component.getById('editor').scrollTop;
						
						var imgList = component.getById('editor').getElementsByTagName('img');
						
						//for (var i = 0; i < imgList.length; i++)
							//imgList[i].style.maxWidth = "500px";
					}
					
					onChange();
				}
			};
			
			imagesLibrary.onDropFiles($event);
		}
	};
	
	component.getById('bbEditor').onDragEnter = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(245, 245, 245)'; };
	component.getById('bbEditor').onDragLeave = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	component.getById('bbEditor').onDragEnd = function($event) { component.getById('bbEditor').style.backgroundColor = 'rgb(255, 255, 255)'; };
	
	component.getById('bbEditor').onDragOver = function($event)
	{
		//console.log('DRAG OVER');
	};
	
	component.getById('bbEditor').onDrop = function($event)
	{
		console.log('ON DROP');
		console.log($event);
		
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			//$this.saveSelection();
			var imagesLibrary = initImagesLibrary();
			
			imagesLibrary.onImagesUpload = function($urls)
			{
				if (utils.isset($urls) && Array.isArray($urls))
				{
					var str = '';
					
					for (var i = 0; i < $urls.length; i++)
					{
						$this.restoreSelection(selection);
						str = str + '[img]' + $urls[i] + '[/img]';
					}
					
					replaceBBCodeWidth(str);
					
					onChange();
				}
			};
			
			imagesLibrary.onDropFiles($event);
		}
	};
	
	this.onFocus = function() {};
	
	component.getById('editor').addEvent('focus', function()
	{
		scrollY = component.getById('editor').scrollTop;
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.onFocus();
	});
	
	component.getById('bbEditor').addEvent('focus', function()
	{
		scrollY = component.getById('editor').scrollTop;
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.onFocus();
	});
	
	this.onBlur = function() {};
	
	component.getById('editor').addEvent('blur', function()
	{
		scrollY = component.getById('editor').scrollTop;
		$this.onBlur();
	});
	
	var onChange = function()
	{
		scrollY = component.getById('editor').scrollTop;
		$this.emptyHistoryFrom(historyIndex);
		$this.addToHistory();
		$this.updateCode();
		$this.makeImagesDraggable();
		$this.onChange();
	};
	
	this.onChange = function() {};
	
	var onEditorChange = function($event)
	{
		scrollY = component.getById('editor').scrollTop;

		var shortcutModifier = Events.keyPressTable['ctrl'];
		
		if (/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", "")))
			shortcutModifier = $event.metaKey;
		
		if (shortcutModifier !== true)
		{
			var keys = [16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 91, 93,
						112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130];
			
			var arrowKeys = [37, 38, 39, 40];
			
			if (keys.indexOf($event.keyCode) < 0)
			{
				if ($event.keyCode === 9 && $event.type === 'keydown')
				{
					Events.preventDefault($event);
					document.execCommand('insertHTML', true, '	');
				}
				
				changeDate = new Date();
				
				changeTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-changeDate.getTime() >= 500)
					{
						onChange();
					}
					
				}, 500);
			}
			else if (arrowKeys.indexOf($event.keyCode) >= 0)
			{
				arrowDate = new Date();
				
				arrowTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-arrowDate.getTime() >= 500)
						$this.updateCursorInHistory(historyIndex);
					
				}, 500);
			}
		}
	};
	
	component.getById('editor').addEvent('keydown', onEditorChange);
	component.getById('editor').addEvent('keyup', onEditorChange);
	
	component.getById('editor').onClick = function()
	{
		scrollY = component.getById('editor').scrollTop;
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.updateCursorInHistory(historyIndex);
	};
	
	component.getById('bbEditor').addEvent('keydown', onEditorChange);
	component.getById('bbEditor').addEvent('keyup', onEditorChange);
	
	component.getById('bbEditor').onClick = function()
	{
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
	};
	
	this.onKeyDown = function($event)
	{
		var shortcutModifier = Events.keyPressTable['ctrl'];
		
		if (/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", "")))
			shortcutModifier = $event.metaKey;
	
		if (shortcutModifier === true)
		{
			var keylist = [66, 73, 80, 83, 87, 89, 90];
			
			if (keylist.indexOf($event.keyCode) >= 0)
			{
				Events.preventDefault($event);
				Events.stopPropagation($event);
			}
			
			// Pomme + B
			if ($event.keyCode === 66)
			{
				if (bold === true)
				{
					var applyStyle = false;
					
					if (mode === 'text')
					{
						surroundBBCodeWithTag('[b]', '[/b]');
						applyStyle = true;
					}
					else if (!$this.isThereCodeOrQuoteTag())
					{
						document.execCommand('bold', false, null);
						applyStyle = true;
					}
					
					onChange();
				}
			}
			// Pomme + I
			else if ($event.keyCode === 73)
			{
				if (italic === true)
				{
					var applyStyle = false;
					
					if (mode === 'text')
					{
						surroundBBCodeWithTag('[i]', '[/i]');
						applyStyle = true;
					}
					else if (!$this.isThereCodeOrQuoteTag())
					{
						document.execCommand('italic', false, null);
						applyStyle = true;
					}
					
					onChange();
				}
			}
			// Pomme + U
			else if ($event.keyCode === 85)
			{
				if (underline === true)
				{
					var applyStyle = false;
					
					if (mode === 'text')
					{
						surroundBBCodeWithTag('[u]', '[/u]');
						applyStyle = true;
					}
					else if (!$this.isThereCodeOrQuoteTag())
					{
						document.execCommand('underline', false, null);
						applyStyle = true;
					}
					
					onChange();
				}
			}
		}
		// Gérer les sauts de ligne
		else if ($event.keyCode === 13)
		{
			if (Events.keyPressTable['shift'] === true)
			{
				/*
				if (mode === 'text')
				{
					Events.preventDefault($event);
					replaceBBCodeWidth('\n');
				}
				else
				//*/
				{
					Events.preventDefault($event);
					document.execCommand('insertText', true, '[br]' + detectCaretStr);
					var htmlCode = component.getById('editor').innerHTML + "";
					component.getById('editor').innerHTML = htmlCode.replace('[br]', '<br />');
					$this.restoreCaret(false);
				}
				
				
			}
			/*
			else
			{
				if (mode === 'text')
				{
					Events.preventDefault($event);
					replaceBBCodeWidth('\n');
				}
			}
			//*/
			
			onChange();
		}
	};
	
	this.onUndo = function($event)
	{
		console.log("Annuler");
		$this.undo();
		$this.updateCode();
		scrollY = component.getById('editor').scrollTop;
		$this.onChange();
	};
	
	this.onRedo = function($event)
	{
		console.log("Rétablir");
		$this.redo();
		$this.updateCode();
		scrollY = component.getById('editor').scrollTop;
		$this.onChange();
	};
	
	var onPaste = function($event)
	{
		scrollY = component.getById('editor').scrollTop;
		// Récupération du contenu à coller
		
		var clipboardData = $event.clipboardData || window.clipboardData;
		var dataToPaste = clipboardData.getData('text/html');
		
		// Si le contenu HTML n'existe pas, récupérer le contenu texte pur et l'encadrer dans une balise de paragraphe
		
		if (!utils.isset(dataToPaste) || dataToPaste === '')
		{
			//var textPlain = clipboardData.getData('text/plain').replace(/</g, '&amp;#60;').replace(/>/g, '&amp;#62;');
			var textPlain = dataManager.encodeHTMLEntities(clipboardData.getData('text/plain')).replace(/&/g, '&amp;');
			//console.log("Texte pur : " + textPlain);
			dataToPaste = '<p>' + textPlain + '</p>';
		}
		else
		{
			console.log("HTML : " + dataToPaste);
			dataToPaste = dataToPaste.replace(/<br ?\/?>/ig, '[br]')
			console.log("HTML : " + dataToPaste);
		}
		
		// Purge des styles du contenu
		
		var nodeToFilter = document.createElement('div');
		nodeToFilter.innerHTML = dataToPaste.replace('<!DOCTYPE html>', '').replace('\n', '<br />').replace('[br]', '<br />');
		//htmlContentToPaste  = Format.parseHtmlNode(nodeToFilter, $this.getConfig());
		htmlContentToPaste  = Format.purgeNodeStyle(nodeToFilter, $this.getConfig());
		
		// Retrait d'ancres et de balises en trop
		
		if (utils.isset(htmlContentToPaste.firstChild) && utils.isset(htmlContentToPaste.firstChild.getAttribute) && htmlContentToPaste.firstChild.getAttribute('class') === "anchor")
			htmlContentToPaste.removeChild(htmlContentToPaste.firstChild);
		
		if (htmlContentToPaste.childNodes.length <= 1 && utils.isset(htmlContentToPaste.firstChild) && htmlContentToPaste.firstChild.nodeType !== Node.TEXT_NODE)
		{
			if (utils.isset(htmlContentToPaste.firstChild.firstChild) && htmlContentToPaste.firstChild.firstChild.getAttribute('class') === "anchor")
				htmlContentToPaste.firstChild.removeChild(htmlContentToPaste.firstChild.firstChild);
			
			htmlContentToPaste.innerHTML = htmlContentToPaste.firstChild.innerHTML;
		}
		
		// Convertir le contenu à coller en bbCode
		
		bbCodeToPaste = Format.nodeToBBCode(htmlContentToPaste, $this.getConfig());
		
		// Nettoyage des balises de code
		
		if ($this.isThereCodeOrQuoteTag())
		{
			bbCodeToPaste = bbCodeToPaste.replace(/\[code=([ a-zA-Z0-9]+?)\]/gi, '');
			bbCodeToPaste = bbCodeToPaste.replace(/\[code=([a-zA-Z0-9]+?)&#160;hljs\]/gi, '');
			bbCodeToPaste = bbCodeToPaste.replace(/\[\/code\]/gi, '');
		}
		
		bbCodeToPaste = bbCodeToPaste.replace(/^\n{1,}/, '');
		bbCodeToPaste = bbCodeToPaste.replace(/\n{1,}$/, '');
		
		// Insertion du bb Code
		
		document.execCommand('insertHTML', true, bbCodeToPaste + detectCaretStr);
		
		Events.preventDefault($event);
		
		$this.updateCode();
		
		// Reconversion du bb code en html
		
		component.getById('editor').innerHTML = Format.bbCodeToHTML(bbContent, $this.getConfig());
		
		// Repositionnement du curseur
		
		$this.restoreCaret(true);
		
		onChange();
	};
	
	component.getById('editor').addEventListener('paste', onPaste);
	
	this.onRemove = function()
	{
		if (Events.undo === $this.onUndo)
			Events.undo = doNothing;
		
		if (Events.redo === $this.onRedo)
			Events.redo = doNothing;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getBBContent = function() { return bbContent; };
	this.getHTMLContent = function() { return htmlContent; };
	this.getDefaultColor = function() { return defaultColor; };
	this.getColorsList = function() { return colorsList; };
	this.getLanguagesList = function() { return languagesList; };
	this.getImagesLibraryConfig = function() { return imagesLibraryConfig; };
	this.getMode = function() { return mode; };
	
	// SET
	
	this.setBBContent = function($bbContent)
	{
		bbContent = $bbContent;
		htmlContent = Format.bbCodeToHTML(bbContent, $this.getConfig());
		component.getById('editor').innerHTML = htmlContent;
		component.getById('bbEditor').value = bbContent;
		$this.makeImagesDraggable();
	};
	
	this.setHTMLContent = function($htmlContent)
	{
		htmlContent = $htmlContent;
		$this.updateCode();
		component.getById('editor').innerHTML = htmlContent;
		component.getById('bbEditor').value = bbContent;
		$this.makeImagesDraggable();
	};
	
	this.setBold = function($bold)
	{
		bold = $bold;
		
		if (bold === true)
			component.getById('bold').style.display = 'inline';
		else
			component.getById('bold').style.display = 'none';
	};
	
	this.setItalic = function($italic)
	{
		italic = $italic;
		
		if (italic === true)
			component.getById('italic').style.display = 'inline';
		else
			component.getById('italic').style.display = 'none';
	};
	
	this.setUnderline = function($underline)
	{
		underline = $underline;
		
		if (underline === true)
			component.getById('underline').style.display = 'inline';
		else
			component.getById('underline').style.display = 'none';
	};
	
	this.setStrike = function($strike)
	{
		strike = $strike;
		
		if (strike === true)
			component.getById('strike').style.display = 'inline';
		else
			component.getById('strike').style.display = 'none';
	};
	
	this.setFontSize = function($fontSize)
	{
		fontSize = $fontSize;
		
		if (fontSize === true)
			component.getById('font-size').style.display = 'inline';
		else
			component.getById('font-size').style.display = 'none';
	};
	
	this.setFont = function($font)
	{
		font = $font;
		
		if (font === true)
			component.getById('font').style.display = 'inline';
		else
			component.getById('font').style.display = 'none';
	};
	
	this.setTitle = function($title)
	{
		title = $title;
		
		if (title === true)
			component.getById('title').style.display = 'inline';
		else
			component.getById('title').style.display = 'none';
	};
	
	this.setTextColor = function($textColor)
	{
		textColor = $textColor;
		
		if (textColor === true)
			component.getById('text-color').style.display = 'inline';
		else
			component.getById('text-color').style.display = 'none';
	};
	
	this.setQuote = function($quote)
	{
		quote = $quote;
		
		if (quote === true)
			component.getById('quote').style.display = 'inline';
		else
			component.getById('quote').style.display = 'none';
	};
	
	this.setCode = function($code)
	{
		code = $code;
		
		if (code === true)
			component.getById('code').style.display = 'inline';
		else
			component.getById('code').style.display = 'none';
	};
	
	this.setAlign = function($align)
	{
		align = $align;
		
		if (align === true)
			component.getById('align').style.display = 'inline';
		else
			component.getById('align').style.display = 'none';
	};
	
	this.setLists = function($lists)
	{
		lists = $lists;
		
		if (lists === true)
			component.getById('list').style.display = 'inline';
		else
			component.getById('list').style.display = 'none';
	};
	
	this.setTables = function($tables)
	{
		tables = $tables;
		
		if (tables === true)
			component.getById('table').style.display = 'inline';
		else
			component.getById('table').style.display = 'none';
	};
	
	this.setLinks = function($links)
	{
		links = $links;
		
		if (links === true)
		{
			component.getById('url').style.display = 'inline';
			component.getById('links').style.display = 'inline';
		}
		else
		{
			component.getById('url').style.display = 'none';
			
			if (images === false)
				component.getById('links').style.display = 'none';
		}
	};
	
	this.setImages = function($images)
	{
		images = $images;
		
		if (images === true)
		{
			component.getById('img').style.display = 'inline';
			component.getById('links').style.display = 'inline';
		}
		else
		{
			component.getById('img').style.display = 'none';
			
			if (links === false)
				component.getById('links').style.display = 'none';
		}
	};
	
	this.setAddAnchor = function($addAnchor) { addAnchor = $addAnchor; };
	this.setKeepBR = function($keepBR) { keepBR = $keepBR; };
	
	this.setDefaultColor = function($defaultColor) { defaultColor = $defaultColor; };
	
	this.setColorsList = function($colorsList)
	{
		colorsList = $colorsList;
		
		for (var i = 0; i < colorsList.length; i++)
		{
			if (/^rgb/.test(colorsList[i]))
			{
				colorsList[i] = colorsList[i].replace(/ /gi, '');
				var rgb = colorsList[i].match(/^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/);
				colorsList[i] = '#' + Colors.rgbToHex(rgb[1], rgb[2], rgb[3]);
				console.log(colorsList[i]);
			}
		}
	};
	
	this.setFontsList = function($fontList) { fontList = $fontList; };
	
	this.setLanguagesList = function($languagesList) { languagesList = $languagesList; };
	
	this.setImagesUploadMode = function($mode, $value) { imagesUploadModes[$mode] = $value; };
	this.setImagesUploadModes = function($imagesUploadModes) { imagesUploadModes = $imagesUploadModes; };
	this.setImagesLibraryConfig = function($imagesLibraryConfig) { imagesLibraryConfig = $imagesLibraryConfig; };
	this.setImgSecureURL = function($imgSecureURL) { imgSecureURL = $imgSecureURL; };
	
	this.setMode = function($mode)
	{
		if (mode !== $mode)
		{
			$this.updateCode();
			
			mode = $mode;
			
			if (mode === 'text')
			{
				component.getById('editor').style.display = 'none';
				component.getById('remove-format-block').style.display = 'none';
				component.getById('bbEditor').style.display = 'block';
			}
			else
			{
				component.getById('editor').style.display = 'block';
				component.getById('remove-format-block').style.display = 'inline-block';
				component.getById('bbEditor').style.display = 'none';
			}
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Events.undo = $this.onUndo;
	Events.redo = $this.onRedo;
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("contentEditable");