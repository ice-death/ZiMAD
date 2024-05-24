import appMc from './../appMc.js';
import * as API from './../innerApi.js';
import * as EVENT from './../events.js';
import AppResize from './../appresize.js';
import {MainScreenController} from './mainScreen.сontroller';

/**
 * @class View
 *
 * Visual representation of the main screen model.
 */

declare global {
  interface Window {
    stage: object;
    gsap:any;
  }
}

interface activeLvl{
	activeLvlIcon:activeLvlIcon;	
	level:number;	
}

interface activeLvlIcon{
	a0:number;
	scale:number;
}

interface mapData{
	start:string;
}

interface DeepNestedObject<T> {
 [key: string]: T | DeepNestedObject<T>;
}

interface TextStyle{
		align: string,
	  dropShadow: boolean,
	  dropShadowAlpha: number,
	  dropShadowAngle: number,
	  dropShadowBlur: number,
	  dropShadowDistance: number,
	  fill: string,
	  fontFamily: string,
	  fontSize: number,
	  lineJoin: string,
	  stroke: string,
	  strokeThickness: number
}

interface interactiveElement {
	interactive:boolean; 
 	name:string;
 	on<E extends keyof EventMap>(type: E, listener: (ev: EventMap[E]) => any): void;
}

interface EventMap {
    "pointerdown": TouchEvent;
    "pointerup": TouchEvent;
    "pointerout": TouchEvent;
    "pointeroutside": TouchEvent;
    "touchendoutside": TouchEvent;    
}

type pixiObject = {
 name: string;
 alpha: number;
 visible:boolean;
 interactive:boolean;
 a0:number; 
};

type mapObject = {
 mode: string;
 parent: string;
 rotate:number;
 tex:string;
 type:string;
};

export class MainView{
	
	public mainObj: any = {};	
	public mapObj: Array<any>=[];	
	public mainText:string = "CHOISE LEVEL";
	public activeLvl:activeLvl;
	private appMc: any = appMc;
	private gsap:any = window.gsap;
	private mapData: mapData;
	private activeLvlOld:activeLvl = null;
	private toRAD:number = Math.PI/180;
	private mainTextStyle:TextStyle;
	private bgTexture: string = "bg";
	private bgLvlTexture: string = "bg_lvl";
	private playTexture: string = "playBtn";
	private soundBtnTexture: string = "soundOnBtn";	

