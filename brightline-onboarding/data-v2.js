/* Brightline Onboarding v2: the arc's new content, loaded after data.js and extending window.OB.
   Assembled from the drafted parts (day one, first call, mapping, events and the back office, secure and
   configuration, certification and readiness, the ramp). Each part is wrapped in (function(D){ … })(window.OB). */

/* ── part: firstcall ── */
/* firstcall: step 1 for v2 (the first successful call, with time to first call on its receipt), the agents step
   (connect Claude Code and Cursor over MCP), the feasibility note as an offer after step 1 rather than a step,
   and the two reasons around them: why these eleven steps on two tracks, and what the agent key can never do. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;
  /* the v1 objects this part builds on; their choice and snippets are kept exactly */
  var S1=FLOWS.s1, S2=FLOWS.s2, SCOPE=FLOWS.scope, NOTE=ACTS.note;
  function mcpSnip(){ if(D.SNIP&&D.SNIP.mcp) return D.SNIP.mcp; return S1.blocks({first:'mcp', lang:'node', goals:['agents']})[0].code.text }
  function without(o,k){ var c=Object.assign({}, o); delete c[k]; return c }

  /* the v2 route, for "why these steps": each step, its track, and why it is there; which steps are on her route comes from the engine */
  var V2=[
    {k:'d0',     t:'Day one · start the long-lead items',       tr:'Long-lead', w:'Five of their moves take weeks; asked for on day one, they land before the build needs them'},
    {k:'s1',     t:'First successful call',                     tr:'Build',     w:'The network sees your key and your message shape before anything else is built'},
    {k:'agents', t:'Connect your agents',                       tr:'Build',     w:'You asked for Claude Code and Cursor on the sandbox; a scoped key, never production'},
    {k:'mapmsg', t:'Map the authorization messages',            tr:'Build',     w:'Your host speaks ISO 8583 and the network speaks JSON; the mapping is yours, and nothing waits for it'},
    {k:'s3',     t:'Receive events',                            tr:'Build',     w:'You want decisions, disputes and settlement as they happen; an endpoint, a secret, four cases'},
    {k:'office', t:'The back office: settlement and disputes',  tr:'Both',      w:'Settlement is finance’s and disputes are operations’; both see the real thing before certification'},
    {k:'s4',     t:'Secure the connection',                     tr:'Both',      w:'Mutual TLS needs the chain, the allowlist and the firewall change; the handshake proves all three'},
    {k:'s5',     t:'Confirm configuration',                     tr:'Build',     w:'Every certification case is generated from a value you confirm; nothing generic is tested'},
    {k:'s6',     t:'Certify, in rounds',                        tr:'Both',      w:'Ana validates the cases end to end; two rounds is the plan, so her comments are expected'},
    {k:'s7',     t:'Production readiness and go/no-go',         tr:'Both',      w:'Production credentials were asked for on day one; readiness and Dana’s decision make May 14 a fact'},
    {k:'ramp',   t:'Ramp',                                      tr:'Both',      w:'Traffic goes up in steps, each gated by the first settlement file reconciling; a reroute is always ready'}
  ];
  function v2steps(R){ var on={}; steps(R).forEach(function(s){ on[s.k]=true }); return V2.filter(function(s){ return on[s.k] }) }

  Object.assign(FLOWS, {
    s1:{ q:'Start: the sandbox and your first call', step:'s1',
      trace:function(R){ return [['Reading your sandbox history','214 calls since March 10 · preview key'],['Preparing a key of your own','sandbox · scoped to what you build'],['Picking the first call for '+lang(R), first(R)==='mcp'?'your agent, over MCP':'the snippet with your values filled in']] },
      read:'Read your sandbox history and the deal’s identifiers', noToggle:true,
      lead:function(R){ return first(R)==='mcp'
        ?'A scoped key for your agents, and the first call sent by them over MCP; they stay connected for the build. The key reads the reference, sends test cards, reads logs and runs cases; never production, never the authorization path.'
        :'A key of your own, and the first call made the way you’ll really make it, with your values filled in. Change the way of calling any time; the key is the same.' },
      choice:S1.choice,
      blocks:S1.blocks,
      act:function(R){ return first(R)==='mcp'?'agentkey':'key' }, recs:function(R){ return first(R)==='mcp'?['scope']:['why'] } },

    agents:{ q:'Connect your agents', step:'agents',
      trace:[['Reading your tooling','Claude Code and Cursor · from your description'],['Preparing a key for your agents','sandbox and certification · reference, cards, logs, cases, deliveries'],['Reading what it can never do','production · keys · configuration · the authorization path']],
      read:'Read your tooling and the scopes an agent key can hold', noToggle:true,
      lead:'One line connects Claude Code and Cursor to mcp.dgn.com on a scoped key: the reference, test cards, logs, certification runs and deliveries. Never production, and never the authorization path, which stays on the API over mutual TLS.',
      blocks:function(R){ return [{code:{title:'Connect your agents · mcp.dgn.com', text:mcpSnip()}}] },
      act:'agentkey', recs:['scope'] },

    /* the feasibility note to Dana: no longer a step, offered after the first call; the evidence is what the facts sheet says she ran */
    s2:Object.assign(without(S2,'step'), {
      trace:[['Reading what you’ve done','214 calls on the preview key · the first on your own · the reference read'],['Drafting the note','one sentence and the evidence']],
      draft:function(R){ var iso=R.host==='iso';
        var text='Dana, it’s feasible. We’ve made 214 calls against the sandbox and the first on a key of our own, and read the authorization and event references'+(iso?'; the mapping from our ISO 8583 host is ours, and nothing waits on it':'')+'. Nothing in the specification blocks us. Go ahead and sign when you’re ready. Priya';
        return {title:'To Dana Iverson, drafted', words:text.split(/\s+/).length+' words', text:text} } }),

    /* a reason with no act and no recs: the engine's default Next is the next step on the route */
    why:{ q:'Why these steps and not others?',
      trace:function(R){ var n=v2steps(R).length; return [['Comparing your route with the full roadmap',n+' steps · '+(V2.length-n)+' skipped'],['Reading the two tracks','build, yours · long-lead, other people’s moves from day one'],['Reading what each goal switched on',R.goals.length+' goals']] },
      read:'Read the roadmap and the long-lead items against your goals', noToggle:true,
      lead:'Two tracks: the build steps are yours; the long-lead items are other people’s moves, started on day one so they land before you need them. Each step is there because something you said needs it, and nothing is there for its own sake.',
      rows:function(R){ var done=R.done||{}, ss=v2steps(R), hot=null; ss.some(function(s){ if(!done[s.k]){ hot=s.k; return true } return false });
        return {cols:['Step','Track','Why it is there'], items:ss.map(function(s){ return [s.t, s.tr, s.w, !!done[s.k], s.k===hot] }), nocheck:true, tally:function(){ return '' }, done:ss.length+' steps on two tracks · five long-lead items, started on day one'} } },

    scope:Object.assign({}, SCOPE, {act:'agentkey'})
  });

  Object.assign(ACTS, {
    key:{key:'key', step:'s1', t:'Issue your sandbox key', m:'Shown once · rotate any time · sandbox only', btn:'Review and issue',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Issue an API key', rows:[['Environment','Sandbox'],['Name','priya-dev'],['Scope','Authorizations, events, test cards, logs'],['Shown','Once, then only its name'],['Then','Your first authorization, sent the way you chose']], note:'Keys are yours to rotate or expire from API keys. The preview key you used in March stops working in 30 days.', ok:'Issue the key'},
      approved:'Issued by you at 10:04 AM',
      receipt:{k:'Key issued · 10:04 AM', w:'sk_sandbox_7f3a… · copied', prog:{to:100, dur:2600}, line:'<b>Your first call</b> · approved · 00 · 48 ms · 11 minutes from the route to decision: approved', fixed:'The key is shown once. Rotate priya-dev from API keys at any time.'},
      next:['agents','mapmsg','first','s2']},
    agentkey:{key:'agentkey', step:'s1', steps:['s1','agents'], t:'Issue a scoped key for your agents', m:'Read the reference · send test cards · read logs · run cases · <b>never production</b>', btn:'Review and issue',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Issue an agent key', rows:[['Environment','Sandbox and certification'],['Name','brightline-agent'],['Scope','reference:read · cards:send · logs:read · cert:run'],['Not in scope','Production, keys, configuration'],['Connect','mcp.dgn.com with this key'],['Then','Your agent sends the first authorization and stays connected for the build']], note:'An agent key can’t touch production or change configuration. Revoke it from API keys at any time; sessions end within a minute.', ok:'Issue the agent key'},
      approved:'Issued by you at 10:04 AM',
      receipt:{k:'Agent key issued · 10:04 AM', w:'brightline-agent · connected to mcp.dgn.com', prog:{to:100, dur:2200}, line:'<b>Your agent sent its first authorization</b> · approved · 00 · 48 ms · 11 minutes from the route to decision: approved', fixed:'Your agents stay connected for the build. Revoke from API keys at any time.'},
      next:['mapmsg','s3','first','s2']},
    /* the note to Dana completes no step now; the build is already under way when she sends it */
    note:Object.assign(without(NOTE,'step'), {
      sheet:Object.assign({}, NOTE.sheet, {rows:[['To','Dana Iverson, VP of Partnerships'],['Says','Feasible. The sandbox calls, the reference read, nothing in the specification blocks us.'],['Then','Dana can sign; nothing else changes']]}),
      receipt:Object.assign({}, NOTE.receipt, {line:'<b>Feasibility done</b> · Dana’s Agreements page shows it · she signs when she is ready'}),
      next:['agents','mapmsg','s3','first']})
  });
})(window.OB);


/* ── part: dayone ── */
/* dayone: day one and the long-lead track. The step that raises the five items other people hold, in three sheets grouped
   by owner; the reasons behind them (why so long, what am I waiting on); the wait before the connection can be secured; the
   two nudges; and the lead of the return briefing. Owners, dues and landings read from R.long and R.acts; the facts kept
   here are the fallback when the engine has not filled them in. */
