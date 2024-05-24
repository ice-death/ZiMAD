import appMc from './appMc.js';
import {MainView} from './mainScreen/mainScreen.view';
import {MainModel} from './mainScreen/mainScreen.model';
import {MainScreenController} from './mainScreen/mainScreen.сontroller';
import {LevelController} from './level/level.сontroller';
import {LevelView} from './level/level.view';
import {LevelModel} from './level/level.model';
import {InfoView} from './info/info.view';
import {InfoModel} from './info/info.model';
import {InfoController} from './info/info.сontroller';

const InitBasicObj = () => {

	// Main Screen Init
	appMc.mainScreen = new MainScreenController(new MainModel(), new MainView());
	
	// Init Start Animation
	appMc.mainScreen.mainView.initAnimation();
	
	// Init level 
	appMc.mainLevel = new LevelController(new LevelModel(), new LevelView(), appMc.mainScreen);
	
	// Init Info window 
	appMc.mainInfoWindow = new InfoController(new InfoModel(), new InfoView(), appMc.mainScreen);

}

export default InitBasicObj;