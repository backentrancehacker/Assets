const fs = require('fs')

function getFiles(folder, files_) {
	files_ = files_ || new Array;
	let files = fs.readdirSync(folder);
	for (let i in files){
		let name = folder + '/' + files[i];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, files_);
		} 
		else {
			files_.push(name);
		}
	}
	return files_;
}
module.exports.getFiles = getFiles;
