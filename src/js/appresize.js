import appMc from './appMc.js';

const AppResize = (e) =>{
	let appObj = window.appObj;
	let mainView = appMc.mainScreen.mainView.mainObj;
	appObj.mainWidth		= Math.ceil(window.innerWidth);
	appObj.mainHeight		= Math.ceil(window.innerHeight); 
	appObj.canvasWidth		= Math.ceil(1.5*window.innerWidth);
	appObj.canvasHeight		= Math.ceil(1.5*window.innerHeight); 
	
	window.renderer.view.style.width	= appObj.mainWidth+"px";
	window.renderer.view.style.height	= appObj.mainHeight+"px";							
	window.renderer.view.width			= appObj.canvasWidth;
	window.renderer.view.height		= appObj.canvasHeight;
	
	window.renderer.resize(appObj.canvasWidth, appObj.canvasHeight);	
	window.stage.position.set(Math.ceil(appObj.canvasWidth*0.5), Math.ceil(appObj.canvasHeight*0.5));
		
						
	//- POSITION OBJ
	
	mainView.gameContainer.scale.set(1, 1);	
	mainView.mainUI.scale.set(1, 1);
	
	if(appObj.mainWidth<appObj.mainHeight){	
		
		mainView.gameContainer.scale.x = appObj.canvasWidth/1280;
		mainView.gameContainer.scale.y = mainView.gameContainer.scale.x;
		if(mainView.gameContainer.scale.y*1280 < appObj.canvasHeight){
			mainView.gameContainer.scale.y = appObj.canvasHeight/1280;
			mainView.gameContainer.scale.x = mainView.gameContainer.scale.y;
		}
		
		mainView.mainUI.scale.x = appObj.canvasWidth/720;
		mainView.mainUI.scale.y = mainView.mainUI.scale.x;
		if(mainView.mainUI.scale.y*1280 > appObj.canvasHeight){
			mainView.mainUI.scale.y = appObj.canvasHeight/1280;
			mainView.mainUI.scale.x = mainView.mainUI.scale.y;
		}

		mainView.mainUIOverlay.scale.x = 0.1 + appObj.canvasWidth/1280/mainView.mainUI.scale.x;
		mainView.mainUIOverlay.scale.y = 0.1 + appObj.canvasHeight/1280/mainView.mainUI.scale.x;

		mainView.soundBtn.x = -80+appObj.canvasWidth*0.5/mainView.mainUI.scale.y;
		mainView.soundBtn.y = 60-appObj.canvasHeight*0.5/mainView.mainUI.scale.y;

		mainView.logo.y = 170-appObj.canvasHeight*0.5/mainView.mainUI.scale.y;
		mainView.logo.x = 0;
		mainView.logo.scale.set(0.8);

		mainView.map.x = 0;
		mainView.map.y = 50;

		mainView.startText.x = -mainView.startText.width*.5;
		mainView.startText.y = -200;

		mainView.Timer.x = -mainView.Timer.width*.5;
		mainView.Timer.y = -250;

		mainView.playBtn.y = 400;

		mainView.gameField.y = 100;
			
	}
	else{
		
		mainView.gameContainer.scale.x = appObj.canvasWidth/1280;
		mainView.gameContainer.scale.y = mainView.gameContainer.scale.x;
		if(mainView.gameContainer.scale.y*1280 < appObj.canvasHeight){
			mainView.gameContainer.scale.y = appObj.canvasHeight/1280;
			mainView.gameContainer.scale.x = mainView.gameContainer.scale.y;
		}
		
		mainView.mainUI.scale.x = appObj.canvasWidth/1280;
		mainView.mainUI.scale.y = mainView.mainUI.scale.x;	
		if(mainView.mainUI.scale.y*720 > appObj.canvasHeight){
			mainView.mainUI.scale.y = appObj.canvasHeight/720;
			mainView.mainUI.scale.x = mainView.mainUI.scale.y;
		}
		
		mainView.mainUIOverlay.scale.x = 0.1 + appObj.canvasWidth/1280/mainView.mainUI.scale.x;
		mainView.mainUIOverlay.scale.y = 0.1 + appObj.canvasHeight/1280/mainView.mainUI.scale.x;

		mainView.soundBtn.x = -100+appObj.canvasWidth*0.5/mainView.mainUI.scale.y;
		mainView.soundBtn.y = 60-appObj.canvasHeight*0.5/mainView.mainUI.scale.y;	

		mainView.logo.y = 120-appObj.canvasHeight*0.5/mainView.mainUI.scale.y;
		mainView.logo.x = 140-appObj.canvasWidth*0.5/mainView.mainUI.scale.y;
		mainView.logo.scale.set(0.6);

		mainView.map.x = 0;
		mainView.map.y = -50;

		mainView.startText.x = -mainView.startText.width*.5;
		mainView.startText.y = -250;

		mainView.Timer.x = -350+appObj.canvasWidth*0.5/mainView.mainUI.scale.y;
		mainView.Timer.y = 30-appObj.canvasHeight*0.5/mainView.mainUI.scale.y;	

		mainView.playBtn.y = 250;

		mainView.gameField.y = -50;

	}
}			
// Resize

export default AppResize;