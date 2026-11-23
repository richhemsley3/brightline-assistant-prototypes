/* walk5.js [w1,w2] [ids…] : every state in walk.json at the given widths (default 1600,400). Records page errors, page overflow,
   any text under 14px, any element wider than its card, and the parts in the last turn. Output: walk5-results.json, shots/walk5/<id>-<w>.png */
const {execFileSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const SP=__dirname, W=JSON.parse(fs.readFileSync(path.join(SP,'walk.json'),'utf8'));
let args=process.argv.slice(2), widths=[1600,400]; if(args[0]&&/^\d+(,\d+)*$/.test(args[0])){ widths=args.shift().split(',').map(Number) }
fs.mkdirSync(path.join(SP,'shots','walk5'),{recursive:true});
const probe=`(function(){ var t=[].slice.call(document.querySelectorAll('.turn')).pop(); function txt(s,r){ var e=(r||document).querySelector(s); return e?e.textContent.trim():'' }
  var small=[], over=[];
  [].forEach.call(document.querySelectorAll('body *'),function(e){ if(!e.offsetParent&&getComputedStyle(e).position!=='fixed') return; var cs=getComputedStyle(e); if(cs.visibility==='hidden'||+cs.opacity===0) return;
    var hasText=[].some.call(e.childNodes,function(n){ return n.nodeType===3&&n.textContent.trim() }); if(hasText&&e.closest('svg')==null){ var fs=parseFloat(cs.fontSize); if(fs<14) small.push((e.className&&e.className.baseVal==null?e.className:e.tagName)+':'+fs+':'+e.textContent.trim().slice(0,30)) } });
  [].forEach.call(document.querySelectorAll('.thead,.prepared,.receipt,.chartsec,.paycard,.draft,.code,.recs,.standing,.rail,.pane'),function(c){ var cr=c.getBoundingClientRect(); if(!cr.width) return; [].forEach.call(c.querySelectorAll('*'),function(e){ if(e.closest('pre')||e.closest('table')&&c.classList.contains('paycard')) return; var r=e.getBoundingClientRect(); if(r.width&&r.right>cr.right+1) over.push(c.className.split(' ')[0]+'>'+(e.className&&e.className.baseVal==null?e.className:e.tagName)+':'+Math.round(r.right-cr.right)) }) });
  var svgsmall=[]; [].forEach.call(document.querySelectorAll('svg.imap'),function(s){ if(!s.getBoundingClientRect().width) return; var k=s.getBoundingClientRect().width/s.viewBox.baseVal.width; [].forEach.call(s.querySelectorAll('text'),function(x){ var f=parseFloat(getComputedStyle(x).fontSize)*k; if(f<13.5) svgsmall.push(Math.round(f*10)/10+':'+x.textContent.slice(0,20)) }) });
  return JSON.stringify({ title:document.title, scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, turnTitle:t?txt('.qtitle',t):'', parts:t?[].map.call(t.children,function(n){ return n.className.split(' ')[0] }).join(','):'', small:small.slice(0,8), smallN:small.length, over:over.slice(0,8), overN:over.length, svgsmall:svgsmall.slice(0,5), rail:txt('#rail .clock') }) })()`;
const out=[]; const states=W.states.filter(s=>!args.length||args.includes(s.id));
for(const s of states){ for(const w of widths){ const url=W.base+'&v='+Date.now()+'&'+s.q, png=path.join(SP,'shots','walk5',s.id+'-'+w+'.png');
  let r; try{ const o=execFileSync('node',[path.join(SP,'shot.js'),url,png,String(w),w>800?'1000':'800',probe,'3600'],{encoding:'utf8',timeout:90000}); r=JSON.parse(o.trim().split('\n').pop()) }catch(e){ r={error:String(e.message).slice(0,200)} }
  let p={}; try{ p=JSON.parse(r.result) }catch(e){ p={raw:r.result} }
  out.push(Object.assign({id:s.id,width:w,png,pageErrors:r.errors||[],shotError:r.error||null,height:r.height},p));
  console.log(s.id+'@'+w+' · '+(p.turnTitle||p.title||r.error||'?').slice(0,50)+(r.errors&&r.errors.length?' · ERRORS '+r.errors.join(' ; ').slice(0,200):'')+(p.scrollWidth>p.clientWidth?' · PAGE-OVERFLOW '+p.scrollWidth:'')+(p.smallN?' · SMALL '+p.smallN+' '+p.small.slice(0,3).join(' | '):'')+(p.overN?' · OVER '+p.overN+' '+p.over.slice(0,3).join(' | '):'')+(p.svgsmall&&p.svgsmall.length?' · SVG<14 '+p.svgsmall.slice(0,2).join(' | '):'')) } }
fs.writeFileSync(path.join(SP,'walk5-results.json'),JSON.stringify(out,null,1)); console.log('wrote '+out.length+' shots');
