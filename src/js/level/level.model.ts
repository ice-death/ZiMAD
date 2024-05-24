import jsonToLoad from './../json.js';

/**
 * @class Level Model
 *
 * Manages the data of the active level.
 */

interface endTextStyle{
	size:number;
	color:string;
	strokeThickness:number;
}

export class LevelModel{

	public lvlJSON: any = {};
	public timer:number;
	public lvlNum:number;	
	public lvlSectors: any = {};
	public lvlProps: any = {};
	public pipeCheckData:Array<any>;
	public loseText:string = "YOU LOSE!";
	public winText:string = "GREAT!";
	public endTextStyle:endTextStyle = {size:100, color:"0xaaaa00", strokeThickness:10};
	public tmDebug:number = 0;
	public tmDebugComplete:number = 60;
	private lvlName: string;
	private lvlData: any = {};

	constructor() {
		this.lvlJSON = jsonToLoad;	
		this.setPipeCheckData();	
	}

	setLevelName():string{
		this.lvlName = "level_"+this.lvlNum;
		return this.lvlName;
	}

	loadLvlData(){
		this.lvlData = this.lvlJSON[this.setLevelName()][0];
		this.lvlSectors = this.lvlData.sectors;
		this.lvlProps = this.lvlData.data;
		this.tmDebug = 0;
	}
	
	setPipeCheckData(){
		this.pipeCheckData = [
			{name:"pipe_start", 
				checks:[
					{r:0, w:["top", "down"]},
					{r:0.5, w:["left", "right"]},
					{r:1.0, w:["top", "down"]},
					{r:1.5, w:["left", "right"]},
				]
			},
			{name:"pipe_end", 
				checks:[
					{r:0, w:["top", "down"]},
					{r:0.5, w:["left", "right"]},
					{r:1.0, w:["top", "down"]},
					{r:1.5, w:["left", "right"]},
				]
			},
			{name:"pipe_line", 
				checks:[
					{r:0, w:["top", "down"]},
					{r:0.5, w:["left", "right"]},
					{r:1.0, w:["top", "down"]},
					{r:1.5, w:["left", "right"]},
				]
			},
			{name:"pipe_coner", 
				checks:[
					{r:0, w:["top", "left"]},
					{r:0.5, w:["top", "right"]},
					{r:1.0, w:["right", "down"]},
					{r:1.5, w:["left", "down"]},
				]
			},
			{name:"pipe_triple", 
				checks:[
					{r:0, w:["top", "left", "down"]},
					{r:0.5, w:["left", "right", "top"]},
					{r:1.0, w:["right", "top", "down"]},
					{r:1.5, w:["left", "down", "right"]},
				]
			},
			{name:"pipe_krest", 
				checks:[
					{r:0, w:["top", "right", "down", "left"]},
					{r:0.5, w:["top", "right", "down", "left"]},
					{r:1.0, w:["top", "right", "down", "left"]},
					{r:1.5, w:["top", "right", "down", "left"]},
				]
			},
		];
	}		
}


