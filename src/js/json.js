const jsonToLoad = {};
const importJson = (r) =>{
  let json = {};
  r.keys().map((item, index) => { json[item.replace('./', '')] = r(item); });
  return json;
}
const json = importJson(require.context('../../tmp/json/', false, /\.(json)$/));

for(let item in json){
	let name = item.replace(/\.[^.]+$/, '');		
	jsonToLoad[name] = [];
	import(
    '../../tmp/json/'+ item
	).then(({default: aData}) => {	
	    jsonToLoad[name].push(aData);	   
	});
}
export default jsonToLoad;