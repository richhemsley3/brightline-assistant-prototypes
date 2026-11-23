/* bawalk.js [w1,w2] [seats…] : Brightline Assist, each seat through its arc (home, answer, drill-down, sheet, receipt) at the given widths.
   Records page errors, page overflow, text under 14px (portal chrome counted separately), and elements wider than their block. */
const {execFileSync}=require('child_process'); const fs=require('fs'); const path=require('path'); const SP=__dirname;
let widths=[1600,400]; const a=process.argv.slice(2); if(a[0]&&/^\d/.test(a[0])) widths=a.shift().split(',').map(Number);
const seats=a.length?a:['dana','marcus','priya'], steps=['home','answer','drill','sheet','receipt'];
fs.mkdirSync(path.join(SP,'shots','ba'),{recursive:true});
function drive(n){ return `(async()=>{ const s=ms=>new Promise(r=>setTimeout(r,ms)); const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
  const N=${n}; let log=[];
  if(N>=1){ $('#sugg1').click(); await s(900) }
  if(N>=2){ const c=$$('.recs:not(.done) [data-rec]')[0]; if(c){ c.click(); await s(1200) } else log.push('no rec') }
  if(N>=3){ const b=$$('.prepared:not(.sent) .btn').pop(); if(b){ b.click(); await s(700) } else log.push('no prepared') }
  if(N>=4){ const ok=$('#shOk'); if(ok&&$('#scrim').classList.contains('open')){ ok.click(); await s(900) } else log.push('no sheet'); window.scrollTo(0,document.body.scrollHeight); await s(300) }
  const small=[], chrome=[], over=[];
  $$('body *').forEach(e=>{ const cs=getComputedStyle(e); if((!e.offsetParent&&cs.position!=='fixed')||cs.visibility==='hidden'||+cs.opacity===0) return; if(e.closest('svg')) return;
    const own=[...e.childNodes].some(x=>x.nodeType===3&&x.textContent.trim()); if(!own) return; const fz=parseFloat(cs.fontSize); if(fz<14){ const t=(typeof e.className==='string'?e.className:e.tagName)+':'+fz+':'+e.textContent.trim().slice(0,24); (e.closest('.appbar,.sb')?chrome:small).push(t) } });
  $$('svg').forEach(sv=>{ const r=sv.getBoundingClientRect(); if(!r.width||!sv.viewBox||!sv.viewBox.baseVal||!sv.viewBox.baseVal.width) return; const k=r.width/sv.viewBox.baseVal.width; sv.querySelectorAll('text').forEach(x=>{ const f=parseFloat(getComputedStyle(x).fontSize)*k; if(f<13.5&&getComputedStyle(x).opacity!=='0') small.push('svg:'+Math.round(f*10)/10+':'+x.textContent.slice(0,20)) }) });
  $$('.turn,.home,.prepared,.receipt,.recs,.figure,.chartsec,.paycard,.draft,.code,.hero,.card,.sheet').forEach(c=>{ const cr=c.getBoundingClientRect(); if(!cr.width) return; c.querySelectorAll('*').forEach(e=>{ if(e.closest('pre')||e.closest('.orow')||(e.closest('table')&&e.closest('.paycard'))) return; const r=e.getBoundingClientRect(); if(r.width&&r.right>cr.right+1) over.push(c.className.split(' ')[0]+'>'+(typeof e.className==='string'?e.className:e.tagName)+':'+Math.round(r.right-cr.right)) }) });
  return JSON.stringify({log, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, title:document.title, small:small.slice(0,6), smallN:small.length, chromeN:chrome.length, chrome:chrome.slice(0,4), over:over.slice(0,5), overN:over.length, turns:$$('.turn').length, receipt:!!$('.receipt'), sheet:$('#scrim').classList.contains('open') }) })()` }
const out=[];
for(const seat of seats) for(const [n,st] of steps.entries()) for(const w of widths){
  const png=path.join(SP,'shots','ba',seat+'-'+st+'-'+w+'.png'), url='http://localhost:8100/?fast&v='+Date.now();
  const expr=`(async()=>{ document.querySelector('[data-seat="${seat}"]').click(); await new Promise(r=>setTimeout(r,700)); return await ${drive(n)} })()`;
  let r; try{ const o=execFileSync('node',[path.join(SP,'shot.js'),url,png,String(w),w>800?'1000':'800',expr,'1500'],{encoding:'utf8',timeout:90000}); r=JSON.parse(o.trim().split('\n').pop()) }catch(e){ r={error:String(e.message).slice(0,200)} }
  let p={}; try{ p=JSON.parse(r.result) }catch(e){ p={raw:r.result} }
  out.push(Object.assign({seat,step:st,w,png,errors:r.errors||[]},p));
  console.log(seat+' '+st+'@'+w+' · '+(p.title||r.error||JSON.stringify(p.raw)||'?').slice(0,48)+(p.log&&p.log.length?' · LOG '+p.log.join(','):'')+(r.errors&&r.errors.length?' · ERRORS '+r.errors.join(' ; ').slice(0,200):'')+(p.sw>p.cw?' · PAGE-OVERFLOW '+p.sw:'')+(p.smallN?' · SMALL '+p.smallN+' '+p.small.slice(0,3).join(' | '):'')+(p.overN?' · OVER '+p.overN+' '+p.over.slice(0,3).join(' | '):'')+(p.chromeN?' · chrome<14 '+p.chromeN:'')) }
fs.writeFileSync(path.join(SP,'bawalk-results.json'),JSON.stringify(out,null,1)); console.log('wrote '+out.length);
