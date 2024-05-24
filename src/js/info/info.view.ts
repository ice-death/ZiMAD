import * as EVENT from './../events.js';
import * as API from './../innerApi.js';

/**
 * @class info View
 *
 * Visual representation of the info window
 */

declare global {
  interface Window {
    stage: object;
    gsap:any;
  }
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

interface DeepNestedObject<T> {
 [key: string]: T | DeepNestedObject<T>;
}

type pixiObject = {
 name: string;
 alpha: number;
 visible:boolean;
 interactive:boolean; 
};

export class InfoView{

	public textStyle:TextStyle;
	public infoWindow:any;
	public win:boolean;
	public viewObjects:DeepNestedObject<pixiObject>;
	private gsap:any = window.gsap;
	private windowObj:string = "infoWindow"; 
	private windowObjBgTexture = "info_bg";
	private replayTexture = "replayBtn";
	private nextTexture = "nextBtn";
	private menuTexture = "menuBtn";	

	constructor() {}	

	buildInfoWindow(){
		this.infoWindow = this.viewObjects[this.windowObj];
		this.infoWindow.children.forEach((c:any)=>{
			this.infoWindow.removeChild(c);
		});

		this.infoWindow.children = [];
		this.infoWindow.bg = new API.createSprite({p:this.infoWindow, tex:this.windowObjBgTexture});

		this.infoWindow.finLevelName = new API.createText({p:this.infoWindow, text:"", style:this.textStyle});
		this.infoWindow.finLevelName.y = -200;		
		this.infoWindow.finLevelText = new API.createText({p:this.infoWindow, text:"", style:this.textStyle});
		this.infoWindow.finLevelText.y = -50;

		this.infoWindow.replayBtn = new API.createSprite({p:this.infoWindow, tex:this.replayTexture, x:-150, y:150});
		this.infoWindow.nextBtn = new API.createSprite({p:this.infoWindow, tex:this.nextTexture, x:0, y:150});
		this.infoWindow.menuBtn = new API.createSprite({p:this.infoWindow, tex:this.menuTexture, x:150, y:150});
	}	

	showInfoWindow(levelText:string, infoText:string, color:string){
		this.infoWindow.alpha = 1;

		this.infoWindow.finLevelName.text = levelText;
		this.infoWindow.finLevelName.x = - this.infoWindow.finLevelName.width*0.5;

		this.infoWindow.finLevelText.text = infoText;
		this.infoWindow.finLevelText.style.fill = color;
		this.infoWindow.finLevelText.x = - this.infoWindow.finLevelText.width*0.5;

		this.gsap.set(this.infoWindow, {delay:1.5, overwrite:"none", visible:true});
		this.gsap.to(this.viewObjects.bgOverlay, 0.2, {delay:1.5, overwrite:"none", alpha:0.5, ease:"none"});
		this.gsap.to(this.viewObjects.bgLvl, 0.2, {delay:1.5, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.from(this.infoWindow, 0.2, {delay:1.5, overwrite:"none", alpha:0, ease:"none"});

		if(!this.win){
			this.infoWindow.replayBtn.x = -100;
			this.infoWindow.nextBtn.visible = false;
			this.infoWindow.menuBtn.x = 100;
		}
		else{
			this.infoWindow.replayBtn.x = -150;
			this.infoWindow.nextBtn.visible = true;
			this.infoWindow.menuBtn.x = 150;
		}
	}

	hideInfoWindow(btn:DeepNestedObject<pixiObject>){		
		this.gsap.to(this.viewObjects.bgOverlay, 0.2, {delay:0.0, overwrite:"none", alpha:0.0, ease:"none"});
		this.gsap.to(btn.scale, 0.1, {delay:0.0, yoyo:true, repeat:1, overwrite:"none", x:0.9, y:0.9, ease:"none"});
		this.gsap.to(this.infoWindow, 0.2, {delay:0.2, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.set(this.infoWindow, {delay:0.4, overwrite:"none", visible:false});
	}
}


