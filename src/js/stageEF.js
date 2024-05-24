import appMc from './appMc.js';
import AppResize from './appresize.js';

let tmDebug = 0;
const StageEF = () => {
	appObj = window.appObj;
	
	appObj.time_current = performance.now();				
	if(appObj.time_current - appObj.time_old > 16){		
		
		if(!appMc.pauseGlobal){
			appObj.time_old = appObj.time_current;
			// 33 - 30 fps
			// 16 - 60 fps
			
			var i,j,k,d,a;
			let heroPos;
			let objTemp, objTempC;
			var objTempExtra;	


			appMc.mainScreen.mainView.update();	
			appMc.mainLevel.update();	
			appMc.mainLevel.levelView.update();	


		}			
		window.renderer.render(window.stage);
		let objTemp; 
		objTemp = appObj;		
		objTemp.tm_resize++;
		if(objTemp.tm_resize == 10){
			objTemp.tm_resize = 0;
			if(objTemp.mainWidth != Math.ceil(window.innerWidth) || objTemp.mainHeight != Math.ceil(window.innerHeight)){
				AppResize();
			}
		}
	}	
	window.requestAnimationFrame(StageEF);
}
export default StageEF;
