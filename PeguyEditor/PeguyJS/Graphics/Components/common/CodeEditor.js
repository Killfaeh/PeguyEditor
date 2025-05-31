function CodeEditor($language)
{
	///////////////
	// Attributs //
	///////////////
	
	// Données
	
	var language = $language;

    if (!utils.isset(language))
        language = "";
	
	var detectCaretStr = "ChaineDeCaracteresAlaConQuePersonneNeTaperaJamaisCode";
	var breakLineStr = '<p style="padding: 0px; margin: 0px; height: 0px;" ></p>\n\r';
	var scrollX = 0;
	var scrollY = 0;
	
	// Eléments affichables
	
	var html = '<pre class="codeEditor" >'
					+ '<code id="editor" class="editor ' + language + '" contenteditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" ></code>'
					+ '<div class="num-lines" ><code id="num-lines" ></code></div>'
				+ '</pre>';

	//var html = '<div class="codeEditor" ><xmp id="editor" class="' + language + '" contenteditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" ></xmp></div>';
		
	var component = new Component(html);
	
	// Données de fonctionnement
	
	var codeContent = "";
	var selection = null;
	var caretPosition = { node: component.getById('editor'), offset: 0 };
	var changeDate = new Date();
	var changeTimer = null;
	var arrowDate = new Date();
	var arrowTimer = null;
	var history = [];
	var historyIndex = 0;

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

		//console.log(selection);
		
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
	
    this.saveCaretPosition = function()
	{
		document.execCommand('insertText', true, detectCaretStr);
		scrollX = component.getById('editor').scrollLeft;
		scrollY = component.getById('editor').scrollTop;
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
			//var bbCaretPosition = bbContent.indexOf(detectCaretStr);
			//bbContent = bbContent.replace(detectCaretStr, '');
			
			var saltPosition = caretNode.textContent.indexOf(detectCaretStr);
			var textContent = caretNode.textContent.replace(detectCaretStr, '');
			//console.log('Restore text content : "' + textContent + '"');
			caretNode.textContent = textContent;
			//console.log('Restored text content : "' + caretNode.textContent + '"');
			
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
						
						var newScrollX = scrollX;
						var newScrollY = scrollY;
						var editorPosition = component.getById('editor').position();
						var spanPosition = span.position();
						
						if (spanPosition.x - editorPosition.x < scrollX)
							newScrollX = spanPosition.x - editorPosition.x - 10;
						else if (spanPosition.x - editorPosition.x > scrollX + component.getById('editor').offsetWidth)
							newScrollX = spanPosition.x - editorPosition.x - component.getById('editor').offsetWidth + 50;

						if (spanPosition.y - editorPosition.y < scrollY)
							newScrollY = spanPosition.y - editorPosition.y - span.offsetHeight;
						else if (spanPosition.y - editorPosition.y > scrollY + component.getById('editor').offsetHeight)
							newScrollY = spanPosition.y - editorPosition.y - component.getById('editor').offsetHeight + 3*span.offsetHeight;
						
						if (utils.isset(component.getById('editor').scrollTo))
							component.getById('editor').scrollTo(newScrollX, newScrollY);
						else
						{
							component.getById('editor').scrollLeft = newScrollX;
							component.getById('editor').scrollTop = newScrollY;
						}
						
						var spanParent = span.parentNode;
						spanParent.removeChild(span);
					}
				}
			}
			
			//console.log('Restored text content : "' + caretNode.textContent + '"');
		}

		$this.updateNumLines();
		$this.updateNumLinesScroll();
	};
	
	this.updateCode = function()
	{
		codeContent = component.getById('editor').innerText;
	};

	this.updateNumLinesScroll = function()
	{
		var scrollTop = component.getById('editor').scrollTop;
		component.getById('num-lines').style.top = (-scrollTop) + 'px';
	};

	this.updateNumLines = function()
	{
		var innerHTML = component.getById('editor').innerHTML;
		var lines = innerHTML.split('\n');
		//console.log(lines.length);
		component.getById('num-lines').empty();

		for (var i = 1; i <= lines.length; i++)
		{
			component.getById('num-lines').appendChild(document.createTextNode(i));
			component.getById('num-lines').appendChild(document.createElement('br'));
		}
	};

    this.highlight = function()
    {
        if (utils.isset(hljs) && ((!utils.isset(selection)) || (selection.startOffset === selection.endOffset && selection.startContainer === selection.endContainer)))
        {
			if (language !== 'plaintext' && language !== 'xml' && language !== 'html')
			{
				component.getById('editor').setAttribute('class', 'editor ' + language);
				$this.saveCaretPosition();
				//component.getById('editor').appendChild(document.createTextNode('\n'));
				component.getById('editor').removeAttribute('data-highlighted');
				hljs.highlightElement(component.getById('editor'));

				var lastNode = component.getById('editor').lastChild;

				if (utils.isset(lastNode) && lastNode.nodeType !== Node.TEXT_NODE)
					lastNode.appendChild(document.createTextNode('\n'));

				$this.restoreCaret(true);				
			}
			else
			{
				$this.updateNumLines();
				$this.updateNumLinesScroll();
			}
        }
    };
	
	//// Gestion de l'historique ////
	
	var updateUndoRedoButtons = function()
	{
        /*
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
        //*/
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
	
	this.cloneCodeForHistory = function()
	{
		var cloneCode = "";
		
		if (component.getById('editor').setSelectionRange)
		{
			cloneCode = component.getById('editor').value.substring(0, component.getById('editor').selectionStart)
							+ component.getById('editor').value.substring(component.getById('editor').selectionStart, component.getById('editor').selectionEnd)
							+ detectCaretStr + component.getById('editor').value.substring(component.getById('editor').selectionEnd, component.getById('editor').value.length);
		}
		else
		{
			var range = document.selection.createRange();
			
			cloneCode = component.getById('editor').value.substring(0, range.startOffset)
							+ range.text 
							+ detectCaretStr + component.getById('editor').value.substring(range.endOffset, component.getById('editor').value.length);
		}

        console.log(cloneCode);
		
		return cloneCode;
	};
	
	this.addToHistory = function()
	{
		console.log("ADD TO HISTORY");
		
		var cloneCode = codeContent;

		if (window.getSelection)
			currentCaretNode = window.getSelection();
		else if (document.selection)
			currentCaretNode = document.selection;
		
		var clone = $this.cloneForHistory(component.getById('editor'));
		
        cloneCode = clone.innerText;
		
		if (cloneCode !== history[history.length-1])
			history.push(cloneCode);
		
		historyIndex = history.length-1;
		updateUndoRedoButtons();
	};
	
	this.updateCursorInHistory = function($index)
	{
		var cloneCode = codeContent;

		if (window.getSelection)
			currentCaretNode = window.getSelection();
		else if (document.selection)
			currentCaretNode = document.selection;
		
		var clone = $this.cloneForHistory(component.getById('editor'));

        cloneCode = clone.innerText;

		history[$index] = cloneCode;
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
		history.push(codeContent);
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
			
			codeContent = history[historyIndex];
			component.getById('editor').innerHTML = history[historyIndex];
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
			codeContent = history[historyIndex];
			component.getById('editor').innerHTML = history[historyIndex];
			$this.restoreCaret(false);
			updateUndoRedoButtons();
		}
	};

	this.refresh = function() { onChange(); };

	this.insertCode = function($code)
	{
		if (utils.isset(selection))
		{
			$this.restoreSelection(selection);
			document.execCommand('insertHTML', true, $code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') + detectCaretStr);	
			scrollY = component.getById('editor').scrollTop;	
			$this.updateCode();
			$this.restoreCaret(true);
		}
		else
		{
			var block = document.createElement('span');
			block.innerHTML = $code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
			component.getById('editor').appendChild(block);
			scrollY = component.getById('editor').scrollTop;
		}

		$this.highlight();
		onChange();
	};

	this.restoreScroll = function()
	{
		component.getById('editor').scrollLeft = scrollX;
		component.getById('editor').scrollTop = scrollY;
	};
	
	//// Future fonction de formatage pour remplacer la native ////
	
	this.format = function($command, $param)
	{
        /*
		var inlineList = ['bold', 'italic', 'underline', 'strike', 'fontSize', 'foreColor', 'fontName', 'createLink', 'insertImage'];
		
		var blockList = ['formatBlock', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
        //*/
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	//component.getById('undo').onClick = function() { $this.onUndo(); };
	//component.getById('undo').onToolTip = KEYWORDS.undo;
	
	//component.getById('redo').onClick = function() { $this.onRedo(); };
	//component.getById('redo').onToolTip = KEYWORDS.redo;
	
	this.onFocus = function() {};
	
	component.getById('editor').onscroll = function($event)
	{
		$this.updateNumLinesScroll();
		scrollX = component.getById('editor').scrollLeft;
		scrollY = component.getById('editor').scrollTop;
	};

	component.getById('editor').addEvent('focus', function()
	{
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.saveSelection();
		$this.onFocus();
	});
	
	this.onBlur = function() {};
	
	component.getById('editor').addEvent('blur', function() { $this.onBlur(); });
	
	var onChange = function()
	{
		$this.emptyHistoryFrom(historyIndex);
		$this.addToHistory();
		$this.updateCode();
        $this.highlight();
		$this.saveSelection();
		$this.onChange(codeContent);
	};
	
	this.onChange = function($codeContent) {};
	
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
                if ($event.type === 'keydown')
                {
                    if ($event.keyCode === 9)
                    {
                        Events.preventDefault($event);
                        document.execCommand('insertHTML', true, '	');
                    }
					/*
                    else if ($event.keyCode === 13)
                    {
                        console.log("Saut de ligne...");
                        Events.preventDefault($event);
			            //document.execCommand('insertHTML', true, '<p style="padding: 0px; margin: 0px; height: 0px;" ></p>\n\r');
			            document.execCommand('insertHTML', true, '<br/>');
                        //$this.highlight();
                    }
					//*/
                }

				changeDate = new Date();
				
				changeTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-changeDate.getTime() >= 1000)
					{
						onChange();
					}
					
				}, 1000);
			}
            /*
			else if (arrowKeys.indexOf($event.keyCode) >= 0)
			{
				arrowDate = new Date();
				
				arrowTimer = setTimeout(function()
				{
					var currentDate = new Date();
	
					if (currentDate.getTime()-arrowDate.getTime() >= 1000)
						$this.updateCursorInHistory(historyIndex);
					
				}, 1000);
			}
            //*/
		}
	};
	
	component.getById('editor').addEvent('keydown', onEditorChange);
	component.getById('editor').addEvent('keyup', onEditorChange);
	
	component.getById('editor').onClick = function()
	{
		Events.undo = $this.onUndo;
		Events.redo = $this.onRedo;
		$this.updateCursorInHistory(historyIndex);
		$this.saveSelection();
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

            // C'était du formatage de texte pour le contentEditable

		}
        else if ($event.keyCode === 13)
		{
            Events.preventDefault($event);
			//document.execCommand('insertText', true, '\n\r' + detectCaretStr);
        }
	};
	
	this.onUndo = function($event)
	{
		console.log("Annuler");
		$this.undo();
		$this.updateCode();
		$this.saveSelection();
		$this.onChange();
	};
	
	this.onRedo = function($event)
	{
		console.log("Rétablir");
		$this.redo();
		$this.updateCode();
		$this.saveSelection();
		$this.onChange();
	};
	
	var onPaste = function($event)
	{
		scrollY = component.getById('editor').scrollTop;

		// Récupération du contenu à coller
		
		var clipboardData = $event.clipboardData || window.clipboardData;
		var dataToPaste = clipboardData.getData('text/html');
		
		// Si le contenu HTML n'existe pas, récupérer le contenu texte pur
		
		if (!utils.isset(dataToPaste) || dataToPaste === '')
		{
			var textPlain = dataManager.encodeHTMLEntities(clipboardData.getData('text/plain')).replace(/&/g, '&');
			//console.log("Texte pur : " + textPlain);
			dataToPaste = textPlain;
		}
		else
		{
			//console.log("HTML : " + dataToPaste);
		}
		
		// Purge des styles du contenu
		
		var nodeToFilter = document.createElement('div');
        nodeToFilter.innerHTML = dataToPaste.replace('<!DOCTYPE html>', '');
		
		// Insertion du code
		
        var codeToInsert = nodeToFilter.innerText;

		document.execCommand('insertHTML', true, codeToInsert + detectCaretStr);
		scrollY = component.getById('editor').scrollTop;
		
		Events.preventDefault($event);
		
		$this.updateCode();

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
	this.getCode = function() { return codeContent; };
    this.getLanguage = function() { return language; };
	
	// SET
	
	this.setCode = function($code)
	{
		codeContent = $code;
		component.getById('editor').innerHTML = codeContent.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
		$this.highlight();
	};

    this.setLanguage = function($language)
    {
        var language = $language;

        if (!utils.isset(language))
            language = "";

        component.getById('editor').setAttribute('class', 'editor ' + language);
        $this.highlight();
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
	Loader.hasLoaded("codeEditor");

