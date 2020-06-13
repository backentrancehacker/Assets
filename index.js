const App = require('./server.js'),
	{getFiles} = require('./files.js'),
	util = require('./util.js')

let app = new App();

const files = getFiles('./public')

app.folder = './public';
app.get(['/', ''], (req, res) => {
	let toSend = files.map(file => file.replace('./public', '')).join('\n');
	app.send(toSend)
})
app.post(['/', ''], (req, res) => {
	app.send(files)
})
app.all('*', (req, res) => {
	app.sendFile(req.url)
})
app.start(8080);