	constructor() {
		this.mainTextStyle = {
			    align: "center",
			    dropShadow: true,
			    dropShadowAlpha: 0.3,
			    dropShadowAngle: 1.6,
			    dropShadowBlur: 4,
			    dropShadowDistance: 4,
			    fill: "#0cafe4",
			    fontFamily: "ZubiloBlack",
			    fontSize: 60,
			    lineJoin: "round",
			    stroke: "#921f0e",
			    strokeThickness: 4
		}

		this.mainObj.mainContainer = new API.createContainer({p:window.stage, visible:false});	
			this.mainObj.gameContainer = new API.createContainer({p:this.mainObj.mainContainer});	
				this.mainObj.worldCamera = new API.createContainer({p:this.mainObj.gameContainer});
			    	
			    	this.mainObj.bg = new API.createSprite({
							p:this.mainObj.worldCamera, 
							tex:this.bgTexture
						});	
					
						this.mainObj.bgLvl = new API.createSprite({
							p:this.mainObj.worldCamera, 
							tex:this.bgLvlTexture,
							alpha:0
						});
					
						this.mainObj.bgOverlay = new API.createRect({
							p:this.mainObj.worldCamera, 
							x:-1280*.5,
							y:-1280*.5,
							width:1280,
							height:1280,
							alpha:0.0
						});

			this.mainObj.mainUI = new API.createContainer({p:this.mainObj.mainContainer});	

				this.mainObj.startText = new API.createText({p:this.mainObj.mainUI, text:this.mainText, style:this.mainTextStyle});				
				
				this.mainObj.logo = new API.createSprite({
					p:this.mainObj.mainUI, 
					tex:"logo"
				});				
				
				this.mainObj.mainUIOverlay = new API.createRect({
					p:this.mainObj.mainUI, 
					x:-1280*.5,
					y:-1280*.5,
					width:1280,
					height:1280,
					alpha:0.0
				});
				
				this.mainObj.infoWindow = new API.createContainer({p:this.mainObj.mainUI, visible:false});	 

				this.mainObj.gameField = new API.createContainer({p:this.mainObj.mainUI});

				this.mainObj.finLevelTextContainer = new API.createContainer({p:this.mainObj.mainUI});
					this.mainObj.finLevelText = new API.createText({p:this.mainObj.finLevelTextContainer, text:"", style:this.mainTextStyle});
					this.mainObj.finLevelText.alpha = 0;

				this.mainObj.Timer = new API.createContainer({p:this.mainObj.mainUI});
						this.mainObj.Timer.timerText = new API.createText({p:this.mainObj.Timer, text:"1111", style:this.mainTextStyle});
				this.mainObj.Timer.alpha = 0;		

				this.mainObj.playBtn = new API.createSprite({
					p:this.mainObj.mainUI, 
					tex:this.playTexture
				});	
				this.mainObj.playBtn.interactive = true;

				this.mainObj.soundBtn = new API.createSprite({
					p:this.mainObj.mainUI, 
					tex:this.soundBtnTexture,
					anchor:[0,0.5]
				});	

				this.mainObj.soundBtn.interactive = true;
				this.mainObj.soundBtn.on('pointerup', API.BtnGlobalSound);	

				this.UIOverlayInteractive(this.mainObj.mainUIOverlay);	
	}

	UIOverlayInteractive=(obj:interactiveElement):void=>{		
		obj.interactive = true;		
		obj.on('pointerdown', EVENT.StageDown);
		obj.on('pointerup', EVENT.StageUp);
		obj.on('pointerout', EVENT.StageUp);
		obj.on('pointeroutside', EVENT.StageUp);
		obj.on('touchendoutside', EVENT.StageUp);	
	}

	buildMainMap(data:DeepNestedObject<mapObject>, tile:any){
		this.mapData = tile;	
		this.mainObj.map = new API.createContainer({p:this.mainObj.mainUI});
		let map = this.mainObj.map;
		let w:number = tile.width;
		let h:number = tile.height;
		let offsetW:number = -w*0.5+w*tile.gor*0.5;
		let offsetH:number = -h-0.5+h*tile.vert*0.5;

		for(let i:number = 0; i<tile.vert; i++){
			for(let j:number = 0; j<tile.gor; j++){
				let name:string = tile.sector_name+"_"+i+"_"+j;
				let obj:any = data[tile.sector_name+"_"+i+"_"+j];
				
				if(obj.mode != "clear"){
					map[name] = new API.createContainer({p:map, x:-offsetW+j*w, y:-offsetH+i*h});
						map[name].bg = new API.createContainer({p:map[name]});
							map[name].bg.empty = new API.createSprite({
								p:map[name].bg, 
								tex:obj.tex,
								x:-(w-tile[obj.tex].w)*0.5,
								y:-(h-tile[obj.tex].h)*0.5,
							});	
							map[name].bg.full = new API.createSprite({
								p:map[name].bg, 
								tex:obj.tex+tile.tex_full_pref,
								x:-(w-tile[obj.tex].w)*0.5,
								y:-(h-tile[obj.tex].h)*0.5,
							});
						map[name].bg.rotation = obj.rotate*Math.PI;

					if(obj.type == "lvl"){
						map[name].activeLvlIcon = new API.createSprite({
							p:map[name], 
							tex:tile.lvl_active_tex							
						});	
						map[name].lockLvlIcon= new API.createSprite({
							p:map[name], 
							tex:tile.lvl_lock_tex							
						});	
						map[name].status = obj.status;
						map[name].stars = obj.stars;
						map[name].level = obj.level;
					}	
					map[name].type = obj.type;
					map[name].parentSeg = obj.parent;	
					map[name].name = name;
					map[name].startSeq = false;
					this.mapObj.push(map[name]);						
				}	

			}
		}
	}

