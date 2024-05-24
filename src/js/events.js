import appMc from './appMc.js';

export const StageDown = (e) =>{			
	appMc.numGlobalClick++;		
	if(appMc.pauseGlobal){
		appMc.pauseGlobal = false;
		try{ gsap.globalTimeline.resume() }catch(e){}	
	}	
	if(appMc.stateGame == 0){
		appMc.stateGame = 1;
		soundCheck();			
	}
	appMc.mouse.isDown = true;
	if(appMc.stateGame==1){			

	}					
}		
export const StageUp = (e) =>{	
	appMc.mouse.isDown = false;	
}
export const soundCheck = ()=>{
	if(!appMc.isGlobalActive){
		appMc.isGlobalActive = true;
		appMc.isGlobalSound = true;
		Howler.mute(!appMc.isGlobalSound);	
	}	
}
