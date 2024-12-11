function DesktopItem($label, $icon)
{
    ///////////////
    // Attributs //
    ///////////////
    
    var label = $label;
    var icon = $icon;
    
    var parent = null;
    
    var html = '<li class="desktopItem" >'
                    + '<div id="icon" class="desktopItemIcon" ></div>'
                    + '<div id="label" class="desktopItemLabel" >' + label + '</div>'
                + '</li>';

    var component = new Component(html);
    
    // Drag & drop
    var clicked = false;
    var moved = false;
    
    var dragging = false;
    var startX = 0;
    var startY = 0;
    var offsetX = 0;
    var offsetY = 0;
    
    var ghost = null;
    var virtualItem = null;
    var parentNode = null;
    var offsetIndex = 0;
    var currentIndex = 0;
    
    //////////////
    // Méthodes //
    //////////////
    
    var updateIcon = function()
    {
        component.getById('icon').removeAllChildren();
        
        if (utils.isset(icon))
            component.getById('icon').appendChild(icon);
        
        component.getById('icon').appendChild(new Component('<div class="wall" ></div>'));
    };
    
    ///////////////////////////////////
    // Initialisation des événements //
    ///////////////////////////////////
    
    this.onAction = function($event) {};
    this.onClick = function($event) { $this.onAction($event); };
    
    //// Déclenchement du drag & drop ////
    
    component.onMouseDown = function($event)
    {
        //if (utils.isset(parent) && parent.isEditMode() === true && parent.getElementsList().length > 1)
        if (utils.isset(parent) && parent.isEditMode() === true)
        {
            if (!$event) // Cas IE 
                $event = window.event;
            
            if ($event.preventDefault) 
                $event.preventDefault(); 
            else
                $event.returnValue = false;
            
            if ($event.button === 0)
            {
                dragging = true;
                
                var x = $event.clientX + component.parentNode.scrollLeft;
                var y = $event.clientY + component.parentNode.scrollTop;
                var componentInitPosition = component.position();
                //console.log("Mouse position : " + x + ", " + y);
                //console.log(componentInitPosition);
                var componentInitX = componentInitPosition.x;
                var componentInitY = componentInitPosition.y;
                startX = x;
                startY = y;
                offsetX = startX-componentInitX;
                offsetY = startY-componentInitY;
                
                $this.focus();
            }
        }

        return false;
    };
    
    this.onDrag = function($x, $y) { return null; };
    this.onRelease = function($list, $index) {};
    
    //// Déplacement de l'élément ////
    
    var onMouseMove = function($event)
    {
        /*
        if (dragging === true)
        {
            Events.preventDefault($event);
    
            var mouseX = $event.clientX;
            var mouseY = $event.clientY;
            
            // Création de l'élément fantôme s'il n'existe pas encore
            
            if (!utils.isset(ghost))
            {
                if (utils.isset(parent))
                {
                    mouseX = $event.clientX + parent.getById('listIcons').scrollLeft;
                    mouseY = $event.clientY + parent.getById('listIcons').scrollTop;
                
                    var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
                    
                    if (moveDistance > 10)
                    {
                        ghost = document.createElement('div');
                        ghost.setAttribute('class', 'ghost-dektopItem');
                        //ghost.style.width = component.offsetWidth + "px";
                        component.getById('label').style.display = 'inline-block';
                        ghost.innerHTML = component.innerHTML;
                        ghost.style.width = currentWidth + 'px';
                        
                        document.getElementById('main').appendChild(ghost);
                        
                        offsetIndex = component.index();
                        currentIndex = offsetIndex;
                        parent.getById('listIcons').removeChild(component);
                        
                        virtualItem = document.createElement('li');
                        virtualItem.setAttribute('class', 'virtual-desktopItem');
                        virtualItem.style.width = currentWidth + 'px';
                        //virtualItem.innerHTML = '<div class="virtual-dockItem-border" ></div>';
                        parent.getById('listIcons').insertAt(virtualItem, offsetIndex);
                    }
                }
            }
            
            // Si le fantôme existe
            
            if (utils.isset(ghost))
            {
                var parentPosition = { x: 0, y: 0, width: 0, height: 0 };
                
                if (utils.isset(parent))
                {
                    parentPosition = parent.getById('listIcons').position();
                    parentPosition.width = parent.getById('listIcons').offsetWidth;
                    parentPosition.height = parent.getById('listIcons').offsetHeight;
                    mouseX = $event.clientX + parent.getById('listIcons').scrollLeft;
                    mouseY = $event.clientY + parent.getById('listIcons').scrollTop;
                }
                
                var x = mouseX - offsetX;
                var y = mouseY - offsetY;
                
                var overLayer = $this.onDrag(x, y);
                
                if (x < 0)
                    x = 0;
                else if (x > ghost.parentNode.offsetWidth-ghost.offsetWidth)
                    x = ghost.parentNode.offsetWidth-ghost.offsetWidth;
                
                if (y < 0)
                    y = 0;
                else if (y > ghost.parentNode.offsetHeight-ghost.offsetHeight)
                    y = ghost.parentNode.offsetHeight-ghost.offsetHeight;
        
                ghost.style.left = x + 'px';
                ghost.style.top = y + 'px';
                
                // Si on survole un élément
                
                if (utils.isset(overLayer) && utils.isset(overLayer.getById) && utils.isset(overLayer.getById('label')) && overLayer !== $this)
                {
                    overLayerPosition = overLayer.position();
                    deltaX = x - overLayerPosition.x;
                    deltaY = mouseY - overLayerPosition.y;
                    
                    if (utils.isset(parent))
                        parent.getById('listIcons').insertAfter(virtualItem, overLayer);
                }
                
                // Si on ne survole aucun élément 
                
                else if (utils.isset(parent) && ((utils.isset(overLayer) && overLayer.isClass('listIcons')) || !utils.isset(overLayer)))
                {
                    if (x <= parent.getById('listIcons').position().x+5)
                    {
                        if (parent.getById('listIcons').firstChild)
                            parent.getById('listIcons').insertBefore(virtualItem, parent.getById('listIcons').firstChild);
                        else
                            parent.getById('listIcons').appendChild(virtualItem);
                    }
                    else
                        parent.getById('listIcons').appendChild(virtualItem);
                }
                
                currentIndex = virtualItem.index();
            }
        }
        //*/
    };
    
    this.mouseMove = onMouseMove;
    
    //// Relâcher l'élément ////
    
    var onMouseUp = function($event)
    {
        /*
        if (dragging === true)
        {
            dragging = false;
            
            if (utils.isset(ghost) && utils.isset(ghost.parentNode))
            {
                document.getElementById('main').removeChild(ghost);
                ghost = null;
                moved = false;
            }
            
            if (utils.isset(parent))
            {
                if (utils.isset(virtualItem))
                {
                    Events.preventDefault($event);
            
                    var mousePosition = $this.mousePosition($event);
                    var parentPosition = parent.parentNode.position();
                    var parentHeight = parent.parentNode.offsetHeight;
                    
                    if (utils.isset(virtualItem.parentNode))
                        virtualItem.parentNode.removeChild(virtualItem);
                    
                    $this.onRelease($this, currentIndex);
                    
                    if ((mousePosition.y - parentPosition.y)/parentHeight < 0.5)
                        parent.removeElement($this);
                    
                    parent.reduce();
                }
                
                virtualItem = null;
                parentNode = null;
            }
        }
        //*/
    };
    
    this.mouseUp = onMouseUp;
    
    //// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
    
    this.onKeyUp = function($event)
    {
        if (dragging === true)
        {
            if ($event.keyCode === 27)
            {
                onMouseUp($event);
                console.log("Echappe ! ");
            }
        }
    };
    
    ////////////////
    // Accesseurs //
    ////////////////
    
    // GET
    
    this.getLabel = function() { return label; };
    this.getIcon = function() { return icon; };
    this.getParent = function() { return parent; };
    
    //// Détecter si l'élement est survolé ////
    
    this.getOverLayer = function($x, $y, $movingElement)
    {
        var overLayer = null;
        var isMouseOver = false;
        
        var position = component.position();
        
        if ($x >= position.x && $x <= position.x+component.offsetWidth)
            isMouseOver = true;
        
        if (isMouseOver === true)
            overLayer = $this;
        
        return overLayer;
    };
    
    //// Récupérer la position courante de l'élément ////
    
    this.index = function()
    {
        var i = 0;
        var previousSibling = $this.previousSibling;
        
        while (utils.isset(previousSibling))
        {
            i++;
            previousSibling = previousSibling.previousSibling;
        }
    
        return i;
    };
    
    this.isLast = function()
    {
        var isLast = false;
        
        if (utils.isset(parentBranch))
        {
            if (parent.getTabList()[parent.getTabList().length-1] === $this)
                isLast = true;
            else if (parent.getTabList()[parent.getTabList().length-2] === $this && parent.getTabList()[parent.getTabList().length-1].isDragging() === true)
                isLast = true;
        }
        
        return isLast;
    }
    
    this.isDragging = function() { return dragging; };

    // SET
    
    this.setLabel = function($label)
    {
        label = $label;
        component.getById('label').innerHTML = label;
    };
    
    this.setIcon = function($icon)
    {
        icon = $icon;
        updateIcon();
    };
    
    this.setParent = function($parent) { parent = $parent; };
    
    updateIcon();
    
    //////////////
    // Héritage //
    //////////////
    
    var $this = utils.extend(component, this);
    return $this;
}

if (Loader !== null && Loader !== undefined)
    Loader.hasLoaded("desktopItem");