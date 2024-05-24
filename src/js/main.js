import * as API	from './innerApi.js';
import appMc from './appMc.js';
import InitBasicObj from './initBasicObj.js';
import moduleTexture from './texture.js';
import AppResize from './appresize.js';
import StageEF from './stageEF.js';

let i,j,k,n;

window.appObj={   
	time_old		: 0,
	time_current	: 0,
	tm_resize		: 0,
	mainWidth		: 0,
	mainHeight		: 0
};

window.AppCanvas = document.createElement("canvas");
window.stage;
window.renderer;
window.gsap = gsap;

Howler.mute(true);

//---------------------------------------------------------------------------------

window.onload = () =>{	
	try{	
		API.fontLoader();	
		LoadTextures();	
	}catch(e){
		API.fontLoader();
		LoadTextures();
	}		
}

const LoadTextures =()=>{
	try{
		var mraidGetMaxSize = mraid.getMaxSize();
	}catch(e){}
	
	moduleTexture.load(CompleteLoadAllMaterials);
}
const CompleteLoadAllMaterials =()=>{
	//- InitPixi
	ProccesingInitPixi();
}
const ProccesingInitPixi=()=>{
	if(PIXI){
		try{
			API.InitPixi();
			setTimeout(ProccesingInitAd, 50);	
		}catch(e){
			setTimeout(ProccesingInitAd, 200);
		}
	}else{
		setTimeout(ProccesingInitAd, 200);
	}
}


const ProccesingInitAd=()=>{	

	InitBasicObj();
	
	//- Focus

	var hidden, state, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
		state = "visibilityState";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
		state = "mozVisibilityState";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
		state = "msVisibilityState";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
		state = "webkitVisibilityState";
	}
					
	window.addEventListener(visibilityChange, API.canvasVisibilityChange, false);
	window.addEventListener('blur', API.WindowOnBlur);
	window.addEventListener('focus', API.WindowOnFocus);	

	InitGame();	
}	

const InitGame=()=>{

	//- Resize
	
	AppResize();
	window.addEventListener('resize', AppResize);
	
	//- EF
	
	StageEF();
			
}
