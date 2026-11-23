/* na-walk.js : Network Assist states at 1440 and 390 via ?to=N plus clicks. Flags errors, text under 14px, horizontal overflow. */
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path'); const SP=__dirname; fs.mkdirSync(path.join(SP,'shots','na'),{recursive:true});
const probe=`var small=[];[].forEach.call(document.querySelectorAll('.stage *'),function(e){ var cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0||!e.getClientRects().length) return; var ok=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()}); if(ok&&!e.closest('svg')&&parseFloat(cs.fontSize)<14) small.push((e.className||e.tagName)+':'+cs.fontSize+':'+e.textContent.trim().slice(0,24)) });
  var v=document.getElementById('view'); var over=[].filter.call(document.querySelectorAll('.col *, .home *'),function(e){ var r=e.getBoundingClientRect(); return r.width&&r.right>innerWidth+1 }).slice(0,5).map(function(e){return (e.className||e.tagName)+':'+Math.round(e.getBoundingClientRect().right)});
  JSON.stringify({small:small.slice(0,6),smallN:small.length,over:over,vsw:v.scrollWidth,vcw:v.clientWidth})`;
const sleep=ms=>`await new Promise(r=>setTimeout(r,${ms}));`, click=sel=>`(document.querySelector('${sel}')||{click(){}}).click();`;
const S=[
 {id:'home',to:1,wait:2500,js:''},
 {id:'answer',to:3,wait:11500,js:''},
 {id:'drill',to:4,wait:3000,js:click('#next [data-ask]')+sleep(7000)},
 {id:'prepared',to:5,wait:3000,js:click('#next2 [data-ask]')+sleep(5000)},
 {id:'sheet',to:5,wait:3000,js:click('#next2 [data-ask]')+sleep(5000)+click('#review3')+sleep(900)},
 {id:'receipt',to:5,wait:3000,js:click('#next2 [data-ask]')+sleep(5000)+click('#review3')+sleep(900)+click('#confirmbtn')+sleep(4500)}];
const only=process.argv.slice(2); const out=[];
for(const s of S.filter(x=>!only.length||only.includes(x.id))) for(const w of [1440,390]){ const png=path.join(SP,'shots','na',s.id+'-'+w+'.png');
  const ev=`(async()=>{ ${s.js} var v=document.getElementById('view'); var st=document.getElementById('stage'); document.documentElement.style.cssText='height:auto;overflow:visible'; document.body.style.cssText='height:auto;overflow:visible'; st.style.height=Math.max(innerHeight,v.scrollHeight+140)+'px'; ${sleep(300)} return (function(){ ${probe.replace('JSON.stringify({small','return JSON.stringify({small')} })() })()`;
  let r; try{ r=JSON.parse(execFileSync('node',[path.join(SP,'shot.js'),'http://localhost:8102/?to='+s.to+'&v='+Date.now(),png,String(w),w>800?'900':'844',ev,String(s.wait)],{encoding:'utf8',timeout:90000}).trim().split('\n').pop()) }catch(e){ r={error:String(e.message).slice(0,160)} }
  let p={}; try{p=JSON.parse(r.result)}catch(e){p={raw:String(r.result).slice(0,200)}}
  out.push({id:s.id,w,png,errors:r.errors,...p}); console.log(s.id+'@'+w+(r.errors&&r.errors.length?' ERRORS '+r.errors.join(';').slice(0,200):'')+(p.smallN?' SMALL '+p.smallN+' '+p.small.join(' | '):'')+(p.over&&p.over.length?' OVER '+p.over.join(' | '):'')+(p.vsw>p.vcw?' HSCROLL '+p.vsw:'')+(r.error?' '+r.error:'')+(p.raw?' RAW '+p.raw:'')) }
fs.writeFileSync(path.join(SP,'na-results.json'),JSON.stringify(out,null,1));
