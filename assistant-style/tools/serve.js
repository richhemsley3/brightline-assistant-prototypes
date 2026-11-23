/* serve.js dir port : a tiny static server for screenshots */
const http=require('http'),fs=require('fs'),path=require('path');const [dir,port]=process.argv.slice(2);
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.otf':'font/otf','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(dir,p);if(!f.startsWith(path.resolve(dir))){r.writeHead(403);return r.end()}
fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});r.end(b)})}).listen(+port,()=>console.log('serving '+dir+' on '+port));
