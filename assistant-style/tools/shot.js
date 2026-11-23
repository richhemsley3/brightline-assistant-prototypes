/* shot.js url out.png width height [evalJS] [waitMs] : drives headless Chrome over CDP, evaluates JS, screenshots the full page */
const {spawn}=require('child_process'); const http=require('http'); const fs=require('fs');
const [,,url,out,W='1440',H='1400',evalJS='',waitMs='1500']=process.argv;
const port=9300+Math.floor(Math.random()*500);
const PROFILE=require('path').join(require('os').tmpdir(),'cdp-profile-'+port+'-'+Date.now()); /* temp profile, removed on exit */
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--hide-scrollbars','--remote-debugging-port='+port,'--window-size='+W+','+H,'--user-data-dir='+PROFILE,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const getJSON=p=>new Promise((res,rej)=>http.get('http://127.0.0.1:'+port+p,r=>{let b='';r.on('data',d=>b+=d);r.on('end',()=>{try{res(JSON.parse(b))}catch(e){rej(e)}})}).on('error',rej));
(async()=>{ try{
  let list=null; for(let i=0;i<40&&!list;i++){ try{ list=await getJSON('/json/list') }catch(e){ await sleep(250) } }
  const page=list.find(t=>t.type==='page'); const ws=new WebSocket(page.webSocketDebuggerUrl); let id=0, pend={};
  await new Promise(r=>ws.onopen=r); const errs=[]; ws.onmessage=m=>{ const d=JSON.parse(m.data); if(d.method==='Runtime.exceptionThrown'){ const ex=d.params.exceptionDetails; errs.push((ex.exception&&ex.exception.description||ex.text||'').split('\n').slice(0,2).join(' | ')) } if(d.method==='Runtime.consoleAPICalled'&&d.params.type==='error'){ errs.push('console.error: '+d.params.args.map(a=>a.value||a.description).join(' ')) } if(d.id&&pend[d.id]){ pend[d.id](d); delete pend[d.id] } };
  const send=(method,params={})=>new Promise(r=>{ const i=++id; pend[i]=r; ws.send(JSON.stringify({id:i,method,params})) });
  await send('Emulation.setDeviceMetricsOverride',{width:+W,height:+H,deviceScaleFactor:1,mobile:+W<800});
  await send('Page.enable'); await send('Runtime.enable'); await send('Page.navigate',{url}); await sleep(+waitMs);
  let result=null; if(evalJS){ const r=await send('Runtime.evaluate',{expression:evalJS,awaitPromise:true,returnByValue:true}); result=r.result&&r.result.result?r.result.result.value:r; await sleep(600) }
  const m=await send('Page.getLayoutMetrics'); const ch=Math.min(Math.ceil(m.result.cssContentSize.height),6000);
  await send('Emulation.setDeviceMetricsOverride',{width:+W,height:ch,deviceScaleFactor:1,mobile:+W<800}); await sleep(300);
  const s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true}); fs.writeFileSync(out,Buffer.from(s.result.data,'base64'));
  console.log(JSON.stringify({out,height:ch,result,errors:errs}));
 }catch(e){ console.error('ERR',e.message) } finally{ chrome.kill('SIGKILL'); setTimeout(function(){ try{ fs.rmSync(PROFILE,{recursive:true,force:true}) }catch(e){} process.exit(0) },300) } })();
