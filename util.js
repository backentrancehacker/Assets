const Time = () => {
	let today = new Date(),
		date = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0'),
		time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');

	return `${date} ${time}`;
	
}
function log(){
	let fullList = `${Time()} |`;
	for(let argument of arguments){
		fullList += ` ${argument}`;
	}
	fullList += '\n'
	console.log(fullList);
	return fullList;
}
module.exports.log = log;
