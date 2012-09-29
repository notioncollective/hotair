#include "PSD.jsx"
#include "PSD.utils.jsx"
#include "PSD.layersetstofiles.jsx"

function main(argv) {
	if( BridgeTalk.appName === "photoshop" && app.documents.length > 0 ) {	
		var opts = {
			reverse_order: true
		};
		$.level = 1;
		
		if(typeof argv === 'undefined' || argv.length === 'undefined' || argv.length < 1) {
			return "Please make a selection";
		} else {	
			try {
				switch(argv[0]) {
					// frames commend
					case 'frames':
						PSD.layersetstofiles.start(opts);
						break;
					default:
						return "Please make a valid selection";
				}
			} catch(err) {
				return "Error: "+err.message;
			}
		}
	} else {
		return "Photoshop isn't even open, dummy!"
	}
}