/* Brightline Assist: the engine. Sign in, the shell, the briefing, the ask field, and the run of a flow:
   the question rises into the title, the work runs in the open, the answer composes from the record,
   what the assistant prepared waits for approval on the platform's sheet. Nothing moves on without the
   person: the field, send, the suggested question, the approval. */
(function(){
  "use strict";
  var D=window.BA, SEATS=D.SEATS, FLOWS=D.FLOWS;
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var esc=function(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEAT=null, HOME=null, TURNS=0, run=0, gates=[], FS='rest', SUGGEST=null, toastT=0, undoFn=null, timers=[];

  function icon(n,cls){ var p=(window.GN_ICONS||{})[n]||''; return '<svg class="gn-icon'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
  var MARK='<i class="as-mark" aria-hidden="true"></i>';
  var ARROW='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5"/></svg>';
  var TICK='<svg class="as-tick" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5 5.5 10.5 11.5 3.5"/></svg>';

  /* ── timing ── */
  function wait(ctx,ms){ if(ctx.fast||reduce) return Promise.resolve(); return new Promise(function(res,rej){ setTimeout(function(){ ctx.tok===run?res():rej('cancel') },ms) }) }
  function frame(){ return new Promise(function(r){ requestAnimationFrame(function(){ requestAnimationFrame(r) }) }) }
  function cancelGates(){ gates.forEach(function(g){ g.cleanup(); g.rej('cancel') }); gates=[] }
  function gate(ctx,els){
    if(ctx.tok!==run) return Promise.reject('cancel');
    els=[].concat(els);
    return new Promise(function(res,rej){
      var g={rej:rej};
      function go(e){ if(e){ e.preventDefault(); e.stopPropagation() } g.cleanup(); gates=gates.filter(function(x){return x!==g}); if(ctx.tok!==run){ rej('cancel'); return } res() }
      function key(e){ if(e.key==='Enter'||e.key===' '||e.key==='Tab'){ go(e) } }
      g.cleanup=function(){ els.forEach(function(el){ el.removeEventListener('click',go); el.removeEventListener('keydown',key); el.classList.remove('is-await') }) };
      els.forEach(function(el){ el.addEventListener('click',go); el.addEventListener('keydown',key); el.classList.add('is-await') });
      gates.push(g);
    });
  }
  function announce(t){ var l=$('#live'); l.textContent=''; setTimeout(function(){ l.textContent=t },30) }
  function toast(msg,undo){ var t=$('#toast'); clearTimeout(toastT); undoFn=undo||null;
    t.innerHTML=esc(msg)+(undo?' <button class="gn-link" id="toastUndo">Undo</button>':''); t.classList.add('is-on');
    if(undo) $('#toastUndo').onclick=function(){ t.classList.remove('is-on'); undo() };
    toastT=setTimeout(function(){ t.classList.remove('is-on') }, undo?8000:5000); announce(msg) }

  /* ── sign in ── */
  function renderSignin(){
    $('#accounts').innerHTML=Object.keys(SEATS).map(function(k){ var s=SEATS[k];
      return '<div class="gn-row is-link" role="button" tabindex="0" data-seat="'+k+'"><img class="gn-avatar gn-avatar--36" src="'+s.av+'" alt=""><div class="gn-row-t"><b>'+esc(s.n)+'</b><span>'+esc(s.r)+' · '+esc(s.org)+'</span></div><div class="gn-row-r"><span>'+esc(s.portal)+'</span>'+icon('right','gn-icon--sm')+'</div></div>' }).join('');
    $$('#accounts [data-seat]').forEach(function(r){ r.onclick=function(){ signIn(r.dataset.seat) }; r.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); signIn(r.dataset.seat) } } });
  }
  function signIn(k){ SEAT=SEATS[k]; HOME=D.HOME[k]; $('#signin').hidden=true; $('#app').hidden=false; document.title=SEAT.portal+' · Brightline Assist'; renderHeader(); renderNav(); goHome(); }

  /* ── the header: the mark, the organisation, the one field, what needs the reader, help, the person ── */
  function renderHeader(){
    var h=$('#hdr'), orgState=SEAT.state?' <span class="gn-status is-good">'+SEAT.state+'</span>':'';
    h.innerHTML='<div class="gn-header-m" id="hMark" role="link" tabindex="0"><i>D</i><span>'+esc(SEAT.portal)+'</span></div>'
      +'<div class="gn-header-org"><b>'+esc(SEAT.org)+'</b>'+orgState+'</div>'
      +'<div class="gn-header-q"><div class="as-askwrap"><div class="as-ask ring" id="ask"><i class="as-mark" aria-hidden="true"></i><input id="askin" type="text" autocomplete="off" aria-label="Ask" placeholder="'+esc(SEAT.ph)+'"><i class="as-caret"></i><kbd class="as-tab" id="askTab" hidden>Tab</kbd><button class="as-send" id="send" aria-label="Ask">'+ARROW+'</button></div><div class="as-offers" id="offers" hidden></div></div></div>'
      +'<div class="gn-header-r"><span class="gn-header-a needs" id="hNeeds" role="link" tabindex="0">'+icon(SEAT.needs[0]==='Alerts'?'bell':'flag')+'<span class="gn-lb">'+esc(SEAT.needs[0])+'</span><span class="gn-count">'+SEAT.needs[1]+'</span></span>'
      +'<span class="gn-header-a" role="link" tabindex="0">'+icon('help')+'<span class="gn-lb">Help</span></span>'
      +'<div class="gn-header-u" id="hUser" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><img class="gn-avatar" src="'+SEAT.av+'" alt=""><span class="gn-name">'+esc(SEAT.n)+'<span>'+esc(SEAT.r)+'</span></span>'+icon('down','gn-icon--sm')+'</div></div>';
    $('#hMark').onclick=goHome;
    $('#hNeeds').onclick=function(){ openPage(SEAT.k==='marcus'?'home':'alerts') };
    var u=$('#hUser');
    u.onclick=function(e){ e.stopPropagation(); var m=$('#hMenu'); if(m){ m.remove(); u.setAttribute('aria-expanded','false'); return }
      var p=document.createElement('div'); p.className='gn-menu-panel as-menu'; p.id='hMenu'; p.setAttribute('role','menu');
      p.innerHTML='<div class="gn-menu-h"><b>'+esc(SEAT.n)+'</b> · '+esc(SEAT.org)+'</div><button role="menuitem">Notification settings</button><hr><button role="menuitem" id="signout">Sign out</button>';
      u.appendChild(p); u.setAttribute('aria-expanded','true'); $('#signout').onclick=function(){ location.reload() } };
    document.addEventListener('click',function(e){ var m=$('#hMenu'); if(m&&!m.contains(e.target)){ m.remove(); u.setAttribute('aria-expanded','false') } if(!$('#offers').contains(e.target)&&!$('#ask').contains(e.target)) hideOffers() });
    /* the field */
    var inp=$('#askin'), ask=$('#ask');
    inp.addEventListener('focus',function(){ if(FS==='rest') showOffers() });
    inp.addEventListener('input',function(){ if(FS==='rest'||FS==='ready'){ setSend(!!inp.value.trim()) } });
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); submit() } if(e.key==='Escape'){ hideOffers(); inp.blur() } });
    $('#send').onclick=function(){ if($('#send').classList.contains('is-ready')) submit() };
    ask.addEventListener('click',function(){ if(FS==='rest') inp.focus() });
    document.addEventListener('keydown',function(e){ if(e.key==='/'&&document.activeElement!==inp&&!$('#sheet').classList.contains('is-on')){ e.preventDefault(); inp.focus() } });
  }
  function setSend(ready){ $('#send').classList.toggle('is-ready',!!ready) }
  function fieldState(s,text){
    FS=s; var ask=$('#ask'), inp=$('#askin'), tab=$('#askTab'), send=$('#send');
    ask.classList.remove('is-working','is-suggest','is-landed','is-typing'); send.classList.remove('is-working');
    inp.readOnly=false; tab.hidden=true; SUGGEST=null;
    if(s==='rest'){ inp.value=''; inp.placeholder=TURNS?'Ask a follow-up':SEAT.ph; setSend(false) }
    if(s==='typing'){ ask.classList.add('is-typing'); inp.readOnly=true; setSend(false) }
    if(s==='ready'){ setSend(true) }
    if(s==='working'){ ask.classList.add('is-working'); send.classList.add('is-working'); inp.value=''; inp.placeholder='Working…'; inp.readOnly=true; setSend(false) }
    if(s==='suggest'){ ask.classList.add('is-suggest'); inp.value=text; inp.readOnly=true; tab.hidden=false; setSend(false); SUGGEST=text }
    if(s==='landed'){ ask.classList.add('is-landed'); inp.value=''; inp.placeholder='Ask a follow-up'; setSend(false); setTimeout(function(){ if(FS==='landed') fieldState('rest') },1300) }
  }
  function seatFlows(){ var set={}, q=HOME.offers.slice(); while(q.length){ var id=q.shift(); if(set[id]) continue; set[id]=1; if(FLOWS[id]&&FLOWS[id].next) q.push(FLOWS[id].next) } return Object.keys(set) }
  function showOffers(){
    var o=$('#offers'); o.hidden=false;
    o.innerHTML='<h6>Questions you can ask</h6>'+HOME.offers.map(function(id){ return '<button type="button" data-flow="'+id+'">'+MARK+esc(FLOWS[id].q)+'</button>' }).join('')
      +'<h6>Do</h6>'+HOME.dos.map(function(d){ return '<button type="button" class="is-do">'+icon('right','gn-icon--sm')+esc(d)+'</button>' }).join('');
    $$('[data-flow]',o).forEach(function(b){ b.onclick=function(){ hideOffers(); askFlow(b.dataset.flow,{auto:false}) } });
    $$('.is-do',o).forEach(function(b){ b.onclick=function(){ hideOffers(); toast('Not in this prototype.') } });
  }
  function hideOffers(){ var o=$('#offers'); if(o) o.hidden=true }
  function submit(){
    var inp=$('#askin'), v=inp.value.trim();
    if(FS==='suggest'){ acceptSuggest(); return }
    if(FS==='ready'&&PENDING){ var p=PENDING; PENDING=null; startFlow(p); return }
    if(!v) return;
    var f=matchFlow(v); if(!f){ toast('Not in this prototype. Try one of the questions the field offers.'); showOffers(); return }
    inp.value=FLOWS[f].q; startFlow(f);
  }
  function matchFlow(v){ var words=v.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(function(w){return w.length>3}); var best=null,bs=0;
    seatFlows().forEach(function(id){ var q=FLOWS[id].q.toLowerCase(); if(q===v.toLowerCase()){ best=id; bs=99; return } var sc=words.filter(function(w){return q.indexOf(w)>-1}).length; if(sc>bs&&sc>=2){ bs=sc; best=id } }); return best }
  var PENDING=null;
  async function typeInto(ctx,text){ var inp=$('#askin'); fieldState('typing'); inp.value=''; if(ctx.fast||reduce){ inp.value=text; return } for(var i=0;i<text.length;i++){ inp.value=text.slice(0,i+1); await wait(ctx,text[i]===' '?70:34+Math.random()*30) } }
  /* from a card or an offer: the question is typed into the field, and the person presses send */
  async function askFlow(id,opts){ opts=opts||{}; var tok=++run; cancelGates(); var ctx={tok:tok,fast:false};
    try{ hideOffers(); await typeInto(ctx,FLOWS[id].q); fieldState('ready'); PENDING=id; $('#askin').focus();
      if(opts.auto){ await wait(ctx,350); PENDING=null; startFlow(id) } else { await gate(ctx,[$('#send')]); PENDING=null; startFlow(id) } }catch(e){} }
  function acceptSuggest(){ var id=SUGGEST_ID; if(!id) return; var tok=++run; cancelGates(); var ctx={tok:tok,fast:false}; $('#ask').classList.remove('is-suggest'); $('#askTab').hidden=true; $('#askin').style.color=''; FS='ready'; setSend(true); wait(ctx,450).then(function(){ startFlow(id) }).catch(function(){}) }
  var SUGGEST_ID=null;

  /* ── the sidebar ── */
  function renderNav(){
    var sb=$('#sb'); sb.innerHTML='<nav class="gn-nav" id="nav" aria-label="Pages">'+D.NAV[SEAT.k].map(function(g){ return (g[0]?'<span class="gn-nav-group">'+esc(g[0])+'</span>':'')+g[1].map(function(it){ return '<a role="link" tabindex="0" data-page="'+it[0]+'">'+icon(it[3])+esc(it[1])+(it[2]?'<span class="gn-count'+(it[2]&&it[0]!=='home'&&it[0]!=='cases'&&it[0]!=='inbound'&&it[0]!=='compliance'?' needs':'')+'">'+it[2]+'</span>':'')+'</a>' }).join('') }).join('')+'</nav>'
      +'<div class="gn-sidebar-foot"><b>'+esc(SEAT.n)+'</b><span>'+esc(SEAT.org)+'</span></div>';
    $$('#nav a').forEach(function(a){ a.onclick=function(){ a.dataset.page==='home'?goHome():openPage(a.dataset.page) }; a.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); a.click() } } });
  }
  function navOn(k){ $$('#nav a').forEach(function(a){ a.classList.toggle('is-on',a.dataset.page===k); if(a.dataset.page===k) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current') }) }
  function navLabel(k){ var l=k; D.NAV[SEAT.k].forEach(function(g){ g[1].forEach(function(it){ if(it[0]===k) l=it[1] }) }); return l }

  /* ── the home: the briefing ── */
  function goHome(){ ++run; cancelGates(); clearTimers(); TURNS=0; navOn('home'); hideOffers();
    var m=$('#main'), H=HOME;
    m.innerHTML='<div class="as-open"><div class="as-eyebrow">'+MARK+'<span>'+esc(H.eyebrow)+'</span></div><h1>'+H.h1+'</h1></div>'
      +'<div class="gn-figs gn-figs--cards as-figs">'+H.figs.map(function(f){ return '<div class="gn-fig as-reveal"><b>'+f[0]+'</b><span>'+f[1]+'</span><small>'+f[2]+'</small></div>' }).join('')+'</div>'
      +'<div class="as-insg">'+leadCard(H.lead)+H.cards.map(smallCard).join('')+'</div>';
    $$('[data-ask]',m).forEach(function(c){ var go=function(e){ if(e.target.closest('.gn-btn')) return; askFlow(c.dataset.ask,{auto:true}) }; c.onclick=go; c.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); askFlow(c.dataset.ask,{auto:true}) } } });
    var lb=$('#leadBtn'); if(lb) lb.onclick=function(e){ e.stopPropagation(); askFlow(lb.dataset.flow,{auto:true}) };
    fieldState('rest'); document.title=SEAT.portal+' · Brightline Assist'; window.scrollTo(0,0);
    requestAnimationFrame(function(){ $$('.as-reveal',m).forEach(function(el,i){ setTimeout(function(){ el.classList.add('in') }, 60+i*70) }) });
  }
  function leadCard(c){ return '<div class="as-card is-lead as-reveal is-link" role="button" tabindex="0" data-ask="'+c.flow+'" aria-label="'+esc(c.lab)+'"><span class="as-lab">'+esc(c.lab)+'</span><span class="as-num">'+esc(c.num)+'</span><p class="as-say">'+c.say+'</p>'
    +'<div class="as-rows">'+c.rows.map(function(r){ return '<div><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>' }).join('')+'</div>'
    +'<button class="gn-btn gn-btn--primary" id="leadBtn" data-flow="'+c.flow+'" type="button">'+esc(c.btn)+'</button></div>' }
  function smallCard(c){ var link=!!c.flow; return '<div class="as-card as-reveal'+(link?' is-link" role="button" tabindex="0" data-ask="'+c.flow+'"':'"')+'><span class="as-lab">'+esc(c.lab)+'</span><span class="as-num">'+esc(c.num)+'</span><p class="as-say">'+c.say+'</p></div>' }

  /* a page that is not built */
  function openPage(k){ ++run; cancelGates(); clearTimers(); TURNS=0; navOn(k); hideOffers(); var m=$('#main');
    m.innerHTML='<div class="gn-page-head"><div><h1>'+esc(navLabel(k))+'</h1><p>Not built in this prototype. The assistant can still answer about it.</p></div></div>'
      +'<div class="as-nb"><div class="as-offers"><h6>Questions you can ask</h6>'+HOME.offers.map(function(id){ return '<button type="button" data-flow="'+id+'">'+MARK+esc(FLOWS[id].q)+'</button>' }).join('')+'</div></div>';
    $$('[data-flow]',m).forEach(function(b){ b.onclick=function(){ askFlow(b.dataset.flow,{auto:false}) } });
    fieldState('rest'); document.title=navLabel(k)+' · '+SEAT.portal; window.scrollTo(0,0) }

  /* ── running a flow ── */
  async function startFlow(id){
    var f=FLOWS[id], tok=++run; cancelGates(); var ctx={tok:tok,fast:false};
    try{
      var m=$('#main'), first=TURNS===0;
      if(first){ navOn(null); m.innerHTML='<div class="as-conv" id="conv"></div>' }
      var conv=$('#conv'), t=document.createElement('section'); t.className='as-turn'; t.setAttribute('aria-label',f.q);
      t.innerHTML=(first?'<h1 class="as-q">':'<h2 class="as-q">')+esc(f.q)+(first?'</h1>':'</h2>')
        +'<div class="as-tracewrap"><div class="as-trace">'+f.trace.map(function(s){ return '<div class="as-step"><span class="ic"><span class="as-spin"></span></span><span class="t">'+esc(s[0])+'</span><span class="r"></span></div>' }).join('')+'</div></div>'
        +'<div class="as-read">'+MARK+'<span>'+esc(f.read)+'</span>'+(f.noToggle?'<span class="as-steps is-static">'+esc(f.steps||(f.trace.length+' steps'))+'</span>':'<button class="as-steps" type="button" aria-expanded="false">'+(f.trace.length+' steps')+'<i class="pm"></i></button>')+'</div>'
        +(f.query?'<pre class="gn-code as-query">'+esc(f.query)+'</pre>':'')
        +'<p class="as-find"></p><p class="as-say"></p><div class="as-blocks" style="display:grid;gap:16px"></div><div class="as-acts" style="display:grid;gap:16px"></div>';
      conv.appendChild(t);
      document.title=f.q+' · '+SEAT.portal;
      /* the question travels from the field into the title */
      var inp=$('#askin'), from=inp.getBoundingClientRect(), title=$('.as-q',t), to=title.getBoundingClientRect();
      fieldState('working');
      if(!reduce&&title.animate){ var s=15/parseFloat(getComputedStyle(title).fontSize); title.animate([{transform:'translate('+(from.left-to.left)+'px,'+(from.top-to.top)+'px) scale('+s+')',opacity:.5},{transform:'none',opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}) }
      if(!first) t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); else window.scrollTo({top:0});
      await wait(ctx,500);
      /* the work in the open */
      var steps=$$('.as-step',t);
      for(var i=0;i<steps.length;i++){ steps[i].classList.add('in'); await wait(ctx,700); $('.r',steps[i]).textContent=f.trace[i][1]; $('.ic',steps[i]).innerHTML=TICK; await frame(); steps[i].classList.add('done'); await wait(ctx,120) }
      await wait(ctx,1200);
      var tw=$('.as-tracewrap',t); tw.style.height=tw.offsetHeight+'px'; await frame(); tw.style.height='0px'; $('.as-read',t).classList.add('in');
      var tog=$('button.as-steps',t); if(tog){ tog.onclick=function(){ var q=$('.as-query',t), on=q.classList.toggle('is-open'); tog.classList.toggle('is-open',on); tog.setAttribute('aria-expanded',on) } }
      await wait(ctx,450);
      /* the voice */
      await words(ctx,$('.as-find',t),f.find); await wait(ctx,150); await words(ctx,$('.as-say',t),f.say);
      await wait(ctx,350);
      /* the composed blocks */
      var host=$('.as-blocks',t);
      for(var b=0;b<f.blocks.length;b++){ var el=renderBlock(f.blocks[b]); host.appendChild(el); await frame(); el.classList.add('in'); await mountBlock(ctx,f.blocks[b],el); await wait(ctx,220) }
      /* what the assistant prepared */
      var ah=$('.as-acts',t); (f.acts||[]).forEach(function(a,i){ ah.appendChild(renderAct(a,i,t)) });
      for(var k=0;k<ah.children.length;k++){ await frame(); ah.children[k].classList.add('in'); await wait(ctx,260) }
      promote(t);
      TURNS++;
      /* the next question, proposed in the field */
      if(f.next){ SUGGEST_ID=f.next; fieldState('suggest',FLOWS[f.next].q); announce('Suggested: '+FLOWS[f.next].q); await gate(ctx,[$('#ask')]); acceptSuggest() }
      else { SUGGEST_ID=null; fieldState('landed') }
    }catch(e){ if(e!=='cancel') console.error(e) }
  }
  async function words(ctx,el,html){ el.innerHTML=html.split(/(<[^>]+>)/).map(function(p){ return p.charAt(0)==='<'?p:p.replace(/(\S+)/g,'<span class="as-w">$1</span>') }).join(''); var ws=$$('.as-w',el); for(var i=0;i<ws.length;i++){ ws[i].classList.add('in'); await wait(ctx,26) } }

  /* ── blocks ── */
  function fig(f,cls){ return '<div class="gn-fig'+(cls||'')+'"><b data-count>'+f[0]+'</b><span>'+f[1]+'</span>'+(f[2]?'<small>'+f[2]+'</small>':'')+'</div>' }
  function table(b){ return '<div class="gn-table-wrap"><table class="gn-table gn-table--dense"'+(b.id?' id="'+b.id+'"':'')+'><thead><tr>'+b.cols.map(function(c,i){ return '<th scope="col"'+((b.num||[]).indexOf(i)>-1?' class="is-num"':'')+'>'+esc(c)+'</th>' }).join('')+'</tr></thead><tbody>'
    +b.rows.map(function(r,ri){ var hot=[].concat(b.hot===undefined?[]:b.hot).indexOf(ri)>-1; return '<tr'+(hot?' class="is-hot"':'')+'>'+r.map(function(c,i){ return '<td'+((b.num||[]).indexOf(i)>-1?' class="is-num"':'')+'>'+c+'</td>' }).join('')+'</tr>' }).join('')+'</tbody></table></div>'+(b.foot?'<div class="gn-table-foot">'+esc(b.foot)+'</div>':'') }
  function renderBlock(b){ var el=document.createElement('div'); el.className='as-reveal as-block as-b-'+b.t;
    if(b.t==='twoup'){ el.className+=' as-twoup'; el.innerHTML='<div class="gn-figs gn-figs--cards">'+fig(b.fig)+'</div><div class="as-chartcard"><div class="gn-chart-h"><b>'+esc(b.chart.title)+'</b><span>'+esc(b.chart.sub||'')+'</span></div><div class="gn-chart"></div></div>' }
    else if(b.t==='chart'){ el.innerHTML='<div class="as-chartcard"><div class="gn-chart-h"><b>'+esc(b.chart.title)+'</b><span>'+esc(b.chart.sub||'')+'</span></div><div class="gn-chart"></div></div>' }
    else if(b.t==='figs'){ el.innerHTML='<div class="gn-figs gn-figs--cards as-figs3">'+b.items.map(function(f){ return fig(f) }).join('')+'</div>' }
    else if(b.t==='table'){ el.className+=' as-table'; el.innerHTML=table(b) }
    else if(b.t==='doc'){ el.innerHTML='<div class="gn-doc as-doc">'+b.items.map(function(r){ return '<div class="gn-doc-r"><span class="gn-doc-l">'+esc(r[0])+'</span><span class="gn-doc-v">'+esc(r[1])+'</span></div>' }).join('')+'</div>' }
    else if(b.t==='alert'){ el.innerHTML='<div class="gn-alert as-alert"><div class="gn-alert-h"><div><b>'+esc(b.title)+'</b><span>'+esc(b.when)+'</span></div><span class="gn-status '+b.status[1]+'">'+esc(b.status[0])+'</span></div><div class="gn-alert-s">'+b.steps.map(function(s){ return '<div><b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span></div>' }).join('')+'</div><div class="gn-alert-f">'+esc(b.close)+'</div></div>' }
    else if(b.t==='checks'){ el.innerHTML='<div class="as-checks"><h3>'+esc(b.title)+'</h3><div class="gn-rows gn-rows--compact">'+b.rows.map(function(r){ return '<div class="gn-row"><div class="gn-row-t"><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span></div><div class="gn-row-r"><span class="gn-status '+r[3]+'">'+esc(r[2])+'</span></div></div>' }).join('')+'</div></div>' }
    else if(b.t==='draft'){ el.innerHTML='<div class="as-draft"><div class="as-draft-h"><b>'+esc(b.title)+'</b><span>'+esc(b.words)+'</span><button class="gn-btn gn-btn--sm" type="button" data-edit>Edit</button></div><p>'+esc(b.text)+'</p></div>'; }
    else if(b.t==='cal'){ el.innerHTML='<div class="gn-cal as-cal" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+b.weeks.map(function(w,i){ var free=b.cap-w[1].length; return '<div class="gn-cal-w'+(i===1?' is-cur':'')+'" data-week="'+i+'"><div class="gn-cal-h"><b>'+esc(w[0])+'</b><span class="gn-num">'+(free?free+' of '+b.cap+' free':'Full')+'</span></div>'+w[1].map(function(it){ return '<div class="gn-cal-i"><span>'+esc(it[0])+'</span><span class="gn-num">'+esc(it[1])+'</span></div>' }).join('')+(free?'<div class="gn-cal-e is-free">'+free+' slot'+(free>1?'s':'')+' free</div>':'')+'</div>' }).join('')+'</div>' }
    var ed=$('[data-edit]',el); if(ed) ed.onclick=function(){ toast('Editing the statement isn’t in this prototype.') };
    return el }
  async function mountBlock(ctx,b,el){
    if(b.t==='twoup'||b.t==='chart'){ var c=b.chart, host=$('.gn-chart',el);
      if(c.kind==='line'){ GNChart.line(host,{values:c.values,labels:c.labels,fmt:c.fmt,min:c.min,max:c.max,points:true,h:220,left:48,right:72,area:true,hover:true});
        var svg=$('svg',host), path=$('.l',svg), area=$('.a',svg), pts=$$('.p',svg);
        if(c.mark!==undefined&&pts.length>c.mark+1){ var cx=parseFloat(pts[c.mark+1].getAttribute('cx')); var ns='http://www.w3.org/2000/svg', ln=document.createElementNS(ns,'line'); ln.setAttribute('class','mk'); ln.setAttribute('x1',cx); ln.setAttribute('x2',cx); ln.setAttribute('y1',12); ln.setAttribute('y2',220-32); svg.appendChild(ln); var tx=document.createElementNS(ns,'text'); tx.setAttribute('class','mkl'); tx.setAttribute('x',cx-8); tx.setAttribute('y',16); tx.setAttribute('text-anchor','end'); tx.textContent=c.markLabel||''; svg.appendChild(tx); ln.style.opacity=0; tx.style.opacity=0 }
        if(!(ctx.fast||reduce)&&path&&path.animate){ var len=path.getTotalLength(); path.style.strokeDasharray=len; path.style.strokeDashoffset=len; pts.forEach(function(p){ p.style.transform='scale(0)' }); if(area) area.style.opacity=0;
          path.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:1600,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
          pts.forEach(function(p,i){ setTimeout(function(){ p.style.transform='' }, i===0?1500:120+i*95) });
          if(area) area.animate([{opacity:0},{opacity:.06}],{duration:900,delay:600,fill:'forwards'});
          await wait(ctx,1500); if(ln){ ln.animate([{opacity:0},{opacity:1}],{duration:400,fill:'forwards'}); tx.animate([{opacity:0},{opacity:1}],{duration:400,fill:'forwards'}) } await wait(ctx,400) }
        else { if(ln){ ln.style.opacity=1; tx.style.opacity=1 } } }
      if(c.kind==='bars'){ GNChart.bar(host,{values:c.values,labels:c.labels,fmt:c.fmt,h:220,left:48,right:16}); var bars=$$('.b',host); bars.forEach(function(r,i){ if((c.highlight||[]).indexOf(i)<0){ r.classList.remove('on'); r.classList.add('is-dim') } });
        if(!(ctx.fast||reduce)){ bars.forEach(function(r,i){ r.style.transform='scaleY(0)'; r.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:600,delay:i*28,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}) }); await wait(ctx,900) } } }
    if(b.t==='figs'||b.t==='twoup'){ var bs=$$('[data-count]',el); if(!(ctx.fast||reduce)) bs.forEach(function(x,i){ setTimeout(function(){ countUp(x) }, i*120) }); await wait(ctx,700) }
    if(b.t==='table'){ var rows=$$('tbody tr',el); if(!(ctx.fast||reduce)){ rows.forEach(function(r,i){ r.style.opacity=0; r.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:420,delay:i*60,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}) }); await wait(ctx,300+rows.length*60) } }
  }
  function countUp(el){ var s=el.textContent.trim(), m=/^(\$?)([\d,]+)(\.\d+)?(.*)$/.exec(s); if(!m) return; var target=parseFloat(m[2].replace(/,/g,'')+(m[3]||'')), dec=m[3]?m[3].length-1:0, pre=m[1], suf=m[4]; var t0=performance.now(), d=900;
    (function tick(t){ var p=Math.min(1,(t-t0)/d), e=1-Math.pow(1-p,3), v=target*e; el.textContent=pre+v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf; if(p<1) requestAnimationFrame(tick); else el.textContent=s })(t0) }

  /* ── what the assistant prepared ── */
  function renderAct(a,i,turn){ var el=document.createElement('div');
    if(a.kind==='sheet'){ el.className='as-prep ring as-reveal'; el.innerHTML='<span class="k">'+MARK+'<span>Waiting for your approval</span></span><span class="w">'+esc(a.t)+'</span>'+(a.quote?'<p class="q">'+esc(a.quote)+'</p>':'')+'<div class="row"><span class="m">'+a.d+'</span><button class="gn-btn" type="button">'+esc(a.btn)+'</button></div>';
      $('button',el).onclick=function(){ openSheet(a,function(alt){ approve(a,el,turn,alt) }) } }
    else { el.className='as-act as-reveal'; el.innerHTML='<b>'+esc(a.t)+'</b><span>'+esc(a.d)+'</span><div class="r"><button class="gn-btn gn-btn--sm" type="button">'+esc(a.btn)+'</button></div>';
      var btn=$('button',el); btn.onclick=function(){ btn.disabled=true; btn.textContent='Working…'; setTimeout(function(){ runInline(a,el) },800) } }
    return el }
  /* one solid button on the screen: the first prepared action that still waits */
  function promote(turn){ var first=true; $$('.as-prep',turn).forEach(function(p){ var b=$('.row .gn-btn',p); if(!b) return; if(!p.classList.contains('is-done')&&first){ b.classList.add('gn-btn--primary'); first=false } else b.classList.remove('gn-btn--primary') }) }
  function applyEffect(e,on){ if(!e) return;
    if(e.id==='calJune'){ var w=$('[data-week="1"]'); if(!w) return; if(on){ var f=$('.gn-cal-e',w); if(f) f.remove(); if(!$('[data-added]',w)){ w.insertAdjacentHTML('beforeend','<div class="gn-cal-i" data-added><span>Halcyon Acquiring</span><span class="gn-num">booked</span></div>') } $('.gn-cal-h .gn-num',w).textContent='Full' } else { var ad=$('[data-added]',w); if(ad) ad.remove(); if(!$('.gn-cal-e',w)) w.insertAdjacentHTML('beforeend','<div class="gn-cal-e is-free">1 slot free</div>'); $('.gn-cal-h .gn-num',w).textContent='1 of 2 free' } return }
    if(e.id){ var s=document.getElementById(e.id); if(!s) return; var v=on?e.on:e.off; if(!v) return; s.textContent=v[0]; s.className='gn-status '+v[1]; return }
    if(e.row&&on){ var tb=$('#'+e.row+' tbody'); if(tb&&!tb.querySelector('[data-added]')){ var tr=document.createElement('tr'); tr.setAttribute('data-added',''); tr.innerHTML=e.add.map(function(c,i){ return '<td'+(i===3?' class="is-num"':'')+'>'+c+'</td>' }).join(''); tb.appendChild(tr); tr.animate([{opacity:0},{opacity:1}],{duration:400}) } }
  }
  function runInline(a,el){ var r=$('.r',el); r.innerHTML='<span class="gn-status is-good">Done</span>'; applyEffect(a.effect,true);
    toast(a.done, a.once?null:function(){ applyEffect(a.effect,false); r.innerHTML='<button class="gn-btn gn-btn--sm" type="button">'+esc(a.btn)+'</button>'; $('button',r).onclick=function(){ runInline(a,el) }; if(a.undone) announce(a.undone) }) }

  /* the platform's sheet */
  var sheetOk=null;
  function openSheet(a,onOk){ var s=$('#sheet'), sp=a.sheet; sheetOk=onOk;
    s.innerHTML='<span class="k">'+esc(sp.eyebrow)+'</span><h2 id="sheetT">'+esc(sp.h)+'</h2>'+(sp.big?'<span class="big">'+esc(sp.big)+'</span>':'')+'<div class="gn-kv">'+sp.rows.map(function(r){ return '<div class="gn-kv-r"><span class="gn-doc-l">'+esc(r[0])+'</span><span class="gn-doc-v">'+esc(r[1])+'</span></div>' }).join('')+'</div><p class="note">'+esc(sp.note)+'</p>'
      +'<div class="gn-actions"><button class="gn-btn" type="button" id="shNo">Not now</button>'+(sp.alt?'<button class="gn-btn gn-btn--danger" type="button" id="shAlt">'+esc(sp.alt)+'</button>':'')+'<button class="gn-btn gn-btn--primary" type="button" id="shOk">'+esc(sp.ok)+'</button></div>';
    s.hidden=false; $('#scrim').classList.add('is-on'); requestAnimationFrame(function(){ s.classList.add('is-on'); $('#shOk').focus() });
    $('#shNo').onclick=closeSheet; $('#scrim').onclick=closeSheet; $('#shOk').onclick=function(){ closeSheet(); onOk(false) }; var alt=$('#shAlt'); if(alt) alt.onclick=function(){ closeSheet(); onOk(true) };
    s.onkeydown=function(e){ if(e.key==='Escape') closeSheet(); if(e.key==='Tab'){ var f=$$('button',s); if(e.shiftKey&&document.activeElement===f[0]){ e.preventDefault(); f[f.length-1].focus() } else if(!e.shiftKey&&document.activeElement===f[f.length-1]){ e.preventDefault(); f[0].focus() } } } }
  function closeSheet(){ var s=$('#sheet'); s.classList.remove('is-on'); $('#scrim').classList.remove('is-on'); setTimeout(function(){ s.hidden=true },350) }
  function approve(a,card,turn,alt){ card.classList.add('is-done'); $('.k',card).innerHTML='<span>'+esc(a.approved)+'</span>'; applyEffect(a.effect,true); promote(turn);
    var rc=alt&&a.receiptAlt?a.receiptAlt:a.receipt, el=document.createElement('div'); el.className='as-receipt as-reveal';
    el.innerHTML='<span class="k">'+esc(rc.k)+'</span><span class="w">'+esc(rc.w)+'</span><div class="row"><span>'+rc.rows.map(esc).join('<i>·</i>')+'</span>'+(rc.undo?'<button class="gn-btn gn-btn--sm" type="button" data-undo>Undo · <span data-cd>10:00</span></button>':'')+'</div>'+(rc.fixed?'<span class="fx">'+esc(rc.fixed)+'</span>':'')+(rc.undo?'<span class="fx">'+esc(rc.undo)+'</span>':'');
    card.insertAdjacentElement('afterend',el); requestAnimationFrame(function(){ el.classList.add('in') }); el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'}); announce(rc.k+'. '+rc.w);
    var ub=$('[data-undo]',el); if(ub){ var left=600, cd=$('[data-cd]',el); var tm=setInterval(function(){ left--; if(left<0){ clearInterval(tm); ub.disabled=true; ub.textContent='Window closed'; return } cd.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0') },1000); timers.push(tm);
      ub.onclick=function(){ clearInterval(tm); ub.disabled=true; ub.textContent='Undone'; applyEffect(a.effect,false); card.classList.remove('is-done'); $('.k',card).innerHTML=MARK+'<span>Waiting for your approval</span>'; promote(turn); $('.w',el).textContent=rc.undoDone||'Undone'; $('.row > span',el).textContent=''; toast(rc.undoDone||'Undone.') } }
  }
  function clearTimers(){ timers.forEach(clearInterval); timers=[] }

  renderSignin();
})();