(function(D){
  "use strict";
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps,
      fmt=D.fmt||function(iso){ if(!iso) return ''; var p=iso.split('-'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+p[1]-1]+' '+(+p[2]) },
      longState=D.longState||function(R,k){ return (R.long&&R.long[k]&&R.long[k].state)||'none' };

  /* ── the five items: what each is, who holds it, which request raises it, and the dates the facts sheet gives ── */
  var KEYS=['allowlist','cert','firewall','prodcreds','window'], DAYONE=['reqnet','csr','fwticket'], RAISED='2026-03-10';
  var LONG={
    allowlist:{item:'Allowlist for 203.0.113.0/24',       short:'the allowlist',              owner:'Marcus Bell · the network',                       who:'Marcus Bell',        act:'reqnet',  due:'2026-03-24', lands:'2026-03-20'},
    cert:     {item:'Certificate chain from your CA',     short:'the chain',                  owner:'Brightline Issuing CA 2 · your security team',    who:'your security team', act:'csr',     due:'2026-03-24', lands:'2026-03-19'},
    firewall: {item:'Firewall change, ticket NET-4471',   short:'the firewall change',        owner:'Your network team',                               who:'your network team',  act:'fwticket', due:'2026-04-02', lands:'2026-04-02'},
    prodcreds:{item:'Production credentials',             short:'the production credentials', owner:'Marcus Bell · the network',                       who:'Marcus Bell',        act:'reqnet',  due:'2026-05-04', lands:'2026-04-30'},
    window:   {item:'Certification window Apr 20 to 24',  short:'the window hold',            owner:'Ana Okafor · the network',                        who:'Ana Okafor',         act:'reqnet',  due:'2026-04-15', lands:'2026-04-15'}
  };
  /* reading an item's state from the route: landed, out (raised by its request, or marked so by the engine), or not raised */
  function acts(R){ return R.acts||{} }
  function phase(R,k){ var s=longState(R,k); if(s==='landed') return 'landed'; if(s==='out'||acts(R)[LONG[k].act]) return 'out'; return 'none' }
  function dueIso(R,k){ return (R.long&&R.long[k]&&R.long[k].due)||LONG[k].due }
  function due(R,k){ return fmt(dueIso(R,k)) }
  function landsOn(R,k){ var l=R.long&&R.long[k]; return fmt((l&&(l.landed||l.lands))||LONG[k].lands) }
  function since(R,k){ if(phase(R,k)==='none') return ''; var l=R.long&&R.long[k]; return fmt(acts(R)[LONG[k].act]||(l&&l.raised)||RAISED) }
  function state(R,k){ var p=phase(R,k); if(p==='landed') return 'Landed '+landsOn(R,k); if(p==='none') return 'Not raised'; return k==='window'?'Held · confirmed at sign-off':'Out · due '+due(R,k) }
  function dueCell(R,k){ return due(R,k)+(k==='window'?' · sign-off':'') }
  function pending(R){ for(var i=0;i<DAYONE.length;i++){ if(!acts(R)[DAYONE[i]]) return DAYONE[i] } return null }
  function count(R,p,keys){ return (keys||KEYS).filter(function(k){ return phase(R,k)===p }).length }
  function nextDue(R,keys){ return (keys||KEYS).filter(function(k){ return phase(R,k)==='out' }).sort(function(a,b){ return dueIso(R,a)<dueIso(R,b)?-1:1 })[0]||null }
  function words(n){ return ['no','one','two','three','four','five','six','seven','eight','nine','ten'][n]||String(n) }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1) }
  function list(xs){ return xs.length>1?xs.slice(0,-1).join(', ')+' and '+xs[xs.length-1]:(xs[0]||'') }
  /* one sentence on an item: whose move it is and since when, or that it landed, or that it is still to raise */
  function move(R,k){ var L=LONG[k], p=phase(R,k);
    if(p==='landed') return cap(L.short)+' landed '+landsOn(R,k)+'.';
    if(p==='none') return cap(L.short)+' has not been raised yet; the request to '+L.who+' is drafted.';
    return {allowlist:'The allowlist has been with Marcus Bell since '+since(R,k)+', due '+due(R,k)+'.',
      cert:'The certificate request has been with your security team since '+since(R,k)+'; the chain is due '+due(R,k)+'.',
      firewall:'NET-4471 has been with your network team since '+since(R,k)+', for their '+due(R,k)+' window.',
      prodcreds:'The production credentials have been with Marcus Bell since '+since(R,k)+', due '+due(R,k)+'.',
      window:'Ana Okafor has held the window since '+since(R,k)+'; she confirms it at sign-off, '+due(R,k)+'.'}[k] }
  var CONN=['allowlist','cert','firewall'];
  function outstanding(R){ return CONN.filter(function(k){ return phase(R,k)!=='landed' }) }

  Object.assign(FLOWS, {
    /* ── day one: the step. Five items, three sheets, approved one at a time; the rows re-read after each receipt ── */
    d0:{ q:'Day one: start the long-lead items', step:'d0',
      trace:[['Reading the long-lead items','5 items · 4 owners · the first due Mar 24'],['Reading the calendar','firewall window Apr 2 · certification Apr 20 to 24 · first ramp step May 14'],['Drafting the requests','one to Marcus Bell · one to your CA · one ticket to your network team']],
      read:'Read the deal’s long-lead items, the calendar and who holds each', noToggle:true,
      lead:function(R){ var p=pending(R); return p==='reqnet'?'Five things on this route are other people’s moves, and the slowest of them decides May 14. Three requests are drafted, and Marcus Bell’s goes first.':
        p==='csr'?'Marcus Bell has the request for the allowlist and the production credentials, and he passes the window hold to Ana Okafor. The certificate request to your security team is next; the chain is due Mar 24.':
        p==='fwticket'?'Two of the three requests are out. The firewall ticket is the last, and its Apr 2 window decides when the connection can be secured.':
        'Everything long-lead is out, each item with its owner and its due date. The build track is yours from here'+((R.done||{}).s1?'.':', starting with the first call.') },
      rows:function(R){ var p=pending(R), o=5-count(R,'none'), l=count(R,'landed'), nd=nextDue(R);
        return {cols:['Item','Owner','Due','State'], items:KEYS.map(function(k){ return [LONG[k].item, LONG[k].owner, dueCell(R,k), state(R,k), phase(R,k)!=='none', LONG[k].act===p] }), nocheck:true, tally:function(){ return '' },
          done:o+' of 5 out'+(p?' · '+({reqnet:'Marcus Bell’s request',csr:'the certificate request',fwticket:'the firewall ticket'})[p]+' is next':(l?' · '+l+' landed':'')+(nd?' · next due '+due(R,nd):''))} },
      acts:['reqnet','csr','fwticket'], recs:['leadtimes'] },

    /* ── why do these take so long: the owners and their windows; ends in the next request still to send ── */
    leadtimes:{ q:'Why do these take so long?',
      trace:[['Reading who holds each item','5 items · three with the network, two on your side'],['Reading the lead times behind them','a change calendar · a signing queue · a maintenance window · a sign-off']],
      read:'Read the owners and the lead times behind the five items', noToggle:true,
      lead:function(R){ return 'Each item sits in someone else’s queue, and a queue has a window rather than a speed. '+(pending(R)?'Raising all five today is what keeps the slowest of them inside May 14.':'Raising all five on day one is what keeps the slowest of them inside May 14.') },
      rows:function(R){ var p=pending(R), T={allowlist:['Marcus Bell · the network’s change calendar','Two weeks · due Mar 24'],cert:['Brightline Issuing CA 2 · your security team’s signing queue','Two weeks · due Mar 24'],firewall:['Your network team · their next maintenance window','Three weeks · the Apr 2 window'],prodcreds:['Marcus Bell · issued after certification signs off','Eight weeks · due May 4'],window:['Ana Okafor · held at once','Confirmed at her sign-off, Apr 15']};
        return {cols:['Item','Who holds it','Typical lead time'], items:KEYS.map(function(k){ return [LONG[k].item, T[k][0], T[k][1], phase(R,k)!=='none', LONG[k].act===p] }), nocheck:true, tally:function(){ return '' }, done:'5 items · the firewall window decides when the connection can be secured'} },
      act:function(R){ return pending(R) } },

    /* ── what am I waiting on: the five items with whose, since, due and state; the engine supplies the next step ── */
    waiting:{ q:'What am I waiting on?',
      trace:function(R){ return [['Reading the five long-lead items',count(R,'out')+' out · '+count(R,'landed')+' landed · '+count(R,'none')+' not raised'],['Reading who holds each','Marcus Bell · Ana Okafor · your security team · your network team']] },
      read:'Read the five long-lead items against the calendar', noToggle:true,
      lead:function(R){ var o=count(R,'out'), l=count(R,'landed'), nd=nextDue(R);
        if(!o&&!l) return 'Nothing is out yet, so nothing is waiting on anyone but you. All five items are still yours to raise, and Marcus Bell’s request goes first.';
        if(!o) return 'Everything you asked for on day one has landed. Nothing on the route is waiting on anyone else now.';
        var late=dueIso(R,nd)<(R.today||RAISED);
        var s1=cap(words(o))+(o>1?' items are with other people':' item is with someone else')+(l?', and '+words(l)+(l>1?' have':' has')+' landed':'')+'.';
        if(nd==='window') return s1+' The next to land is Ana Okafor’s confirmation of the window, at her sign-off '+due(R,nd)+(late?', a date that has passed':'')+'.';
        return s1+' The next due is '+LONG[nd].short+' from '+LONG[nd].who+', '+due(R,nd)+(late?', and that date has passed':'')+'.' },
      rows:function(R){ var nd=nextDue(R); return {cols:['Move','Whose','Since','Due','State'], items:KEYS.map(function(k){ var p=phase(R,k); return [LONG[k].item, LONG[k].owner, since(R,k), dueCell(R,k), p==='landed'?'Landed '+landsOn(R,k):p==='out'?(k==='window'?'Held':'Out'):'Not raised', p==='landed', k===nd] }), nocheck:true, tally:function(){ return '' },
        done:count(R,'landed')+' of 5 landed · '+count(R,'out')+' out'+(nd?' · next due '+due(R,nd):'')} } },

    /* ── the wait before the connection can be secured: allowlist, chain and firewall must all have landed ── */
    wait_conn:{ q:'Waiting to secure the connection', kind:'wait',
      trace:function(R){ var o=outstanding(R)[0]; return [['Reading the three items the connection needs',count(R,'landed',CONN)+' of 3 landed'],['Reading whose move it is',o?cap(LONG[o].who)+' · since '+(since(R,o)||'not raised yet')+' · due '+due(R,o):'nothing outstanding']] },
      read:'Read the three long-lead items the connection waits on', noToggle:true,
      lead:function(R){ var O=outstanding(R), L=CONN.filter(function(k){ return phase(R,k)==='landed' }), n=function(k){ return LONG[k].short };
        if(!O.length) return 'The allowlist, the chain and the firewall change have all landed. Nothing holds the connection now; the handshake can be tried.';
        var s1=L.length?cap(list(L.map(n)))+(L.length>1?' have':' has')+' landed; '+list(O.map(n))+(O.length>1?' are':' is the one')+' still out.':'Securing the connection waits on the allowlist, the chain and the firewall change, and none has landed yet.';
        return s1+' '+move(R,O[0]) },
      rows:function(R){ var hot=outstanding(R)[0]; return {cols:['Move','Whose','Since','Due'], items:CONN.map(function(k){ var p=phase(R,k); return [LONG[k].item, LONG[k].owner, since(R,k)||'Not raised', p==='landed'?'Landed '+landsOn(R,k):due(R,k), p==='landed', k===hot] }), nocheck:true, tally:function(){ return '' },
        done:count(R,'landed',CONN)+' of 3 landed'+(hot?' · '+LONG[hot].short+' is next, due '+due(R,hot):' · the connection can be secured')} },
      meanwhile:function(R){ var d=R.done||{}, on={s1:true, agents:(R.goals||[]).indexOf('agents')>-1, mapmsg:R.host==='iso', s3:R.events!=='poll', office:true};
        return ['s1','agents','mapmsg','s3','office'].filter(function(k){ return on[k]&&!d[k] }).concat(['waiting']) },
      nudge:function(R){ return phase(R,'firewall')!=='landed'&&phase(R,'allowlist')==='landed'?'nudgeNet':'nudgeMarcus' } }
  });

  Object.assign(ACTS, {
    /* ── the three day-one requests, grouped by owner ── */
    reqnet:{key:'reqnet', t:'Ask Marcus for the allowlist, the production credentials and the window hold', m:'One note to Marcus Bell · three items, each with its due · the allowlist first, <b>Mar 24</b>', btn:'Review and send',
      say:'One note to Marcus Bell covers the allowlist, the production credentials and the window hold, which he passes to Ana Okafor. Each comes back with its own due date.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Send a request', rows:[['To','Marcus Bell, operations lead'],['Says','Three asks for day one: open the staging allowlist for 203.0.113.0/24, start our production credentials, and hold Apr 20 to 24 for certification.'],['Then','Marcus raises the allowlist and the credentials and passes the hold to Ana Okafor; each item stays out until it lands']], note:'The request sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 9:56 AM',
      receipt:{k:'Sent · 9:56 AM', w:'Marcus has your request · three items', prog:{to:100, dur:600000}, line:'<b>Allowlist</b> due Mar 24 · <b>production credentials</b> due May 4 · <b>window Apr 20 to 24</b> held, confirmed at sign-off Apr 15', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}},
    csr:{key:'csr', t:'Request the certificate chain from your CA', m:'A signing request to Brightline Issuing CA 2, through your security team · chain due <b>Mar 24</b>', btn:'Review and send',
      say:'The chain comes from your own CA, through your security team. The request names the host and asks for the full chain, to the root.',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a certificate signing request', rows:[['To','Your security team, for Brightline Issuing CA 2'],['Says','A staging certificate for staging.brightline.example, for mutual TLS with the network: the full chain to Brightline Root CA, by Mar 24.'],['Then','The CA issues the leaf; the chain comes back to you to upload when the connection is secured']], note:'The request sends when you confirm. The chain is yours to upload when it is issued.', ok:'Send'},
      approved:'Sent by you at 9:58 AM',
      receipt:{k:'Sent · 9:58 AM', w:'Your security team has the request', line:'<b>Certificate chain</b> due Mar 24 · Brightline Issuing CA 2 · yours to upload when the connection is secured', fixed:'The chain comes back as a file; the network reads it to the root when you upload it.'}},
    fwticket:{key:'fwticket', step:'d0', t:'Raise the firewall change with your network team', m:'Ticket NET-4471 · outbound from 203.0.113.0/24 to the network, mutual TLS · window <b>Apr 2</b>', btn:'Review and raise',
      say:'The last of the three, and the one with the longest wait: your network team’s next window is Apr 2. The ticket names the range and the hosts.',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Raise a firewall change', rows:[['To','Your network team · ticket NET-4471'],['Says','Allow outbound HTTPS from our staging egress range, 203.0.113.0/24, to sandbox.api.dgn.com, cert.api.dgn.com and mcp.dgn.com, for mutual TLS.'],['Then','The change goes in at the Apr 2 window; the handshake follows it']], note:'The ticket opens when you confirm. Your network team sets the window; Apr 2 is their next one.', ok:'Send'},
      approved:'Raised by you at 10:00 AM',
      receipt:{k:'Raised · 10:00 AM', w:'NET-4471 · with your network team', line:'<b>Firewall change</b> due Apr 2 · all five long-lead items are out · the first is due Mar 24', fixed:'The connection can be secured when the allowlist, the chain and this change have landed.'},
      next:['s1','waiting']},

    /* ── the nudges: standing acts on the wait turns; a drafted note, sent through the sheet, nothing advances ── */
    nudgeMarcus:{key:'nudgeMarcus', t:'Nudge Marcus Bell about the allowlist', m:'A drafted note · the allowlist for 203.0.113.0/24 · due <b>Mar 24</b>', btn:'Nudge Marcus',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Send a nudge', rows:[['To','Marcus Bell, operations lead'],['Says','Checking on the allowlist for 203.0.113.0/24, due Mar 24; the handshake is the next thing waiting on it.'],['Then','Marcus answers in his own time; the allowlist shows as landed when it opens']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 9:12 AM',
      receipt:{k:'Sent · 9:12 AM', w:'Marcus has your nudge', prog:{to:100, dur:600000}, line:'<b>Allowlist</b> still with Marcus Bell · due Mar 24 · nothing else changes until it opens', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}},
    nudgeNet:{key:'nudgeNet', t:'Nudge your network team about NET-4471', m:'A drafted note · the firewall change · window <b>Apr 2</b>', btn:'Nudge the network team',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a nudge', rows:[['To','Your network team · ticket NET-4471'],['Says','Checking that NET-4471 is in the Apr 2 window; the handshake with the network follows it.'],['Then','Your network team answers on the ticket; the change shows as landed when it is made']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 9:14 AM',
      receipt:{k:'Sent · 9:14 AM', w:'Your network team has your nudge', prog:{to:100, dur:600000}, line:'<b>Firewall change</b> still with your network team · window Apr 2 · the handshake follows it', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}}
  });

  /* ── the return briefing's lead: n things moved since she was last here; the engine builds the rows ── */
  D.RET={lead:function(n, from, today){ n=+n||0; from=from||'day one';
    if(!n) return 'Nothing moved '+(today&&today!==from?'between '+from+' and '+today:'since '+from)+'; every item is still with its owner. The route is as you left it, and the next step is ready.';
    if(n===1) return 'Since '+from+', one thing moved, on someone else’s side. What is still out keeps its owner and its due date, and the next step is ready.';
    return 'Since '+from+', '+words(n)+' things moved, each on someone else’s side. What is still out keeps its owner and its due date, and the next step is ready.' }};

  /* ── what she can type for these turns ── */
  D.INTENTS.unshift(
    {re:/waiting on|what am i waiting|whose move|still out/, run:function(R){ return {next:'waiting'} }},
    {re:/why.{0,24}(so long|take so|slow)|lead time/, run:function(R){ return {next:'leadtimes'} }},
    {re:/nudge|chase/, run:function(R,m){ return {next:/firewall|network team|net-4471|ticket/.test((m&&m.input)||'')?'nudgeNet':'nudgeMarcus'} }},
    {re:/day one|long.?lead/, run:function(R){ return {next:'d0'} }}
  );
})(window.OB);


