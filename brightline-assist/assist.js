/* Brightline Assist: the engine, ported from the Network Assist prototype. Sign in; the briefing with the ask
   field in the page; type in place; on send the field drops to the bottom as the assist bar, the question
   rises into the title, the sidebar steps aside and the answer composes around one prepared action. Approving
   it gives a receipt and the next steps that follow from it. Nothing moves on without the person. */
(function(){
  "use strict";
  var D=window.BA, FLOWS=D.FLOWS, ACTS=D.ACTS;
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var esc=function(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};
  var NS='http://www.w3.org/2000/svg';
  function el(t,a,txt){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e}
  var reduce=(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||/[?&]fast\b/.test(location.search);
  var app, SEAT=null, HOME=null, run=0, gates=[], timers=[], SUGGEST=null, aiT=0, toastT=0;
  var ARROW='<svg viewBox="0 0 14 14"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5"/></svg>';
  var TICK='<svg class="tick" viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5"/></svg>';
  var CB='<span class="cb"><svg viewBox="0 0 12 12"><path d="M2.5 6.5 5 9l4.5-6"/></svg></span>';

  /* ── timing ── */
  function wait(ctx,ms){ if(ctx.fast||reduce) return Promise.resolve(); return new Promise(function(res,rej){ setTimeout(function(){ ctx.tok===run?res():rej('cancel') },ms) }) }
  function frame(){ return new Promise(function(r){ var done=false, t=setTimeout(function(){ if(!done){ done=true; r() } },120); requestAnimationFrame(function(){ requestAnimationFrame(function(){ if(!done){ done=true; clearTimeout(t); r() } }) }) }) }
  function money(n){ return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) }
  function cancelGates(){ gates.forEach(function(g){ g.cleanup(); g.rej('cancel') }); gates=[] }
  /* waits for a click (or Enter / Space) on one of the elements; resolves with the one that was clicked */
  function gate(ctx,els){ if(ctx.tok!==run) return Promise.reject('cancel'); els=[].concat(els);
    return new Promise(function(res,rej){ var g={rej:rej,hs:[]};
      function fire(x,e){ if(e){ e.preventDefault(); e.stopPropagation() } g.cleanup(); gates=gates.filter(function(y){return y!==g}); if(ctx.tok!==run){ rej('cancel'); return } res(x) }
      els.forEach(function(x){ var c=function(e){ fire(x,e) }, k=function(e){ if(e.key==='Enter'||e.key===' ') fire(x,e) }; g.hs.push([x,c,k]); x.addEventListener('click',c); x.addEventListener('keydown',k); x.classList.add('await') });
      g.cleanup=function(){ g.hs.forEach(function(h){ h[0].removeEventListener('click',h[1]); h[0].removeEventListener('keydown',h[2]); h[0].classList.remove('await') }) };
      gates.push(g) }) }
  function icon(n,cls){ return window.gnIcon?gnIcon(n,cls):'' }
  function clearTimers(){ timers.forEach(clearInterval); timers=[] }
  function announce(t){ var l=$('#live'); l.textContent=''; setTimeout(function(){ l.textContent=t },30) }
  function toast(msg){ var t=$('#toast'); clearTimeout(toastT); t.textContent=msg; t.classList.add('on'); toastT=setTimeout(function(){ t.classList.remove('on') },5000); announce(msg) }
  function scrollTo(ctx,node){ if(ctx.fast) return; var r=node.getBoundingClientRect(), bottom=r.bottom+window.scrollY+120, vh=window.innerHeight; if(bottom>window.scrollY+vh) window.scrollTo({top:bottom-vh,behavior:'smooth'}) }

  /* ── sign in ── */
  function renderSignin(){ $('#accounts').innerHTML=Object.keys(D.SEATS).map(function(k){ var s=D.SEATS[k]; return '<button class="account" type="button" data-seat="'+k+'"><img src="'+s.av+'" alt=""><span class="t"><b>'+esc(s.n)+'</b><span>'+esc(s.r)+' · '+esc(s.org)+'</span></span><span class="p">'+esc(s.portal)+'</span></button>' }).join('');
    $$('#accounts [data-seat]').forEach(function(b){ b.onclick=function(){ signIn(b.dataset.seat) } }) }
  function signIn(k){ SEAT=D.SEATS[k]; HOME=D.HOME[k]; app=$('#app'); $('#signin').hidden=true; app.hidden=false; renderHeader(); renderNav(); goHome() }

  /* ── header and sidebar: the portal's own ── */
  function renderHeader(){ var h=$('#hdr');
    h.innerHTML='<div class="mark" id="hMark" role="link" tabindex="0"><i>D</i><span>'+esc(SEAT.portal)+'</span></div><div class="org"><b>'+esc(SEAT.org)+'</b>'+(SEAT.state?'<span class="st">'+SEAT.state+'</span>':'')+'</div>'
      +'<div class="q"><form id="hFind" role="search">'+icon('search')+'<input type="text" id="hFindIn" autocomplete="off" aria-label="Find" placeholder="'+esc(SEAT.ph)+'"><kbd>/</kbd></form></div>'
      +'<div class="r"><span class="a needs" id="hNeeds" role="link" tabindex="0">'+icon(SEAT.needs[2])+'<span class="lb">'+esc(SEAT.needs[0])+'</span><span class="n">'+SEAT.needs[1]+'</span></span><span class="a" role="link" tabindex="0">'+icon('help')+'<span class="lb">Help</span></span>'
      +'<div class="u" id="hUser" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><img src="'+SEAT.av+'" alt=""><span class="nm">'+esc(SEAT.n)+'<span>'+esc(SEAT.r)+'</span></span>'+icon('down')+'</div></div>';
    $('#hMark').onclick=leave; $('#hMark').onkeydown=function(e){ if(e.key==='Enter') leave() };
    $('#cclose').onclick=leave;
    $('#hNeeds').onclick=function(){ openPage(SEAT.k==='marcus'?'home':'alerts') };
    /* the portal's find box: on this prototype it hands the question to the assistant */
    $('#hFind').onsubmit=function(e){ e.preventDefault() };
    $('#hFindIn').onfocus=function(){ var r=$('#reply'); if(r&&app.dataset.state==='home'){ this.blur(); r.click() } };
    var u=$('#hUser'); u.onclick=function(e){ e.stopPropagation(); var m=$('#hMenu'); if(m){ m.remove(); u.setAttribute('aria-expanded','false'); return }
      var p=document.createElement('div'); p.className='menu'; p.id='hMenu'; p.setAttribute('role','menu'); p.innerHTML='<div class="h">'+esc(SEAT.n)+' · '+esc(SEAT.org)+'</div><button role="menuitem" type="button">Notification settings</button><hr><button role="menuitem" type="button" id="signout">Sign out</button>'; u.appendChild(p); u.setAttribute('aria-expanded','true'); $('#signout').onclick=function(){ location.reload() } };
    document.addEventListener('click',function(e){ var m=$('#hMenu'); if(m&&!m.contains(e.target)){ m.remove(); u.setAttribute('aria-expanded','false') } });
    /* keys: Tab accepts the proposed question; Escape leaves the assistant (the sheet takes Escape first); / finds */
    document.addEventListener('keydown',function(e){
      if(e.key==='Tab'&&SUGGEST&&$('#cbox').classList.contains('await')){ e.preventDefault(); $('#cbox').click(); return }
      if(e.key==='Escape'&&app.dataset.state==='answer'&&!$('#scrim').classList.contains('open')){ leave(); return }
      if(e.key==='/'&&app.dataset.state==='home'&&!/input|textarea/i.test(e.target.tagName)){ e.preventDefault(); var r=$('#reply'); if(r) r.click() } });
  }
  function renderNav(){ var sb=$('#sb'); sb.innerHTML='<nav aria-label="Pages">'+D.NAV[SEAT.k].map(function(g){ return (g[0]?'<span class="g">'+esc(g[0])+'</span>':'')+g[1].map(function(it){ var needs=it[2]&&['alerts','disputes','notices'].indexOf(it[0])>-1||(it[0]==='home'&&SEAT.k==='marcus'); return '<a role="link" tabindex="0" data-page="'+it[0]+'">'+icon(it[3])+esc(it[1])+(it[2]?'<span class="n'+(needs?' needs':'')+'">'+it[2]+'</span>':'')+'</a>' }).join('') }).join('')+'</nav><div class="foot">'+esc(SEAT.n)+'<span>'+esc(SEAT.org)+'</span></div>';
    $$('#sb a').forEach(function(a){ a.onclick=function(){ a.dataset.page==='home'?leave():openPage(a.dataset.page) }; a.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); a.click() } } }) }
  function navOn(k){ $$('#sb a').forEach(function(a){ a.classList.toggle('on',a.dataset.page===k) }) }
  function navLabel(k){ var l=k; D.NAV[SEAT.k].forEach(function(g){ g[1].forEach(function(it){ if(it[0]===k) l=it[1] }) }); return l }

  /* ── the home ── */
  var DONE={}, THREAD=null;
  /* leaving the assistant keeps the conversation: the briefing offers to continue it; a new question replaces it */
  function leave(){ if(app.dataset.state==='answer'&&$('#col .turn')){ var col=$('#col'); THREAD={col:col,title:document.title,q:$$('.qtitle',col).pop().textContent}; col.remove() } else { dropThread(); return goHome() } goHome(true) }
  function dropThread(){ if(THREAD){ cancelGates(); clearTimers(); DONE={} } THREAD=null }
  function resume(){ if(!THREAD) return; var old=$('#col'); old.replaceWith(THREAD.col); app.dataset.state='answer'; navOn(null); document.title=THREAD.title; THREAD=null; window.scrollTo(0,0); if(SUGGEST) ai('land') }
  function goHome(keep){ var tok; if(keep){ tok=run } else { tok=++run; cancelGates(); clearTimers(); SUGGEST=null; DONE={} } app.dataset.state='home'; app.classList.remove('typing'); navOn('home'); document.title=SEAT.portal+' · Brightline Assist';
    var H=HOME, m=$('#main');
    m.innerHTML='<section class="s-home"><div class="home" id="home">'
      +'<div class="phead"><h1 class="pt">'+esc(navLabel('home'))+'</h1><div class="byline"><i class="aimark"></i><span>'+esc(H.eyebrow)+'</span></div></div><p class="bh">'+H.h1+'</p>'
      +'<div class="hero"><div class="hl"><span class="k">'+esc(H.hero.k)+'</span><span class="hv">'+esc(H.hero.v)+'</span><span class="hd">'+H.hero.d+'</span><div class="chart hcc" id="spark"></div></div><div class="hr">'+H.side.map(function(s){ return '<div><span class="k">'+esc(s[0])+'</span><span class="vv">'+esc(s[1])+'</span><span class="n">'+s[2]+'</span></div>' }).join('')+'</div></div>'
      +'<div class="asksec"><div class="reply ring" id="reply" role="button" tabindex="0"><i class="aimark"></i><span class="rin"><span id="rtext">Reply to this briefing, or ask about anything</span><span class="caret"></span></span><span class="send" id="rsend">'+ARROW+'</span></div>'
      +'<div class="sugg">'+'<span class="k"><i class="aimark"></i>Suggested</span>'+(THREAD?'<button type="button" class="chip" id="resume"><i class="aimark"></i>Continue: '+esc(THREAD.q)+'</button>':'')+'<button type="button" class="chip" id="sugg1">'+esc(FLOWS[H.q].q)+'</button></div><span class="rparse" id="rparse">'+H.parse+'</span></div>'
      +'<div class="insg"><div class="card lead" id="lead" role="button" tabindex="0"><span class="lab">'+esc(H.lead.lab)+'</span><span class="num">'+esc(H.lead.num)+'</span><p class="say">'+H.lead.say+'</p><div class="rows">'+H.lead.rows.map(function(r){ return '<div><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>' }).join('')+'</div><button class="chip ask" type="button" id="leadBtn"><i class="aimark"></i>'+esc(H.lead.btn)+'</button></div>'
      +H.cards.map(function(c){ return '<div class="card"><span class="lab">'+esc(c.lab)+'</span><span class="num">'+esc(c.num)+'</span><p class="say">'+c.say+'</p></div>' }).join('')+'</div>'
      +'</div></section><section class="s-answer"><div class="col" id="col"></div></section>';
    requestAnimationFrame(function(){ buildSpark(H.hero) }); if(!keep) clearComposer(); $('#parse').classList.remove('in'); window.scrollTo(0,0);
    requestAnimationFrame(function(){ $('#home').classList.add('lit') });
    var ctx={tok:tok,fast:false};
    if(THREAD) $('#resume').onclick=resume;
    $('#sugg1').onclick=function(){ askNow(ctx,true) }; $('#lead').onclick=function(e){ if(e.target.closest('.ask')) return; askNow(ctx,true) }; $('#leadBtn').onclick=function(){ askNow(ctx,true) };
    actSearch(ctx).catch(function(){}) }
  /* the briefing's chart: a plain line with points, a dotted grid with its scale on the left, a dated axis, the last
     point labelled. Hover any point for its value and day. */
  /* the home figure's history: columns from zero on a dated axis, the latest in navy and labelled, a tooltip per column */
  function buildSpark(h){ var host=$('#spark'); if(!host) return; var v=h.spark, n=v.length, ax=h.axis||h.labels, mid=Math.floor((n-1)/2), fmtT=h.tick||function(x){ return String(x) };
    columns(host,{values:v, max:h.hi, ticks:h.ticks||[0,h.hi], tick:fmtT, height:128, latest:n-1, latestLabel:h.tick?h.tick(v[n-1]):(h.fmt?h.fmt(v[n-1]):String(v[n-1])),
      xlab:function(i){ return i===0?[ax[i],'l']:i===mid?[ax[i],'c']:i===n-1?[ax[i],'r']:null },
      tip:function(i){ return [h.labels?h.labels[i]:ax[i], h.fmt?h.fmt(v[i]):String(v[i])] } });
    requestAnimationFrame(function(){ grow(host) }) }
  function openPage(k){ if(app.dataset.state==='answer'){ leave() } app.dataset.state='home'; app.classList.remove('typing'); navOn(k); document.title=navLabel(k)+' · '+SEAT.portal;
    $('#main').innerHTML='<div class="nb"><h1>'+esc(navLabel(k))+'</h1><p>Not built in this prototype. The assistant can still answer about it.</p><div class="row"><button type="button" class="chip" id="nbq"><i class="aimark"></i>'+esc(FLOWS[HOME.q].q)+'</button></div></div>';
    $('#nbq').onclick=function(){ goHome(); setTimeout(function(){ var ctx={tok:run,fast:false}; askNow(ctx,true) },400) }; window.scrollTo(0,0) }

  /* ── the field on the home: click, type in place, send ── */
  var TYPED=false;
  async function typeQ(ctx){ var H=HOME, Q=FLOWS[H.q].q, ct=$('#rtext'); app.classList.add('typing'); ct.textContent=''; await wait(ctx,350);
    if(ctx.fast||reduce){ ct.textContent=Q } else { for(var i=0;i<Q.length;i++){ ct.textContent=Q.slice(0,i+1); await wait(ctx,Q[i]===' '?90:45+Math.random()*40) } }
    $('#rsend').classList.add('ready');
    var html=esc(Q); (H.terms||[]).forEach(function(t,i){ html=html.replace(new RegExp('('+t+'[a-z]*)','i'),'<span class="term" id="t'+i+'">$1</span>') }); ct.innerHTML=html;
    for(var k=0;k<(H.terms||[]).length;k++){ await wait(ctx,k?220:120); var te=$('#t'+k); if(te) te.classList.add('on') }
    await wait(ctx,180); $('#rparse').classList.add('in'); TYPED=true }
  async function actSearch(ctx){ TYPED=false; await gate(ctx,$('#reply')); await typeQ(ctx); await gate(ctx,$('#rsend')); startFirst(ctx) }
  /* a card or the suggestion asks straight away: it types, then waits on send */
  function askNow(ctx0,auto){ dropThread(); var tok=++run; cancelGates(); var ctx={tok:tok,fast:false}; (async function(){ try{ if(!TYPED) await typeQ(ctx); else { $('#rsend').classList.add('ready') } if(auto){ await wait(ctx,400); startFirst(ctx) } else { await gate(ctx,$('#rsend')); startFirst(ctx) } }catch(e){} })() }
  function startFirst(ctx){ dropThread(); var tok=++run; cancelGates(); var c={tok:tok,fast:false}; DONE={}; $('#col').innerHTML=''; runFlow(c,HOME.q,true).catch(function(e){ if(e!=='cancel') console.error(e) }) }
  /* a later turn started by a recommendation or a next step: the older chain is let go */
  function startTurn(id){ var tok=++run; cancelGates(); $$('.recs:not(.done)').forEach(function(r){ r.classList.add('done') }); $('#cbox').classList.remove('suggest'); $('#ctext').textContent=FLOWS[id].q; $('#ctext').style.color='var(--c-ink)'; $('#csend').classList.add('ready');
    var ctx={tok:tok,fast:false}; (async function(){ try{ await wait(ctx,450); await runFlow(ctx,id,false) }catch(e){ if(e!=='cancel') console.error(e) } })() }

  /* ── the composer ── */
  function clearComposer(){ var b=$('#cbox'); b.classList.remove('suggest','working','land'); var ct=$('#ctext'); ct.textContent='Ask a follow-up'; ct.style.color=''; $('#csend').classList.remove('ready'); SUGGEST=null }
  function suggest(id){ var b=$('#cbox'); SUGGEST=id; $('#ctext').textContent=FLOWS[id].q; $('#ctext').style.color=''; $('#csend').classList.remove('ready'); b.classList.add('suggest') }
  function ai(st){ var e=$('#cbox'); e.classList.remove('working','land'); if(st==='working') e.classList.add('working'); if(st==='land'){ void e.offsetWidth; e.classList.add('land') } clearTimeout(aiT); if(st==='land') aiT=setTimeout(function(){ ai('rest') },1300) }
  function flipTo(ctx,srcEl,title){ var from=srcEl.getBoundingClientRect(), fs=parseFloat(getComputedStyle(srcEl).fontSize); return function(){ var to=title.getBoundingClientRect(); if(!ctx.fast&&!reduce&&title.animate){ var s=fs/parseFloat(getComputedStyle(title).fontSize); title.animate([{transform:'translate('+(from.left-to.left)+'px,'+(from.top-to.top)+'px) scale('+s+')',opacity:.6},{transform:'none',opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}) } } }
  function recButtons(ids){ return ids.map(function(id){ return '<button type="button" class="chip" data-rec="'+id+'">'+esc(FLOWS[id].q)+'</button>' }).join('') }

  /* ── a turn ── */
  async function runFlow(ctx,id,first){
    var f=FLOWS[id], col=$('#col'), t=document.createElement('div'); t.className='turn'+(first?'':' later');
    t.innerHTML='<h2 class="qtitle'+(first?'':' small')+'">'+esc(f.q)+'</h2>'
      +'<div class="trace-wrap"><div class="trace">'+f.trace.map(function(s){ return '<div class="step"><span class="ic"><span class="spin"></span></span><span class="t">'+esc(s[0])+'</span><span class="r"></span></div>' }).join('')+'</div></div>'
      +(f.read?'<div class="summary"><i class="aimark"></i><span>'+esc(f.read)+'</span>'+(f.noToggle?'<span class="steps">'+f.trace.length+' step'+(f.trace.length>1?'s':'')+'</span>':'<button class="steps" type="button" aria-expanded="false">'+f.trace.length+' steps<i class="pm"></i></button>')+'</div>'+(f.query?'<pre class="qcode">'+esc(f.query)+'</pre>':''):'')
      +'<p class="lead-p"></p>';
    col.appendChild(t); document.title=f.q+' · '+SEAT.portal;
    if(first){
      /* the field drops to the bottom as the bar; the question rises into the title */
      var go=flipTo(ctx,$('#rtext'),$('.qtitle',t)), boxFrom=$('#reply').getBoundingClientRect();
      $('#rparse').classList.remove('in'); app.classList.remove('typing'); app.dataset.state='answer'; navOn(null); window.scrollTo(0,0); clearComposer(); go();
      var bx=$('#cbox'); await frame(); var bt=bx.getBoundingClientRect();
      if(!ctx.fast&&!reduce&&bx.animate){ bx.animate([{transform:'translate('+(boxFrom.left-bt.left)+'px,'+(boxFrom.top-bt.top)+'px) scale('+(boxFrom.width/bt.width)+','+(boxFrom.height/bt.height)+')',transformOrigin:'0 0'},{transform:'none',transformOrigin:'0 0'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'}) }
      await wait(ctx,650); ai('working'); await wait(ctx,250);
    } else {
      var go2=flipTo(ctx,$('#ctext'),$('.qtitle',t)); clearComposer(); go2(); ai('working');
      window.scrollTo({top:t.firstChild.getBoundingClientRect().top+window.scrollY-88,behavior:reduce?'auto':'smooth'}); await wait(ctx,450);
    }
    /* the work in the open */
    var steps=$$('.step',t);
    for(var i=0;i<steps.length;i++){ steps[i].classList.add('in'); scrollTo(ctx,steps[i]); await wait(ctx,i===2?950:700); $('.r',steps[i]).textContent=f.trace[i][1]; $('.ic',steps[i]).innerHTML=TICK; await frame(); steps[i].classList.add('done'); await wait(ctx,120) }
    if(!f.nofold){ await wait(ctx,1400); var tw=$('.trace-wrap',t); tw.style.height=tw.offsetHeight+'px'; await frame(); tw.style.height='0px'; var sm=$('.summary',t); if(sm) sm.classList.add('in'); await wait(ctx,450); tw.hidden=true } else { await wait(ctx,250) }
    var tog=$('button.steps',t); if(tog){ tog.onclick=function(){ var q=$('.qcode',t), on=q.classList.toggle('open'); tog.classList.toggle('open',on); tog.setAttribute('aria-expanded',on) } }
    /* the voice */
    await words(ctx,$('.lead-p',t),f.lead); await wait(ctx,350);
    /* the composed parts, in reading order: the evidence first, then the action it supports, then the asks,
       so the turn ends with what she can do, just above the bar (Rich, Nov 23: reading, comprehension, then action) */
    var act=f.act?ACTS[f.act]:null;
    var recs=(f.recs||[]).filter(function(k){ return FLOWS[k] }), rb=null;
    if(f.figure){ var fg=renderFigure(f.figure); t.appendChild(fg); await frame(); fg.classList.add('in'); scrollTo(ctx,fg); await animFigure(ctx,fg,f.figure); await wait(ctx,350) }
    if(f.chart){ var cs=document.createElement('div'); cs.className='chartsec reveal'; cs.innerHTML='<h4>'+esc(f.chart.title)+'<span>'+esc(f.chart.sub)+'</span></h4><div class="chart"></div>'; t.appendChild(cs); await frame(); cs.classList.add('in'); scrollTo(ctx,cs); await wait(ctx,250); await drawChart(ctx,$('.chart',cs),f.chart,function(r){ pick(r,act) }); await wait(ctx,250) }
    if(f.rows){ var pc=renderRows(f.rows); t.appendChild(pc); await frame(); pc.classList.add('in'); scrollTo(ctx,pc);
      await animRows(ctx,pc,f.rows,f.rows.toggle?function(n){ var pw=$('.prepared .w',t), pb=$('.prepared .btn',t); if(pw&&act&&act.tN) pw.textContent=act.tN(n); if(pb) pb.disabled=n===0 }:null); await wait(ctx,300) }
    if(f.draft){ var dr=document.createElement('div'); dr.className='draft reveal'; dr.innerHTML='<div class="h"><b>'+esc(f.draft.title)+'</b><span>'+esc(f.draft.words)+'</span><button class="tonal" type="button">Edit</button></div><p>'+esc(f.draft.text)+'</p>'; $('.tonal',dr).onclick=function(){ toast('Editing the draft isn’t in this prototype.') }; t.appendChild(dr); await frame(); dr.classList.add('in'); scrollTo(ctx,dr); await wait(ctx,500) }
    if(f.code){ var cd=document.createElement('div'); cd.className='code reveal'; cd.innerHTML='<div class="h">'+esc(f.code.title)+'</div><pre>'+esc(f.code.text)+'</pre>'; t.appendChild(cd); await frame(); cd.classList.add('in'); scrollTo(ctx,cd); await wait(ctx,500) }
    /* then the action, sized to what the evidence selected */
    if(act){ var pr=renderPrepared(act); t.appendChild(pr);
      if(f.rows&&f.rows.toggle&&act.tN){ var nsel=$$('tr.sel',t).length, pw0=$('.w',pr), pb0=$('.btn',pr); if(pw0) pw0.textContent=act.tN(nsel); if(pb0) pb0.disabled=nsel===0 }
      await frame(); pr.classList.add('in'); scrollTo(ctx,pr); await wait(ctx,500) }
    /* and last, a way to look closer or a neighbouring question. The first waits in the bar with Tab. */
    if(recs.length){ rb=document.createElement('div'); rb.className='recs reveal'; rb.innerHTML='<span class="k"><i class="aimark"></i>'+(act?'Before you decide':'Suggested')+'</span><div class="row">'+recButtons(recs)+'</div>'; t.appendChild(rb); await frame(); rb.classList.add('in'); scrollTo(ctx,rb); await wait(ctx,300) }
    if(recs.length){ suggest(recs[0]); ai('land'); announce('Suggested: '+FLOWS[recs[0]].q);
      var chosen=await gate(ctx,[$('#cbox')].concat($$('[data-rec]',rb))), next=chosen.dataset&&chosen.dataset.rec?chosen.dataset.rec:recs[0];
      rb.classList.add('done'); $$('[data-rec]',rb).forEach(function(b){ b.classList.toggle('picked',b.dataset.rec===next) });
      startTurn(next) }
    else { ai('land') }
  }
  async function words(ctx,node,html){ node.innerHTML=html.split(/(<[^>]+>)/).map(function(p){ return p.charAt(0)==='<'?p:p.replace(/(\S+)/g,'<span class="w">$1</span>') }).join(''); var ws=$$('.w',node); for(var i=0;i<ws.length;i++){ ws[i].classList.add('in'); await wait(ctx,28) } }

  /* ── parts ── */
  function renderFigure(fg){ var d=document.createElement('div'); d.className='figure reveal'+(fg.split?'':' nosplit');
    d.innerHTML='<span class="k">'+esc(fg.k)+'</span><span class="big" data-big>'+fmtBig(fg.from!==undefined?fg.from:fg.big,fg)+'</span><span class="d">'+fg.d+'</span>'+(fg.split?'<div class="split"><div class="track">'+fg.split.map(function(s){ return '<i class="'+s[1]+'" data-w="'+s[0]+'"></i>' }).join('')+'</div></div>':'')
      +'<div class="causes">'+fg.causes.map(function(c){ return '<div class="cause"><i class="'+c[0]+'"></i><span class="t">'+c[1]+'<em>'+c[2]+'</em></span><span class="v">'+c[3]+'</span></div>' }).join('')+'</div>'; return d }
  function fmtBig(v,fg){ if(typeof v!=='number') return v; if(fg.unit) return Math.round(v).toLocaleString('en-US')+fg.unit; if(fg.big>1000&&Number.isInteger(fg.big)) return Math.round(v).toLocaleString('en-US'); return money(v) }
  async function animFigure(ctx,node,fg){ var big=$('[data-big]',node);
    if(typeof fg.big==='number'&&!(ctx.fast||reduce)){ await wait(ctx,250); await new Promise(function(res){ var t0=performance.now(), d=1100, a=fg.from!==undefined?fg.from:0, b=fg.big; (function tick(t){ var p=Math.min(1,(t-t0)/d), e=1-Math.pow(1-p,4); big.textContent=fmtBig(a+(b-a)*e,fg); if(p<1&&ctx.tok===run) requestAnimationFrame(tick); else { big.textContent=fmtBig(b,fg); res() } })(t0) }) } else big.textContent=fmtBig(fg.big,fg);
    var segs=$$('.track i',node); for(var j=0;j<segs.length;j++){ segs[j].style.width=segs[j].dataset.w+'%'; await wait(ctx,180) }
    var cs=$$('.cause',node); for(var c=0;c<cs.length;c++){ cs[c].classList.add('in'); await wait(ctx,110) } }

  /* ── charts (CHARTS.md, Nov 23): HTML so text stays true size, one tooltip per mark, the form picked by the reader's job.
     columns: change over time, from zero, the latest emphasised · hbars: magnitudes on a stated scale (ranked bars) or
     ratios against a stated whole (meter list) · timeline: where go-live lands against the plan, pickable ── */
  function W(host){ return Math.max(320,Math.round(host.getBoundingClientRect().width))||520 }
  function nice(v){ var p=Math.pow(10,Math.floor(Math.log10(v))), m=v/p, steps=[1,1.2,1.5,2,2.5,3,4,5,6,8,10]; for(var i=0;i<steps.length;i++){ if(m<=steps[i]) return steps[i]*p } return 10*p }
  function dly(node,ms){ node.style.transitionDelay=ms+'ms'; return node }
  function ctip(host){ var t=$('.ctip',host); if(!t){ t=document.createElement('div'); t.className='ctip'; t.setAttribute('aria-hidden','true'); host.appendChild(t) } return t }
  function showTip(host,anchor,a,b){ var t=ctip(host); t.innerHTML='<span>'+esc(a)+'</span><b>'+esc(b)+'</b>'; t.classList.add('on'); var hr=host.getBoundingClientRect(), ar=anchor.getBoundingClientRect();
    t.style.left=Math.max(0,Math.min(hr.width-t.offsetWidth,ar.left-hr.left+ar.width/2-t.offsetWidth/2))+'px'; t.style.top=Math.max(-8,ar.top-hr.top-t.offsetHeight-8)+'px' }
  function hideTip(host){ var t=$('.ctip',host); if(t) t.classList.remove('on') }
  function hoverTips(host,sel,fn){ $$(sel,host).forEach(function(el){ var on=function(){ var x=fn(el); if(x) showTip(host,$('[data-mark]',el)||el,x[0],x[1]) }; el.addEventListener('mouseenter',on); el.addEventListener('focus',on); el.addEventListener('mouseleave',function(){ hideTip(host) }); el.addEventListener('blur',function(){ hideTip(host) }) }) }
  function grow(host){ $$('[data-h]',host).forEach(function(b){ b.style.height=b.dataset.h }); $$('[data-w]',host).forEach(function(b){ b.style.width=b.dataset.w }) }
  function pct(v,max){ return Math.max(0,Math.min(100,v/max*100)).toFixed(2)+'%' }

  /* columns from zero on a dated axis; o: values, max, ticks, tick(v), latest, latestLabel, xlab(i) → [text, 'l'|'r'|'c', optional],
     tip(i) → [what, how much], bad {i}, next {i}, now (fractional slot), nowLabel, height, legend html */
  function columns(host,o){ var n=o.values.length, yw=Math.max.apply(null,o.ticks.map(function(t){ return String(o.tick(t)).length }))*8+8;
    var cols=o.values.map(function(v,i){ if(v==null) return o.next&&o.next.i===i?'<div class="cc-s next" data-i="'+i+'" tabindex="0"><i class="cc-ev" data-mark></i></div>':'<div class="cc-s empty"></div>';
      var cls='cc-s'+(i===o.latest?' now':'')+(o.bad&&o.bad.i===i?' bad':''), bh=pct(v,o.max);
      return '<div class="'+cls+'" data-i="'+i+'" tabindex="0" style="--bh:'+bh+'"><i class="cc-b" data-mark data-h="'+bh+'" style="transition-delay:'+Math.min(i*24,500)+'ms"></i>'+(i===o.latest&&o.latestLabel?'<span class="cc-v">'+esc(o.latestLabel)+'</span>':'')+'</div>' }).join('');
    host.innerHTML=(o.legend?'<div class="cc-legend">'+o.legend+'</div>':'')
      +'<div class="cc'+(o.now!=null?' has-now':'')+'" style="--h:'+o.height+'px;--yw:'+yw+'px">'
      +'<div class="cc-y" aria-hidden="true">'+o.ticks.map(function(t){ return '<span style="bottom:'+pct(t,o.max)+'">'+esc(o.tick(t))+'</span>' }).join('')+'</div>'
      +'<div class="cc-plot">'+o.ticks.map(function(t){ return '<i class="cc-g'+(t===0?' base':'')+'" style="bottom:'+pct(t,o.max)+'"></i>' }).join('')
      +(o.now!=null?'<i class="cc-now" style="left:'+(o.now/n*100).toFixed(2)+'%"><span>'+esc(o.nowLabel)+'</span></i>':'')
      +'<div class="cc-cols" style="grid-template-columns:repeat('+n+',minmax(0,1fr))">'+cols+'</div></div>'
      +'<div class="cc-x" aria-hidden="true" style="grid-template-columns:repeat('+n+',minmax(0,1fr))">'+o.values.map(function(v,i){ var x=o.xlab(i); return x?'<span class="'+(x[1]||'c')+(x[2]?' opt':'')+'"><span>'+esc(x[0])+'</span></span>':'<span></span>' }).join('')+'</div></div>';
    hoverTips(host,'.cc-s[data-i]',function(el){ return o.tip(+el.dataset.i) }) }

  /* horizontal rows: ranked bars on a stated scale, or a meter list against a stated whole; o: rows [{l,s,v,vl,hot}], max, ticks, tick, meter */
  function hbars(host,o){ host.innerHTML='<div class="hb'+(o.meter?' meter':'')+'">'+o.rows.map(function(r,i){ var w=pct(r.v,o.max);
      return '<div class="hb-r'+(r.hot?' hot':'')+'" data-i="'+i+'" tabindex="0"><span class="hb-n">'+esc(r.l)+(r.s?'<span>'+esc(r.s)+'</span>':'')+'</span>'
        +'<span class="hb-t">'+(o.meter?'':o.ticks.map(function(t){ return '<i class="g" style="left:'+pct(t,o.max)+'"></i>' }).join(''))+'<i class="hb-f" data-mark data-w="'+w+'" style="transition-delay:'+(i*90)+'ms"></i></span>'
        +'<span class="hb-v">'+esc(r.vl||o.tick(r.v))+'</span></div>' }).join('')
      +'<div class="hb-axis" aria-hidden="true"><span></span><span class="hb-at">'+o.ticks.map(function(t,k){ return '<span class="'+(k===0?'l':k===o.ticks.length-1?'r':'c')+'" style="left:'+pct(t,o.max)+'">'+esc(o.tick(t))+'</span>' }).join('')+'</span><span></span></div></div>';
    hoverTips(host,'.hb-r',function(el){ var r=o.rows[+el.dataset.i]; return [r.l, r.vl||o.tick(r.v)] }) }

  /* timeline: where go-live lands for each week against the plan; the plan hollow, the landing filled, the slip between, today a rule */
  function md(a){ return (a[0]-5)*31+a[1] }
  function timeline(host,c,onPick){ var a=md(c.from), b=md(c.to), at=function(d){ return ((md(d)-a)/(b-a)*100).toFixed(2)+'%' };
    host.innerHTML='<div class="tl" role="radiogroup" aria-label="'+esc(c.title)+'">'+c.rows.map(function(r,i){ var l=at(c.plan), x=at(r.at);
      return '<div class="tl-r'+(r.hot?' hot':'')+'" data-i="'+i+'" role="radio" aria-checked="'+(!!r.hot)+'" tabindex="0"><span class="tl-n"><b>'+esc(r.l)+'</b><span>'+esc(r.s)+'</span></span>'
        +'<span class="tl-v">'+esc(r.vl)+'</span>'
        +'<span class="tl-t"><i class="base"></i><i class="today" style="left:'+at(c.today)+'"></i><i class="slip" data-w="calc('+x+' - '+l+')" style="left:'+l+'"></i><i class="plan" style="left:'+l+'"></i><i class="land" data-mark style="left:'+x+'"></i></span></div>' }).join('')
      +'<div class="tl-axis" aria-hidden="true"><span class="tl-at">'+c.ticks.map(function(t,k){ var p=t[2].split(' · '); return '<span class="'+(k===0?'l':k===c.ticks.length-1?'r':'c')+(k===2?' opt':'')+'" style="left:'+at([t[0],t[1]])+'"><span>'+esc(p[0])+(p[1]?'<em> · '+esc(p[1])+'</em>':'')+'</span></span>' }).join('')+'</span></div></div>';
    hoverTips(host,'.tl-r',function(el){ var r=c.rows[+el.dataset.i]; return [r.l+' · '+r.s.split(' · ')[0], r.vl] });
    $$('.tl-r',host).forEach(function(row){ var go=function(){ $$('.tl-r',host).forEach(function(o){ o.classList.remove('hot'); o.setAttribute('aria-checked','false') }); row.classList.add('hot'); row.setAttribute('aria-checked','true'); if(onPick) onPick(c.rows[+row.dataset.i]) };
      row.addEventListener('click',go); row.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go() } }) }) }

  /* the hours since the failure: deliveries per hour from zero; the bad hour in the error colour with its count in the legend; the scheduled retry a dashed rule */
  function hours(host,c){ var vals=c.values.filter(function(v){ return v!=null }), max=nice(Math.max.apply(null,vals)*1.05), n=c.values.length, st=c.start||[6,1,11];
    var when=function(i){ var h=st[2]+i, d=st[1]+Math.floor(h/24); h=h%24; return (d===1?'June 1':'June '+d)+' · '+(h===0?'12 AM':h<12?h+' AM':h===12?'12 PM':(h-12)+' PM') };
    columns(host,{values:c.values, max:max, ticks:[0,max/2,max], tick:function(v){ return Math.round(v).toLocaleString('en-US') }, height:176, bad:c.bad, next:c.next, now:c.now, nowLabel:'now · 9:40',
      legend:(c.bad?'<span><i class="sw bad"></i>'+esc(c.bad.l)+'</span>':'')+(c.good?'<span><i class="sw"></i>'+esc(c.good)+'</span>':'')+(c.next?'<span><i class="sw next"></i>'+esc((c.ticks[c.next.i]||'').replace(/^retry/,'Retry'))+', scheduled</span>':''),
      xlab:function(i){ var t=c.ticks[i]; if(!t) return null; return [t, i<=1?'l':i===n-1?'r':'c', i===13] },
      tip:function(i){ var v=c.values[i]; if(v==null) return [c.ticks[i]||'Scheduled','the network retries evt_89f5b9']; return [when(i), v.toLocaleString('en-US')+' deliveries'+(c.bad&&c.bad.i===i?' · 3 × 503':'')] } }) }

  async function drawChart(ctx,host,c,onPick){ host.innerHTML=''; host.classList.remove('in'); host.dataset.kind=c.kind;
    if(c.kind==='hours') hours(host,c);
    else if(c.kind==='bars'){ var max=nice(Math.max.apply(null,c.values)*1.05); hbars(host,{rows:c.values.map(function(v,i){ return {l:c.labels[i], v:v, vl:c.fmt?c.fmt(v):String(v), hot:(c.highlight||[]).indexOf(i)>-1} }), max:max, ticks:[0,max/2,max], tick:function(v){ return c.fmt?c.fmt(v):String(v) }}) }
    else if(c.kind==='meter'){ var s=c.scale||[0,50,100]; hbars(host,{meter:true, rows:c.rows, max:s[s.length-1], ticks:s, tick:function(v){ return v+(c.unit||'') }}) }
    else if(c.kind==='timeline') timeline(host,c,onPick);
    await frame(); grow(host); host.classList.add('in'); await wait(ctx,c.kind==='hours'?1000:800) }
  /* a picked option rewrites the prepared action: its words, its sheet, its receipt */
  function pick(r,act){ var p=r.pick; if(!p||!act) return; act.t=p.t; act.m=p.m; if(act.sheet){ if(p.big) act.sheet.big=p.big; (p.rows||[]).forEach(function(x){ act.sheet.rows.forEach(function(sr){ if(sr[0]===x[0]) sr[1]=x[1] }) }) } if(p.w) act.receipt.w=p.w; if(p.line) act.receipt.line=p.line;
    $$('.prepared[data-key="'+act.key+'"]').forEach(function(c){ $('.w',c).textContent=act.t; $('.m',c).innerHTML=act.m }); announce('Prepared: '+act.t) }

  /* ── rows: arrive, tick; with toggle, the person can change the selection and the prepared action follows ── */
  function renderRows(r){ var d=document.createElement('div'); d.className='paycard reveal';
    d.innerHTML='<table class="pays'+(r.toggle?' tog':'')+'"><thead><tr>'+(r.nocheck?'':'<th style="width:30px"></th>')+r.cols.map(function(c,i){ return '<th'+(i===2?' class="hm"':'')+'>'+esc(c)+'</th>' }).join('')+'</tr></thead><tbody>'
      +r.items.map(function(it){ return '<tr class="row'+(it[5]?' hot':'')+(it[6]?' opt':'')+'" data-sel="'+(it[4]?1:0)+'">'+(r.nocheck?'':'<td>'+CB+'</td>')+it.slice(0,4).map(function(c,i){ return '<td'+(i===1||i===2?' class="c2'+(i===2?' hm':'')+'"':'')+'>'+c+'</td>' }).join('')+'</tr>' }).join('')+'</tbody></table>'
      +'<div class="tfoot"><span>'+esc(r.sub||'')+'</span><b data-tally>'+esc(r.tally(0))+'</b></div>'; return d }
  async function animRows(ctx,node,r,onToggle){ var rows=$$('tr.row',node); for(var i=0;i<rows.length;i++){ rows[i].classList.add('in'); await wait(ctx,70) } await wait(ctx,350); var n=0;
    for(var j=0;j<rows.length;j++){ if(rows[j].dataset.sel==='1'){ rows[j].classList.add('sel'); n++; $('[data-tally]',node).textContent=r.tally(n); await wait(ctx,90) } }
    await wait(ctx,250); $('[data-tally]',node).textContent=r.done;
    if(onToggle){ rows.forEach(function(row){ row.setAttribute('role','checkbox'); row.tabIndex=0; var go=function(){ row.classList.toggle('sel'); var k=$$('tr.sel',node).length; $('[data-tally]',node).textContent=r.tally(k); onToggle(k) }; row.onclick=go; row.onkeydown=function(e){ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); go() } } }) } }
  function renderPrepared(a){ var d=document.createElement('div'); d.className='prepared ring reveal'; d.dataset.key=a.key; d.innerHTML='<span class="k"><i class="aimark"></i><span>'+(a.inline?'Ready · a setting of yours, reversible here':'Waiting for your approval')+'</span></span><span class="w">'+esc(a.t)+'</span><div class="row"><span class="m">'+a.m+'</span><button class="btn" type="button">'+esc(a.btn)+'</button></div>';
    $('.btn',d).onclick=function(){ a.inline?approve(a):openSheet(a) }; if(DONE[a.key]) markDone(d,a); return d }
  function markDone(card,a){ card.classList.add('sent'); $('.k span',card).textContent=a.approved }

  /* ── the platform's sheet, the receipt, and what follows ── */
  function openSheet(a){ var s=$('#sheet'), sp=a.sheet; s.innerHTML='<span class="k">'+esc(sp.eyebrow)+'</span><h5 id="sheetT">'+esc(sp.h)+'</h5>'+(sp.big?'<span class="big">'+esc(sp.big)+'</span>':'')+'<div>'+sp.rows.map(function(r){ return '<div class="r"><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>' }).join('')+'</div><div class="acts"><button class="tonal" type="button" id="shNo">Not now</button><button class="btn" type="button" id="shOk">'+esc(sp.ok)+'</button></div><span class="note">'+esc(sp.note)+'</span>';
    $('#scrim').classList.add('open'); setTimeout(function(){ $('#shOk').focus() },50);
    $('#shNo').onclick=closeSheet; $('#scrim').onclick=function(e){ if(e.target===$('#scrim')) closeSheet() }; $('#shOk').onclick=function(){ closeSheet(); approve(a) };
    s.onkeydown=function(e){ if(e.key==='Escape'){ e.stopPropagation(); closeSheet() } } }
  function closeSheet(){ $('#scrim').classList.remove('open') }
  function approve(a){ if(DONE[a.key]) return; DONE[a.key]=true; var cards=$$('.prepared[data-key="'+a.key+'"]'); cards.forEach(function(c){ markDone(c,a) }); var last=cards[cards.length-1], rc=a.receipt;
    var el2=document.createElement('div'); el2.className='receipt reveal';
    el2.innerHTML='<span class="k">'+esc(rc.k)+'</span><span class="w">'+esc(rc.w)+'</span>'+(rc.prog&&rc.prog.count?'<div class="prog" style="--pd:'+rc.prog.dur+'ms"><i data-fill></i></div>':'')+'<div class="row"><span>'+rc.line+'</span>'+(rc.cancel?'<button class="tonal" type="button" data-cancel>'+esc(rc.cancel)+' · <span data-cd>10:00</span></button>':rc.undo?'<button class="tonal" type="button" data-cancel data-plain>'+esc(rc.undo)+'</button>':'')+'</div>'+(rc.after?'<span class="fx">'+esc(rc.after)+'</span>':'')+(rc.fixed?'<span class="fx">'+esc(rc.fixed)+'</span>':'');
    last.insertAdjacentElement('afterend',el2); requestAnimationFrame(function(){ el2.classList.add('in') }); announce(rc.k+'. '+rc.w);
    if(rc.prog&&rc.prog.count){ var fill=$('[data-fill]',el2); setTimeout(function(){ fill.style.width=rc.prog.to+'%' },300);
      if(rc.prog.count){ var n=0, cnt=rc.prog.count, tm=setInterval(function(){ n+=4; if(n>=cnt.n){ n=cnt.n; clearInterval(tm) } var A=$('#rcA'); if(A) A.textContent=n+' of '+cnt.n },400); timers.push(tm) } }
    /* what follows from the action: the next steps, each an action of its own; or the way back */
    cancelGates(); $$('.recs:not(.done)').forEach(function(r){ r.classList.contains('next')?r.classList.add('done'):r.remove() });
    var nx=(a.next||[]).filter(function(k){ return FLOWS[k] }), nb=document.createElement('div'); nb.className='recs next reveal';
    nb.innerHTML='<span class="k"><i class="aimark"></i>'+(nx.length?'Suggested next':'That’s everything on this')+'</span><div class="row">'+recButtons(nx)+(nx.length?'':'<button class="tonal" type="button" data-home>Back to the briefing</button>')+'</div>';
    el2.insertAdjacentElement('afterend',nb); requestAnimationFrame(function(){ nb.classList.add('in') }); setTimeout(function(){ scrollTo({fast:false},nb) },150);
    if(nx.length){ suggest(nx[0]); ai('land'); announce('Next: '+FLOWS[nx[0]].q) } else { clearComposer() }
    gate({tok:run},(nx.length?[$('#cbox')]:[]).concat($$('button',nb))).then(function(x){ nb.classList.add('done'); if(x.dataset.home){ leave(); return } var id=x.dataset.rec||nx[0]; $$('[data-rec]',nb).forEach(function(b){ b.classList.toggle('picked',b.dataset.rec===id) }); startTurn(id) }).catch(function(){});
    /* taking it back */
    var ub=$('[data-cancel]',el2); if(ub){ var ct=null; if(!ub.hasAttribute('data-plain')){ var left=600, cd=$('[data-cd]',el2); ct=setInterval(function(){ left--; if(left<0){ clearInterval(ct); ub.disabled=true; ub.textContent='Window closed'; return } cd.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0') },1000); timers.push(ct) }
      ub.onclick=function(){ if(ct) clearInterval(ct); ub.disabled=true; ub.textContent='Undone'; DONE[a.key]=false; cards.forEach(function(c){ c.classList.remove('sent'); $('.k span',c).textContent=a.inline?'Ready · a setting of yours, reversible here':'Waiting for your approval' }); $('.w',el2).textContent=rc.cancelDone; $('.row > span',el2).innerHTML=''; var pf=$('[data-fill]',el2); if(pf) pf.style.width='0'; if(!nb.classList.contains('done')){ nb.remove(); clearComposer() } toast(rc.cancelDone) } } }

  renderSignin();
})();
