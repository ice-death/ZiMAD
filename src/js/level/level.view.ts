import * as EVENT from './../events.js';
import * as API from './../innerApi.js';

/**
 * @class Level View
 *
 * Visual representation of the level model
 */

declare global {
  interface Window {
    stage: object;
    gsap:any;
  }
}

export class LevelView{
	
	public gameField:any;
	public gameFieldScale:number;
	public startSector:any;
	public endtSector:any;
	public sectorArr:Array<any>;
	public pipesChanged:boolean;
	public viewObjects:any;
	public timerText:string;
	public timer:number;
	private gsap:any;
	private fullCount:number;
	private timerSize:number;

	constructor() {
		this.pipesChanged = true;	
		this.fullCount = 0;
		this.sectorArr = [];
		this.gsap = window.gsap;
		this.gameFieldScale = 1;
		this.timerSize = 80;
	}	

	buildMainMap(sectors:any, data:any){
		this.sectorArr = [];
		this.gameField.children = [];
		this.gameField.waterMask = new API.createContainer({p:this.gameField});

		let w:number = data.width;
		let h:number = data.height;
		let offsetW:number = -w*0.5+w*data.gor*0.5;
		let offsetH:number = -h-0.5+h*data.vert*0.5;

		offsetW<offsetH
			?offsetH*2 > 450
				?this.gameFieldScale = 450/(offsetH*2):this.gameFieldScale = 1
			:offsetW*2 > 450	
				?this.gameFieldScale = 450/(offsetW*2):this.gameFieldScale = 1;

		for(let i:number = 0; i<data.vert; i++){
			for(let j:number = 0; j<data.gor; j++){
				let name:string = data.sector_name+"_"+i+"_"+j;
				let obj:any = sectors[data.sector_name+"_"+i+"_"+j];
				this.gameField[name] = new API.createContainer({p:this.gameField, x:-offsetW+j*w, y:-offsetH+i*h});
					this.gameField[name].bg = new API.createSprite({
						p:this.gameField[name],
						tex:data.backTile
					});	
					obj.type==="opacity"?this.gameField[name].bg.alpha = 0:this.gameField[name].bg.alpha = 1;

					if(obj.mode != "clear"){
						this.gameField[name].pipe = new API.createContainer({p:this.gameField[name]});
							this.gameField[name].pipe.pic = new API.createSprite({
								p:this.gameField[name].pipe, 
								tex:obj.tex,
								x:-(w-data[obj.tex].w)*0.5,
								y:-(h-data[obj.tex].h)*0.5,
							});																
						this.gameField[name].pipe.rotation = obj.rotate*Math.PI;
						
						this.gameField.waterMask[name] = new API.createContainer({p:this.gameField.waterMask});
							this.gameField.waterMask[name].pic = new API.createSprite({
								p:this.gameField.waterMask[name], 
								tex:obj.tex+data.tex_mask_pref,
								x:-(w-data[obj.tex].w)*0.5,
								y:-(h-data[obj.tex].h)*0.5,
								visible:false
							});
						this.gameField[name].pipe.water = this.gameField.waterMask[name];
						this.gameField[name].pipe.type = obj.type;
						this.gameField[name].pipe.rotate = obj.rotate;
						this.gameField[name].pipe.name = obj.tex;
						this.gameField[name].pipe.gorIndex = j;
						this.gameField[name].pipe.checking = false;
						this.gameField[name].pipe.full = false;
						this.gameField[name].pipe.vertIndex = i;
						this.gameField[name].pipe.startLinked = false;

						if(name === data.start){
							this.startSector = this.gameField[name].pipe;
							this.gameField[name].pipe.status = "water";
							this.gameField[name].pipe.linked = false;
						}	

						if(name === data.end){
							this.endtSector = this.gameField[name].pipe;
							this.gameField[name].pipe.linked = false;
						}	
						else{
							this.gameField[name].pipe.status = "empty";
						}	

						this.sectorArr.push(this.gameField[name].pipe);	
					}
			}
		}
		this.gameField.setChildIndex(this.gameField.waterMask, this.gameField.children.length-1);
	}

