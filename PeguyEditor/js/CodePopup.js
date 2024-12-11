function CodePopup($title, $code)
{
	///////////////
	// Attributs //
	///////////////

	var title = $title;
	var code = $code;

	var popupHTML = '<h2 draggable="true" >' + title + '</h2>'
						+ '<div id="code-block" class="code-block" >'
							+ '<pre id="code-content" >' + code + '</pre>'
						+ '</div>'
						+ '<div id="copyIcon" class="copyIcon" ></div>';
	
	var popup = new Popup(popupHTML);
	
	popup.addClass('code-popup');
	
	var copyIcon = Loader.getSVG('icons', 'copy-paste-icon', 22, 22);
	
	popup.getById('copyIcon').appendChild(copyIcon);
	
	//////////////
	// Méthodes //
	//////////////
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	copyIcon.onClick = function()
	{
		dataManager.toClipboard(popup.getById('code-content').innerHTML.replace(/<br ?\/?>/gi, '\n').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'), 
									function()
									{
										console.log("Le code a bien été copiée dans le presse papier.");
										
										message = '<p style="text-align: left;" >'
													+ "Le code a bien été copiée dans le presse papier." 
												+ '</p>';
										
										notifCenter.push(message, false);
									}, 
									function() { console.log("La copie a échoué."); });
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("codePopup");