const url = require('url'),
	fs = require('fs'),
	path = require('path'),
	createServer = require('http').createServer;

const types = {
	'.html': 'text/html',
	'.js':   'text/javascript',
	'.css':  'text/css',
	'.json': 'application/json',
	'.png':  'image/png',
	'.jpg':  'image/jpg',
	'.gif':  'image/gif',
	'.svg':  'image/svg+xml',
	'.wav':  'audio/wav',
	'.mp4':  'video/mp4',
	'.woff': 'application/font-woff',
	'.ttf':  'application/font-ttf',
	'.eot':  'application/vnd.ms-fontobject',
	'.otf':  'application/font-otf',
	'.wasm': 'application/wasm'
};

class App {
	constructor() {
		this.alternate;
		this.methods = {};
		this.folder;
		this.code;
		this.req;
		this.res;
		this.config('GET','POST')
	}
	config(){
		for(let method of arguments){
			this.methods[method] = {};
		}
	}
	use(func){
		func(this.req, this.res);
	}
	set(req, res){
		this.req = req;
		this.res = res;

		let parts = url.parse(req.url);

		let method = this.methods[this.req.method || 'GET'][parts.pathname || '/'],
			all = this.methods[this.req.method]['*'];

		if (method) {
			method(this.req, this.res);
		}
		else if(all){
			all(this.req, this.res);
		}
		else {
			let parts = url.parse(this.req.url),
				errorMethod = this.methods[this.req.method]['404'];
				
			if(!errorMethod){
				this.status(404);
				this.send('404 Not Found')
			}
			else errorMethod(this.req, this.res);
		}
	}
	get(path, callback) {
		this.methods['GET'][path] = callback;
	}
	post(path, callback){
		this.methods['POST'][path] = callback;
	}
	all(path, callback){
		for(let method in this.methods){
			this.methods[method][path] = callback;
		}
	}
	status(code){
		this.code = code;
	}
	send(data, headers){
		if(!this.code) this.status(200)
		
		if(!headers) headers = {'Content-Type': 'text/plain'};		

		this.res.writeHead(this.code, headers);
		this.res.end(data)
		
		this.status(200)
	}
	redirect(path){
		this.status(302)
		this.send(null, {
			'Location': path
		})
	}
	sendFile(file){
		let extension =	String(path.extname(file)),
			contentType = types[extension] || 'application/octet-stream', 
			data;
		
		try{
			data = fs.readFileSync(`${this.folder}${file}`);
			this.send(data, {
				'Content-Type': contentType
			})
		}
		catch(e){
			console.log(e)

			switch(e.code){
				case "ENOENT":
					this.status(404);
					this.send(`Cannot GET ${file}`)
					break;
				default: 
					this.status(500);
					this.send('Internal server error.')
			}
		}
	}
	collect(callback){
		let data = '';
		this.req.on('data', (chunk) => {
			data += chunk;
		})
		this.req.on('end', () => {
			callback(data)
		})
	}
	start(port){
		this.server = createServer((req, res) => {
			try{
				this.set(req, res)
			}
			catch(e){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Uptime Robot')
				console.log('Uptime Robot')
			}
		})
		this.server.listen(port)
	}
}
module.exports.App = App;