	pipeWaterHide(){
		this.sectorArr.forEach((pipe:any)=>{
			if(pipe.type === "active" && !pipe.checking){
				this.gsap.killTweensOf(pipe.water);	
				this.gsap.killTweensOf(pipe.water.pic);
				this.gsap.killTweensOf(pipe.water.pic.scale);		
				pipe.status = "empty";
				pipe.water.pic.visible = false;
				pipe.full = false;
			}			
		});
	}

	pipeWaterShow(data:Array<any>, pipe:any){
		let count:number = 0;
		let waterPipe:any = data.find(entry => entry === pipe)??null;	
		if(waterPipe !== null)this.pipeWaterFull(pipe);
	}

	pipeWaterFull(pipe:any){
		if(!pipe.water.pic.visible){
			this.gsap.killTweensOf(pipe.water.pic.scale);
			pipe.water.pic.scale.x = 1;
			this.gsap.set(pipe.water.pic, {delay:0.0, overwrite:"none", visible:true});
			this.gsap.from(pipe.water.pic.scale, 0.1, {delay:0.0, overwrite:"none", x:0, ease:"none"});
			pipe.full = true;
		}

		for(let link in pipe.sectorLinks){
			if(pipe.sectorLinks[link] !== null){
				if(!pipe.sectorLinks[link].full){					
					this.gsap.to(pipe.sectorLinks[link].water, 0.05,{delay:0.0, overwrite:"none", onComplete:()=>{
						this.pipeWaterFull(pipe.sectorLinks[link]);
					}});					
				}
			}
		}	
	}

	pipeClick(obj:any){
		obj.rotate +=0.5;
		this.gsap.to(obj, 0.1, {delay:0.0, overwrite:"none", rotation:obj.rotate*Math.PI, ease:"sine.inOut", onComplete:()=>{
			this.pipesChanged = true;
		}});
	}

	showLvl(){		
		this.gameField.alpha =1;
		this.gameField.visible = true;
		this.gameField.scale.set(this.gameFieldScale);
		this.viewObjects.Timer.alpha = 1;
		this.viewObjects.Timer.timerText.style.fontSize = this.timerSize;
		this.viewObjects.Timer.timerText.text = "00:"+this.timer;

		this.gsap.from(this.viewObjects.Timer, 0.5,{delay:0.5, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.from(this.gameField.scale, 0.5,{delay:0.5, overwrite:"none", x:0, y:0, ease:"back.out"});	

		this.sectorArr.forEach((s:any, i:number)=>{
			s.scale.set(1);
			this.gsap.from(s.scale, 0.5,{delay:1.0+0.05*i, overwrite:"none", x:0, y:0, ease:"back.out"});
		});
	}

	completeLvl(textObj:any, text:string, style:any){
		textObj.alpha = 1;
		textObj.parent.scale.set(1);
		textObj.text = text;
		textObj.style.fontSize = style.size;
		textObj.style.fill = style.color;
		textObj.style.strokeThickness = style.strokeThickness;
		textObj.x = -textObj.width*0.5;		

		this.gsap.to(this.viewObjects.Timer, 0.5,{delay:0.0, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.to(this.gameField, 0.5,{delay:0.5, overwrite:"none", alpha:0, ease:"none"});
		this.gsap.set(this.gameField,{delay:1.0, overwrite:"none", visible:false});
		this.gsap.from(textObj.parent.scale, 0.5, {delay:0.0, overwrite:"none", x:0, y:0, ease:"back.out"});
		this.gsap.to(textObj.parent.scale, 0.5, {delay:1.0, overwrite:"none", x:0, y:0, ease:"back.in"});
	}

	timerUpdate(){
			let text:string;
			this.timer--;
			this.timer<10?text = "00:0":text = "00:";
			this.viewObjects.Timer.timerText.text = text+this.timer.toString();			
	}
	
	update(){
		this.sectorArr.forEach((s:any)=>{
			s.water.x = s.parent.x;
			s.water.y = s.parent.y;
			s.water.rotation = s.rotation;
		});
	}

		
}


