function Desktop()
{
    ///////////////
    // Attributs //
    ///////////////
    
    var html = '<div class="desktop" >'
                    + '<ul id="listIcons" ></ul>'
                + '</div>';

    var component = new Component(html);
    
    var elementsList = [];
    
    var editMode = false;
    
    //////////////
    // Méthodes //
    //////////////
    
    this.addElement = function($element)
    {
        var index = elementsList.indexOf($element);
        
        if (index < 0)
        {
            elementsList.push($element);
            $element.setParent($this);
        }
        
        component.getById('listIcons').appendChild($element);
        
        //$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
        //$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
    };
    
    this.insertElementInto = function($element, $index)
    {
        var index = elementsList.indexOf($element);
        
        if (index >= 0)
            elementsList.splice(index, 1);
        
        elementsList.splice($index, 0, $element);
        component.getById('listIcons').insertAt($element, $index);
        $element.setParent($this);
        //$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
        //$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
    };
    
    this.removeElement = function($element)
    {
        var index = elementsList.indexOf($element);
        
        if (index >= 0)
            elementsList.splice(index, 1);
        
        if (utils.isset($element.parentNode))
            $element.parentNode.removeChild($element);
    };
    
    this.removeAllElement = function()
    {
        for (var i = 0; i < elementsList.length; i++)
            elementsList[i].onRemoveFromDock();
        
        elementsList = [];
        component.getById('listIcons').removeAllChildren();
    };
    
    this.autoResize = function()
    {
        var width = component.offsetWidth;
        
        if (width > 0)
        {
            // Redimensionnement ou restructuration du DOM
        }
        else
            setTimeout(function() { $this.autoResize(); }, 20);
    };
    
    var onDrag = function($x, $y, $element)
    {
        var overLayer = null;
        
        for (var i = 0; i < elementsList.length; i++)
        {
            if (elementsList[i] !== $element)
            {
                overLayer = elementsList[i].getOverLayer($x, $y, $element);
                
                if (utils.isset(overLayer))
                {
                    i = elementsList.length;
                    //overLayer.dragOver();
                }
            }
        }
        
        if (!utils.isset(overLayer))
            overLayer = $this;
        
        return overLayer;
    };
    
    var onRelease = function($element, $index) { $this.insertElementInto($element, $index); };
    
    ///////////////////////////////////
    // Initialisation des événements //
    ///////////////////////////////////
    
    var onMouseMove = function($event)
    {
        if (editMode === true)
        {
            for (var i = 0; i < elementsList.length; i++)
            {
                if (utils.isset(elementsList[i].mouseMove))
                    elementsList[i].mouseMove($event);
            }
        }
    };
    
    document.getElementById('main').onMouseMove.push(onMouseMove);
    
    var onMouseUp = function($event)
    {
        if (editMode === true)
        {
            for (var i = 0; i < elementsList.length; i++)
            {
                if (utils.isset(elementsList[i].mouseUp))
                    elementsList[i].mouseUp($event);
            }
        }
    };
    
    document.getElementById('main').onMouseUp.push(onMouseUp);
    
    this.onKeyUp = function($event)
    {
        if (editMode === true)
        {
            for (var i = 0; i < elementsList.length; i++)
                elementsList[i].onKeyUp($event);
        }
    };
    
    ////////////////
    // Accesseurs //
    ////////////////
    
    // GET
    
    this.isEditMode = function() { return editMode; };

    // SET
    
    this.setEditMode = function($editMode) { editMode = $editMode; };
    
    //////////////
    // Héritage //
    //////////////
    
    var $this = utils.extend(component, this);
    this.autoResize();
    return $this;
}

if (Loader !== null && Loader !== undefined)
    Loader.hasLoaded("desktop");