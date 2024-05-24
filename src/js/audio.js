const ad_conf = require('../../ad_conf.js');
const conf = ad_conf.scripts.audio_conf;
//---------------------------------------------------------------------

const audioToLoad = [];
const importAudio= (r) =>{
  let audio = {};
  r.keys().map((item, index) => { audio[item.replace('./', '')] = r(item); });
  return audio;
}
const audio = importAudio(require.context('../../tmp/audio/', false, /\.(mp3)$/));
let i = 0;
for(let mp3 in audio){
	let name = mp3.replace(/\.[^.]+$/, '');	
	let loop = false;
	let volume = 1;
	conf.forEach(c =>{
		if(c.n == name){
			loop = c.loop;
			volume = c.volume;	
		}		
	});
	audioToLoad.push({
		name:name,	
		loop:loop,
		volume:volume,
		path: audio[mp3].default
	});
	i++;
}

const aLoadSounds = audioToLoad;
export default aLoadSounds;