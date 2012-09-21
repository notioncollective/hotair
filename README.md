Hot Air (Node.js project)
==========================

An implementation of Hot Air using Node.js / CouchDB.


DOCUMENTATION
-------------

The js docs are generated using YUIDoc.  First, install the yuidocjs npm package. Then, to generate the js docs for the modules, navigate to the public/js/modules directory and run:

> yuidoc .

The yuidoc.json config file is tracked in that folder, and contains a few settings that can be updated as needed.


TODO (These should be added to Pivotal Tracker)
-----------------------------------------------

 * Integrate frontend to node proj
 * Fonts should be hosted locally
 * Home screen display



NODE MODULES
------------

(*) Denotes compiled node modules

### Used in runtime ###
 * express (3.0.0rc1)
 * jade (0.27.2)
 * cradle (0.6.x)
 * path (0.4.x)
 * twit (0.1.8)
 * lodash (0.6.x)
 * q (0.8.8)
 * cron (1.0.1)
 * time (0.8.3) *
 
### Used only locally (not in package.js) ###
 * yuidoc (0.3.26)

ARCHITECTURE
------------

 * HA
 * HA.game
 * HA.player
 * HA.mediator
 * HA.enemyController
 * HA.sceneManager
 * HA.twitter

### HA ###
 * namespace
 
### HA.game ###
 * highScores
 * player
 * levels
 * mediator
 * enemyController
 * sceneManager
 * twitter

### HA.player ###
 * name
 * teamSelection
 * score
 * lives
 
### HA.mediator ###
 * subscribe
 * publish
 * eventMap
 
### HA.enemyController ###
 * start
 * stop
 * init (bindEvents)
 * event handlers
 
### HA.sceneManager ###
 * loadScene