/* ── part: mapmsg ── */
/* mapmsg: the mapmsg step, map the authorization messages. The 41 scenarios in five groups as the chart; the run from her agent or her
   host as an inline act (her own tooling, so no sheet and no undo); the three partial-approval misses as the reason "What
   missed?"; the rerun that completes the step. Text reads from R.acts (and R.done) so the turn says where the run stands. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;

  /* where the mapping run stands: not run · ran (38 of 41) · clean (41 of 41, or the step already done) */
  function clean(R){ var a=R.acts||{}; return !!(a.rerunmap||(R.done&&R.done.mapmsg)) }
  function ran(R){ var a=R.acts||{}; return !!(a.runmap||a.runmapHost)||clean(R) }
  function agents(R){ return R.goals.indexOf('agents')>-1 }
  /* the five groups; miss is what the first run gets wrong, and the chart marks the core group until there are results */
  var GROUPS=[
    {l:'Authorization',          s:'approvals, declines, referrals, response codes',   v:12, core:true},
    {l:'Reversals and advices',  s:'full and partial reversals, advices, repeats',     v:9},
    {l:'Timeouts and stand-in',  s:'no answer in time, stand-in, the repeat',          v:7},
    {l:'Partial approvals',      s:'the approved partial, the balance, cash back',     v:6, miss:3},
    {l:'Transit',                s:'tap, deferred authorization, aggregation',         v:7}
  ];

  Object.assign(FLOWS, {
    mapmsg:{ q:'Map the authorization messages', step:'mapmsg',
      trace:function(R){ return [['Reading the specification','the mapping guide · 41 scenarios in five groups · request and response'],['Reading your host','ISO 8583, 1987 variant · the fields the network’s JSON needs'],ran(R)?['Reading the last run',clean(R)?'41 of 41 · clean':'38 of 41 · three misses, all in partial approvals']:['Preparing the run',agents(R)?'your agent sends the scenarios over MCP':'your host sends them to sandbox.api.dgn.com']] },
      read:function(R){ return ran(R)?'Read the specification, your host’s messages and the last run':'Read the specification and your host’s messages' }, noToggle:true,
      lead:function(R){ if(clean(R)) return 'Every group passes, so the mapping is done and your host speaks the network’s shape. Certification runs on the same mapping, and the scenarios run again any time it changes.';
        if(ran(R)) return 'Four groups pass; partial approvals miss on one field, <b>amount_authorized</b>. Fix that in your mapping and rerun the group; the rest stand.';
        return 'The mapping from your ISO 8583 messages to the network’s JSON is yours, and nothing else on the route waits for it. The scenarios are how you know it is right: '+(agents(R)?'your agent sends them over MCP':'your host sends them to the sandbox')+', and a miss opens to the field.' },
      blocks:function(R){ var r=ran(R), c=clean(R), missing=r&&!c; return [{chart:{kind:'cells', title:'The scenarios, by group', sub:!r?'41 scenarios · five groups · from the specification, for your mapping':c?'41 of 41 · clean · the mapping is done':'38 of 41 · three misses, all in partial approvals',
        rows:GROUPS.map(function(g){ var m=missing?(g.miss||0):0, p=g.v-m; return {l:g.l, s:g.s, v:g.v, run:r, miss:m, vl:r?(p+' of '+g.v+(m?' · '+m+' missed':'')):(g.v+' scenarios')} })}}] },
      act:function(R){ if(clean(R)) return null; return ran(R)?'rerunmap':(agents(R)?'runmap':'runmapHost') },
      recs:function(R){ return ran(R)&&!clean(R)?['mismatch']:[] } },
    mismatch:{ q:'What missed?',
      trace:[['Reading the three misses','prepaid, fuel, cash back · one field each'],['Reading what your host returned','amount_authorized equal to the amount requested · the network approved less'],['Reading the specification','amount_authorized is the approved amount · lower than the request on a partial']],
      read:'Read three missed scenarios and the messages behind them', noToggle:true,
      lead:function(R){ return clean(R)
        ?'One field, not the whole mapping: your host copied the requested amount into <b>amount_authorized</b> where the network returned the approved partial. Your fix reads the partial from the response, and the group passed on the rerun.'
        :'One field, not the whole mapping: your host copies the requested amount into <b>amount_authorized</b> where the network returned the approved partial. Read the partial from the response and the three scenarios pass; the rest are untouched.' },
      fig:{k:'Partial approvals', big:'3 of 41', d:'one field · <b>amount_authorized</b> · requested, not approved'},
      rows:{cols:['Scenario','Your host sent','Expected','Field'], items:[['Prepaid card, balance short','$58.20','$41.37','amount_authorized',true,true],['Fuel, pre-authorized at the pump','$75.00','$52.16','amount_authorized',true],['Purchase with cash back, cash back declined','$80.00','$60.00','amount_authorized',true]], nocheck:true, tally:function(){ return '' }, done:'3 of 41 · one field · six scenarios to rerun after the fix'},
      act:'rerunmap', recs:[] }
  });

  Object.assign(ACTS, {
    runmap:{key:'runmap', inline:true, t:'Run the five groups from your agent', m:'41 scenarios over MCP with the agent key · the trace shows what it sent · about two minutes', btn:'Run the five groups',
      approved:'Run by you at 10:22 AM',
      receipt:{k:'Run 1 · 10:22 AM', w:'38 of 41 passed · 3 missed in partial approvals', prog:{to:93, dur:3800, count:{n:38}}, line:'<b id="rcA">0 of 41</b> · three partial approvals returned the requested amount, not the approved one', fixed:'Runs are free and repeatable, and nothing in your configuration changes. Each miss opens to the field, your value beside the expected one.'},
      next:['mismatch']},
    runmapHost:{key:'runmapHost', inline:true, t:'Run the five groups from your host', m:'41 scenarios to sandbox.api.dgn.com · each group turns green as the network reads it · about two minutes', btn:'Run the five groups',
      approved:'Run by you at 10:22 AM',
      receipt:{k:'Run 1 · 10:22 AM', w:'38 of 41 passed · 3 missed in partial approvals', prog:{to:93, dur:3800, count:{n:38}}, line:'<b id="rcA">0 of 41</b> · three partial approvals returned the requested amount, not the approved one', fixed:'Runs are free and repeatable, and nothing in your configuration changes. Each miss opens to the field, your value beside the expected one.'},
      next:['mismatch']},
    rerunmap:{key:'rerunmap', step:'mapmsg', inline:true, t:'Rerun partial approvals after the fix in your mapping', m:'6 scenarios · <b>amount_authorized</b> read from the response · the other 35 stand', btn:'Rerun partial approvals',
      say:'Once your mapping reads the approved partial from the response, partial approvals run again, the same way as the first time.',
      approved:'Rerun by you at 10:31 AM',
      receipt:{k:'Rerun · 10:31 AM', w:'41 of 41 passed · the mapping is done', prog:{to:100, dur:2400, count:{n:41}}, line:'<b id="rcA">38 of 41</b> · partial approvals clean · your host returns the approved partial', fixed:'The mapping is done, and certification runs on it. Runs stay free and repeatable.'},
      next:['s3','mismatch','office']}
  });
})(window.OB);


