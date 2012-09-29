#include "PSD.jsx"
#include "PSD.utils.jsx"
#include "PSD.layersetstofiles.jsx"

function main(argv)
	if( BridgeTalk.appName === "photoshop" && app.documents.length > 0 ) {	
		var opts = {
			reverse_order: true
		};
		$.level = 1;
		
		try {
			switch(argv[0]) {
				// frames commend
				case 'frames':
					PSD.layersetstofiles.start(opts);
					break;
				default:
					return "Please make a selection";
			}
		} catch(err) {
			return "Error: "+err.message;
		}
	} else {
		return "Photoshop isn't even open, dummy!"
	}
}