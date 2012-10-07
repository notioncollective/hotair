Hot Air (Node.js project)
==========================

An implementation of Hot Air using Node.js / CouchDB.


Documentation
-------------

The js docs are generated using YUIDoc.  First, install the yuidocjs npm package. Then, to generate the js docs for the modules, navigate to the public/js/modules directory and run:

> yuidoc .

The yuidoc.json config file is tracked in that folder, and contains a few settings that can be updated as needed.


Node modules
------------

(*) Denotes compiled node modules

### Used in runtime ###
 - express (3.0.0rc1)
 - jade (0.27.2)
 - nono (3.3.2)
 - path (0.4.x)
 - twit (0.1.8)
 - lodash (0.6.x)
 - q (0.8.8)
 - cron (1.0.1)
 - time (0.8.3) *
 
### Used only locally (not in package.js) ###
 - yuidoc (0.3.26)
 - grunt

Architecture
------------

 - HA
 - HA.game
 - HA.player
 - HA.mediator
 - HA.enemyController
 - HA.sceneManager
 - HA.twitter

### HA ###
 - namespace
 
### HA.game ###
 - highScores
 - player
 - levels
 - mediator
 - enemyController
 - sceneManager
 - twitter

### HA.player ###
 - name
 - teamSelection
 - score
 - lives
 
### HA.mediator ###
 - subscribe
 - publish
 - eventMap
 
### HA.enemyController ###
 - start
 - stop
 - init (bindEvents)
 - event handlers
 
### HA.sceneManager ###
 - loadScene
 
Build
-----
 
Eventually we should set up a grunt build system for pre-deployment.
 
A brief outline of what this would (ideally) include -- items with (*) are higher-priority:
 
 - Minify js and concatenate into a single file *
 - Minify css
 - Export PSD project files as .PNG images, then combine into sprite sheet(s) *
 - Automatically export sprites.js during sprite sheet creation
 - Upload static files to a CDN
 - Generate documentation using yuidoc

### Sprite build process overview ###

#### PSD Files

The PSD files should be organized in a logical structure, so that related sprites can be grouped together. A basic structure would be:
	
	imgsrc/
	  |
	  +- master_sprite/
	      |
	      +- simple_sprite_componant.psd
	      +- complex_sprite_component/
	      |    |
	      |    +- complex_sprite_component1.psd
	      |    +- complex_sprite_component2.psd
	      |    +- complex_sprite_component3.psd
	      |
	      +- another_simple_sprite_component.psd
	      :
	      
	      [etc..]
	        
	
#### PSD Export

When processed, the PSD directory tree will be mapped to the build folder, probably in build/sprite-frames or something similar.

In this structure the only difference is that each PSD is replace by a folder of consecutively number PNG frames of the same name (i.e. balloon.psd --> balloon/)

	imgsrc/
	  |
	  +- master_sprite/
	      |
	      +- simple_sprite_componant/
	      |    |
	      |    +- simple_sprite_componant_0001.png
	      |    +- simple_sprite_componant_0002.png
	      |    +- simple_sprite_componant_0003.png
	      |    :
	      |    [etc..]
	      |
	      +- complex_sprite_component/
	      |    |
	      |    +- complex_sprite_component1/
	      |    |    |
	      |    |    +- complex_sprite_component1_0001.png
	      |    |    +- complex_sprite_component1_0002.png
	      |    |    +- complex_sprite_component1_0003.png
	      |    |    :
	      |    |    [etc..]	
	      |    |
	      :    : 
	      
	      [etc..]
	        
#### Sprite Mapping

Once the frames are all created, they will need to be combined into a spritesheet that can be used by Crafty.js. Right now the best approach to this seems to be modifying the node-spritesheet package (https://github.com/richardbutler/node-spritesheet).


#### Export Settings

To avoid confusion when sprites are added/removed, or if they are resized, ideally the image build would also export a Crafy.sprite definition that would fill in the necessary values. It may be necessary to modify the Crafty sprite component so that it is able to better manage different sprite sizes/locations in one sheet (will need to investigate this).

