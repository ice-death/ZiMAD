import * as EVENT from './../events.js';
import {InfoView} from './info.view';
import {InfoModel} from './info.model';
import {MainScreenController} from './../mainScreen/mainScreen.сontroller';

/**
 * @class Info Controller
 *
 *
 * @param info model
 * @param info view
 */

export class InfoController{

	private lvlName:string;
	private lvlText:string;
	private lvlTextColor:string;
	private replay:boolean = false;
	private endLevel:number = 5;

	constructor(private infoModel: InfoModel, private infoView: InfoView, private mainScreenController:MainScreenController) {
		this.mainScreenController.infoController = this;
		this.infoView.viewObjects = this.mainScreenController.viewObj;
		this.infoView.textStyle = this.infoModel.textStyle;		
		
	}

	setReplayBtn(){
		this.infoView.infoWindow.replayBtn.interactive = true;
		this.infoView.infoWindow.replayBtn.on("pointerup", (event:Event)=>{
			this.mainScreenController.sound["click"].play();
			this.replayLvl();				
		});
	}

	setNextBtn(){
		this.infoView.infoWindow.nextBtn.interactive = true;
		this.infoView.infoWindow.nextBtn.on("pointerup", (event:Event)=>{
			this.mainScreenController.sound["click"].play();
			this.nextLvl();				
		});
	}

	setMenuBtn(){
		this.infoView.infoWindow.menuBtn.interactive = true;
		this.infoView.infoWindow.menuBtn.on("pointerup", (event:Event)=>{
			this.mainScreenController.sound["click"].play();
			this.menuShow();				
		});
	}

	replayLvl(){
		console.log("replay");
		this.infoView.infoWindow.replayBtn.interactive = false;
		this.infoView.hideInfoWindow(this.infoView.infoWindow.replayBtn);
		this.mainScreenController.levelController.setLevel(this.mainScreenController.activeLvl);
	}

	nextLvl(){
		console.log("next");
		this.infoView.infoWindow.nextBtn.interactive = false;
		this.infoView.hideInfoWindow(this.infoView.infoWindow.nextBtn);
		setTimeout(()=>{			
			this.mainScreenController.setMapActiveLvl(this.mainScreenController.activeLvl);
		}, 500);
		this.mainScreenController.activeLvl ++;
		if(this.mainScreenController.activeLvl === this.endLevel+1)this.mainScreenController.activeLvl = 1;
		this.mainScreenController.levelController.setLevel(this.mainScreenController.activeLvl);
	}

	menuShow(){
		console.log("menu");
		this.infoView.infoWindow.menuBtn.interactive = false;
		this.infoView.hideInfoWindow(this.infoView.infoWindow.menuBtn);

		setTimeout(()=>{
			this.mainScreenController.setMapActiveLvl(this.mainScreenController.activeLvl);
			this.mainScreenController.showMainMap();
		}, 500);		
	}
	
	setInfoWindow(){
		this.infoView.buildInfoWindow();
		this.lvlName = this.infoModel.LevelText+this.mainScreenController.activeLvl;

		if(this.mainScreenController.activeLvlWin){
			this.lvlText = this.infoModel.CompleteText.text;
			this.lvlTextColor = this.infoModel.CompleteText.color;
			this.infoView.win = true;
		}
		else{
			this.lvlText = this.infoModel.NoCompleteText.text;
			this.lvlTextColor = this.infoModel.NoCompleteText.color;
			this.infoView.win = false;
		}

		console.log(this.lvlName, this.lvlText);
		
		this.infoView.showInfoWindow(this.lvlName, this.lvlText, this.lvlTextColor);
		this.setReplayBtn();
		this.setNextBtn();		
		this.setMenuBtn();
	}	
}


