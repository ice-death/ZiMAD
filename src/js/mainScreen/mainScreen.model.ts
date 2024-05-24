import jsonToLoad from './../json.js';

/**
 * @class Model
 *
 * Manages the data of the start screen and level map
 */


export class MainModel{
	
	public mapTile: any = {};
	public mapSectors: any = {};
	public startSector: string;
	public timer:number;
	private mapJSON: any = {};
	private mapData: any = {};	
	private mapName: string = "levelMap";	

	constructor() {
		this.mapJSON = jsonToLoad;			
		this.mapData = this.mapJSON[this.mapName][0];

		for(let prop in this.mapData.data){
			this.mapTile[prop] = this.mapData.data[prop];
		}
		
		this.startSector = this.mapData.data.start;
		this.mapSectors = this.mapData.sectors;	
	}	
}


