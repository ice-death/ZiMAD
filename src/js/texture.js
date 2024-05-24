const textureToLoad = [];
const importAll= (r) =>{
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../../tmp/img/', false, /\.(png|jpe?g|svg)$/));

for(let img in images){
	let name = img.replace(/\.[^.]+$/, '');	
	textureToLoad.push({
		name:name,
		path: images[img].default
	});
}

const moduleTexture = {
	textures		: 	textureToLoad,
	baseTextures	: {},
	threeTextures	: {},	
	pixiTextures	: {},
	funComplete		: null,
	load			: function(_funComplete){
		moduleTexture.funComplete = _funComplete;					
		moduleTexture.loadTexture();
	},
	idLoadTexture	: 0, 
	loadTexture		: function(){
		if(moduleTexture.idLoadTexture < moduleTexture.textures.length){
			
			moduleTexture.baseTextures[moduleTexture.textures[moduleTexture.idLoadTexture].name] = new Image();
			
			moduleTexture.baseTextures[moduleTexture.textures[moduleTexture.idLoadTexture].name].onload = moduleTexture.loadTextureComplete;
			moduleTexture.baseTextures[moduleTexture.textures[moduleTexture.idLoadTexture].name].onerror = moduleTexture.loadTextureError;
			moduleTexture.baseTextures[moduleTexture.textures[moduleTexture.idLoadTexture].name].src = moduleTexture.textures[moduleTexture.idLoadTexture].path;
			
		}else{
			moduleTexture.funComplete();
		}
	},
	loadTextureComplete		: function(){		
		moduleTexture.pixiTextures[moduleTexture.textures[moduleTexture.idLoadTexture].name] = PIXI.Texture.from(moduleTexture.textures[moduleTexture.idLoadTexture].path);
		moduleTexture.idLoadTexture++;
		moduleTexture.loadTexture();
	},
	loadTextureError		: function(){
		setTimeout(moduleTexture.loadTexture, 200);
	}
}

export default moduleTexture;