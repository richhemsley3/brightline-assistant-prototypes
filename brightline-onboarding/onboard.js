/* Brightline Onboarding: the engine. Built on the Brightline Assist engine (sign in, the briefing with the ask
   field, the field dropping to the bar, traces, the voice, composed parts, prepared actions on the platform's sheet,
   receipts, next steps, a kept thread). New here: choice turns (goals and the technical questions, answered with
   chips), a route drawn from the answers and redrawn when a fork is re-chosen, step text that reads from the
   route, and receipts that mark a step done on the map. Nothing moves without the person. */
(function(){
  "use strict";
  var D=window.OB, FLOWS=D.FLOWS, CHOICES=D.CHOICES, ACTS=D.ACTS, SEAT=D.SEAT, HOME=D.HOME;
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var esc=function(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};
  var NS='http://www.w3.org/2000/svg';
  function el(t,a,txt){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e}
  var reduce=(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||/[?&]fast\b/.test(location.search);
  var app, run=0, gates=[], timers=[], SUGGEST=null, aiT=0, toastT=0, R=null, DONE={}, THREAD=null;
  var ARROW='<svg viewBox="0 0 14 14"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5"/></svg>';
  var TICK='<svg class="tick" viewBox="0 0 14 14"><path d="M2.5 7.5 5.5 10.5 11.5 3.5"/></svg>';
  var CB='<span class="cb"><svg viewBox="0 0 12 12"><path d="M2.5 6.5 5 9l4.5-6"/></svg></span>';
  var val=function(x){ return typeof x==='function'?x(R):x };
  var qOf=function(id){ return FLOWS[id]?FLOWS[id].q:CHOICES[id]?CHOICES[id].q:ACTS[id].t };
  var known=function(id){ return !!(FLOWS[id]||CHOICES[id]||ACTS[id]) };
  /* an action reached directly becomes a short turn: a line, then the prepared action */
  var flowOf=function(id){ return FLOWS[id]||{q:ACTS[id].t, trace:[], read:'', nofold:true, lead:ACTS[id].say||'', act:id, recs:ACTS[id].recs||[]} };

  /* ── timing ── */
  function wait(ctx,ms){ if(ctx.fast||reduce) return Promise.resolve(); return new Promise(function(res,rej){ setTimeout(function(){ ctx.tok===run?res():rej('cancel') },ms) }) }
  function frame(){ return new Promise(function(r){ var done=false, t=setTimeout(function(){ if(!done){ done=true; r() } },120); requestAnimationFrame(function(){ requestAnimationFrame(function(){ if(!done){ done=true; clearTimeout(t); r() } }) }) }) }
  function cancelGates(){ gates.forEach(function(g){ g.cleanup(); g.rej('cancel') }); gates=[] }
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
  function renderSignin(){ $('#accounts').innerHTML='<button class="account" type="button" data-seat="priya"><img src="'+SEAT.av+'" alt=""><span class="t"><b>'+esc(SEAT.n)+'</b><span>'+esc(SEAT.r)+' · '+esc(SEAT.org)+'</span></span><span class="p">'+esc(SEAT.portal)+'</span></button>';
    $('#accounts [data-seat]').onclick=function(){ signIn() } }
  function signIn(){ app=$('#app'); $('#signin').hidden=true; app.hidden=false; R=JSON.parse(JSON.stringify(D.DEFAULT_ROUTE)); renderHeader(); goHome() }

  /* ── header and sidebar: the portal's own ── */
  function renderHeader(){ var h=$('#hdr');
    h.innerHTML='<div class="mark" id="hMark" role="link" tabindex="0"><i>D</i><span>'+esc(SEAT.portal)+'</span></div><div class="org"><b>'+esc(SEAT.org)+'</b><span class="st quiet">'+SEAT.state+'</span></div><button class="date" id="hDate" type="button" aria-haspopup="menu" aria-expanded="false" title="The date · skip ahead to the next move"></button>'
      +'<div class="q"></div><div class="r"><span class="a" role="link" tabindex="0">'+icon('help')+'<span class="lb">Help</span></span>'
      +'<div class="u" id="hUser" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><img src="'+SEAT.av+'" alt=""><span class="nm">'+esc(SEAT.n)+'<span>'+esc(SEAT.r)+'</span></span>'+icon('down')+'</div></div>';
    $('#hMark').onclick=leave; $('#hMark').onkeydown=function(e){ if(e.key==='Enter') leave() };
    $('#cclose').onclick=leave; renderDate(); $('#hDate').onclick=dateMenu;
    /* the bar takes typing: the proposed question clears when she starts, comes back if she leaves it empty */
    var ct=$('#ctext'), bx=$('#cbox'); ct.contentEditable='true'; ct.spellcheck=false; ct.setAttribute('role','textbox'); ct.setAttribute('aria-label','Ask the assistant');
    ct.addEventListener('focus',function(){ if(bx.classList.contains('suggest')||ct.textContent==='Ask a follow-up'){ ct.textContent=''; } bx.classList.add('typing'); bx.classList.remove('suggest'); ct.style.color='var(--c-ink)' });
    ct.addEventListener('input',function(){ $('#csend').classList.toggle('ready',ct.textContent.trim().length>0) });
    ct.addEventListener('blur',function(){ bx.classList.remove('typing'); if(!ct.textContent.trim()){ if(SUGGEST) suggest(SUGGEST); else { ct.textContent='Ask a follow-up'; ct.style.color=''; $('#csend').classList.remove('ready') } } });
    ct.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); var v=ct.textContent.trim(); if(v){ ct.blur(); hear(v) } else if(SUGGEST){ ct.blur(); $('#csend').click() } } if(e.key==='Escape'){ e.stopPropagation(); ct.textContent=''; ct.blur() } });
    $('#csend').addEventListener('click',function(e){ if(bx.classList.contains('typing')||(ct.textContent.trim()&&!SUGGEST&&ct.textContent!=='Ask a follow-up'&&!$('#csend').classList.contains('await'))){ var v=ct.textContent.trim(); if(v&&v!=='Ask a follow-up'){ e.stopPropagation(); ct.blur(); hear(v) } } });
    var u=$('#hUser'); u.onclick=function(e){ e.stopPropagation(); var m=$('#hMenu'); if(m){ m.remove(); u.setAttribute('aria-expanded','false'); return }
      closeMenus(); var p=document.createElement('div'); p.className='menu'; p.id='hMenu'; p.setAttribute('role','menu'); p.innerHTML='<div class="h">'+esc(SEAT.n)+' · '+esc(SEAT.org)+'</div><button role="menuitem" type="button" id="signout">Sign out</button>'; u.appendChild(p); u.setAttribute('aria-expanded','true'); $('#signout').onclick=function(){ location.reload() } };
    document.addEventListener('click',function(e){ if(!e.target.closest('.menu')) closeMenus() });
    document.addEventListener('keydown',function(e){
      if(e.key==='Tab'&&SUGGEST&&$('#csend').classList.contains('await')&&!$('#cbox').classList.contains('typing')){ e.preventDefault(); $('#csend').click(); return }
      if(e.key==='Escape'&&app.dataset.state==='answer'&&!$('#scrim').classList.contains('open')){ leave(); return }
      if(e.key==='/'&&app.dataset.state==='home'&&!/input|textarea/i.test(e.target.tagName)){ e.preventDefault(); var r=$('#reply'); if(r) r.click() } });
  }
  /* ── the clock: the date in the header, and skipping ahead to the next move. Time moves only when the viewer moves it. ── */
  function renderDate(){ var b=$('#hDate'); if(!b||!R) return; var nm=R.drawn?D.nextMove(R):null; b.innerHTML='<span class="d">'+esc(D.fmtLong(R.today))+'</span><span class="ds">'+esc(D.fmt(R.today))+'</span><span class="n">day '+D.dayN(R)+(nm?' · next move '+esc(D.fmt(nm.date)):'')+'</span>'+icon('down'); b.classList.toggle('pending',!!nm) }
  function closeMenus(){ $$('.menu').forEach(function(m){ m.remove() }); $$('[aria-expanded="true"]').forEach(function(x){ x.setAttribute('aria-expanded','false') }) }
  function dateMenu(e){ e.stopPropagation(); var b=$('#hDate'); if($('#dMenu')){ closeMenus(); return } closeMenus(); var nm=R.drawn?D.nextMove(R):null, p=document.createElement('div'); p.className='menu'; p.id='dMenu'; p.setAttribute('role','menu');
    p.innerHTML='<div class="h">'+esc(D.fmtLong(R.today))+' · day '+D.dayN(R)+'</div>'+(nm?'<button role="menuitem" type="button" id="skip">Skip ahead to '+esc(D.fmt(nm.date))+' · '+esc(nm.short)+'</button>':'<div class="h">'+(R.drawn?'Nothing is out with other people':'Nothing has started yet')+'</div>')+'<hr><button role="menuitem" type="button" id="reset">Start the route over</button>';
    b.appendChild(p); b.setAttribute('aria-expanded','true'); var s=$('#skip'); if(s) s.onclick=function(ev){ ev.stopPropagation(); closeMenus(); skipTo(nm.date) }; $('#reset').onclick=function(ev){ ev.stopPropagation(); closeMenus(); resetRoute() } }
  function resetRoute(){ dropThread(); DONE={}; R=JSON.parse(JSON.stringify(D.DEFAULT_ROUTE)); renderDate(); goHome() }
  function skipTo(date){ if(!R.drawn) return; D.applyClock(R,date); renderDate(); drawRoute(); if(app.dataset.state!=='answer'){ if(THREAD) resume(); else { app.dataset.state='answer'; navOn(null) } } startTurn('ret') }
  function renderNav(){ var sb=$('#sb'); sb.innerHTML='<nav aria-label="Pages">'+D.NAV.map(function(g){ return (g[0]?'<span class="g">'+esc(g[0])+'</span>':'')+g[1].map(function(it){ return '<a role="link" tabindex="0" data-page="'+it[0]+'">'+icon(it[3])+esc(it[1])+(it[2]?'<span class="n">'+it[2]+'</span>':'')+'</a>' }).join('') }).join('')+'</nav><div class="foot">'+esc(SEAT.n)+'<span>'+esc(SEAT.org)+'</span></div>';
    $$('#sb a').forEach(function(a){ a.onclick=function(){ a.dataset.page==='home'?leave():openPage(a.dataset.page) }; a.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); a.click() } } }) }
  function navOn(k){ $$('#sb a').forEach(function(a){ a.classList.toggle('on',a.dataset.page===k) }) }
  function navLabel(k){ var l=k; D.NAV.forEach(function(g){ g[1].forEach(function(it){ if(it[0]===k) l=it[1] }) }); return l }

  function curStep(){ var S=D.steps(R); for(var i=0;i<S.length;i++){ if(!R.done[S[i].k]) return S[i].k } return null }
  function weeksLeft(){ return D.weeksLeft(R) }
  /* the things other people hold, as the tiles and the margin say them */
  function outWith(){ var out=[], landed=[], none=[]; Object.keys(R.long).forEach(function(k){ var st=D.longState(R,k); (st==='out'?out:st==='landed'?landed:none).push(k) }); return {out:out,landed:landed,none:none} }
  function movesLines(n){ var p=D.pending(R).slice(0,n||3); if(!p.length){ var o=outWith(); return '<div class="moves"><span>'+(o.none.length===Object.keys(R.long).length?'Nothing out with other people yet':'Nothing left out with other people')+'</span></div>' } return '<div class="moves">'+p.map(function(e){ return '<span><b>'+esc(D.fmt(e.date))+'</b>'+esc(e.short)+' · '+esc(e.who.replace(/ · .*$/,''))+'</span>' }).join('')+'</div>' }
  function riskText(){ var rk=D.risk(R); return rk.days>0?'at risk · '+rk.days+' days on '+R.long[rk.key].short:'on track' }
  function tiles(ts){ return '<div class="figs">'+ts.map(function(t){ return '<div class="fg"><span class="k">'+esc(t[0])+'</span><span class="v">'+esc(t[1])+'</span>'+(t[2]?'<span class="s">'+esc(t[2])+'</span>':'')+'</div>' }).join('')+'</div>' }
  /* the route's four figures, in the route turn's head card. (The integration drawing is retired, Nov 23: it repeated its labels and the rail.) */
  function routeFigs(){ var S=D.steps(R), doneN=S.filter(function(s){ return R.done[s.k] }).length, o=outWith(), nm=D.nextMove(R);
    return tiles([['Weeks',String(weeksLeft()),'to the first ramp step'],['Steps',String(S.length),doneN?doneN+' done':'on two tracks'],['Out with others',String(o.out.length),o.out.length?(nm?'next: '+D.fmt(nm.date)+' \u00b7 '+nm.short:'all due'):(o.landed.length===Object.keys(R.long).length?'all landed':o.none.length+' to start today')],['First ramp step','May 14',riskText()]]) }
  function drawRoute(){ drawRail(); renderDate(); if(!R.drawn) return; $$('.turn[data-flow="route"] .thead .figs').forEach(function(old){ var n=document.createElement('div'); n.innerHTML=routeFigs(); var fresh=n.firstChild; fresh.className=old.className; old.replaceWith(fresh) }) }
  /* the margin, once she is on a step: the same drawing, small, where she is on it, and whose moves are out */
  /* the step rail: the clock, their moves, your build. Fixed at the left from the route turn on; each step opens its turn. */
  var RAILSUB={ s1:function(){ return 'sandbox · the first call' }, agents:function(){ return 'MCP · a scoped agent key' }, mapmsg:function(){ return '41 scenarios from the specification' },
    s3:function(){ return R.events==='both'?'webhooks and the file':'webhooks' }, office:function(){ return 'Leah signs the reconciliation' }, s4:function(){ return 'mutual TLS · the chain' },
    s5:function(){ return D.cases(R)+' cases from your choices' }, s6:function(){ return R.rounds?'round '+R.rounds+' · Ana reviews':'Ana reviews' }, s7:function(){ return 'go/no-go May 11' }, ramp:function(){ return R.ramp?(R.ramp===1?'the pilot is live':R.ramp+'% of traffic'):'May 14 to 26' } };
  function stepState(s,cur){ if(R.done[s.k]) return 'done'; var f=FLOWS[s.k], g=f?val(f.gate):null; if(g&&g!==s.k&&FLOWS[g]&&FLOWS[g].kind==='wait') return s.k===cur?'now wait':'wait'; return s.k===cur?'now':'' }
  var WAITSUB={ wait_conn:function(){ var e=D.map(R).edges.filter(function(x){ return x.wait&&x.wait() })[0]; return e?e.wait().short:'waiting on the connection' }, wait_ana:function(){ return 'waiting on Ana’s review' }, wait_fin:function(){ return 'waiting on Leah’s sign-off' },
    wait_prod:function(){ return 'waiting on production credentials · '+D.fmt(R.long.prodcreds.lands) }, wait_file:function(){ return 'waiting on the settlement file' } };
  var RAILLONG={allowlist:'Allowlist · Marcus', cert:'Chain · your CA', firewall:'Firewall · NET-4471', prodcreds:'Production credentials', window:'Window · Ana'};
  function waitSub(s){ var f=FLOWS[s.k], g=f?val(f.gate):null; return g&&WAITSUB[g]?WAITSUB[g]():g?'waiting':'' }
  function drawRail(){ var rail=$('#rail'); if(!rail) return; if(!R.drawn||app.dataset.state!=='answer'){ rail.innerHTML=''; rail.hidden=true; app.classList.remove('has-rail'); return } rail.hidden=false; app.classList.add('has-rail');
    var S=D.steps(R), cur=curStep(), doneN=S.filter(function(s){ return R.done[s.k] }).length, rk=D.risk(R), nm=D.nextMove(R), o=outWith(), d0=S.filter(function(s){ return s.k==='d0' })[0];
    var row=function(s){ var st=stepState(s,cur), sub=st.indexOf('wait')>-1?waitSub(s):st==='done'?'done':(RAILSUB[s.k]?RAILSUB[s.k]():''); return '<button type="button" class="st '+st+'" data-step="'+s.k+'"'+(st.indexOf('now')>-1?' aria-current="step"':'')+'><span class="dot"><i></i></span><span class="tx"><span class="t">'+esc(s.t.replace(/^Day one: /,'Day one · '))+'</span>'+(sub?'<span class="s">'+esc(sub)+'</span>':'')+'</span></button>' };
    var longs=Object.keys(R.long).map(function(k){ var L=R.long[k], st=D.longState(R,k); return '<div class="'+st+'"><em>'+esc(RAILLONG[k]||L.t)+'</em><span>'+(st==='landed'?esc(D.fmt(L.lands)):st==='out'?esc(D.fmt(L.lands)):'not asked')+'</span></div>' }).join('');
    rail.innerHTML='<div class="clock"><b>'+esc(D.fmtLong(R.today))+'</b><span>Day '+D.dayN(R)+' of the route · step '+Math.min(doneN+1,S.length)+' of '+S.length+'</span><span>Ramp May 14 · '+(rk.days>0?'<span class="risk">at risk by '+rk.days+' days</span>':'<span class="ok">on track</span>')+'</span></div>'
      +'<div class="lh">Their moves'+(o.out.length?' · '+o.out.length+' out':'')+'</div>'+(d0?row(d0):'')+'<div class="sub">'+longs+'</div>'
      +'<div class="lh">Your build</div>'+S.filter(function(s){ return s.k!=='d0' }).map(row).join('')
      +(nm?'<div class="foot">Next move '+esc(D.fmt(nm.date))+' · '+esc(nm.short)+'</div>':'')
      +'<button type="button" class="strip" aria-expanded="'+rail.classList.contains("open")+'"><span><b>Step '+Math.min(doneN+1,S.length)+' of '+S.length+'</b> · '+esc((S.filter(function(s){ return s.k===cur })[0]||{t:'All steps done'}).t)+'</span><span>'+(nm?'next move '+esc(D.fmt(nm.date)):'nothing out')+'</span></button>';
    $$('[data-step]',rail).forEach(function(b){ b.onclick=function(){ var k=b.dataset.step; if(known(k)) startTurn(k) } });
    $('.strip',rail).onclick=function(){ rail.classList.toggle('open'); this.setAttribute('aria-expanded',rail.classList.contains('open')) } }
  /* the reading pane: reference pages for the turn */
  var PANE=null;
  function refsOf(id){ var X=window.OB_DOCS; return X&&X.refs[id]?X.refs[id].filter(function(k){ return X.pages[k] }):[] }
  function refsRow(id){ var rs=refsOf(id); if(!rs.length) return null; var X=window.OB_DOCS, d=document.createElement('div'); d.className='refs';
    d.innerHTML='<span class="k">Reference</span>'+rs.map(function(k,i){ var p=X.pages[k]; return '<button type="button" class="lnk" data-doc="'+k+'">'+esc(p.title)+'</button>'+(i===0?'<button type="button" class="lnk" data-doc="'+k+'" data-walk>'+esc(p.walkTitle)+'</button>':'') }).join('');
    $$('[data-doc]',d).forEach(function(b){ b.onclick=function(){ openPane(b.dataset.doc,b.hasAttribute('data-walk')) } }); return d }
  function openPane(k,walk){ var pane=$('#pane'); if(!pane) return; var X=window.OB_DOCS, p=X.pages[k]; if(!p) return; PANE=k;
    pane.innerHTML='<div class="top"><span>'+p.crumbs.slice(0,-1).map(esc).join(' › ')+' › <b>'+esc(p.crumbs[p.crumbs.length-1])+'</b></span><button type="button" class="close" aria-label="Close the reference">'+icon('x')+'</button></div>'
      +'<h2>'+esc(p.title)+'</h2><p>'+p.intro+'</p><div class="here"><i class="aimark"></i><span>'+p.here+'</span></div>'
      +'<table><tr><th>'+esc(p.table.cols[0])+'</th><th>'+esc(p.table.cols[2])+'</th></tr>'+p.table.rows.map(function(r){ return '<tr><td>'+r[0]+'<span class="ty">'+r[1]+'</span></td><td>'+r[2]+'</td></tr>' }).join('')+'</table>'
      +'<h3 id="walk">'+esc(p.walkTitle)+'</h3><ol>'+p.walk.map(function(s){ return '<li>'+s+'</li>' }).join('')+'</ol><pre>'+p.code+'</pre><div class="call">'+esc(p.call)+'</div>'
      +'<div class="foot">'+Object.keys(X.pages).filter(function(x){ return x!==k }).map(function(x){ return '<button type="button" class="lnk" data-doc="'+x+'">'+esc(X.pages[x].title)+'</button>' }).join('')+'</div>';
    pane.hidden=false; pane.scrollTop=0; app.classList.add('has-pane'); $('.close',pane).onclick=closePane;
    $$('[data-doc]',pane).forEach(function(b){ b.onclick=function(){ openPane(b.dataset.doc) } });
    $$('.refs [data-doc]').forEach(function(b){ b.classList.toggle('on',b.dataset.doc===k&&!b.hasAttribute('data-walk')) });
    if(walk){ var w=$('#walk',pane); if(w) pane.scrollTop=w.offsetTop-24 } }
  function closePane(){ var pane=$('#pane'); PANE=null; if(pane){ pane.hidden=true; pane.innerHTML='' } app.classList.remove('has-pane'); $$('.refs .on').forEach(function(b){ b.classList.remove('on') }) }
  /* ── the home: Getting started ── */
  function leave(){ if(app.dataset.state==='answer'&&$('#col .turn')){ var col=$('#col'); THREAD={col:col,title:document.title,q:$$('.qtitle',col).pop().textContent}; col.remove() } else { dropThread(); return goHome() } goHome(true) }
  function dropThread(){ if(THREAD){ cancelGates(); clearTimers() } THREAD=null }
  function resume(){ if(!THREAD) return; $('#col').replaceWith(THREAD.col); app.dataset.state='answer'; navOn(null); document.title=THREAD.title; THREAD=null; window.scrollTo(0,0); drawRoute(); if(SUGGEST) ai('land') }
  function goHome(keep){ var tok; if(keep){ tok=run } else { tok=++run; cancelGates(); clearTimers(); SUGGEST=null } app.dataset.state='home'; app.classList.remove('typing'); navOn('home'); document.title='Getting started · '+SEAT.portal;
    var H=HOME, m=$('#main');
    m.innerHTML='<section class="s-home"><div class="home" id="home">'
      +'<div class="byline"><i class="aimark"></i><span>'+esc(H.eyebrow)+'</span></div><h1 class="bh">'+H.h1+'</h1>'
      +'<div class="asksec"><div class="reply ring" id="reply" role="button" tabindex="0"><i class="aimark"></i><span class="rin"><span id="rtext">'+esc(H.ph)+'</span><span class="caret"></span></span><span class="send" id="rsend">'+ARROW+'</span></div>'
      +'<div class="sugg">'+'<span class="k"><i class="aimark"></i>Suggested</span>'+(THREAD?'<button type="button" class="chip" id="resume"><i class="aimark"></i>Continue: '+esc(THREAD.q)+'</button>':'<button type="button" class="chip" id="sugg1">'+esc(H.ask)+'</button>')+'</div><span class="rparse" id="rparse">Looking at <b>the deal</b>, <b>your sandbox</b> and <b>what you want</b></span></div>'
      +'<p class="known">'+H.known+'</p>'
      +'</div></section><section class="s-answer"><div class="wrap"><aside class="rail" id="rail" aria-label="Your route" hidden></aside><div class="col" id="col"></div><aside class="pane" id="pane" aria-label="Reference" hidden></aside></div></section>';
    app.classList.remove('has-rail','has-pane'); PANE=null;
    if(!keep) clearComposer(); $('#parse').classList.remove('in'); window.scrollTo(0,0);
    requestAnimationFrame(function(){ $('#home').classList.add('lit') });
    var ctx={tok:tok,fast:false};
    if(THREAD){ $('#resume').onclick=resume } else { $('#sugg1').onclick=function(){ askNow(ctx,true) } }
    actSearch(ctx).catch(function(){}) }
  function openPage(k){ if(app.dataset.state==='answer'){ leave() } app.dataset.state='home'; app.classList.remove('typing'); navOn(k); document.title=navLabel(k)+' · '+SEAT.portal;
    $('#main').innerHTML='<div class="nb"><h1>'+esc(navLabel(k))+'</h1><p>Not built in this prototype. The route takes you here when a step needs it.</p><div class="row"><button type="button" class="chip" id="nbq"><i class="aimark"></i>'+(THREAD?'Continue: '+esc(THREAD.q):esc(HOME.ask))+'</button></div></div>';
    $('#nbq').onclick=function(){ if(THREAD){ goHome(true); resume() } else { goHome(); setTimeout(function(){ askNow({tok:run,fast:false},true) },400) } }; window.scrollTo(0,0) }

  /* ── the field on the home ── */
  var TYPED=false;
  async function typeQ(ctx){ var Q=D.DESC, ct=$('#rtext'); app.classList.add('typing'); ct.textContent=''; await wait(ctx,350);
    if(ctx.fast||reduce){ ct.textContent=Q } else { for(var i=0;i<Q.length;i++){ ct.textContent=Q.slice(0,i+1); await wait(ctx,Q[i]==='.'?160:Q[i]===' '?22:9+Math.random()*12) } }
    $('#rsend').classList.add('ready'); await wait(ctx,180); $('#rparse').classList.add('in'); TYPED=true }
  /* the home field takes typing too: her own words about what she is building */
  async function actSearch(ctx){ TYPED=false; if(THREAD) return; var rt=$('#rtext'), rp=$('#reply'), PH=rt.textContent; rt.contentEditable='true'; rt.spellcheck=false; rt.setAttribute('role','textbox'); rt.setAttribute('aria-label','Tell the assistant what you are building');
    rp.addEventListener('click',function(e){ if(e.target.closest('#rsend')) return; if(document.activeElement!==rt){ rt.focus() } });
    rt.addEventListener('focus',function(){ if(rt.textContent===PH) rt.textContent=''; app.classList.add('typing') });
    rt.addEventListener('input',function(){ $('#rsend').classList.toggle('ready',rt.textContent.trim().length>0) });
    rt.addEventListener('blur',function(){ if(!rt.textContent.trim()){ rt.textContent=PH; app.classList.remove('typing'); $('#rsend').classList.remove('ready') } });
    function submit(){ var v=rt.textContent.trim(); if(!v||v===PH){ R.heard=null; startFirst(ctx); return } Object.assign(R,D.readNeeds(v)); R.heard=v; rt.blur(); startFirst(ctx) }
    rt.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); submit() } if(e.key==='Escape'){ rt.textContent=''; rt.blur() } });
    $('#rsend').addEventListener('click',submit) }
  function askNow(ctx0,auto){ dropThread(); R.heard=null; TYPED=false; var tok=++run; cancelGates(); var ctx={tok:tok,fast:false}; (async function(){ try{ if(!TYPED) await typeQ(ctx); else { $('#rsend').classList.add('ready') } await wait(ctx,400); startFirst(ctx) }catch(e){ if(e!=='cancel') console.error(e) } })() }
  function startFirst(ctx){ dropThread(); var tok=++run; cancelGates(); DONE={}; R.done={}; R.acts={}; R.gates={}; R.signed={}; R.rounds=0; R.ramp=0; var c={tok:tok,fast:false}; $('#col').innerHTML=''; if(!R.heard){ R.heard=D.DESC; Object.assign(R,D.readNeeds(D.DESC)) } R.answered=D.ORDER.slice(); R.drawn=true; runTurn(c,'route',true).catch(function(e){ if(e!=='cancel') console.error(e) }) }
  function startTurn(id){ var tok=++run; cancelGates(); if(!CHOICES[id]&&id!=='route'&&id!=='why'&&!R.started){ R.started=true; drawRail() } $$('.recs:not(.done)').forEach(function(r){ r.classList.add('done') }); $('#cbox').classList.remove('suggest'); $('#ctext').textContent=qOf(id); $('#ctext').style.color='var(--c-ink)'; $('#csend').classList.add('ready');
    var ctx={tok:tok,fast:false}; (async function(){ try{ await wait(ctx,450); await runTurn(ctx,id,false) }catch(e){ if(e!=='cancel') console.error(e) } })() }

  /* ── the composer ── */
  function clearComposer(){ var b=$('#cbox'); b.classList.remove('suggest','working','land'); var ct=$('#ctext'); ct.textContent='Ask a follow-up'; ct.style.color=''; $('#csend').classList.remove('ready'); SUGGEST=null }
  function suggest(id){ var b=$('#cbox'); SUGGEST=id; $('#ctext').textContent=qOf(id); $('#ctext').style.color=''; $('#csend').classList.remove('ready'); b.classList.add('suggest') }
  function ai(st){ var e=$('#cbox'); e.classList.remove('working','land'); if(st==='working') e.classList.add('working'); if(st==='land'){ void e.offsetWidth; e.classList.add('land') } clearTimeout(aiT); if(st==='land') aiT=setTimeout(function(){ ai('rest') },1300) }
  function flipTo(ctx,srcEl,title){ var from=srcEl.getBoundingClientRect(), fs=parseFloat(getComputedStyle(srcEl).fontSize); return function(){ var to=title.getBoundingClientRect(); if(!ctx.fast&&!reduce&&title.animate){ var s=fs/parseFloat(getComputedStyle(title).fontSize); title.animate([{transform:'translate('+(from.left-to.left)+'px,'+(from.top-to.top)+'px) scale('+s+')',opacity:.6},{transform:'none',opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'}) } } }
  function recButtons(ids){ return ids.map(function(id){ return '<button type="button" class="chip" data-rec="'+id+'">'+esc(qOf(id))+'</button>' }).join('') }

  /* ── a turn: the shell every turn shares ── */
  async function openTurn(ctx,q,first,steps,title){ var col=$('#col'), t=document.createElement('div'); t.className='turn'+(first?'':' later')+(title===false?' asked':'');
    t.innerHTML='<div class="thead">'+(title===false?'':'<h2 class="qtitle'+(first?'':' small')+'">'+esc(title||q)+'</h2>')+(steps&&steps.length?'<div class="trace-wrap"><div class="trace">'+steps.map(function(s){ return '<div class="step"><span class="ic"><span class="spin"></span></span><span class="t">'+esc(s[0])+'</span><span class="r"></span></div>' }).join('')+'</div></div>':'')+'</div>';
    col.appendChild(t); document.title=q+' · '+SEAT.portal;
    if(first){ var go=flipTo(ctx,$('#rtext'),$('.qtitle',t)), boxFrom=$('#reply').getBoundingClientRect();
      $('#rparse').classList.remove('in'); app.classList.remove('typing'); app.dataset.state='answer'; navOn(null); window.scrollTo(0,0); clearComposer(); go();
      var bx=$('#cbox'); await frame(); var bt=bx.getBoundingClientRect();
      if(!ctx.fast&&!reduce&&bx.animate){ bx.animate([{transform:'translate('+(boxFrom.left-bt.left)+'px,'+(boxFrom.top-bt.top)+'px) scale('+(boxFrom.width/bt.width)+','+(boxFrom.height/bt.height)+')',transformOrigin:'0 0'},{transform:'none',transformOrigin:'0 0'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'}) }
      await wait(ctx,650); ai('working'); await wait(ctx,250) }
    else { var ttl=$('.qtitle',t), go2=ttl?flipTo(ctx,$('#ctext'),ttl):null; clearComposer(); if(go2) go2(); ai('working'); if(ttl) window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-88,behavior:reduce?'auto':'smooth'}); await wait(ctx,ttl?450:150) }
    return t }
  /* her words, as a line of the conversation */
  function said(t,text){ var s=document.createElement('div'); s.className='said reveal'+(text.length>80?' long':''); s.innerHTML='<img src="'+SEAT.av+'" alt=""><span>'+esc(text)+'</span>'+(text.length>160?'<button type="button" class="more">Show all</button>':''); var mb=$('.more',s); if(mb){ mb.onclick=function(){ s.classList.toggle('folded'); mb.textContent=s.classList.contains('folded')?'Show all':'Show less' } } (t.classList.contains('turn')?$('.thead',t):t).appendChild(s); requestAnimationFrame(function(){ s.classList.add('in') }); return s }
  async function runTurn(ctx,id,first){ return CHOICES[id]?runChoice(ctx,id,first):runFlow(ctx,id,first) }

  /* a choice turn: the assistant asks, chips answer, a button draws the consequence */
  async function runChoice(ctx,id,first){ var c=CHOICES[id], t=await openTurn(ctx,c.q,first,null,first?(R.heard||HOME.ask):false);
    var p=document.createElement('p'); p.className='lead-p'; $('.thead',t).appendChild(p);
    await words(ctx,p,'<span class="q">'+esc(c.q)+'</span> '+val(c.say)); await wait(ctx,250);
    var opts=val(c.opts), sel=c.multi?R[c.key].slice():R[c.key];
    var box=document.createElement('div'); box.className='recs fork reveal'; box.setAttribute('role',c.multi?'group':'radiogroup');
    box.innerHTML='<span class="k"><i class="aimark"></i>'+(c.multi?'Any of these, or say it in the bar':'One of these, or say it in the bar')+(c.key==='lang'?' · MCP never carries the authorization path':'')+'</span><div class="row">'+opts.map(function(o){ var on=c.multi?sel.indexOf(o.k)>-1:sel===o.k; return '<button type="button" class="chip'+(on?' on':'')+'" data-k="'+o.k+'" title="'+esc(o.s)+'" role="'+(c.multi?'checkbox':'radio')+'" aria-checked="'+on+'">'+esc(o.l)+'</button>' }).join('')+(c.multi?'<button class="tonal" type="button" data-go>'+esc(c.btn)+'</button>':'')+'</div>';
    t.appendChild(box); await frame(); box.classList.add('in'); scrollTo(ctx,box); ai('rest');
    var chips=$$('.chip',box);
    if(c.multi){ chips.forEach(function(b){ b.onclick=function(){ b.classList.toggle('on'); var k=b.dataset.k, i=sel.indexOf(k); if(i>-1) sel.splice(i,1); else sel.push(k); b.setAttribute('aria-checked',b.classList.contains('on')) } }); await gate(ctx,$('[data-go]',box)) }
    else { var hit=await gate(ctx,chips); chips.forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-checked','false') }); hit.classList.add('on'); hit.setAttribute('aria-checked','true'); sel=hit.dataset.k }
    R[c.key]=sel; if(R.answered.indexOf(c.key)<0) R.answered.push(c.key); if(c.key==='goals'&&R.answered.indexOf('token')<0) R.answered.push('token'); if(c.key==='lang'){ R.first=sel==='mcp'?'mcp':sel==='curl'?'curl':'sdk' } if(c.key==='goals'){ R.token=sel.indexOf('token')>-1?'now':'later'; if(sel.indexOf('agents')<0&&R.first==='mcp') R.first='sdk'; if(sel.indexOf('agents')<0&&R.lang==='mcp') R.lang='node' }
    box.classList.add('done'); var tb=$('[data-go]',box); if(tb) tb.remove();
    R.how[c.key]='said'; if(c.key==='goals') R.how.token='said'; drawRoute();
    /* she answered; the assistant says what it heard and what it means */
    var picked=chips.filter(function(b){ return b.classList.contains('on') }).map(function(b){ return b.textContent }); said(box,picked.length?picked.join(' · '):'None of these'); await wait(ctx,350);
    var ap=document.createElement('p'); ap.className='lead-p ack'; box.appendChild(ap); if(c.ack){ await words(ctx,ap,val(c.ack)) } await wait(ctx,500);
    startTurn('route') }
  /* something she typed: an intent, answered in the conversation */
  function hear(text){ text=text.trim(); if(!text) return; var low=text.toLowerCase(), resp=null;
    for(var i=0;i<D.INTENTS.length;i++){ var m=low.match(D.INTENTS[i].re); if(m){ resp=D.INTENTS[i].run(R,m); break } }
    if(resp&&resp.skip){ said($('#col .turn:last-child')||$('#col'),text); var nm=R.drawn?D.nextMove(R):null; if(nm) skipTo(nm.date); else toast(R.drawn?'Nothing is out with other people right now.':'Nothing has started yet.'); return }
    if(resp&&resp.next&&!known(resp.next)){ resp={say:'That part of the route isn’t built yet. Pick from what’s below.', recs:[nextStep(),'why']} }
    if(resp&&resp.next&&!resp.say){ said($('#col .turn:last-child')||$('#col'),text); startTurn(resp.next); return }
    var tok=++run; cancelGates(); $$('.recs:not(.done)').forEach(function(r){ r.classList.add('done') }); var ctx={tok:tok,fast:false};
    (async function(){ try{ var t=await openTurn(ctx,text,false,null); if(!resp){ resp={say:'I didn’t catch that. You can pick from what’s below, or ask me about any step on your route.', recs:[nextStep(),'why']} }
      if(resp.set){ Object.keys(resp.set).forEach(function(k){ R[k]=resp.set[k] }); if(resp.key&&R.answered.indexOf(resp.key)<0) R.answered.push(resp.key); drawRoute() }
      var p=document.createElement('p'); p.className='lead-p'; $('.thead',t).appendChild(p); await words(ctx,p,resp.say); await wait(ctx,300);
      var recs=(resp.recs||[nextStep()]).filter(known); if(R.drawn===false&&resp.set){ recs=[] }
      if(resp.set&&resp.key){ R.how[resp.key]='said' }
      if(recs.length){ var rb=document.createElement('div'); rb.className='recs next reveal'; rb.innerHTML='<span class="k"><i class="aimark"></i>Suggested</span><div class="row">'+recButtons(recs)+'</div>'; t.appendChild(rb); await frame(); rb.classList.add('in'); scrollTo(ctx,rb); suggest(recs[0]); ai('land');
        var chosen=await gate(ctx,[$('#csend')].concat($$('[data-rec]',rb))), id=chosen.dataset&&chosen.dataset.rec?chosen.dataset.rec:recs[0]; rb.classList.add('done'); startTurn(id) } else ai('land') }catch(e){ if(e!=='cancel') console.error(e) } })() }
  function nextStep(){ var S=D.steps(R); for(var i=0;i<S.length;i++){ if(!R.done[S[i].k]&&known(S[i].k)) return S[i].k } return 'why' }
  function isDoneId(k){ return !!(R.done[k]||DONE[k]) }
  function pendingAct(f){ var as=val(f.acts); if(!as) return null; for(var i=0;i<as.length;i++){ if(!DONE[as[i]]&&ACTS[as[i]]) return as[i] } return null }
  function pendingChoice(){ var order=['goals','host','events','settle','disputes','lang']; for(var i=0;i<order.length;i++){ if(R.answered.indexOf(order[i])<0) return order[i] } return 'route' }

  /* a step turn */
  async function runFlow(ctx,id,first){
    var f=flowOf(id); var gt=val(f.gate); if(gt&&known(gt)&&gt!==id){ return runFlow(ctx,gt,first) }
    var trace=val(f.trace)||[], t=await openTurn(ctx,val(f.q),first,trace), read=val(f.read); t.dataset.flow=id;
    if(first&&R.heard){ said(t,R.heard) }
    var th=$('.thead',t);
    if(read){ var sm=document.createElement('div'); sm.className='summary'; sm.innerHTML='<i class="aimark"></i><span>'+esc(read)+'</span>'+(trace.length?'<span class="steps">'+trace.length+' step'+(trace.length>1?'s':'')+'</span>':''); th.insertBefore(sm,th.firstChild) }
    var lp=document.createElement('p'); lp.className='lead-p'; th.appendChild(lp);
    var steps=$$('.step',t);
    for(var i=0;i<steps.length;i++){ steps[i].classList.add('in'); scrollTo(ctx,steps[i]); await wait(ctx,i===2?950:700); $('.r',steps[i]).textContent=trace[i][1]; $('.ic',steps[i]).innerHTML=TICK; await frame(); steps[i].classList.add('done'); await wait(ctx,120) }
    if(!f.nofold&&read){ await wait(ctx,1200); var tw=$('.trace-wrap',t); tw.style.height=tw.offsetHeight+'px'; await frame(); tw.style.height='0px'; $('.summary',t).classList.add('in'); await wait(ctx,450); tw.hidden=true } else { await wait(ctx,250) }
    var sd=$('.said.long',t); if(sd&&$('.more',sd)){ sd.classList.add('folded'); await wait(ctx,300) }
    await words(ctx,lp,val(f.lead)); await wait(ctx,350);
    var rr=refsRow(id); if(rr){ th.appendChild(rr); if(PANE&&refsOf(id).indexOf(PANE)<0) openPane(refsOf(id)[0]) }
    if(id==='route'){ var rm=document.createElement('div'); rm.innerHTML=routeFigs(); var tl=rm.firstChild; tl.classList.add('reveal'); th.insertBefore(tl,rr||null); await frame(); tl.classList.add('in'); drawRail(); await wait(ctx,900) }
    /* a fork inside the step: chips; choosing again rewrites what follows */
    if(f.choice){ var fc=f.choice, fo=val(fc.opts), fb=document.createElement('div'); if(R.answered.indexOf(fc.key)<0){ R.answered.push(fc.key); drawRail() } fb.className='recs fork reveal'; fb.innerHTML='<span class="k"><i class="aimark"></i>'+esc(fc.q)+'</span><div class="row">'+fo.map(function(o){ return '<button type="button" class="chip'+(R[fc.key]===o.k?' on':'')+'" data-k="'+o.k+'" title="'+esc(o.s)+'">'+esc(o.l)+'</button>' }).join('')+'</div>'; t.appendChild(fb); await frame(); fb.classList.add('in'); await wait(ctx,250);
      $$('[data-k]',fb).forEach(function(b){ b.onclick=function(){ $$('[data-k]',fb).forEach(function(x){ x.classList.remove('on') }); b.classList.add('on'); R[fc.key]=b.dataset.k; if(fc.key==='first'&&b.dataset.k==='sdk'&&(R.lang==='mcp'||R.lang==='curl')) R.lang='node'; rebuild(t,f); drawRoute() } }) }
    await buildParts(ctx,t,f,false);
    /* a wait: whose move it is, what she can do meanwhile, a nudge she can send */
    if(f.kind==='wait'){ await waitTail(ctx,t,f); return }
    /* the end of the route: onboarding hands off to operating */
    if(f.end){ ai('land'); var endb=document.createElement('div'); endb.className='recs next reveal'; endb.innerHTML='<span class="k"><i class="aimark"></i>Onboarding is done</span><div class="row"><button class="tonal" type="button" data-home>Continue in the Developer Portal</button></div>'; t.appendChild(endb); await frame(); endb.classList.add('in'); $('[data-home]',endb).onclick=leave; return }
    /* before the decision; or, with nothing to decide, what is next */
    var hasAct=!!(val(f.act)||pendingAct(f)), recs=(val(f.recs)||[]).filter(function(k){ return known(k)&&!(FLOWS[k]&&FLOWS[k].step&&R.done[k]) }), rb=null;
    if(!hasAct&&!recs.length&&id!=='route'){ recs=[nextStep()].filter(known) }
    if(recs.length){ rb=document.createElement('div'); rb.className='recs reveal'; rb.innerHTML='<span class="k"><i class="aimark"></i>'+(hasAct?'Before you decide':'Suggested')+'</span><div class="row">'+recButtons(recs)+'</div>'; t.appendChild(rb); await frame(); rb.classList.add('in'); scrollTo(ctx,rb) }
    if(recs.length){ suggest(recs[0]); ai('land'); announce('Suggested: '+qOf(recs[0]));
      var chosen=await gate(ctx,[$('#csend')].concat($$('[data-rec]',rb))), next=chosen.dataset&&chosen.dataset.rec?chosen.dataset.rec:recs[0];
      rb.classList.add('done'); $$('[data-rec]',rb).forEach(function(b){ b.classList.toggle('picked',b.dataset.rec===next) }); startTurn(next) }
    else { ai('land') }
  }
  async function waitTail(ctx,t,f){ var mw=(val(f.meanwhile)||[]).filter(function(k){ return known(k)&&!isDoneId(k) }), nd=val(f.nudge), na=nd&&ACTS[nd]?ACTS[nd]:null;
    var rb=document.createElement('div'); rb.className='recs reveal'; rb.innerHTML='<span class="k"><i class="aimark"></i>Meanwhile</span><div class="row">'+recButtons(mw)+(na?'<button class="tonal" type="button" data-standing="'+esc(nd)+'">'+esc(standingLabel(na))+'</button>':'')+'</div>'; t.appendChild(rb); await frame(); rb.classList.add('in'); scrollTo(ctx,rb); wireStanding(rb);
    if(mw.length){ suggest(mw[0]); ai('land'); announce('Meanwhile: '+qOf(mw[0])); var chosen=await gate(ctx,[$('#csend')].concat($$('[data-rec]',rb))), next=chosen.dataset&&chosen.dataset.rec?chosen.dataset.rec:mw[0]; rb.classList.add('done'); $$('[data-rec]',rb).forEach(function(b){ b.classList.toggle('picked',b.dataset.rec===next) }); startTurn(next) } else { ai('land'); clearComposer() } }
  function wireStanding(scope){ $$('[data-standing]',scope).forEach(function(b){ b.onclick=function(){ var a=ACTS[b.dataset.standing]; if(!a) return; if(a.inline) approve(a,'standing',b); else openSheet(a,'standing',b) } }) }
  /* the composed parts, read from the route; dynamic so a fork can rebuild them */
  async function buildParts(ctx,t,f,quiet){ var blocks=(val(f.blocks)||[]).slice(); if(f.fig) blocks=[{fig:val(f.fig)}].concat(blocks); if(f.rows){ var rw=val(f.rows); if(rw) blocks=blocks.concat([{rows:rw}]) } if(f.draft){ var dr=val(f.draft); if(dr) blocks=blocks.concat([{draft:dr}]) } if(f.code){ var cd=val(f.code); if(cd) blocks=blocks.concat([{code:cd}]) }
    var w=quiet?{tok:ctx.tok,fast:true}:ctx, th=$('.thead',t);
    for(var i=0;i<blocks.length;i++){ var b=blocks[i], node=null;
      if(b.fig){ node=document.createElement('div'); node.className='hfig reveal'; node.innerHTML='<span class="v">'+esc(b.fig.big)+'</span><span class="k">'+esc(b.fig.k)+' · '+b.fig.d+'</span>'; node.setAttribute('data-dyn',''); var lpn=$('.lead-p',th); th.insertBefore(node,lpn?lpn.nextSibling:null); await frame(); node.classList.add('in'); await wait(w,300); continue }
      else if(b.code){ node=document.createElement('div'); node.className='code reveal'; node.innerHTML='<div class="h">'+esc(b.code.title)+'</div><pre>'+esc(b.code.text)+'</pre>' }
      else if(b.rows){ node=renderRows(b.rows) }
      else if(b.draft){ node=document.createElement('div'); node.className='draft reveal'; node.innerHTML='<div class="h"><b>'+esc(b.draft.title)+'</b><span>'+esc(b.draft.words)+'</span><button class="tonal" type="button">Edit</button></div><p>'+esc(b.draft.text)+'</p>'; $('.tonal',node).onclick=function(){ toast('Editing the draft isn’t in this prototype.') } }
      else if(b.chart){ node=document.createElement('div'); node.className='chartsec reveal'; node.innerHTML='<div class="h"><b>'+esc(b.chart.title)+'</b><span>'+esc(b.chart.sub)+'</span></div>'+barsHTML(b.chart) }
      if(!node) continue; node.setAttribute('data-dyn',''); t.appendChild(node); await frame(); node.classList.add('in'); if(!quiet) scrollTo(ctx,node);
      if(b.rows) await animRows(w,node,b.rows); if(b.chart){ await frame(); $$('.track i',node).forEach(function(x){ x.style.width=x.dataset.w }); await wait(w,700) } await wait(w,b.code?450:300) }
    /* read, comprehend, then act: the prepared action and what is always available follow the evidence */
    var ak=val(f.act)||pendingAct(f); if(ak&&ACTS[ak]){ var pr=renderPrepared(ACTS[ak]); pr.setAttribute('data-dyn',''); t.appendChild(pr); await frame(); pr.classList.add('in'); if(!quiet) scrollTo(ctx,pr); await wait(w,500) }
    var sa=(val(f.standing)||[]).filter(function(k){ return !!ACTS[k] }); if(sa.length){ var sr=document.createElement('div'); sr.className='standing reveal'; sr.setAttribute('data-dyn',''); sr.innerHTML='<span class="k"><i class="aimark"></i>Always here</span>'+sa.map(function(k){ return '<button class="tonal" type="button" data-standing="'+k+'">'+esc(standingLabel(ACTS[k]))+'</button>' }).join(''); t.appendChild(sr); wireStanding(sr); await frame(); sr.classList.add('in') } }
  /* option rows as HTML bars, so the text stays its true size */
  /* counts of discrete items as cells: one per item; navy passed, red missed, light blue counted but not run */
  function cellsHTML(c){ return '<div class="cellchart">'+c.rows.map(function(r){ var miss=r.miss||0, ok=r.run?r.v-miss:0, cells=[];
      for(var i=0;i<r.v;i++){ var st=!r.run?'n':(i<ok?'ok':'miss'), tip=r.l+' · '+(i+1)+' of '+r.v+(r.run?(st==='ok'?' · passed':' · missed'):''); cells.push('<i class="'+st+'" tabindex="-1" data-tip="'+esc(tip)+'"></i>') }
      return '<div class="cg'+(miss?' hot':'')+'"><span class="n">'+esc(r.l)+(r.s?'<span>'+esc(r.s)+'</span>':'')+'</span><div class="cells" role="img" aria-label="'+esc(r.l+': '+(r.vl||r.v))+'">'+cells.join('')+'</div><span class="val'+(miss?' miss':'')+'">'+esc(r.vl||String(r.v))+'</span></div>' }).join('')
    +'</div>' }
  function barsHTML(c){ if(c.kind==='cells') return cellsHTML(c); var max=Math.max.apply(null,c.rows.map(function(r){ return r.v }))||1;
    return '<div class="bars opts">'+c.rows.map(function(r){ return '<div class="b'+(r.hot?' hot':'')+'"><span class="n">'+esc(r.l)+(r.s?'<span>'+esc(r.s)+'</span>':'')+'</span><div class="track"><i'+(r.hot?' class="hot"':'')+' data-w="'+(r.v>0?Math.max(2,100*r.v/max).toFixed(1):0)+'%"></i></div><span class="val">'+esc(r.vl||String(r.v))+'</span></div>' }).join('')+'</div>' }
  function standingLabel(a){ return a.standingLabel||(a.t.length<=34?a.t:a.btn) }
  function rebuild(t,f){ var lp=$('.lead-p',t); if(lp) lp.innerHTML=val(f.lead); $$('[data-dyn]',t).forEach(function(n){ n.remove() }); var rb=$('.recs:not(.fork)',t); buildParts({tok:run,fast:true},t,f,true).then(function(){ if(rb){ t.appendChild(rb) } }) }
  async function words(ctx,node,html){ node.innerHTML=html.split(/(<[^>]+>)/).map(function(p){ return p.charAt(0)==='<'?p:p.replace(/(\S+)/g,'<span class="w">$1</span>') }).join(''); var ws=$$('.w',node); for(var i=0;i<ws.length;i++){ ws[i].classList.add('in'); await wait(ctx,28) } }

  /* ── charts: bars and option rows ── */
  function W(host){ return Math.max(320,Math.round(host.getBoundingClientRect().width))||520 }
  function dly(node,ms){ node.style.transitionDelay=ms+'ms'; return node }
  async function drawChart(ctx,host,c){ host.innerHTML=''; host.classList.remove('in'); var svg=drawOptions(host,c); svg.setAttribute('role','img'); svg.setAttribute('aria-label',c.title); host.appendChild(svg); await frame(); host.classList.add('in'); await wait(ctx,1000) }
  function drawOptions(host,c){ var w=W(host), rowH=72, T=4, h=T+c.rows.length*rowH-8, max=Math.max.apply(null,c.rows.map(function(r){ return r.v })); var svg=el('svg',{viewBox:'0 0 '+w+' '+h});
    c.rows.forEach(function(r,i){ var y=T+i*rowH, g=el('g',{class:'orow'+(r.hot?' hot':'')});
      g.appendChild(dly(el('text',{x:0,y:y+18,class:'ol'},r.l),i*90)); g.appendChild(dly(el('text',{x:w,y:y+18,'text-anchor':'end',class:'ov'},r.vl||String(r.v)),i*90));
      g.appendChild(dly(el('text',{x:0,y:y+37,class:'cap'},r.s),i*90));
      g.appendChild(el('rect',{x:0,y:y+46,width:w,height:12,rx:6,class:'trk'})); if(r.v>0) g.appendChild(dly(el('rect',{x:0,y:y+46,width:Math.max(12,w*r.v/max),height:12,rx:6,class:'fill'}),250+i*140));
      svg.appendChild(g) });
    return svg }

  /* ── rows, prepared, sheet, receipt ── */
  function renderRows(r){ var d=document.createElement('div'); d.className='paycard reveal';
    d.innerHTML='<table class="pays'+(r.toggle?' tog':'')+'"><thead><tr>'+(r.nocheck?'':'<th style="width:30px"></th>')+r.cols.map(function(c,i){ return '<th'+(i===2?' class="hm"':'')+'>'+esc(c)+'</th>' }).join('')+'</tr></thead><tbody>'
      +r.items.map(function(it){ return '<tr class="row'+(it[5]?' hot':'')+'" data-sel="'+(it[4]?1:0)+'">'+(r.nocheck?'':'<td>'+CB+'</td>')+it.slice(0,r.cols.length).map(function(c,i){ return '<td'+(i===1||i===2?' class="c2'+(i===2?' hm':'')+'"':'')+'>'+c+'</td>' }).join('')+'</tr>' }).join('')+'</tbody></table>'
      +'<div class="tfoot"><span>'+esc(r.sub||'')+'</span><b data-tally>'+esc(r.tally(0))+'</b></div>'; return d }
  async function animRows(ctx,node,r){ var rows=$$('tr.row',node); for(var i=0;i<rows.length;i++){ rows[i].classList.add('in'); await wait(ctx,70) } await wait(ctx,300); var n=0;
    for(var j=0;j<rows.length;j++){ if(rows[j].dataset.sel==='1'){ rows[j].classList.add('sel'); n++; $('[data-tally]',node).textContent=r.tally(n); await wait(ctx,90) } }
    await wait(ctx,200); $('[data-tally]',node).textContent=r.done }
  function renderPrepared(a){ var d=document.createElement('div'); d.className='prepared ring reveal'; d.dataset.key=a.key; d.innerHTML='<span class="k"><i class="aimark"></i><span>'+(a.inline?'Ready · a setting of yours, reversible here':'Waiting for your approval')+'</span></span><span class="w">'+esc(a.t)+'</span><div class="row"><span class="m">'+a.m+'</span><button class="btn" type="button">'+esc(a.btn)+'</button></div>';
    $('.btn',d).onclick=function(){ a.inline?approve(a):openSheet(a) }; if(DONE[a.key]) markDone(d,a); return d }
  function markDone(card,a){ card.classList.add('sent'); $('.k span',card).textContent=a.approved }
  function openSheet(a,mode,anchor){ var s=$('#sheet'), sp=a.sheet; s.innerHTML='<span class="k">'+esc(sp.eyebrow)+'</span><h5 id="sheetT">'+esc(sp.h)+'</h5>'+(sp.big?'<span class="big">'+esc(sp.big)+'</span>':'')+'<div>'+sp.rows.map(function(r){ return '<div class="r"><span>'+esc(r[0])+'</span><span>'+esc(r[1])+'</span></div>' }).join('')+'</div><div class="acts"><button class="tonal" type="button" id="shNo">Not now</button><button class="btn" type="button" id="shOk">'+esc(sp.ok)+'</button></div><span class="note">'+esc(sp.note)+'</span>';
    $('#scrim').classList.add('open'); setTimeout(function(){ $('#shOk').focus() },50);
    $('#shNo').onclick=closeSheet; $('#scrim').onclick=function(e){ if(e.target===$('#scrim')) closeSheet() }; $('#shOk').onclick=function(){ closeSheet(); approve(a,mode,anchor) };
    s.onkeydown=function(e){ if(e.key==='Escape'){ e.stopPropagation(); closeSheet() } } }
  function closeSheet(){ $('#scrim').classList.remove('open') }
  /* what an approval changes on the route besides marking a step */
  function effect(a,undo){ var k=a.key; if(k==='pilot'||k==='r10'||k==='r50'||k==='r100'){ var lv={pilot:1,r10:10,r50:50,r100:100}[k]; if(undo){ R.ramp=R.rampPrev } else { R.rampPrev=R.ramp; R.ramp=lv } }
    if(k==='submit') R.rounds=undo?0:1; if(k==='round2') R.rounds=undo?1:2; if(k==='tokennow') R.token=undo?'later':'now';
    if(k==='reroute'&&!undo){ var order=['pilot','r10','r50','r100'], lastk=null; order.forEach(function(x){ if(R.acts[x]) lastk=x }); if(lastk){ delete R.acts[lastk]; DONE[lastk]=false; delete R.gates[lastk]; $$('.prepared[data-key="'+lastk+'"]').forEach(function(c){ c.classList.remove('sent'); $('.k span',c).textContent='Waiting for your approval' }) } R.ramp=R.rampPrev||0 } }
  function approve(a,mode,anchor){ var standing=mode==='standing'; if(!standing&&DONE[a.key]) return; if(!standing) DONE[a.key]=true; R.acts[a.key]=R.today; effect(a,false);
    var cards=standing?[]:$$('.prepared[data-key="'+a.key+'"]'); cards.forEach(function(c){ markDone(c,a) }); var last=standing?(anchor.closest('.recs, .standing')||anchor):cards[cards.length-1], rc=a.receipt;
    var el2=document.createElement('div'); el2.className='receipt reveal'+(standing?' standing-r':'');
    el2.innerHTML='<span class="k">'+esc(val(rc.k))+'</span><span class="w">'+esc(val(rc.w))+'</span>'+(rc.prog?'<div class="prog" style="--pd:'+rc.prog.dur+'ms"><i data-fill></i></div>':'')+'<div class="row"><span>'+val(rc.line)+'</span>'+(rc.cancel?'<button class="tonal" type="button" data-cancel>'+esc(rc.cancel)+' · <span data-cd>10:00</span></button>':rc.undo?'<button class="tonal" type="button" data-cancel data-plain>'+esc(rc.undo)+'</button>':'')+'</div>'+(rc.after?'<span class="fx">'+esc(rc.after)+'</span>':'')+(rc.fixed?'<span class="fx">'+esc(rc.fixed)+'</span>':'');
    last.insertAdjacentElement('afterend',el2); requestAnimationFrame(function(){ el2.classList.add('in') }); announce(rc.k+'. '+rc.w);
    if(standing){ if(rc.prog){ var sf=$('[data-fill]',el2); setTimeout(function(){ sf.style.width=rc.prog.to+'%' },300) } delete R.acts[a.key]; drawRoute(); toast(rc.k); setTimeout(function(){ scrollTo({fast:false},el2) },150); return }
    if(rc.prog){ var fill=$('[data-fill]',el2); setTimeout(function(){ fill.style.width=rc.prog.to+'%' },300);
      if(rc.prog.count){ var n=0, cnt=rc.prog.count, A=$('#rcA',el2); if(A){ var from=parseInt(A.textContent,10)||0; n=from; var tm=setInterval(function(){ n+=Math.max(1,Math.round(cnt.n/8)); if(n>=cnt.n){ n=cnt.n; clearInterval(tm) } A.textContent=n+' of '+cnt.n },380); timers.push(tm) } } }
    /* the step on the map, and the route it may change */
    var stepsDoneBefore=JSON.stringify(R.done); if(a.step&&(a.key!=='chain'&&a.key!=='run'&&a.key!=='runAgent')) R.done[a.step]=true; (a.steps||[]).forEach(function(k){ R.done[k]=true }); drawRoute();
    /* what follows */
    cancelGates(); $$('.recs:not(.done)').forEach(function(r){ r.classList.contains('next')?r.classList.add('done'):(r.classList.contains('fork')?r.classList.add('done'):r.remove()) });
    /* a sequence of acts in one turn: the checklist re-draws and the next one is prepared, here */
    var turn=last.parentElement, fid=turn&&turn.dataset?turn.dataset.flow:null, ff=fid?FLOWS[fid]:null, pend=ff?pendingAct(ff):null;
    if(pend){ var rowsDef=ff.rows?val(ff.rows):null, olds=$$('.paycard[data-dyn]',turn); if(rowsDef&&olds.length){ var fresh=renderRows(rowsDef); fresh.setAttribute('data-dyn',''); olds[olds.length-1].replaceWith(fresh); fresh.classList.add('in'); animRows({tok:run,fast:true},fresh,rowsDef).catch(function(){}) }
      var pr=renderPrepared(ACTS[pend]); pr.setAttribute('data-dyn',''); el2.insertAdjacentElement('afterend',pr); requestAnimationFrame(function(){ pr.classList.add('in') }); setTimeout(function(){ scrollTo({fast:false},pr) },150); clearComposer(); announce('Next: '+ACTS[pend].t); return }
    var nx=(a.next||[]).filter(function(k){ if(!known(k)||DONE[k]) return false; var st=D.STEPS.filter(function(s){ return s.k===k })[0]; if(st&&(R.done[k]||(st.when&&!st.when(R)))) return false; if(k==='tokennow'&&R.token==='now') return false; if(k==='local'&&R.events!=='webhooks') return false; if(k==='watch'&&R.goals.indexOf('agents')<0) return false; if(k==='prodendpoint'&&R.events==='poll') return false; if(k==='s2'&&DONE.note) return false; return true }), nb=document.createElement('div'); nb.className='recs next reveal';
    nb.innerHTML='<span class="k"><i class="aimark"></i>'+(nx.length?'Suggested next':'That’s the route')+'</span><div class="row">'+recButtons(nx)+(nx.length?'':'<button class="tonal" type="button" data-home>Back to Getting started</button>')+'</div>';
    el2.insertAdjacentElement('afterend',nb); requestAnimationFrame(function(){ nb.classList.add('in') }); setTimeout(function(){ scrollTo({fast:false},nb) },150);
    if(nx.length){ suggest(nx[0]); ai('land'); announce('Next: '+qOf(nx[0])) } else { clearComposer() }
    gate({tok:run},(nx.length?[$('#csend')]:[]).concat($$('button',nb))).then(function(x){ nb.classList.add('done'); if(x.dataset.home){ leave(); return } var id=x.dataset.rec||nx[0]; $$('[data-rec]',nb).forEach(function(b){ b.classList.toggle('picked',b.dataset.rec===id) }); startTurn(id) }).catch(function(){});
    var ub=$('[data-cancel]',el2); if(ub){ var ct=null; if(!ub.hasAttribute('data-plain')){ var left=600, cd=$('[data-cd]',el2); ct=setInterval(function(){ left--; if(left<0){ clearInterval(ct); ub.disabled=true; ub.textContent='Window closed'; return } cd.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0') },1000); timers.push(ct) }
      ub.onclick=function(){ if(ct) clearInterval(ct); ub.disabled=true; ub.textContent='Undone'; DONE[a.key]=false; delete R.acts[a.key]; effect(a,true); R.done=JSON.parse(stepsDoneBefore); drawRoute(); cards.forEach(function(c){ c.classList.remove('sent'); $('.k span',c).textContent=a.inline?'Ready · a setting of yours, reversible here':'Waiting for your approval' }); $('.w',el2).textContent=rc.cancelDone; $('.row > span',el2).innerHTML=''; var pf=$('[data-fill]',el2); if(pf) pf.style.width='0'; if(!nb.classList.contains('done')){ nb.remove(); clearComposer() } toast(rc.cancelDone) } } }

  renderSignin();
  /* test hook: ?auto=home | route | <turn id> [&today=2026-04-07] [&visited=2026-03-10] [&done=d0,s1] [&acts=reqnet,csr] [&long=all|allowlist,cert] [&ramp=10] [&rounds=1]
     signs in and drives the demo to that state (with ?fast for speed) */
  var AUTO=(location.search.match(/[?&]auto=([^&]*)/)||[])[1];
  function qp(k){ var m=location.search.match(new RegExp('[?&]'+k+'=([^&]*)')); return m?decodeURIComponent(m[1]):'' }
  if(AUTO){ signIn(); if(AUTO!=='home'){ setTimeout(function(){ askNow({tok:run,fast:false},true) },60);
    if(AUTO!=='route'){ var tm0=setInterval(function(){ if($('#col .recs:not(.fork)')){ clearInterval(tm0);
      qp('done').split(',').filter(Boolean).forEach(function(k){ R.done[k]=true });
      if(qp('today')){ R.visited=qp('visited')||R.today; R.today=qp('today') }
      qp('acts').split(',').filter(Boolean).forEach(function(k){ DONE[k]=true; R.acts[k]=qp('acted')||R.today });
      var lg=qp('long'); if(lg){ Object.keys(R.long).forEach(function(k){ if(lg==='all'||lg.split(',').indexOf(k)>-1){ R.long[k].state='landed' } else if(lg==='out'){ R.acts[R.long[k].by]=R.acts[R.long[k].by]||R.today } }) }
      D.events(R).forEach(function(e){ if(e.date<=R.today){ var p=e.key.split(':'); if(p[0]==='long') R.long[p[1]].state='landed'; if(p[0]==='signed') R.signed[p[1]]=true; if(p[0]==='gate') R.gates[p[1]]=true; if(e.key==='review') R.reviewed=true; if(e.key==='signoff') R.signoff=true } });
      if(qp('ramp')) R.ramp=+qp('ramp'); if(qp('rounds')) R.rounds=+qp('rounds'); if(qp('signed')) R.signed.fin=true;
      if(!CHOICES[AUTO]&&AUTO!=='why'){ R.started=true } drawRoute(); startTurn(AUTO) } },150) } } }
})();
