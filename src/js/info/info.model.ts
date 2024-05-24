import jsonToLoad from './../json.js';

/**
 * @class Level Model
 *
 *	Manages the data of the info window.
 */

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
interface TextInfo{
	text:string;
	color:string;
}

export class InfoModel{

	public LevelText:string = "Level ";
	public CompleteText:TextInfo = {text:"COMPLETE", color:"0xaaaa00"};
	public NoCompleteText:TextInfo = {text:"NOT COMPLETE", color:"0xff0000"};
	public textStyle:TextStyle = {
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
	};

	constructor() {}		
}