/* ── part: events-office ── */
/* events-office: the events fork reduced to webhooks or polling, the agent's watch of the sandbox stream as an in-place standing act,
   the back office step (sample settlement file, test dispute, the reconciliation checklist to Leah Park), the ledger reason,
   and the wait on finance with its nudge. Overrides FLOWS.s3 and ACTS.endpoint. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;

  /* helpers for this part */
  function day(iso){ return iso?(D.fmt||fmt)(iso):'' }
  function addDays(iso,n){ if(!iso) return ''; var p=iso.split('-').map(Number), d=new Date(Date.UTC(p[0],p[1]-1,p[2]+n)); return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2) }
  function acts(R){ return R.acts||{} }
  function done(R,k){ return !!(R.done&&R.done[k]) }
  function signed(R){ return !!(R.signed&&R.signed.fin) }
  function hasFile(R){ return R.settle!=='api' }
  function hasDispute(R){ return R.disputes==='api' }
  function officeActs(R){ var a=[]; if(hasFile(R)) a.push('file'); if(hasDispute(R)) a.push('dispute'); a.push('recon'); return a }
  function evidenceIn(R){ var A=acts(R); return (!hasFile(R)||!!A.file)&&(!hasDispute(R)||!!A.dispute) }
  function wc(t){ return t.trim().split(/\s+/).length+' words' }
  function lstate(R,k){ return D.longState?D.longState(R,k):((R.long&&R.long[k]&&R.long[k].state)||'none') }

  Object.assign(FLOWS, {
    /* step: receive events · the fork is webhooks or polling; the agent's watch is a chip under the prepared endpoint */
    s3:{ q:'Receive events', step:'s3',
      trace:function(R){ var p=R.events==='poll'; return [['Reading the six events','decision, dispute, settlement, token, risk, certificate'],['Preparing '+(p?'nothing: you chose to poll':'an endpoint'),p?'a cursor example instead':'staging · signed · retries for 72 hours']] },
      read:'Read the event reference and your staging configuration', noToggle:true,
      lead:function(R){ return R.events==='poll'?'You poll on a cursor, so there is no endpoint to add and nothing to protect. The latency is your interval; here is the loop.':'This staging endpoint receives all six events, signed; the production one comes at readiness. Add it and I’ll send one test event to your handler.' },
      choice:{key:'events', q:'How do you want to receive events?', opts:[{k:'webhooks', l:'Webhooks to our endpoint', s:'signed · retries for 72 hours'},{k:'poll', l:'Poll the API', s:'no events step · latency is your interval'}]},
      blocks:function(R){ return R.events==='poll'?[{code:{title:'Polling · a cursor', text:'GET /acceptance/v1/authorizations?since=cursor_8f2a&limit=200\n→ 200 · { "data": [ … ], "next": "cursor_9b10" }\n\n# decisions arrive when you ask; the event would have arrived in under a second'}}]:[{rows:{cols:['Event','When','Carries'], items:[['authorization.decisioned','Within a second of the answer','decision, response code, round trip',true],['dispute.opened','When a cardholder disputes','reason code, your clock',true],['settlement.posted','About 6:00 AM Eastern','net, wire reference',true],['token.updated','When the issuer reissues','the token keeps working',true],['merchant.risk_changed','When behavior moves','the merchant and the move',true],['certificate.expiring','30 days ahead','read from your handshake',true]], nocheck:true, tally:function(){ return '' }, done:'6 events · all on'}}] },
      act:function(R){ return R.events==='poll'?null:'endpoint' },
      standing:function(R){ return R.events!=='poll'&&(R.goals||[]).indexOf('agents')>-1?['watch']:null },
      recs:function(R){ return R.events==='poll'?[]:['local'] } },

    /* step: the back office · settlement into the ledger, disputes into the case tool, finance and operations in the loop */
    office:{ q:'The back office: settlement and disputes', step:'office',
      trace:function(R){ var t=[]; t.push(hasFile(R)?['Reading your settlement file layout','the layout your ledger reconciles today · totals and the wire reference in the trailer']:['Reading the settlement API and settlement.posted','the same totals · the wire reference the moment it exists']);
        if(hasFile(R)) t.push(['Reading the SFTP target','sftp.brightline.example · your drop · write access confirmed']);
        t.push(hasDispute(R)?['Reading your case tool','the disputes API · case, clock, evidence, outcome']:['Reading where disputes are worked',({portal:'the Partner Portal · nothing to build',email:'email, as today · nothing to build'})[R.disputes]||'nothing to build']);
        return t },
      read:function(R){ var f=hasFile(R), d=hasDispute(R); return f&&d?'Read your settlement file layout, the SFTP target and your case tool':f?'Read your settlement file layout and the SFTP target':d?'Read the settlement API and your case tool':'Read the settlement API and settlement.posted' }, noToggle:true,
      lead:function(R){ var A=acts(R), f=hasFile(R), d=hasDispute(R);
        if(A.recon) return 'The checklist is with Leah Park, and she signs within a week; nothing here is yours until then. The other track keeps moving while finance works.';
        if(evidenceIn(R)) return 'The evidence is in place: '+(f?'the sample file on your drop':'the settlement totals from the API')+(d?' and a test case in your case tool':'')+'. The checklist to Leah Park is drafted from it; she confirms each line and signs within a week.';
        if(f&&A.file) return 'The sample file is on your drop in the layout your ledger reads today. The test dispute is next, so operations sees the case fields finance will check.';
        return 'Settlement and disputes are integrations with finance and operations as much as with the network, so both come in now. '+(f?'A sample file goes to your SFTP drop':'The settlement totals come from the API')+(d?', a test dispute into your case tool,':',')+' and the checklist Leah Park signs is drafted.' },
      rows:function(R){ var A=acts(R), f=hasFile(R), d=hasDispute(R), st=A.recon?'Sent':'For Leah', sel=!!A.recon, items=[];
        if(f) items.push(['File layout','Every field lands where the ledger reads it today','the sample file',st,sel,!A.file]);
        items.push(['Totals against the host','Gross, fees and net agree with what your host authorized',f?'the sample file':'the settlement API',st,sel,false]);
        items.push(['Wire reference','The reference in the '+(f?'trailer':'event')+' is the one on the bank statement',R.settle==='both'?'the trailer and settlement.posted':f?'the trailer':'settlement.posted',st,sel,false]);
        items.push(['Timing',f?'The file is on the drop once settlement is final, about 6:00 AM Eastern, before the morning run':'settlement.posted arrives once settlement is final, about 6:00 AM Eastern, before the morning run',f?'the SFTP target':'the event',st,sel,false]);
        if(d) items.push(['Dispute case fields','Case id, amount, reason code and the clock match the case tool','the test dispute',st,sel,!A.dispute&&(!f||!!A.file)]);
        var n=items.length+' checks', foot=A.recon?(signed(R)?n+' · signed by Leah Park':n+' · sent to Leah Park · she signs within a week'):evidenceIn(R)?n+' · evidence in place · the checklist is next':(f&&!A.file)?n+' · the sample file goes first':n+' · the test dispute is next';
        return {cols:['Check','What finance confirms','From','State'], items:items, nocheck:true, tally:function(){ return '' }, done:foot} },
      draft:function(R){ var f=hasFile(R), d=hasDispute(R), t='Leah, '+(f?'the network’s sample settlement file is on our SFTP drop in the layout the ledger reads today':'the network’s settlement totals and wire reference now come to us from the settlement API and the settlement.posted event')+(d?', with a test dispute in the case tool beside '+(f?'it':'them')+'.':'.')+' The checklist has what you confirm: '+(f?'the layout, ':'')+'the totals against the host, the wire reference'+(d?', the 6:00 AM timing and the dispute fields.':' and the 6:00 AM timing.')+' Nothing goes live on this; your sign-off lets certification include '+(f?'the file':'settlement')+'. A week is fine. Priya';
        return {title:'To Leah Park, drafted', words:wc(t), text:t} },
      acts:function(R){ return officeActs(R) }, recs:function(R){ return hasFile(R)?['ledger']:[] } },

    /* reason: a settlement line against a ledger entry · ends in whichever back-office act is still pending */
    ledger:{ q:'How does a settlement line map to a ledger entry?',
      trace:[['Reading the settlement file layout','one line per settled authorization · totals and the wire reference in the trailer'],['Reading your ledger import','the columns it posts the daily file into']],
      read:'Read the file layout against your ledger import', noToggle:true,
      lead:'Each line is one settled authorization, and every field lands in a column your ledger import already has. The trailer carries the totals and the wire reference, so nothing is computed on your side.',
      rows:{cols:['File field','Ledger entry','Note'], items:[['settlement_date','posting date','the business day settled',true],['auth_id','reference','the id from authorization.decisioned',true],['merchant_id','account','your merchant, as configured',true],['gross_amount','debit','minor units · integer',true],['network_fee','fee','the network’s fee on the line',true],['net_amount','credit','gross less fee · rounded by the network’s rule',true,true],['wire_reference','bank reference','trailer · the same reference on the statement',true]], nocheck:true, tally:function(){ return '' }, done:'7 fields · nothing derived on your side'},
      act:function(R){ if(done(R,'office')) return null; var A=acts(R), seq=officeActs(R); for(var i=0;i<seq.length;i++){ if(!A[seq[i]]) return seq[i] } return null }, recs:[] },

    /* wait: finance's sign-off · Leah Park's move, since the checklist went, due a week later */
    wait_fin:{ q:'Leah Park’s sign-off', kind:'wait', noToggle:true,
      trace:function(R){ var s=acts(R).recon; return [['Reading the checklist you sent',s?'sent '+day(s)+' · for Leah Park':'not sent yet'],['Reading what finance has returned',signed(R)?'signed':'nothing yet · sign-off takes about a week']] },
      read:'Read the checklist and what finance has returned',
      lead:function(R){ var s=acts(R).recon;
        if(signed(R)) return 'Leah Park signed the reconciliation, so the back office is done on both sides. Nothing here waits on finance anymore.';
        if(s) return 'This is Leah Park’s move: the checklist has been with her since '+day(s)+', and she signs within a week. Nothing has come back yet; the other moves keep landing meanwhile.';
        return 'Finance’s sign-off is the gate here, and the clock on it starts when the checklist reaches Leah Park. Until it goes, nothing is waiting on her.' },
      rows:function(R){ var A=acts(R), s=A.recon, due=s?addDays(s,7):'', items=[];
        items.push(['Sign the reconciliation checklist','Leah Park · finance',s?day(s):'when the checklist goes',s?day(due):'a week after',signed(R),!signed(R)]);
        [['allowlist','Allowlist for 203.0.113.0/24','Marcus Bell · the network','reqnet','Mar 24'],['cert','Certificate chain from your CA','Brightline Issuing CA 2 · your security team','csr','Mar 24'],['firewall','Firewall change, ticket NET-4471','Your network team','fwticket','Apr 2'],['window','Certification window Apr 20 to 24','Ana Okafor · the network','reqnet','at sign-off'],['prodcreds','Production credentials','Marcus Bell · the network','reqnet','May 4']].forEach(function(l){ if(lstate(R,l[0])!=='out') return; var L=R.long&&R.long[l[0]], due=(L&&L.due&&l[0]!=='window')?day(L.due):l[4]; items.push([l[1],l[2],A[l[3]]?day(A[l[3]]):'day one',due,false,false]) });
        return {cols:['Move','Whose','Since','Due'], items:items, nocheck:true, tally:function(){ return '' }, done:signed(R)?'Signed · the back office is done':s?'Leah Park signs by '+day(due)+' · the other moves keep landing':'Starts when the checklist goes to Leah Park'} },
      meanwhile:function(R){ return ['s4','cases','waiting'].filter(function(k){ return !done(R,k)&&!(k==='cases'&&done(R,'s5')) }) },
      nudge:'nudgeLeah' }
  });

  Object.assign(ACTS, {
    /* the staging endpoint, as today; after it the back office, with local forwarding as the neighbour */
    endpoint:{key:'endpoint', step:'s3', t:'Add the endpoint and send a test event', m:'https://staging.brightline.example/dgn/events · six events · signed', btn:'Review and add',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Add a webhook endpoint', rows:[['URL','https://staging.brightline.example/dgn/events'],['Events','All six'],['Signing secret','whsec_… shown once'],['Retries','6m · 12m · 1h · 6h · 24h · 48h, stop after 72h'],['Then','One test event, authorization.decisioned']], note:'The endpoint is staging only. The production one is added at readiness, with its own secret.', ok:'Add and send a test'},
      approved:'Added by you at 10:36 AM',
      receipt:{k:'Added · 10:36 AM', w:'Test event delivered: 200 in 180 ms', prog:{to:100, dur:1500}, line:'<b>evt_test_01</b> · authorization.decisioned · your handler verified the signature', fixed:'Deliveries, attempts and retries are in Webhooks from now on.'},
      next:['office','local']},

    /* local forwarding (the v1 act) keeps its text; its clock follows the endpoint and its neighbour is now the back office */
    forward:Object.assign({}, ACTS.forward, {approved:'On · by you at 10:37 AM', receipt:Object.assign({}, ACTS.forward.receipt, {k:'Forwarding · 10:37 AM'}), next:['office','s4']}),

    /* in place, standing in the events step: the agent watches the sandbox stream over MCP while she builds · a window, never a production path */
    watch:{key:'watch', inline:true, t:'Watch the sandbox event stream from your agent', m:'Over MCP with the agent key · while you build · <b>never a production path</b>', btn:'Start watching',
      say:'Your agent can read the sandbox event stream over MCP while you build, seeing each decision and dispute as the sandbox emits it. Production events still arrive by webhook or polling; this is a window, not a path.',
      approved:'On · by you at 10:38 AM',
      receipt:{k:'Watching · 10:38 AM', w:'Your agent reads the sandbox stream over mcp.dgn.com', line:'<b>First event seen</b> · authorization.decisioned · your agent logged it', undo:'Stop watching', cancelDone:'Stopped watching'},
      next:['office','local']},

    /* the back office, approved one at a time: the sample file, the test dispute, the checklist to finance */
    file:{key:'file', t:'Deliver a sample settlement file to your SFTP drop', m:'Built from your sandbox activity · your layout · sftp.brightline.example · <b>marked as a sample</b>', btn:'Review and deliver',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Deliver a sample settlement file', rows:[['Built from','Your sandbox authorizations since March 10'],['Layout','The one your ledger reconciles today · totals and the wire reference in the trailer'],['To','sftp.brightline.example · /dgn/settlement'],['Marked','SAMPLE in the header · never posts'],['Then','Finance reconciles it against your host']], note:'A sample file is marked as such and never posts. Deliver another at any time; each one is marked.', ok:'Deliver the file'},
      approved:'Delivered by you at 10:44 AM',
      receipt:{k:'Delivered · 10:44 AM', w:'dgn-settlement-sample.csv · on your SFTP drop', prog:{to:100, dur:1800}, line:'<b>Marked SAMPLE</b> · your layout · totals and the wire reference in the trailer · nothing posts', fixed:'Deliver another sample at any time; each one is marked.'}},
    dispute:{key:'dispute', t:'Send a test dispute into your case tool', m:'Through your case tool’s API · a sandbox case · <b>the clock runs</b> · no cardholder, no money', btn:'Review and send',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Send a test dispute', rows:[['Case','One sandbox dispute on a settled sample line'],['Reason','Not recognized · a test reason code'],['Reaches','Your case tool, through its API · dispute.opened'],['Clock','Starts when the case opens · shown in the case'],['Then','Operations sees the case fields finance checks']], note:'A test dispute carries no money and no cardholder. Close it from your case tool, or let the clock run out.', ok:'Send the dispute'},
      approved:'Sent by you at 10:48 AM',
      receipt:{k:'Sent · 10:48 AM', w:'dsp_test_01 open in your case tool · the clock started at 10:48 AM', prog:{to:100, dur:1500}, line:'<b>dispute.opened</b> · reason code, amount and the clock, as your case tool shows them', fixed:'The case closes from your case tool, or when the clock runs out.'}},
    recon:{key:'recon', step:'office', t:'Send the reconciliation checklist to Leah Park', m:'From you · what finance confirms and where the evidence is · Leah Park signs within a week', btn:'Review and send',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a note', rows:[['To','Leah Park, finance'],['Says','Settlement and disputes are set up in the sandbox; the checklist says what finance confirms and where to look.'],['Then','Leah reconciles and signs within a week; certification includes settlement once she does']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 10:52 AM',
      receipt:{k:'Sent · 10:52 AM', w:'Leah has the checklist', prog:{to:100, dur:600000}, line:'<b>Back office done on your side</b> · Leah Park signs within a week of today · certification includes settlement once she does', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'},
      next:['wait_fin','s4']},

    /* standing, from the wait: a drafted reminder to finance */
    nudgeLeah:{key:'nudgeLeah', t:'Remind Leah Park about the checklist', m:'A drafted reminder · the checklist, when it went, what waits on it', btn:'Review and send',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a reminder', rows:[['To','Leah Park, finance'],['Says','A reminder on the reconciliation checklist; certification includes settlement only once finance signs.'],['Then','Nothing else changes; the wait stays until she signs']], note:'The reminder sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 11:20 AM',
      receipt:{k:'Sent · 11:20 AM', w:'Leah has your reminder', prog:{to:100, dur:600000}, line:'<b>Reminder sent</b> · the wait continues until she signs', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}}
  });

  /* what she can type: the back office, the reminder, the agent's watch */
  D.INTENTS.unshift(
    {re:/(nudge|remind).{0,12}(leah|finance)/i, run:function(R){ return {next:'wait_fin'} }},
    {re:/watch.{0,30}(stream|event|sandbox)|agent.{0,20}watch/i, run:function(R){ return {next:'watch'} }},
    {re:/back.?office|reconcil|\bledger\b|\bleah\b|\bfinance\b/i, run:function(R){ return {next:'office'} }}
  );
})(window.OB);


