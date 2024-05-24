import * as EVENT from './../events.js';
import {LevelView} from './level.view';
import {LevelModel} from './level.model';
import {MainScreenController} from './../mainScreen/mainScreen.сontroller';
/**
 * @class Level Controller
 *
 *
 * @param model
 * @param view
 */

interface CheckData{
	checks:Array<{r:number, w:Array<string>}>;
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
 status:string;
 vertIndex:number;
 gorIndex:number;
};

interface interactiveElement {
	interactive:boolean; 
 	name:string;
 	type:string;
 	on<E extends keyof EventMap>(type: E, listener: (ev: EventMap[E]) => any): void;
}

interface EventMap {
    "pointerdown": TouchEvent;
    "pointerup": TouchEvent;
    "pointerout": TouchEvent;
    "pointeroutside": TouchEvent;
    "touchendoutside": TouchEvent;    
}

export class LevelController{

	public  timer:number;
	private activeLvl:string;	
	private topSector:any;
	private downSector:any;
	private leftSector:any;
	private rightSector:any;
	private waterSectors:Array<any>;
	private complete:boolean = false;
	private sectorClicked:any;
	private timerStart:boolean;
	private tmDebug:number;
	private tmDebugComplete:number;

	constructor(private levelModel: LevelModel, private levelView: LevelView, private mainScreenController:MainScreenController) {
		this.mainScreenController.levelController = this;
		this.levelView.gameField = this.mainScreenController.gameField;
		this.levelView.viewObjects = this.mainScreenController.viewObj;
		this.timerStart = false;
		this.waterSectors = [];

	}	
	setLevel(lvl:number){
		console.log(`Show ${lvl} level`);
		this.complete = false;
		this.mainScreenController.activeLvlWin = false;
		this.levelModel.lvlNum = lvl;
		this.levelModel.loadLvlData();
		this.timer = this.levelModel.lvlProps.timer;
		this.levelView.timer = this.timer;
		this.levelView.buildMainMap(this.levelModel.lvlSectors, this.levelModel.lvlProps);
		this.levelView.showLvl();
		this.setLevelMapActiveElement();
	}	
	setLevelMapActiveElement(){
		this.levelView.sectorArr.forEach((s:DeepNestedObject<pixiObject>)=>{
			this.setPipeChecks(s);
		});
		this.checkPipe();
		this.levelView.sectorArr.forEach((s:interactiveElement)=>{
			if(s.type === "active"){						
				s.interactive = true;
				s.on("pointerup", (event:Event)=>{					
					if(this.levelView.pipesChanged && !this.complete){
						this.mainScreenController.sound["pipe"].play();
						if(!this.timerStart)this.timerStart = true;
						this.levelView.pipesChanged = false;
						this.sectorClicked = event.target;
						this.levelView.pipeClick(event.target);
						this.setPipeChecks(event.target);
						this.checkPipe();
					}					
				});
			}
		});
	}
	fromStartChesk(pipe:any){
		let check:boolean = false;
		pipe.checking = true;
		pipe.status = "water";	
			
		if(pipe.name !== "pipe_start")this.waterSectors.push(pipe);		

		for(let link in pipe.sectorLinks){
			if(pipe.sectorLinks[link] !== null){				
				if(!pipe.sectorLinks[link].checking){					
					if(pipe.sectorLinks[link].name === "pipe_end"){
						this.win();
					}				
					this.fromStartChesk(pipe.sectorLinks[link]);
					check = true;	
				}
			}			
		}

		if(!check){
			setTimeout(()=>{this.watterOff()},50);
		}		
	}

	watterOff(){
		this.levelView.pipeWaterHide();
		this.levelView.pipeWaterShow(this.waterSectors, this.sectorClicked);		
	}

	win(){
		console.log("win");
		this.timerStart = false;
		this.mainScreenController.activeLvlWin = true;
		this.complete = true;

		this.mainScreenController.mapObj  = this.mainScreenController.mapObj.map((item:any) => {
			item.level&&item.level === this.mainScreenController.activeLvl?item.status = true:item.level;
			return item;
		});	

		this.levelView.completeLvl(this.mainScreenController.viewObj.finLevelText, this.levelModel.winText, this.levelModel.endTextStyle);
		this.mainScreenController.infoController.setInfoWindow();	
	}

