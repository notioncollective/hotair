

if (documents.length > 0) 
{
	var docRef = activeDocument;    
	
	var activeLayer = docRef.activeLayer;

	numLayers = docRef.artLayers.length; 	
	
	var rows = numLayers;
	
 	var spriteX = docRef.width;
 	var spriteY = docRef.height;	
	
	app.preferences.rulerUnits = Units.PIXELS;
 	docRef.resizeCanvas( spriteX * rows, spriteY, AnchorPosition.TOPLEFT );
 	 	
 	
 	for (i=0;i < numLayers ;i++) 
 	{ 	
		
 		docRef.artLayers[i].visible = true;
 		
  		var movX = spriteX*i;
  		
 		docRef.artLayers[i].translate(movX, 0);
 		
 
 	}

}else
{
msg("Sorry must have more than 1 image open in photoshop to work!");
}
 	
 	