/* ── part: secure-config ── */
/* secure-config: Secure the connection (s4, gated until the allowlist, the chain and the firewall change have landed),
   the handshake reason (mtls, honest at any point on the clock), the chain acts without the allowlist move (that is
   Marcus's), and Confirm configuration (s5) with the certification re-estimate on its receipt. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;

  /* the three long-lead items this step waits on, read from R.long with the facts sheet as the fallback */
  var CONN=['allowlist','cert','firewall'];
  var LANDS={allowlist:'2026-03-20', cert:'2026-03-19', firewall:'2026-04-02'}, DUE={allowlist:'2026-03-24', cert:'2026-03-24', firewall:'2026-04-02'};
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function day(iso){ if(!iso) return ''; if(D.fmt) return D.fmt(iso); var p=iso.split('-'); return MON[+p[1]-1]+' '+(+p[2]) }
  function state(R,k){ return D.longState?D.longState(R,k):((R.long&&R.long[k]&&R.long[k].state)||'none') }
  function landedAll(R){ return D.landed?D.landed(R,CONN):CONN.every(function(k){ return state(R,k)==='landed' }) }
  function landedN(R){ return CONN.filter(function(k){ return state(R,k)==='landed' }).length }
  function when(R,k){ var l=(R.long&&R.long[k])||{}, s=state(R,k); return s==='landed'?day(l.lands||LANDS[k]):s==='out'?'due '+day(l.due||DUE[k]):'' }
  function longRow(R,k,obj,owner,landedWord,outWord,hot){ var s=state(R,k); return [obj, s==='landed'?landedWord:s==='out'?outWord:'Not requested', owner, when(R,k), s==='landed'&&!hot, !!hot] }
  /* where the chain stands: none · out · issued · short (uploaded one link short) · done (handshake complete) */
  function phase(R){ var A=R.acts||{}; if((R.done&&R.done.s4)||A.chainfix) return 'done'; if(A.chain) return 'short'; var c=state(R,'cert'); return c==='landed'?'issued':c==='out'?'out':'none' }
  function chainNow(R){ var p=phase(R); return p==='done'?'Uploaded, full to the root · handshake complete':p==='short'?'Uploaded one link short · the root is missing':p==='issued'?'Issued '+when(R,'cert')+' · not uploaded':p==='out'?'Requested from your CA · '+when(R,'cert'):'Not requested from your CA yet' }
  function connected(R){ return phase(R)==='done' }

  Object.assign(FLOWS, {
    s4:{ q:'Secure the connection', step:'s4',
      gate:function(R){ return landedAll(R)?null:'wait_conn' },
      trace:function(R){ var n=landedN(R), p=phase(R); return [
        ['Reading the long-lead items', n+' of 3 landed'+(n===3?' · allowlist '+when(R,'allowlist')+' · chain '+when(R,'cert')+' · firewall '+when(R,'firewall'):'')],
        [state(R,'cert')==='landed'?'Reading the chain your CA issued':'Reading what your CA will issue','brightline-staging.pem · Brightline Issuing CA 2 · expires March 3, 2027'],
        ['Reading connectivity for staging',(R.events==='webhooks'?'endpoint registered · ':'')+(p==='done'?'chain uploaded · handshake complete':p==='short'?'chain uploaded one link short · handshake failed':'no chain uploaded · no handshake yet')]] },
      read:'Read the long-lead items, your staging objects and the chain from your CA', noToggle:true,
      lead:function(R){ var p=phase(R); return p==='done'
        ?'The connection is secured: allowlist, firewall change, chain and handshake, all in. The production chain comes at readiness.'
        :p==='short'
        ?'The chain went up one link short, so the handshake failed from your range. Upload the full chain to the root and the network retries at once.'
        :landedAll(R)
        ?'Marcus opened the allowlist, your network team made the firewall change and your CA issued the chain. Upload the chain and the network tries the handshake at once.'
        :'The allowlist, the firewall change and your chain are other people’s moves, and this step opens when they land. Nothing here is yours to do yet.' },
      rows:function(R){ var p=phase(R), A=R.acts||{}; var items=[
        longRow(R,'allowlist','Allowlist 203.0.113.0/24','Marcus Bell','Open','Requested'),
        p==='done'?['Certificate chain','Uploaded, full to the root','Your CA',day(A.chainfix),true,false]
          :p==='short'?['Certificate chain','Uploaded one link short','Your CA',day(A.chain),false,true]
          :longRow(R,'cert','Certificate chain','Your CA','Issued','Requested',true),
        longRow(R,'firewall','Firewall change NET-4471','Your network team','Made','Booked'),
        p==='done'?['Handshake','Complete · both ways','The network',day(A.chainfix),true,false]
          :p==='short'?['Handshake','Failed · the root is missing','The network',day(A.chain),false,false]
          :['Handshake','Not tried','The network','after the upload',false,false]
      ]; var n=items.filter(function(r){ return r[4] }).length;
      return {cols:['Object','State','Owner','When'], items:items, nocheck:true, tally:function(){ return '' }, done:n+' of 4 · '+(p==='done'?'connection secured':p==='short'?'the full chain is next':'the chain is next')} },
      act:function(R){ var p=phase(R); return p==='done'?null:p==='short'?'chainfix':'chain' }, recs:['mtls'] },

    mtls:{ q:'What does the handshake prove?',
      trace:function(R){ return [
        ['Reading the handshake the network runs','four checks · both directions · before any authorization crosses'],
        [state(R,'cert')==='landed'?'Reading the chain your CA issued':'Reading the chain your CA will issue','leaf · Brightline Issuing CA 2 · Brightline Root CA']] },
      read:'Read what mutual TLS checks, and the chain from your CA', noToggle:true,
      lead:'Each side proves who it is before any authorization crosses: the network to your host, your host to the network. Your chain is the half that is yours, and the network reads it all the way to the root.',
      rows:function(R){ var p=phase(R), issued=state(R,'cert')==='landed'; return {cols:['Check','Proves','Checked by','Now'], items:[
        ['The network’s certificate','You are talking to the network, nothing in between','Your host','Trusted already · the root your sandbox calls use',true],
        ['Your certificate chain','The caller is Brightline Bank · leaf, Brightline Issuing CA 2, Brightline Root CA','The network',chainNow(R),p==='done',p!=='done'],
        ['The private keys','The key behind each certificate · nothing secret crosses the wire','Both',p==='done'?'Proven at the handshake':'Proven when the handshake completes',p==='done'],
        ['Validity','Both certificates in date, neither revoked','Both',issued?'Yours expires March 3, 2027 · a reminder 30 days ahead':'Read from the leaf when your CA issues it',issued]
      ], nocheck:true, tally:function(){ return '' }, done:'Four checks · the chain is yours, full to the root'} },
      act:function(R){ var p=phase(R); if(p==='done') return null; if(p==='short') return 'chainfix'; return landedAll(R)?'chain':null } },

    s5:{ q:'Confirm the configuration', step:'s5',
      trace:function(R){ return [['Reading the four sections','Acceptance · Settlement · Disputes · Connection'],['Reading where each value came from','the agreement · your technical review · your sandbox run · your answers'],['Counting the cases this generates',cases(R)+' for your route']] },
      read:'Read the agreement, your technical review, your sandbox history and your answers', noToggle:true,
      lead:function(R){ return (connected(R)
        ?'With the connection made, the deal and your answers fill most of the configuration; two values are still yours. '
        :'The deal and your answers fill most of the configuration; two values are still yours. ')
        +'Confirming generates the cases and re-estimates certification against the window Ana holds.' },
      rows:function(R){ var c=connected(R); return {cols:['Value','Set to','From','State'], items:[['BIN range','601149','the agreement','Set',true],['Card present and not present','Both · contactless','the agreement','Set',true],['Settlement rhythm','Daily, next business day','your technical review','Set',true],['Settlement account','····4471','the agreement','Set',true],['Rounding','half-up','your sandbox run','Yours to confirm',false,true],['Dispute routing','API to your case tool','your answer','Set',true],['Daily balancing owner','Not set','','Yours',false,true],['Connection','staging.brightline.example · mutual TLS','connectivity',c?'Set':'After the handshake',c]], nocheck:true, tally:function(){ return '' }, done:c?'9 of 11 set · 2 yours':'8 of 11 set · 2 yours · the connection after the handshake'} },
      act:'config', recs:['cases'] }
  });

  Object.assign(ACTS, {
    chain:{key:'chain', t:'Upload the staging certificate chain', m:'brightline-staging.pem · 2 certificates · expires March 3, 2027', btn:'Review and upload',
      say:'Your staging chain, issued by Brightline Issuing CA 2. The network tries the handshake from your range the moment it lands.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Upload a certificate chain', rows:[['File','brightline-staging.pem'],['Certificates','Leaf, intermediate'],['Issued','Mar 19 · Brightline Issuing CA 2'],['Expires','March 3, 2027 · read from the leaf'],['Then','The network tries the handshake from 203.0.113.40']], note:'A chain can be replaced at any time; the previous one stays valid for an hour.', ok:'Upload'},
      approved:'Uploaded by you at 10:18 AM',
      receipt:{k:'Uploaded · 10:18 AM', w:'Handshake: 12 attempts failed in 4 minutes', prog:{to:100, dur:3200}, line:'<b>unable to get local issuer certificate</b> · from 203.0.113.40 · the chain ends one link early', fixed:'The network requires the full chain to the root. Most clients accept one link short; the network doesn’t.'},
      next:['fix']},
    chainfix:{key:'chainfix', step:'s4', t:'Upload the corrected chain, three certificates in order', m:'Leaf · intermediate · <b>root, which was missing</b> · the same leaf, so nothing else changes', btn:'Review and upload',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Replace a certificate chain', rows:[['File','brightline-staging-full.pem'],['Certificates','Leaf, intermediate, root'],['Order','Leaf first, root last, as the network reads it'],['Then','Handshake retried from 203.0.113.40']], note:'Replaces the chain uploaded at 10:18. The leaf is unchanged.', ok:'Upload'},
      approved:'Uploaded by you at 10:24 AM',
      receipt:{k:'Uploaded · 10:24 AM', w:'Handshake complete · mutual TLS both ways', prog:{to:100, dur:1800}, line:'<b>Connection secured</b> · allowlist, firewall, chain, handshake · six minutes from the first failure to the fix', fixed:'Certificate expiry March 3, 2027 is recorded; the network reminds you 30 days ahead. The production chain comes at readiness.'},
      next:['s5','mtls']},
    config:{key:'config', step:'s5', t:'Confirm the configuration', m:'4 sections · 11 values · 2 still yours to set', btn:'Review and confirm',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Confirm your configuration', rows:[['Acceptance','BIN 601149, card present and not present, contactless'],['Settlement','Daily, next business day · account ····4471'],['Disputes','Routed by API to your case tool'],['Connection','staging.brightline.example · mutual TLS · handshake complete'],['Generates','Your certification cases'],['Then','Certification re-estimated against the window Apr 20 to 24']], note:'Confirming generates the cases. Changing a value later regenerates the ones it touches and says which.', ok:'Confirm'},
      approved:'Confirmed by you at 10:30 AM',
      receipt:{k:'Confirmed · 10:30 AM', w:'21 cases · Authorization 9 · Events 4 · Settlement 5 · Disputes 3', prog:{to:100, dur:2600, count:{n:21}}, line:'<b id="rcA">0 of 21</b> cases generated · certification re-estimated at <b>two rounds</b>, inside the window Apr 20 to 24 · May 14 holds', fixed:'Cases regenerate if a value changes, and the estimate with them.'},
      next:['s6']}
  });

  /* "what does the handshake prove" reaches the reason by typing; ahead of the chain/tls intent, which opens the step */
  D.INTENTS.unshift({re:/handshake|mutual tls|\bprove/, run:function(R){ return {next:'mtls'} }});
})(window.OB);


