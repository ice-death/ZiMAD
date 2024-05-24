import appMc from './../appMc.js';
import * as EVENT from './../events.js';
import {MainView} from './mainScreen.view';
import {MainModel} from './mainScreen.model';
import {LevelController} from './../level/level.сontroller';
import {InfoController} from './../info/info.сontroller';

/**
 * @class Controller
 *
 *
 * @param model
 * @param view
 */

interface mapElement {
	interactive:boolean; 
 	parentObj:DeepNestedObject<pixiObject>;
 	parentSeg:string;
 	type:string;
 	status:boolean;
 	name:string;
 	on<E extends keyof EventMap>(type: E, listener: (ev: EventMap[E]) => any): void;
}

interface EventMap {
    "pointerup": TouchEvent;    
}

interface mapTarget{
   name:string;   
}

interface DeepNestedObject<T> {
 [key: string]: T | DeepNestedObject<T>;
}

type pixiObject = {
 name: string;
 alpha: number;
 visible:boolean;
 interactive:boolean; 
};

export class MainScreenController{

	public sound:any = appMc.appSounds;
	public activeLvl:number;
	public activeLvlWin:boolean;
	public levelController:LevelController;
	public infoController:InfoController;
	public gameField:DeepNestedObject<pixiObject>;
	public viewObj:DeepNestedObject<pixiObject>;
	public mapObj:Array<any>;

	constructor(private mainModel: MainModel, private mainView: MainView) {
			this.mainView.buildMainMap(this.mainModel.mapSectors, this.mainModel.mapTile);
			this.mainView.setMainMap();
			this.setMapIteractive();
			this.PlayBtn();
			this.mainView.showActiveLevel(this.mainModel.startSector);	
			this.gameField =  this.mainView.mainObj.gameField;	
			this.viewObj = this.mainView.mainObj;
			this.mapObj = this.mainView.mapObj;
			this.activeLvlWin = false;
	}

	PlayBtn(){
		this.mainView.mainObj.playBtn.on("pointerup", (event:Event)=>{
			EVENT.soundCheck();
			this.sound["click"].play();
			this.activeLvlWin = false;
			this.activeLvl = this.mainView.activeLvl.level;
			console.log(`start level ${this.mainView.activeLvl.level}`);
			this.mainView.hideMainScreen();
			this.levelController.setLevel(this.mainView.activeLvl.level);
		});
	}	

	setMapIteractive(){	
		this.mapObj = this.mainView.mapObj;

		this.mapObj.forEach((el:mapElement)=>{			
			if(el.parentSeg){
				el.interactive = false;								
				if(el.type === "lvl"&&el.parentObj.status){
					el.interactive = true;
					el.on("pointerup", (event:Event)=>{
						EVENT.soundCheck();
						this.sound["click"].play();
						let target:any = event.target;						
						this.mainModel.startSector = target.name;
						this.mainView.showActiveLevel(this.mainModel.startSector);
					});
				}
			}
			else{
				el.interactive = true;
				el.on("pointerup", (event:Event)=>{
					this.sound["click"].play();
					EVENT.soundCheck();
					let target:any = event.target;				
					this.mainModel.startSector = target.name;
					this.mainView.showActiveLevel(this.mainModel.startSector);
				});
			}
		});
	}

	showMainMap(){		
		this.mainView.setMainMap();
		this.setMapIteractive();
		this.mainView.showMainScreen();		
	}

	setMapActiveLvl(lvl:number){		
		if(this.activeLvlWin){
			lvl++;
			let sectorOld = this.mainView.mapObj.find(entry => entry.level === lvl-1);			
			sectorOld.status = true;
		}	
		
		let sector = this.mainView.mapObj.find(entry => entry.level === lvl);	
		this.mainModel.startSector = sector.name;
	
		this.mainView.setMainMap();
		this.mainView.showActiveLevel(this.mainModel.startSector);
	}
}