	lose(){
		console.log("lose");
		this.complete = true;						
		this.levelView.completeLvl(this.mainScreenController.viewObj.finLevelText, this.levelModel.loseText, this.levelModel.endTextStyle);
		this.mainScreenController.infoController.setInfoWindow();	
	}
	checkPipe(){	
		this.waterSectors = [];
		this.levelView.sectorArr.forEach((pipe:any)=>{			
			pipe.status = "empty";
			pipe.checking = false;	

			let CheckData:CheckData = this.levelModel.pipeCheckData.find(entry => entry.name === pipe.name);	
			this.setPipeChecks(pipe);
			let checkPos:DeepNestedObject<pixiObject> = null;

			pipe.checks.forEach((check:string)=>{			
				switch(check){
					case "top":
						if(this.topSector !== null){
							checkPos = this.topSector.checks.find((entry:any) => entry === "down");
							if(checkPos !== null && checkPos !== undefined){
								pipe.sectorLinks.top = this.topSector;							
							}
						}	
					break;
					case "down":
						if(this.downSector !== null){
							checkPos = this.downSector.checks.find((entry:any) => entry === "top");
							if(checkPos !== null && checkPos !== undefined){
								pipe.sectorLinks.down = this.downSector;
							}
						}	
					break;
					case "left":
						if(this.leftSector !== null){
							checkPos = this.leftSector.checks.find((entry:any) => entry === "right");
							if(checkPos !== null && checkPos !== undefined){
								pipe.sectorLinks.left = this.leftSector;							
							}
						}	
					break;
					case "right":
						if(this.rightSector !== null){
							checkPos = this.rightSector.checks.find((entry:any) => entry === "left");
							if(checkPos !== null && checkPos !== undefined){
								pipe.sectorLinks.right = this.rightSector;							
							}
						}	
					break;
				}
			});

			if(pipe.name === "pipe_start"){
				checkPos !== null && checkPos !== undefined?this.levelView.startSector.linked = true:this.levelView.startSector.linked = false;
			}				

		});	
		if(this.levelView.startSector.linked){
			this.fromStartChesk(this.levelView.startSector);
		}
		else{
			this.levelView.pipeWaterHide();
		}		
	}

	setPipeChecks(pipe:any){
		let rotationData:number = pipe.rotate%2;
		let CheckData:CheckData = this.levelModel.pipeCheckData.find(entry => entry.name === pipe.name);
		let Checks = CheckData.checks.find((entry:any) => entry.r === rotationData);
		pipe.checks = Checks.w;

		this.topSector = this.setTopSector(pipe);
		this.downSector = this.setDownSector(pipe);
		this.leftSector = this.setLeftSector(pipe);
		this.rightSector = this.setRightSector(pipe);

		pipe.sectorLinks = 	{top:null, down:null, left:null, right:null};

		pipe.topSectorLink = null;
		pipe.downSectorLink = null;
		pipe.leftSectorLink = null;
		pipe.rightSectorLink = null;		
	}

	setPipeWater(pipe:any){
		pipe.status = "water";
	}
	
	setTopSector(pipe:any){
		return this.levelView.sectorArr.find((entry:any) => entry.vertIndex === pipe.vertIndex-1 && entry.gorIndex === pipe.gorIndex) ?? null;
	}

	setDownSector(pipe:any){
		return this.levelView.sectorArr.find(entry => entry.vertIndex === pipe.vertIndex+1 && entry.gorIndex === pipe.gorIndex) ?? null;
	}

	setLeftSector(pipe:any){
		return this.levelView.sectorArr.find(entry => entry.vertIndex === pipe.vertIndex && entry.gorIndex === pipe.gorIndex-1) ?? null;
	}

	setRightSector(pipe:any){
		return this.levelView.sectorArr.find(entry => entry.vertIndex === pipe.vertIndex && entry.gorIndex === pipe.gorIndex+1) ?? null;
	}

	update(){
		if(this.timerStart){
			this.levelModel.tmDebug++;
			if(this.levelModel.tmDebug == this.levelModel.tmDebugComplete){
				this.levelModel.tmDebug = 0;
				if(this.levelView.timer >0){
					this.levelView.timerUpdate();
				}
				else{					
					this.timerStart = false;
					this.lose();
				}				
			}
		}
	}
}