/* ── part: certify-readiness ── */
/* certify-readiness: certification in rounds (round 1 submitted to Ana, the wait on her review, her two comments,
   round 2, which Ana's sign-off follows and the window confirms with it) and production readiness with the go/no-go
   (the wait on Marcus's credentials, the readiness objects, the note to Dana and Marcus, Dana's decision recorded on
   May 11), plus the reason "What happens on the first morning?", which replaces the old s8. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;

  /* dates: ISO in, ISO out; the engine formats for display */
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fm(iso){ if(typeof fmt==='function') return fmt(iso); if(!iso) return ''; var p=iso.split('-'); return MON[+p[1]-1]+' '+(+p[2]) }
  function addDays(iso,n){ var p=iso.split('-').map(Number); return new Date(Date.UTC(p[0],p[1]-1,p[2]+n)).toISOString().slice(0,10) }
  function biz(iso,n){ var out=iso, k=0; while(k<n){ out=addDays(out,1); var d=new Date(out+'T00:00:00Z').getUTCDay(); if(d!==0&&d!==6) k++ } return out }
  function today(R){ return (D.today?D.today(R):R.today)||'2026-03-10' }
  function acts(R){ return R.acts||{} }
  function landed(R,keys){ return D.landed?D.landed(R,keys):false }
  function longState(R,k){ return D.longState?D.longState(R,k):'none' }
  var GONOGO='2026-05-11';
  /* round 1 was submitted; Ana's review is back three business days after the submission (Apr 8 → Apr 13) */
  function submitted(R){ return !!acts(R).submit||(R.rounds||0)>=1 }
  function reviewed(R){ var A=acts(R); return !!(A.round2||R.reviewed)||(submitted(R)&&today(R)>=biz(A.submit||'2026-04-08',3)) }

  /* the certification groups, as s6 drew them before */
  function groups(R){ return [{l:'Authorization',s:'approvals, declines, reversals',v:9,vl:'9 cases',hot:true},{l:'Events',s:'the six events · delivery, signature, retries, order',v:4,vl:'4 cases',when:R.events!=='poll'},{l:'Settlement',s:({file:'file, adjustments, totals',api:'API, event',both:'file, adjustments, totals, API, event'})[R.settle],v:({file:3,api:2,both:5})[R.settle],vl:({file:3,api:2,both:5})[R.settle]+' cases'},{l:'Disputes',s:'open, evidence, close',v:3,vl:'3 cases',when:R.disputes==='api'},{l:'Tokenization',s:'reissue, card on file',v:8,vl:'8 cases',when:R.token==='now'}].filter(function(x){ return x.when!==false }) }
  /* the readiness sequence: five objects, four when she polls and has no endpoint to add */
  function seq(R){ var s=[['prodkey','Production key'],['prodchain','Production chain'],['prodendpoint','Production endpoint'],['gonogo','The go/no-go note'],['decision','The decision']]; return R.events==='poll'?s.filter(function(x){ return x[0]!=='prodendpoint' }):s }
  function readyCount(R){ var A=acts(R); return seq(R).filter(function(x){ return A[x[0]] }).length }
  function nextReady(R){ var A=acts(R), n=seq(R).filter(function(x){ return !A[x[0]] })[0]; return n?n[1]:null }
  /* the decision is Dana's, on May 11; it is offered for recording from that day */
  function decided(R){ return !!acts(R).decision||today(R)>=GONOGO }

  Object.assign(FLOWS, {
    /* s6 · certification in rounds; while round 1 is with Ana the step hands over to the wait */
    s6:{ q:'Certify, in rounds', step:'s6',
      gate:function(R){ return submitted(R)&&!acts(R).round2&&!reviewed(R)?'wait_ana':null },
      trace:function(R){ var g=groups(R); return [['Reading the cases',cases(R)+' · '+g.length+' groups'],['Reading the plan','two rounds · Ana reviews a round within three business days'],['Preparing round 1',R.runner==='agent'?'your agent sends the cases over MCP':'your host sends the cases to cert.api.dgn.com']] },
      read:'Read the generated cases, your certification credentials and the plan', noToggle:true,
      lead:function(R){ var A=acts(R), r=R.rounds||0;
        if(landed(R,['window'])||A.window) return 'Certification is done in two rounds; Ana has signed off and confirmed the window, Apr 20 to 24. Production readiness is next.';
        if(r>=2||A.round2) return 'Both rounds are clean. Ana’s sign-off on Apr 15 confirms the window, Apr 20 to 24, and production readiness follows it.';
        if(reviewed(R)) return 'Ana’s review is back: two comments and no failed case. Round 2 is prepared with both fixes in, and a clean round earns her sign-off.';
        if(submitted(R)) return 'Round 1 is with Ana; her review comes back within three business days. Round 2 is prepared for whatever she finds.';
        if(A.rounding) return 'The rerun is clean, so round 1 is ready to submit to Ana. Her review comes back within three business days, and round 2 is held for her comments.';
        return 'The cases test your configuration and nothing generic; the plan assumes two rounds, with Ana’s review between them. '+(R.runner==='agent'?'Your agent sends round 1 over MCP with the key it has':'Your host sends round 1 to cert.api.dgn.com')+'; a failure opens to the request, the diagnosis and the fix.' },
      choice:{key:'runner', q:'Who sends the cases?', opts:function(R){ return [{k:'host', l:'Our host', s:'to cert.api.dgn.com'},{k:'agent', l:'Our agent (MCP)', s:R.goals.indexOf('agents')>-1?'with the agent key':'needs an agent key first'}] }},
      blocks:function(R){ return [{chart:{kind:'cells', title:'Your cases, by group', sub:cases(R)+' cases · generated from your configuration · two rounds planned', rows:groups(R)}}] },
      act:function(R){ var A=acts(R); if(A.round2||(R.rounds||0)>=2||landed(R,['window'])) return null; if(submitted(R)) return reviewed(R)?'round2':null; if(A.rounding) return 'submit'; return R.runner==='agent'?'runAgent':'run' },
      recs:function(R){ return reviewed(R)&&!acts(R).round2?['review']:[] } },

    /* the wait on Ana's review of round 1 */
    wait_ana:{ q:'Waiting on Ana’s review', kind:'wait', noToggle:true,
      trace:function(R){ var A=acts(R), s=A.submit||'2026-04-08'; return [['Reading the round you submitted','21 of 21 · with Ana Okafor since '+fm(s)],['Reading the long-lead track','the window held · production credentials out with Marcus Bell']] },
      read:'Read the submitted round and the long-lead track',
      lead:function(R){ var A=acts(R), s=A.submit||'2026-04-08';
        if(A.round2) return 'Ana’s review came back, and round 2 has run with her two fixes in. Her sign-off confirms the window.';
        if(reviewed(R)) return 'Ana’s review came back on '+fm(biz(s,3))+' with two comments and no failed case. Round 2 is prepared with both fixes in.';
        return 'Ana’s move: round 1 has been with her since '+fm(s)+', and her review is due by '+fm(biz(s,3))+'. Nothing else has moved; the window stays held for Apr 20 to 24, and the production credentials are out with Marcus until May 4.' },
      rows:function(R){ var A=acts(R), s=A.submit||'2026-04-08', d0=A.reqnet||'2026-03-10', pc=longState(R,'prodcreds'), rv=reviewed(R), out=(pc==='landed'?2:3)-(rv?1:0);
        return {cols:['Move','Whose','Since','Due'], items:[
          ['Review of round 1 · 21 cases','Ana Okafor · the network',fm(s),rv?'Back '+fm(biz(s,3))+' · 2 comments':fm(biz(s,3)),rv,!rv],
          ['Certification window, Apr 20 to 24 · held','Ana Okafor · the network',fm(d0),'Confirmed at sign-off',false,false],
          ['Production credentials','Marcus Bell · the network',fm(d0),pc==='landed'?'Landed':'May 4',pc==='landed',false]
        ], nocheck:true, tally:function(){ return '' }, done:out+' out with the network · '+(rv?'her review is back · round 2 is next':'Ana’s review is the one that gates round 2')} },
      meanwhile:function(R){ return reviewed(R)&&!acts(R).round2?['review','morning','waiting']:['morning','waiting'] }, nudge:'nudgeAna' },

    /* the reason: Ana's two comments, ending in round 2 */
    review:{ q:'What did Ana say?', noToggle:true,
      trace:function(R){ var A=acts(R), s=A.submit||'2026-04-08'; return [['Reading Ana’s review','back '+fm(biz(s,3))+' · 2 comments · no case failed'],['Reading the two requests','AUTH-07 · the advice 1.2 s after the authorization · SETL-01 · the header in local time'],['Preparing round 2','the 21 cases · both fixes in']] },
      read:'Read Ana’s review and the two requests behind it',
      lead:'Two comments, neither a failed case: the reversal advice lands late and the settlement file header is in local time. Both are small fixes on your side; round 2 runs every case again with them in.',
      fig:{k:'Round 1', big:'2 comments', d:'on <b>21 of 21</b> passed · AUTH-07 · SETL-01 · nothing failed'},
      rows:function(R){ var A=acts(R), st=A.round2?'Passed in round 2':'Ready for round 2'; return {cols:['Case','Her comment','Your fix','State'], items:[
        ['AUTH-07 · reversal advice','The reversal advice arrived 1.2 s after the authorization; the network expects under a second','Send the advice before the response is logged',st,!!A.round2,true],
        ['SETL-01 · settlement file','The file header timestamp is local time; the network reads UTC','Write the header timestamp in UTC',st,!!A.round2,false]
      ], nocheck:true, tally:function(){ return '' }, done:'2 comments · 2 fixes · one more round'} },
      act:'round2', recs:[] },

    /* s7 · production readiness and the go/no-go */
    s7:{ q:'Production readiness and go/no-go', step:'s7', noToggle:true,
      gate:function(R){ return landed(R,['prodcreds'])?null:'wait_prod' },
      trace:function(R){ var s=seq(R); return [['Reading your production objects',readyCount(R)+' of '+s.length+' · key, chain'+(R.events!=='poll'?', endpoint':'')+', the go/no-go, the decision'],['Reading the operating side','alerts · dashboards · runbook · on-call roster'],['Reading the calendar','go/no-go May 11 · pilot cohort May 14, 6:00 AM']] },
      read:'Read production readiness, the ramp plan and the calendar',
      lead:function(R){ var A=acts(R);
        if(A.decision) return 'The go is recorded: the pilot cohort on May 14 at 6:00 AM, Marcus told, the ramp plan with Dana. The ramp is next.';
        if(A.gonogo) return 'Dana and Marcus have the plan, and Dana decides on May 11. Her decision is the last readiness object; nothing starts before it is recorded.';
        if(!landed(R,['prodcreds'])) return 'Production waits on Marcus’s credentials, due May 4; the objects are prepared for when they land. The ramp plan is drafted for the go/no-go on May 11.';
        return 'Marcus’s production credentials have landed, so production is open: one object at a time, the last of them Dana’s decision. The ramp plan goes to Dana and Marcus with the go/no-go: a pilot cohort first, then wider steps, each gated by the first file reconciling.' },
      rows:function(R){ var A=acts(R), poll=R.events==='poll', s=seq(R), nx=nextReady(R), n=readyCount(R);
        var it=[
          ['Production key',A.prodkey?'Issued · inert until May 14':'Not issued','You',A.prodkey?fm(A.prodkey):'now',!!A.prodkey,nx==='Production key'],
          ['Production chain',A.prodchain?'Uploaded · handshake complete':'Not uploaded','You',A.prodchain?fm(A.prodchain):'after the key',!!A.prodchain,nx==='Production chain'],
          poll?['Production endpoint','Not needed · you poll on a cursor','You','',true,false]:['Production endpoint',A.prodendpoint?'Added · its own secret':'Not added','You',A.prodendpoint?fm(A.prodendpoint):'after the chain',!!A.prodendpoint,nx==='Production endpoint'],
          ['Alerts',A.prodkey?'Wired · the three thresholds, reroute prepared':'Prepared · the three thresholds','You',A.prodkey?fm(A.prodkey):'with the key',!!A.prodkey,false],
          ['Dashboards',A.prodkey?'Live · the cohort against the gateway baseline':'Prepared · the cohort against the gateway baseline','You',A.prodkey?fm(A.prodkey):'with the key',!!A.prodkey,false],
          ['Runbook',A.gonogo?'Sent with the go/no-go · reroute, reconcile, escalate':'Drafted · reroute, reconcile, escalate','You and operations',A.gonogo?fm(A.gonogo):'with the go/no-go',!!A.gonogo,false],
          ['On-call roster',A.decision?'Confirmed · May 14 to Jun 9':'Proposed · May 14 to Jun 9','Your on-call',A.decision?fm(A.decision):'with the decision',!!A.decision,false],
          ['Go/no-go',A.decision?'Go · recorded':A.gonogo?'Note sent · Dana decides May 11':'Not sent · May 11','Dana Iverson · Marcus Bell · you',A.decision?fm(A.decision):A.gonogo?fm(A.gonogo):'May 11',!!A.decision,nx==='The go/no-go note'||nx==='The decision']
        ];
        var foot=nx==='The decision'&&!decided(R)?'Dana decides May 11 · her decision is recorded then':nx?nx.toLowerCase()+' is next':'the ramp is next';
        return {cols:['Object','State','Owner','When'], items:it, nocheck:true, tally:function(){ return '' }, done:n+' of '+s.length+' readiness objects · '+foot} },
      acts:function(R){ return seq(R).map(function(x){ return x[0] }).filter(function(k){ return k!=='decision'||decided(R) }) }, recs:['morning'] },

    /* the wait on Marcus's production credentials */
    wait_prod:{ q:'Waiting on production credentials', kind:'wait', noToggle:true,
      trace:function(R){ var A=acts(R), w=longState(R,'window')==='landed'; return [['Reading the long-lead track','production credentials · out with Marcus Bell since '+fm(A.reqnet||'2026-03-10')+' · due May 4'],['Reading what landed',w?'certification signed off · the window confirmed for Apr 20 to 24':'round 2 clean · Ana’s sign-off confirms the window']] },
      read:'Read the long-lead track and what landed since certification',
      lead:function(R){ var pc=longState(R,'prodcreds'), w=longState(R,'window')==='landed', t=today(R);
        if(pc==='landed') return 'Marcus’s production credentials have landed, so nothing is out with the network. Production readiness is open.';
        if(!w) return 'Marcus’s move: the production credentials, requested on day one, are due May 4. Ana’s sign-off confirms the window, Apr 20 to 24, where she validates the certification end to end.';
        if(t<'2026-04-25') return 'Marcus’s move: the production credentials, requested on day one and due May 4, are the last long-lead item out. Ana validates the certification end to end in the window, Apr 20 to 24, while you wait.';
        return 'Marcus’s move: the production credentials, requested on day one and due May 4, are the last long-lead item out. Certification is signed off and validated; production readiness opens the day the credentials land.' },
      rows:function(R){ var A=acts(R), d0=A.reqnet||'2026-03-10', pc=longState(R,'prodcreds'), w=longState(R,'window')==='landed', t=today(R);
        var it=[['Production credentials · the key, chain and endpoint follow','Marcus Bell · the network',fm(d0),pc==='landed'?'Landed':'May 4',pc==='landed',pc!=='landed']];
        if(!w) it.push(['Certification window, Apr 20 to 24 · held','Ana Okafor · the network',fm(d0),'Confirmed at sign-off',false,false]);
        else if(t<'2026-04-25') it.push(['Certification window, Apr 20 to 24 · validated end to end, settlement file included','Ana Okafor · the network','Apr 15','Apr 24',false,false]);
        return {cols:['Move','Whose','Since','Due'], items:it, nocheck:true, tally:function(){ return '' }, done:pc==='landed'?'Landed · production readiness is open':it.length+' out with the network · readiness opens when the credentials land'} },
      meanwhile:['morning','thresholds','waiting'], nudge:'nudgeMarcus' },

    /* the reason: the first morning, in place of the old s8 */
    morning:{ q:'What happens on the first morning?', noToggle:true,
      trace:[['Reading the ramp plan','pilot cohort May 14, 6:00 AM · Marlow & Third · about 1,100 authorizations a day'],['Reading the gate to 10%','the first settlement file reconciles · May 15, 6:14 AM'],['Reading who is on','you and your on-call · Marcus Bell at the network']],
      read:'Read the ramp plan and the first gate',
      lead:'At 6:00 AM on May 14 the network routes Marlow & Third to the direct path, and the first hour is watched by the minute. The next morning’s file reconciling is the gate to 10%; nothing widens without you.',
      fig:{k:'First ramp step', big:'May 14', d:'<b>6:00 AM</b> Eastern · Marlow & Third · about 1,100 authorizations a day'},
      rows:{cols:['When','What','Who'], items:[
        ['May 14, 6:00 AM','Pilot cohort live · Marlow & Third on the direct path, the gateway behind it','The network · Marcus Bell','',false,true],
        ['May 14, 6:00 to 7:00','The first hour · approvals, declines, round trip and deliveries by the minute against the gateway baseline','You','',false,false],
        ['May 15, 6:14 AM','The first settlement file reconciles · the gate to 10% opens','Your ledger · finance','',false,false],
        ['Then','10% prepared for May 18 · approved by you, not before','You','',false,false]
      ], nocheck:true, tally:function(){ return '' }, done:'Four moments · the reroute to the gateway stands ready throughout'} }
  });

  /* the v1 run acts completed s6 on their own; in v2 the step completes at round 2, so the first run no longer carries the step key */
  (function(){ function without(o,k){ var c=Object.assign({}, o); delete c[k]; return c }
    if(ACTS.run) ACTS.run=without(ACTS.run,'step'); if(ACTS.runAgent) ACTS.runAgent=without(ACTS.runAgent,'step') })();

  Object.assign(ACTS, {
    /* the fix after round 1's three failures now leads to the submission */
    rounding:{key:'rounding', t:'Set rounding to half-even and rerun the three cases', m:'Configuration · Settlement · rounding · the network’s rule, not yours', btn:'Review and rerun',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Change a configuration value', rows:[['Section','Settlement'],['Value','Rounding: half-even (was half-up)'],['Regenerates','The three cases that failed, no others'],['Then','Rerun those three']], note:'The change applies to certification and production alike. One value, three cases.', ok:'Change and rerun'},
      approved:'Changed by you at 10:41 AM',
      receipt:{k:'Rerun · 10:41 AM', w:'21 of 21 passed', prog:{to:100, dur:2400, count:{n:21}}, line:'<b id="rcA">18 of 21</b> · clean run · round 1 is ready to submit', fixed:'A clean run is round 1. Ana reviews what you submit; the window validates it.'},
      next:['submit']},
    submit:{key:'submit', t:'Submit round 1 to Ana Okafor', m:'21 of 21 clean at 10:41 · she reviews within three business days · recall until she opens it', btn:'Review and submit',
      say:'A clean run is round 1; Ana reads every request against the network’s rules and comes back within three business days. The plan assumes one more round after her comments.',
      sheet:{eyebrow:'Confirm · Discover Global Network · Certification', h:'Submit a certification round', rows:[['Round','1 of 2 planned'],['Cases','21 of 21 clean, at 10:41'],['To','Ana Okafor, certification'],['Reviews','Within three business days · by Apr 13'],['Then','Her comments come back with the fixes prepared']], note:'Ana sees the run as you saw it. You can recall the submission until she opens it.', ok:'Submit round 1'},
      approved:'Submitted by you at 10:47 AM',
      receipt:{k:'Submitted · 10:47 AM', w:'Round 1 · with Ana Okafor', prog:{to:100, dur:600000}, line:'<b>Ana Okafor reviews by Apr 13</b> · round 2 is held for her comments', cancel:'Recall', cancelDone:'Recalled · the run is still yours', after:'Recall works until Ana opens it.'},
      next:['wait_ana']},
    nudgeAna:{key:'nudgeAna', t:'Nudge Ana Okafor about round 1', m:'A drafted note · round 1 is with her · due <b>Apr 13</b> · nothing on the route changes', btn:'Nudge Ana',
      say:'A nudge is a note, nothing more: it asks whether she needs anything from you before her review. Her due date does not move.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Send a nudge', rows:[['To','Ana Okafor, certification'],['Says','Round 1 is with you, 21 of 21 clean. Is there anything you need from us before you review it?'],['Then','Ana answers in her own time; her review is still due Apr 13']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 9:12 AM',
      receipt:{k:'Sent · 9:12 AM', w:'Ana has your nudge', prog:{to:100, dur:600000}, line:'<b>Round 1</b> still with Ana Okafor · due Apr 13 · nothing else changes until her review', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}},
    round2:{key:'round2', step:'s6', t:'Run round 2 with the two fixes', m:'AUTH-07 · SETL-01 · the 21 cases again · a clean round goes to Ana for sign-off', btn:'Review and run',
      say:'Round 2 is the whole set again with the two fixes in, sent the way round 1 was. A clean round goes to Ana for sign-off, and her sign-off confirms the window.',
      sheet:{eyebrow:'Confirm · Discover Global Network · Certification', h:'Start certification round 2', rows:[['Round','2 of 2 planned'],['Cases','21, the two fixes in'],['Fixes','AUTH-07: the advice before the response is logged · SETL-01: the header in UTC'],['Sent','The same way as round 1'],['Then','A clean round goes to Ana Okafor; her sign-off confirms the window, Apr 20 to 24']], note:'Round 2 goes to Ana as it completes. She signs off a clean round and confirms the window with it.', ok:'Start round 2'},
      approved:'Run started by you at 9:40 AM',
      receipt:{k:'Round 2 · 9:40 AM', w:'21 of 21 passed · with Ana Okafor for sign-off', prog:{to:100, dur:3800, count:{n:21}}, line:'<b id="rcA">0 of 21</b> · clean · AUTH-07 under a second · SETL-01 header in UTC', fixed:'Two rounds, as planned. Ana Okafor signs off by Apr 15, and the window, Apr 20 to 24, is confirmed with it.'},
      next:['s7','tokennow']},

    /* readiness: the objects, approved in turn inside s7 */
    prodkey:{key:'prodkey', t:'Issue the production key', m:'Shown once · separate from sandbox · inert until the pilot cohort, 6:00 AM May 14', btn:'Review and issue',
      say:'The first readiness object: a production key of its own, issued on Marcus’s credentials and inert until the pilot cohort. Nothing in sandbox or certification changes.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Issue an API key', rows:[['Environment','Production'],['Name','brightline-prod'],['Scope','Authorizations, events, settlement, disputes'],['Credentials','Marcus Bell’s, landed Apr 30'],['Active','From the pilot cohort, 6:00 AM May 14']], note:'Production keys are shown once and rotate with a seven-day overlap.', ok:'Issue the key'},
      approved:'Issued by you at 10:50 AM',
      receipt:{k:'Issued · 10:50 AM', w:'brightline-prod · inert until May 14', line:'<b>Production key issued</b> · shown once · the chain is next', fixed:'Rotate from API keys with a seven-day overlap.'}},
    prodchain:{key:'prodchain', t:'Upload the production chain', m:'brightline-prod-full.pem · three certificates · expires April 2, 2027', btn:'Review and upload',
      say:'The production chain, full to the root this time; staging taught us that. The network tries the handshake from the production range as it lands; the expiry goes in your calendar, with a reminder 30 days ahead.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Upload a certificate chain', rows:[['File','brightline-prod-full.pem'],['Certificates','Leaf, intermediate, root'],['Expires','April 2, 2027 · the network reminds you 30 days ahead'],['Then','Handshake from the production range']], note:'Full chain, as staging taught us.', ok:'Upload'},
      approved:'Uploaded by you at 10:52 AM',
      receipt:{k:'Uploaded · 10:52 AM', w:'Handshake complete · first try', line:'<b>Mutual TLS both ways</b> · from the production range · expiry recorded', fixed:'The network will remind you on March 3, 2027.'}},
    prodendpoint:{key:'prodendpoint', t:'Add the production endpoint', m:'https://api.brightline.example/dgn/events · its own secret · deliveries from the pilot cohort', btn:'Review and add',
      say:'The production endpoint gets a secret of its own, so staging and production can never verify each other’s events. It stays inert until the pilot cohort; send it a test from Webhooks any time before the day.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Add a webhook endpoint', rows:[['URL','https://api.brightline.example/dgn/events'],['Events','All six'],['Signing secret','New, shown once'],['Active','From the pilot cohort, 6:00 AM May 14']], note:'Separate secret from staging. Deliveries start with the pilot cohort on May 14.', ok:'Add'},
      approved:'Added by you at 10:54 AM',
      receipt:{k:'Added · 10:54 AM', w:'Production endpoint registered', line:'<b>Its own signing secret</b> · inert until the pilot cohort · the go/no-go note is next', fixed:'Test it from Webhooks any time before the day.'}},
    gonogo:{key:'gonogo', t:'Send the go/no-go note to Dana and Marcus', m:'From you · the ramp plan and the thresholds · <b>Dana decides on May 11</b>', btn:'Review and send',
      say:'The note carries the ramp plan, so the decision on May 11 is about a plan everyone has read. Nothing starts until the go is recorded.',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a note', rows:[['To','Dana Iverson, VP of Partnerships · Marcus Bell, the network'],['Says','Ready for go/no-go on May 11. Ramp: Marlow & Third pilot May 14 at 6:00 AM, 10% May 18, 50% May 21, 100% May 26. Any threshold breach reroutes to the gateway; hypercare to Jun 9.'],['Then','Dana decides on May 11; Marcus schedules the network side; her decision is recorded as the last readiness object']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 11:02 AM',
      receipt:{k:'Sent · 11:02 AM', w:'Dana and Marcus have the plan', prog:{to:100, dur:600000}, line:'<b>Dana Iverson decides May 11</b> · Marcus schedules the network side · her decision is recorded then', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'}},
    decision:{key:'decision', step:'s7', t:'Record Dana’s go for May 14', m:'Dana’s decision, May 11 · the pilot cohort at 6:00 AM Eastern · Marcus told · a new date takes a new go', btn:'Review and record',
      say:'Dana gave the go on May 11; recording it puts the pilot cohort in the network’s change calendar for May 14 and tells Marcus. Nothing routes to the direct path before 6:00 AM that day.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Record a go/no-go decision', rows:[['Decision','Go · Dana Iverson, May 11'],['First ramp step','Thursday, May 14 · 6:00 AM Eastern · Marlow & Third'],['Then','10% May 18 · 50% May 21 · 100% May 26 · hypercare to Jun 9'],['Told','Marcus Bell · the network schedules the pilot'],['Moves','Only with a new go from Dana; Marcus reschedules the network side']], note:'Recording the go puts the pilot in the network’s change calendar; Marcus schedules it from there.', ok:'Record the go'},
      approved:'Recorded by you at 11:15 AM',
      receipt:{k:'Recorded · 11:15 AM', w:'Go · pilot cohort May 14, 6:00 AM', prog:{to:100, dur:600000}, line:'<b>Marlow & Third at 6:00 AM, May 14</b> · in the network’s change calendar · Marcus told', cancel:'Move the date', cancelDone:'Date released · a new date takes a new go from Dana', after:'Moving the date takes a new go from Dana.'},
      next:['ramp']}
  });

  /* what she can type for this part */
  D.INTENTS.unshift(
    {re:/what did ana say|\bana\b.{0,16}(say|said|comment|review)/, run:function(R){ return {next:'review'} }},
    {re:/how many rounds|two rounds|second round|round 2/, run:function(R){ return {say:'Two rounds is the plan: round 1 after a clean run, Ana’s review within three business days, then round 2 with her comments in. Ana signs off a clean round 2 and confirms the window, Apr 20 to 24, with it.', recs:['s6']} }},
    {re:/first morning|on the morning|the morning of/, run:function(R){ return {next:'morning'} }},
    {re:/go.?no.?go/, run:function(R){ return {next:'s7'} }}
  );
})(window.OB);