	setMainMap(){
		this.mapObj.forEach(el=>{
			if(el.parentSeg){
				let parentObj:any = this.mapObj.find(entry => entry.name === el.parentSeg);
				el.parentObj = parentObj;

				if(!parentObj.status){
					el.bg.full.alpha = 0;
					if(el.type === "lvl"){
						el.activeLvlIcon.alpha = 0;
					}
				}
				else{
					el.bg.full.alpha = 1;
					if(el.type === "lvl"){
						el.lockLvlIcon.alpha = 0;
						el.activeLvlIcon.alpha = 1;
					}
				}

			}

			if(el.name === this.mapData.start){
				el.bg.full.alpha = 0;
				el.lockLvlIcon.alpha = 0;
				el.activeLvlIcon.alpha = 1;
				el.startSeq = true;
			}

		});
	}

	showActiveLevel(obj:string){
		this.activeLvl = this.mapObj.find(entry => entry.name === obj);

		if(this.activeLvlOld !== null){
			this.gsap.to(this.activeLvlOld.activeLvlIcon.scale, 0.2, {delay:0.0, overwrite:"none", x:1.0, y:1.0, ease:"back.out"});
		}

		this.activeLvlOld = this.activeLvl;	
		this.activeLvl.activeLvlIcon.a0 = API.RandomInteger(0,360);
		this.gsap.to(this.activeLvl.activeLvlIcon.scale, 0.2, {delay:0.0, overwrite:"none", x:1.1, y:1.1, ease:"back.in"});
	}

	showMainScreen(){
		this.mainObj.map.visible = true;
		this.mainObj.map.alpha = 1;
		this.mainObj.startText.visible = true;
		this.mainObj.startText.alpha = 1;
		this.mainObj.startText.style = this.mainTextStyle;
		this.mainObj.playBtn.visible = true;	

		this.gsap.from(this.mainObj.map, 0.5, {delay:0.0, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.from(this.mainObj.startText, 0.5, {delay:0.5, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.from(this.mainObj.playBtn.scale, 0.5, {delay:0.7, overwrite:"none", x:0, y:0, ease:"back.out(1.7)"});
		this.gsap.to(this.mainObj.bgLvl, 0.2, {delay:0.0, overwrite:"none", alpha:0, ease:"none"});
	}

	hideMainScreen(){	
		this.gsap.to(this.mainObj.map, 0.2, {delay:0.0, overwrite:"none", alpha:0, ease:"none", onComplete:()=>{
			this.mainObj.map.visible = false;
		}});	

		this.gsap.to(this.mainObj.startText, 0.2, {delay:0.0, overwrite:"none", alpha:0, ease:"none", onComplete:()=>{
			this.mainObj.startText.visible = false;
		}});

		this.gsap.to(this.mainObj.bgLvl, 0.2, {delay:0.0, overwrite:"none", alpha:1, ease:"none"});
		this.mainObj.playBtn.visible = false;
	}

	initAnimation(){
		AppResize();
		this.mainObj.mainContainer.visible=true;
		document.getElementById('main').style.visibility = "visible";
		document.getElementById('progress').style.display = "none";

		this.appMc.appSounds["bg"].play();
		
		this.showMainScreen();
	}
	
	update(){
		let obj:any = this.activeLvl.activeLvlIcon;
		obj.a0 <360?obj.a0+=5:obj.a0-=360;
		obj.rotation = 0.4*Math.cos(obj.a0*this.toRAD);
	}
}


