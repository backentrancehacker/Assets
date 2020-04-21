const {App} = require('./server.js'),
	{getFiles} = require('./files.js');

let app = new App()


const files = getFiles('./public')

app.folder = './public';
app.get('/', (req, res) => {
	app.send(`AdCharity Assets\n${files.join('\n')}`)
})
app.post('/', (req, res) => {
	app.send(files)
})
app.all('*', (req, res) => {
	app.sendFile(req.url)
})
app.start(8080);