/* ── part: ramp ── */
/* ramp: the launch as a ramp. Four steps of traffic (the pilot cohort, 10%, 50%, all of it), each gated by the next
   morning's settlement file reconciling against Leah's ledger; the wait for that file; the thresholds as a reason; a
   standing reroute to the gateway; and the hand-off turn that ends the route. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, lang=D.lang, first=D.first, cases=D.cases, steps=D.steps, fmt=D.fmt;
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  fmt=fmt||function(iso){ if(!iso) return ''; var p=iso.split('-'); return MON[+p[1]-1]+' '+(+p[2]) };
  function addDay(iso,n){ var p=iso.split('-').map(Number), d=new Date(Date.UTC(p[0],p[1]-1,p[2]+n)); return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2) }

  /* the four steps of the ramp: key, label, the phrase in prose, how the gating file is named, what the gate opens, the day */
  var RAMP=[
    {k:'pilot', l:'Marlow & Third', p:'Marlow & Third', f:'for the cohort', g:'10%',         d:'2026-05-14', day:'Thursday'},
    {k:'r10',   l:'10% of traffic', p:'10% of traffic', f:'at 10%',         g:'50%',         d:'2026-05-18', day:'Monday'},
    {k:'r50',   l:'50% of traffic', p:'50% of traffic', f:'at 50%',         g:'all traffic', d:'2026-05-21', day:'Thursday'},
    {k:'r100',  l:'All traffic',    p:'all traffic',    f:'at 100%',        g:'hypercare',   d:'2026-05-26', day:'Tuesday'}
  ];
  function acts(R){ return R.acts||{} }
  function lastRamp(R){ var A=acts(R), x=null; RAMP.forEach(function(s){ if(A[s.k]) x=s }); return x }
  function nextRamp(R){ var A=acts(R); return RAMP.filter(function(s){ return !A[s.k] })[0]||null }
  function prevRamp(x){ var i=RAMP.indexOf(x); return i>0?RAMP[i-1]:null }
  var BASE=['Reading the gateway’s baseline','approval 94.1% · p99 310 ms'];

  Object.assign(FLOWS, {
    ramp:{ q:'Ramp', step:'ramp', noToggle:true,
      gate:function(R){ var A=acts(R), G=R.gates||{}, last=null; ['pilot','r10','r50'].forEach(function(k){ if(A[k]) last=k }); return last&&!G[last]?'wait_file':null },
      trace:function(R){ var A=acts(R), x=lastRamp(R), n=nextRamp(R);
        if(!x) return [['Reading the decision','go · recorded May 11 · Dana Iverson and Marcus Bell told'],['Reading the pilot cohort','Marlow & Third · about 1,100 authorizations a day'],BASE];
        var live=['Reading direct traffic since '+fmt(A.pilot||RAMP[0].d),'approval 94.3% · p99 61 ms · every delivery acknowledged in 0.4 s'];
        if(n) return [live,['Reading the gate','the first file '+x.f+' reconciled · 6:14 AM · Leah’s ledger'],BASE];
        return [live,['Reading the ramp','four steps · three files reconciled · '+(A.reroute?'rerouted once, then retried':'reroute never pressed')],BASE] },
      read:function(R){ return lastRamp(R)?'Read direct traffic against the gateway’s baseline, and the overnight settlement file':'Read the go decision, the gateway’s baseline and the ramp plan' },
      lead:function(R){ var x=lastRamp(R), n=nextRamp(R);
        if(!x) return 'Traffic moves in four steps, each gated by the next morning’s settlement file reconciling against Leah’s ledger. The pilot is one merchant, Marlow & Third, from 6:00 AM Thursday; the gateway stays one button away throughout.';
        if(n) return x.l+' held every threshold against the gateway’s baseline, and the first file '+x.f+' reconciled at 6:14 AM. Next is '+n.p+' from 6:00 AM '+n.day+'; the gateway stays one button away'+(n.k==='r100'?' until it retires':'')+'.';
        return 'Every Brightline authorization is on the network, and every threshold held through the ramp. Hypercare runs to June 9, and the gateway retires on September 23.' },
      rows:function(R){ var A=acts(R), live=!!A.pilot, x=lastRamp(R), d=live?['94.3%','61 ms','0.4 s']:['—','—','—'];
        return {cols:['Measure','Direct','Gateway','Threshold'], items:[
          ['Approval rate',d[0],'94.1%','Within 0.5 points',live,!live],
          ['Round trip, p99',d[1],'310 ms','Under 120 ms',live],
          ['Delivery acknowledgment',d[2],'None · the daily file','Under 2 s',live]
        ], nocheck:true, tally:function(){ return '' }, done:live?('Three of three held since '+fmt(A.pilot)+', 6:00 AM · on the network now: '+x.p):'The gateway’s baseline · three thresholds · a breach prepares the reroute; you approve it'} },
      act:function(R){ var n=nextRamp(R); return n?n.k:null },
      standing:['reroute'], recs:['thresholds'] },

    wait_file:{ q:'Waiting on the settlement file', kind:'wait', noToggle:true,
      trace:function(R){ var x=lastRamp(R)||RAMP[0], A=acts(R); return [['Reading the ramp',x.k==='pilot'?'Marlow & Third on the network since '+fmt(A.pilot||x.d)+', 6:00 AM':x.l+' from '+fmt(x.d)+', 6:00 AM'],['Reading settlement','final about 6:00 AM Eastern · the file to your SFTP drop · Leah’s ledger reconciles it']] },
      read:'Read the ramp and the settlement calendar',
      lead:function(R){ var x=lastRamp(R)||RAMP[0], G=R.gates||{}, prev=prevRamp(x);
        if(G[x.k]) return 'The first file '+x.f+' reconciled at 6:14 AM against Leah’s ledger, so the gate is open. The next step of the ramp is prepared.';
        if(!prev) return 'The network’s move, then Leah’s: settlement for Marlow & Third’s first day is final about 6:00 AM tomorrow, and her ledger reconciles the file. Nothing has moved since 6:00 AM; traffic stays on the network, and the reroute stays one button away.';
        return 'The network’s move, then Leah’s: '+x.p+' moves at 6:00 AM '+x.day+', and the next morning her ledger reconciles the first file '+x.f+'. Nothing has moved since you routed it; '+prev.p+' stays on the network, and the reroute stays one button away.' },
      rows:function(R){ var x=lastRamp(R)||RAMP[0], A=acts(R), G=R.gates||{}, open=!!G[x.k], due=fmt(addDay(x.d,1)), items=[];
        if(x.k!=='pilot') items.push([x.l+' moves to the network','The network · routed by you',fmt(A[x.k]||x.d),fmt(x.d)+' · 6:00 AM',open]);
        items.push(['Settlement final for the first day '+(x.k==='pilot'?'of the cohort':x.f),'The network',fmt(x.d)+' · 6:00 AM',due+' · about 6:00 AM',open,!open]);
        items.push(['The first file '+x.f+' reconciles against the ledger','Leah Park · finance',fmt(x.d),due+' · morning',open]);
        return {cols:['Move','Whose','Since','Due'], items:items, nocheck:true, tally:function(){ return '' }, done:open?('Reconciled · '+due+', 6:14 AM · the gate for '+x.g+' is open'):('Neither move is yours · the gate for '+x.g+' opens when the file reconciles')} },
      meanwhile:['thresholds','waiting'], standing:['reroute'] },

    thresholds:{ q:'What are the thresholds?', noToggle:true,
      trace:[BASE,['Reading the activation plan','three measures · any breach prepares a reroute']],
      read:'Read the gateway’s baseline and the activation plan',
      lead:'Each threshold is set against something the gateway already does or the deal promised, and a breach prepares a reroute that waits for you. They hold at every step of the ramp, from the pilot to all traffic.',
      rows:{cols:['Measure','Threshold','Why'], items:[
        ['Approval rate','Within 0.5 points of the gateway','The gateway approves 94.1%; a wider gap means the mapping changed, not the cards',true,true],
        ['Round trip, p99','Under 120 ms','The network answers in about 44 ms; the rest is your host and the mapping',true],
        ['Delivery acknowledgment','Under 2 s','Decisions reach your bus within a second; slower is an endpoint in trouble',true]
      ], nocheck:true, tally:function(){ return '' }, done:'Three measures · a breach prepares the reroute; you approve it'} },

    operate:{ q:'Hand-off', end:true, noToggle:true,
      trace:function(R){ var A=acts(R); return [['Reading the ramp','four steps · three files reconciled · '+(A.reroute?'rerouted once, then retried':'reroute never pressed')],['Reading what’s ahead','hypercare to Jun 9 · the gateway retires Sep 23']] },
      read:'Read the ramp, the hypercare plan and the retirement date',
      lead:'All of Brightline’s traffic is on the network and every threshold held, so the route ends here. From tomorrow this page is your Overview, and the first thing to ask it is what failed overnight.',
      rows:{cols:['When','What','Who'], items:[
        ['May 26 to Jun 9','Hypercare · the ramp instrument stays open and the reroute stays one button away','You, Marcus Bell and network operations',true,true],
        ['Every morning','The first ask in the Developer Portal: “What failed overnight?” · the answer comes with its action prepared','You',false],
        ['Sep 23','The gateway retires, 120 days after all traffic moved · the reroute goes with it','Your network team',false]
      ], nocheck:true, tally:function(){ return '' }, done:'The route ends here · the portal is yours from tomorrow'} }
  });

  Object.assign(ACTS, {
    pilot:{key:'pilot', t:'Route Marlow & Third to the network from 6:00 AM', m:'The pilot cohort · one merchant · about 1,100 authorizations a day · <b>every other merchant stays on the gateway</b>', btn:'Review and route',
      say:'The pilot is one merchant, so anything the thresholds catch is caught small. Reroute stays one button away.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Route the pilot cohort', rows:[['Cohort','Marlow & Third · one merchant · about 1,100 authorizations a day'],['From','Thursday, May 14 · 6:00 AM Eastern'],['Thresholds','Approval within 0.5 points of the gateway · p99 under 120 ms · acknowledgment under 2 s'],['Gate for 10%','The first settlement file for the cohort reconciling, May 15'],['If a threshold breaks','A reroute to the gateway is prepared for you; nothing moves on its own']], note:'Every other merchant stays on the gateway. Reroute stays one button away at any time.', ok:'Route the pilot'},
      approved:'Routed by you at 6:00 AM',
      receipt:{k:'Routed · 6:00 AM', w:'Marlow & Third is on the network', prog:{to:100, dur:3600}, line:'<b>First hour</b> · approvals 94.3% against the gateway’s 94.1% · p99 61 ms · every delivery acknowledged in 0.4 s', fixed:'The gate for 10% is the first settlement file reconciling against Leah Park’s ledger, May 15. Reroute stays one button away.'},
      next:['wait_file']},
    r10:{key:'r10', t:'Route 10% of traffic to the network from Monday', m:'From 6:00 AM Monday, May 18 · the pilot held every threshold · <b>the first file reconciled at 6:14 AM</b>', btn:'Review and route',
      say:'One authorization in ten from 6:00 AM Monday, Marlow & Third among them; the gate for 50% is the first file at that share reconciling. Reroute stays one button away.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Route 10% to the network', rows:[['Share','10% of Brightline’s authorizations · Marlow & Third included'],['From','Monday, May 18 · 6:00 AM Eastern'],['Gate held','The first file for the cohort reconciled May 15, 6:14 AM · Leah’s ledger'],['Thresholds','Unchanged · approval within 0.5 points · p99 under 120 ms · acknowledgment under 2 s'],['Gate for 50%','The first settlement file at 10% reconciling against Leah Park’s ledger, Tuesday morning']], note:'Nothing changes until 6:00 AM Monday. You can hold the step for ten minutes after confirming.', ok:'Route 10%'},
      approved:'Routed by you at 9:40 AM',
      receipt:{k:'Routed · 9:40 AM', w:'10% of traffic from 6:00 AM Monday, May 18', prog:{to:100, dur:600000}, line:'<b>Gate for 50%</b> · Leah Park reconciles the first file at 10% on Tuesday morning · reroute stays one button away', cancel:'Hold the step', cancelDone:'Held · Marlow & Third stays the only merchant on the network', after:'Hold works for ten minutes; after that, reroute is the way back.'},
      next:['wait_file']},
    r50:{key:'r50', t:'Route 50% of traffic to the network from Thursday', m:'From 6:00 AM Thursday, May 21 · 10% held every threshold · <b>the first file at 10% reconciled at 6:14 AM</b>', btn:'Review and route',
      say:'Half of every merchant’s authorizations from 6:00 AM Thursday; the gate for all traffic is the first file at that share reconciling. Reroute stays one button away.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Route 50% to the network', rows:[['Share','Half of Brightline’s authorizations · every merchant'],['From','Thursday, May 21 · 6:00 AM Eastern'],['Gate held','The first file at 10% reconciled the next morning, 6:14 AM · Leah’s ledger'],['Thresholds','Unchanged · approval within 0.5 points · p99 under 120 ms · acknowledgment under 2 s'],['Gate for all traffic','The first settlement file at 50% reconciling against Leah Park’s ledger, Friday morning']], note:'Nothing changes until 6:00 AM Thursday. You can hold the step for ten minutes after confirming.', ok:'Route 50%'},
      approved:'Routed by you at 8:15 AM',
      receipt:{k:'Routed · 8:15 AM', w:'50% of traffic from 6:00 AM Thursday, May 21', prog:{to:100, dur:600000}, line:'<b>Gate for all traffic</b> · Leah Park reconciles the first file at 50% on Friday morning · reroute stays one button away', cancel:'Hold the step', cancelDone:'Held · 10% stays on the network', after:'Hold works for ten minutes; after that, reroute is the way back.'},
      next:['wait_file']},
    r100:{key:'r100', step:'ramp', t:'Route all traffic to the network from Tuesday', m:'From 6:00 AM Tuesday, May 26 · 50% held every threshold · <b>hypercare to Jun 9</b> · the gateway retires Sep 23', btn:'Review and route',
      say:'Every authorization from 6:00 AM Tuesday, and hypercare for two weeks after it. The gateway is kept for a reroute until it retires on September 23.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Route all traffic to the network', rows:[['Share','Every Brightline authorization · the gateway serves none'],['From','Tuesday, May 26 · 6:00 AM Eastern'],['Gate held','The first file at 50% reconciled the next morning, 6:14 AM · Leah’s ledger'],['Hypercare','To Jun 9 · the ramp instrument stays open · both sides on call'],['The gateway','Kept for a reroute until it retires on Sep 23, 120 days after all traffic']], note:'Hypercare is two weeks. The gateway stays one button away until Sep 23, then it is gone.', ok:'Route all traffic'},
      approved:'Routed by you at 9:02 AM',
      receipt:{k:'Routed · 9:02 AM', w:'All traffic from 6:00 AM Tuesday, May 26', prog:{to:100, dur:600000}, line:'<b>Hypercare to Jun 9</b> · the gateway retires Sep 23 · the route ends here', cancel:'Hold the step', cancelDone:'Held · 50% stays on the network', after:'Hold works for ten minutes; after that, reroute is the way back.'},
      next:['operate']},
    reroute:{key:'reroute', t:'Reroute to the gateway', m:'Every merchant on the network, back to the gateway within a minute · <b>nothing is torn down</b> · the step can be retried', btn:'Review and reroute',
      say:'Rerouting puts every direct authorization back on the gateway within a minute and tears nothing down. The ramp step can be retried when you’re ready.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Reroute to the gateway', rows:[['Moves','Every merchant on the network today, back to the gateway'],['Takes','Under a minute · authorizations in flight finish on the network'],['Keeps','Your production objects · settlement for traffic already on the network still arrives in the daily file'],['Then','The ramp step is retried when you’re ready']], note:'Nothing is lost by rerouting. Marcus Bell and Dana Iverson are told when you confirm.', ok:'Reroute'},
      approved:'Rerouted by you at 9:12 AM',
      receipt:{k:'Rerouted · 9:12 AM', w:'Traffic is back on the gateway', prog:{to:100, dur:1800}, line:'<b>Within a minute</b> · every authorization answering through the gateway · the ramp step can be retried', fixed:'Your production objects stay in place. Route the step again when you’re ready.'}}
  });

  /* which nudge is pending: the one she names, else the soonest due of what is out with other people */
  var DUE={allowlist:'2026-03-24',cert:'2026-03-24',firewall:'2026-04-02',prodcreds:'2026-05-04',window:'2026-04-15'};
  var WHO={allowlist:'nudgeMarcus',prodcreds:'nudgeMarcus',cert:'nudgeNet',firewall:'nudgeNet',window:'nudgeAna'};
  function pendingNudge(R,t){ var L=R.long||{}, A=acts(R), S=R.signed||{}, st=function(k){ return (L[k]&&L[k].state)||'none' };
    if(/marcus|allowlist|credential/.test(t)) return 'nudgeMarcus'; if(/leah|finance|ledger|reconcil/.test(t)) return 'nudgeLeah'; if(/network team|firewall|\bca\b|chain/.test(t)) return 'nudgeNet'; if(/\bana\b|window|review|round/.test(t)) return 'nudgeAna';
    var c=[]; Object.keys(WHO).forEach(function(k){ if(st(k)==='out') c.push([WHO[k],DUE[k]]) });
    if(A.recon&&!S.fin) c.push(['nudgeLeah',addDay(A.recon,7)]); if(R.rounds===1) c.push(['nudgeAna',addDay(A.submit||'2026-04-08',5)]);
    c.sort(function(a,b){ return a[1]<b[1]?-1:a[1]>b[1]?1:0 }); return c.length?c[0][0]:null }

  D.INTENTS.unshift(
    {re:/what am i waiting|whose move|waiting on/, run:function(R){ return {next:'waiting'} }},
    {re:/nudge/, run:function(R,m){ var k=pendingNudge(R,String((m&&m.input)||'').toLowerCase()); return k?{next:k}:{say:'Nothing is out with anyone right now; every move left on the route is yours.', recs:['waiting']} }},
    {re:/reroute|roll ?back/, run:function(R){ return {next:'reroute'} }},
    {re:/how many rounds|rounds/, run:function(R){ var n=R.rounds||0; return {say:n>=2?'Two rounds, as the route assumed: the first run found the rounding rule, Ana’s review found two more, and the second run was clean. Her sign-off followed the next day.':n===1?'One round is with Ana now and the route assumes one more: you fix what she flags, and a clean second run earns her sign-off. The window is already held, so the plan holds too.':'Two rounds is the planning assumption, and the route is drawn to it. A first run finds what the configuration missed, Ana reviews it, and a clean second run earns her sign-off.', recs:['s6']} }},
    {re:/threshold/, run:function(R){ return {next:'thresholds'} }}
  );
})(window.OB);


