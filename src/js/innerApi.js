import moduleTexture from './texture.js';
import jsonToLoad from './json.js';
import appMc from './appMc.js';
import AppResize from './appresize.js';
import aLoadSounds from './audio.js';
import {WebfontLoaderPlugin} from "pixi-webfont-loader";

let i, objTemp;
for(i=0; i<aLoadSounds.length; i++){
	if(aLoadSounds[i].sprite){
		appMc.appSounds[aLoadSounds[i].name] = new Howl({src: [aLoadSounds[i].path], sprite:aLoadSounds[i].sprite, volume:aLoadSounds[i].volume, loop:aLoadSounds[i].loop});
	}else{
		appMc.appSounds[aLoadSounds[i].name] = new Howl({src: [aLoadSounds[i].path], volume:aLoadSounds[i].volume, loop:aLoadSounds[i].loop});
	}
}

//- Init PIXI

export const InitPixi = () => {
	let appObj = window.appObj;
	appObj.canvasWidth	=	Math.ceil(window.innerWidth);
	appObj.canvasHeight	=	Math.ceil(window.innerHeight);
	
	AppCanvas.id		= "AppCanvas";
	AppCanvas.width		= appObj.canvasWidth;
	AppCanvas.height	= appObj.canvasHeight; 

	window.renderer = new PIXI.autoDetectRenderer({
		width 			: appObj.canvasWidth, 		
		height 			: appObj.canvasHeight,
		view			: window.AppCanvas, 
		transparent		: true, 
		antialias		: false		 						
	});
	
	document.getElementById('pixi').append(renderer.view);  
	
	window.stage = new PIXI.Container();
	window.stage.position.set(Math.ceil(appObj.canvasWidth*0.5), Math.ceil(appObj.canvasHeight*0.5));
}
export class createContainer{

	container;

	constructor({p,visible=true,alpha=1,x=0,y=0, scale=1}) {  					
		this.container = new PIXI.Container();
		this.container.position.set(x, y);
		p.addChild(this.container);
		this.container.visible = visible;
		this.container.alpha = alpha;
		this.container.scale.set(scale);						
		return this.container;
	}				
}
export class createSprite{

	sprite;

	constructor({p,tex,x=0,y=0,anchor=[0.5,0.5],scale=1,visible=true,alpha=1, tint="0xffffff"}) {  					
		
		this.sprite = new PIXI.Sprite();	
		this.sprite.texture=moduleTexture.pixiTextures[tex];	
		this.sprite.position.set(x, y);
		this.sprite.anchor.set(anchor[0], anchor[1]);
		this.sprite.scale.set(scale);
		this.sprite.visible = visible;
		this.sprite.alpha = alpha;	
		this.sprite.tint = tint;	
		p.addChild(this.sprite);	
		return this.sprite;					
	}				
}
export class createText{
	Text;
	constructor({p,text,style}) { 		
		this.Text = new PIXI.Text();
		this.Text.text = text;
		this.Text.style = style;	
		p.addChild(this.Text);	
		return this.Text;					
	}				
}
export class createRect{
	
	rect;

	constructor({p,visible=true,alpha=1,x=0,y=0, width=0,height=0,color="0x000000", fill=1,radius=0}) {  					
		this.rect = new PIXI.Graphics();			
		this.rect.beginFill(color, fill);
		this.rect.drawRoundedRect(x, y, width, height,radius);
		this.rect.endFill();
		this.rect.alpha = alpha;
		this.rect.visible = visible;
		p.addChild(this.rect);	
		return this.rect;
	}				
}
//---------------------------------------------------------------------------------
export const fontLoader = ()=>{
	PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
	const fontToLoad = [];
	const importFont= (r) =>{
	  let font = {};
	  r.keys().map((item, index) => { font[item.replace('./', '')] = r(item); });
	  return font;
	}
	const fonts = importFont(require.context('../../tmp/font/', false, /\.(woff)$/));
	let i = 0;
	for(let font in fonts){
		let name = font.replace(/\.[^.]+$/, '');	
		fontToLoad.push({
			name:name,			
			path: fonts[font].default
		});
		i++;
	}
	let styleData = document.styleSheets;
	fontToLoad.forEach(font=>{
		let dataFont = font.path.split(',')[1];
		let base64Info = "data:application/x-font-woff;charset=utf-8;base64,";
		dataFont = base64Info+dataFont;
		styleData[0].insertRule("@font-face { font-family: "+font.name+"; src:url('"+dataFont+"')}", styleData[0].cssRules.length-1);
		styleData[0].insertRule("#"+font.name+"Div { font-family: "+font.name+"; font-size: 0pt; color:black; position:absolute }", styleData[0].cssRules.length-1);
		const el = document.createElement("div");
		el.id = font.name+"Div";
		const currentDiv = document.getElementById("main");
		document.body.insertBefore(el, currentDiv.nextSibling);
		el.innerHTML = ".";
		let fontName = font.name;		
	});

}
//- Components

export function RandomInteger(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

//---------------------------------------------------------------------------------

//- RAF

var raf_lastTime = 0;
var raf_vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < raf_vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[raf_vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame = window[raf_vendors[x]+'CancelAnimationFrame'] || window[raf_vendors[x]+'CancelRequestAnimationFrame'];
} 
if (!window.requestAnimationFrame){
	window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - raf_lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		raf_lastTime = currTime + timeToCall;
		return id;
	};
}	
if (!window.cancelAnimationFrame){
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}

//- FOCUS

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
export const canvasVisibilityChange=()=>{    
	if(document[hidden] || document[state]=="hidden"){	
		try{ Howler.mute(true); }catch(e){}	 
		appMc.pauseGlobal = true;
		try{ gsap.globalTimeline.pause() }catch(e){}	
	}else{
		if(appMc.isGlobalSound){
			Howler.mute(false); 
			appMc.pauseGlobal = false;
			try{ gsap.globalTimeline.resume() }catch(e){}	 
		} 
	}
}
export const WindowOnBlur=()=>{    
	try{ Howler.mute(true); }catch(e){}	 
	appMc.pauseGlobal = true;
	try{ gsap.globalTimeline.pause() }catch(e){}	
}

export const WindowOnFocus=()=>{    
	if(appMc.isGlobalSound){
		Howler.mute(false);
		appMc.pauseGlobal = false;
		try{ gsap.globalTimeline.resume() }catch(e){}		
	}	 
}
export const BtnGlobalSound =(e) =>{
	if(appMc.isGlobalSound){
		appMc.isGlobalSound = false;
		
		e.target.texture = moduleTexture.pixiTextures["soundOffBtn"];
		
		Howler.mute(true);
		
	}else{
		appMc.isGlobalSound = true;
	
		e.target.texture = moduleTexture.pixiTextures["soundOnBtn"];
		
		Howler.mute(false);
	}			
}