/* ── part: zz-glue ── */
/* glue: the lead's resolutions of what the drafts left open. Loaded last. */
(function(D){
  var FLOWS=D.FLOWS, ACTS=D.ACTS, fmt=D.fmt;
  /* a nudge for the production credentials (wait_prod), distinct from the allowlist nudge */
  ACTS.nudgeMarcusProd={key:'nudgeMarcusProd', t:'Nudge Marcus about the production credentials', m:'A drafted note · requested on day one · due May 4', btn:'Review and send',
    sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a nudge', rows:[['To','Marcus Bell, operations lead'],['Says','Certification is signed off and the window is confirmed; the production credentials requested on Mar 10 are the last thing before readiness. Can they land this week?'],['Then','Marcus replies here; nothing else changes']], note:'One note. The request itself stays as it was.', ok:'Send'},
    approved:'Sent by you', receipt:{k:'Nudge sent', w:'Marcus has your note', line:'<b>Production credentials</b> · due May 4 · Marcus usually answers the same day', fixed:'The request stays open; the route re-draws when they land.'}};
  /* a nudge for the chain, held by her own security team */
  ACTS.nudgeSec={key:'nudgeSec', t:'Nudge security about the chain', m:'A drafted note · the signing request went on day one · due Mar 24', btn:'Review and send',
    sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a nudge', rows:[['To','Your security team · Brightline Issuing CA 2'],['Says','The signing request for staging.brightline.example went in on Mar 10; the network needs the full chain to the root before the handshake. Is it on track for Mar 24?'],['Then','Security replies here; nothing else changes']], note:'One note. The signing request stays as it was.', ok:'Send'},
    approved:'Sent by you', receipt:{k:'Nudge sent', w:'Security has your note', line:'<b>Certificate chain</b> · due Mar 24 · three certificates, leaf to root', fixed:'The request stays open; the route re-draws when the chain is issued.'}};
  if(FLOWS.wait_prod) FLOWS.wait_prod.nudge='nudgeMarcusProd';
  if(FLOWS.wait_conn){ var prev=FLOWS.wait_conn.nudge; FLOWS.wait_conn.nudge=function(R){ var out=['allowlist','cert','firewall'].filter(function(k){ return D.longState(R,k)!=='landed' }); if(out.length===1&&out[0]==='cert') return 'nudgeSec'; if(out.indexOf('allowlist')>-1) return 'nudgeMarcus'; if(out.indexOf('firewall')>-1) return 'nudgeNet'; return typeof prev==='function'?prev(R):prev } }
  /* the agent key's receipt: on the agent-first route it is the first call; after a sandbox key it is the agents step */
  if(ACTS.agentkey&&ACTS.agentkey.receipt){ var rc=ACTS.agentkey.receipt, firstLine=rc.line, firstW=rc.w;
    rc.line=function(R){ return R.acts&&R.acts.key?'<b>Your agents are connected</b> · brightline-agent · their runs show here as traces':firstLine };
    rc.w=function(R){ return R.acts&&R.acts.key?'brightline-agent · connected to mcp.dgn.com':firstW } }
  /* standing buttons read as the act, not the sheet */
  if(ACTS.reroute) ACTS.reroute.standingLabel='Reroute to the gateway';
  [['nudgeMarcus','Nudge Marcus'],['nudgeMarcusProd','Nudge Marcus'],['nudgeNet','Nudge the network team'],['nudgeSec','Nudge security'],['nudgeLeah','Nudge Leah'],['nudgeAna','Nudge Ana']].forEach(function(p){ if(ACTS[p[0]]) ACTS[p[0]].standingLabel=p[1] });
})(window.OB);

