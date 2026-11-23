/* Brightline Onboarding: the content. Priya Raghavan, lead integration engineer at Brightline Bank, the week after
   Dana named her. The assistant asks what she is building, draws her route, forks where the choice is real and
   prepares every step for her approval. Text reads from the route (R) so the branches say different things.
   Everything is invented and sits on the Brightline story's data spine. */
window.OB=(function(){
  "use strict";

  var SEAT={k:'priya', n:'Priya Raghavan', r:'Lead integration engineer', org:'Brightline Bank', portal:'Developer Portal', state:'Sandbox', av:'img/av-priya.webp', needs:['Alerts',0,'bell'], ph:'Find an endpoint, event or test card'};

  var NAV=[
    ['',[['home','Getting started',0,'start']]],
    ['Build',[['api','API reference',0,'docs'],['events','Event reference',0,'events'],['cards','Test cards',0,'card']]],
    ['Connect',[['keys','API keys',0,'keys'],['webhooks','Webhooks',0,'webhook'],['config','Configuration',0,'config']]],
    ['Launch',[['cert','Certification',0,'badge'],['golive','Go-live',0,'live']]],
    ['Monitor',[['logs','Logs',0,'terminal'],['alerts','Alerts',0,'bell'],['changelog','Changelog',0,'history']]],
    ['',[['support','Support',0,'lifebuoy']]]
  ];

  /* ── the route: what she chose, and where each step stands ── */
  var DEFAULT_ROUTE={goals:['auth','events','settle','disputes','agents'], host:'iso', events:'webhooks', settle:'both', disputes:'api', lang:'node', first:'sdk', runner:'host', token:'later', done:{}, answered:[], how:{}, heard:null,
    /* v2: the clock, and the things other people hold */
    today:'2026-03-10', visited:'2026-03-10', acts:{}, gates:{}, signed:{}, rounds:0, ramp:0, rampPrev:0,
    long:{
      allowlist:{t:'Allowlist for 203.0.113.0/24', owner:'Marcus Bell · the network', who:'Marcus Bell', short:'the allowlist', ev:'the allowlist opens', due:'2026-03-24', lands:'2026-03-20', need:'2026-04-07', by:'reqnet', state:'none', landed:'The allowlist opened for 203.0.113.0/24'},
      cert:{t:'Certificate chain from your CA', owner:'Brightline Issuing CA 2 · your security team', who:'your CA', short:'the chain', ev:'the chain is issued', due:'2026-03-24', lands:'2026-03-19', need:'2026-04-07', by:'csr', state:'none', landed:'Your CA issued the chain, three certificates to the root'},
      firewall:{t:'Firewall change · NET-4471', owner:'Your network team', who:'your network team', short:'the firewall change', ev:'the firewall change goes in', due:'2026-04-02', lands:'2026-04-02', need:'2026-04-07', by:'fwticket', state:'none', landed:'The firewall change went in · NET-4471'},
      prodcreds:{t:'Production credentials', owner:'Marcus Bell · the network', who:'Marcus Bell', short:'production credentials', ev:'production credentials arrive', due:'2026-05-04', lands:'2026-04-30', need:'2026-05-11', by:'reqnet', state:'none', landed:'Production credentials arrived from Marcus'},
      window:{t:'Certification window · Apr 20 to 24', owner:'Ana Okafor · the network', who:'Ana Okafor', short:'the window', ev:'Ana confirms the window', due:'2026-04-15', lands:'2026-04-15', need:'2026-04-20', by:'reqnet', state:'none', landed:'Ana confirmed the certification window, Apr 20 to 24'}
    }};
  var FIRST_RAMP='2026-05-14';
  /* dates */
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function dt(iso){ var p=iso.split('-'); return new Date(Date.UTC(+p[0],+p[1]-1,+p[2])) }
  function iso(d){ return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0') }
  function fmt(s){ if(!s) return ''; var d=dt(s); return MON[d.getUTCMonth()]+' '+d.getUTCDate() }
  function fmtLong(s){ var d=dt(s); return DOW[d.getUTCDay()]+', '+MON[d.getUTCMonth()]+' '+d.getUTCDate() }
  function addDays(s,n){ var d=dt(s); d.setUTCDate(d.getUTCDate()+n); return iso(d) }
  function daysBetween(a,b){ return Math.round((dt(b)-dt(a))/86400000) }
  function today(R){ return R.today||'2026-03-10' }
  function dayN(R){ return daysBetween('2026-03-10',today(R))+1 }
  function longState(R,k){ var L=R.long&&R.long[k]; if(!L) return 'none'; if(L.state==='landed') return 'landed'; if(R.acts&&R.acts[L.by]) return today(R)>=L.lands?'landed':'out'; return 'none' }
  function landed(R,keys){ return keys.every(function(k){ return longState(R,k)==='landed' }) }
  /* everything that will happen on the clock, derived from what she has approved */
  function events(R){ var ev=[]; var A=R.acts||{};
    Object.keys(R.long||{}).forEach(function(k){ var L=R.long[k]; if(k==='window'){ /* held on day one; confirmed the day after Ana's sign-off */ if(L.state==='landed'||A.round2) ev.push({date:L.state==='landed'?L.lands:addDays(A.round2,1), t:L.landed, short:L.ev, who:L.who, key:'long:'+k, kind:'long'}); return }
      if(A[L.by]||L.state==='landed'){ ev.push({date:L.lands, t:L.landed, short:L.ev, who:L.who, key:'long:'+k, kind:'long'}) } });
    if(A.recon) ev.push({date:addDays(A.recon,7), t:'Leah Park signed the reconciliation checklist', short:'Leah signs the reconciliation', who:'Leah Park · finance', key:'signed:fin', kind:'signed'});
    if(A.submit) ev.push({date:addDays(A.submit,5), t:'Ana returned round 1 with two comments', short:'Ana’s review comes back', who:'Ana Okafor', key:'review', kind:'review'});
    if(A.round2) ev.push({date:addDays(A.round2,1), t:'Ana signed off certification', short:'Ana signs off', who:'Ana Okafor', key:'signoff', kind:'signoff'});
    [['pilot','the pilot cohort'],['r10','10% of traffic'],['r50','50% of traffic'],['r100','all traffic']].forEach(function(p){ if(A[p[0]]) ev.push({date:addDays(A[p[0]],1), t:'The first settlement file for '+p[1]+' reconciled at 6:14 AM', short:'the first file reconciles', who:'The network and Leah’s ledger', key:'gate:'+p[0], kind:'gate'}) });
    if(A.gonogo&&!A.decision&&A.gonogo<'2026-05-11') ev.push({date:'2026-05-11', t:'The go/no-go with Dana Iverson and Marcus Bell', short:'the go/no-go', who:'Dana Iverson · Marcus Bell', key:'meeting:gonogo', kind:'meeting'});
    if(A.r100){ ev.push({date:addDays(A.r100,14), t:'Hypercare ended', short:'hypercare ends', who:'Both on-call teams', key:'hypercare', kind:'late'}); ev.push({date:addDays(A.r100,120), t:'The gateway retired', short:'the gateway retires', who:'You', key:'retire', kind:'late'}) }
    ev.sort(function(a,b){ return a.date<b.date?-1:a.date>b.date?1:0 }); return ev }
  function pending(R){ var t=today(R); return events(R).filter(function(e){ return e.date>t }) }
  function nextMove(R){ return pending(R)[0]||null }
  /* moving the clock: what happened between the last visit and now */
  function applyClock(R,to){ R.visited=today(R); R.today=to; events(R).forEach(function(e){ if(e.date>to) return; var p=e.key.split(':'); if(p[0]==='long'){ R.long[p[1]].state='landed' } else if(p[0]==='signed'){ R.signed=R.signed||{}; R.signed[p[1]]=true } else if(p[0]==='gate'){ R.gates=R.gates||{}; R.gates[p[1]]=true } else if(e.key==='review'){ R.reviewed=true } else if(e.key==='signoff'){ R.signoff=true } }) }
  function since(R){ var v=R.visited||today(R), t=today(R); return events(R).filter(function(e){ return e.date>v&&e.date<=t }) }
  /* May 14 against what is still out: at risk when something lands after the day it is needed */
  function risk(R){ var late=0, worst=null; Object.keys(R.long).forEach(function(k){ var L=R.long[k], st=longState(R,k); var when=st==='landed'?L.lands:(st==='out'?L.due:addDays(today(R),Math.max(7,daysBetween(L.lands,L.due)+10))); var d=daysBetween(L.need,when); if(d>late){ late=d; worst=k } }); return {days:late, key:worst} }
  function weeksLeft(R){ return Math.max(0,Math.round(daysBetween(today(R),FIRST_RAMP)/7)) }
  /* Brightline's description, as Priya would write it. Typed into the field when the demo is driven; anyone can type their own. */
  var DESC='We run an in-house authorization host on ISO 8583 (1987 variant) on AWS, behind a gateway today. We want the network directly for authorizations. Decisions and disputes should come to us by webhook into our event bus; settlement by the daily file to SFTP for the ledger, plus the settlement event. Disputes go into our case tool through its API. We build in Node, and the team uses Claude Code and Cursor, so our agents should be able to work the sandbox and run the certification cases. Tokenization can wait until after go-live.';
  /* the running record of her choices: label, how to read the value, where to change it */
  var LABELS={
    goals:{t:'In scope', v:function(R){ var m={auth:'authorization path',events:'event delivery',settle:'settlement delivery',disputes:'dispute integration',agents:'agent tooling',token:'tokenization'}; return R.goals.length?R.goals.map(function(g){ return m[g] }).join(', '):'nothing yet' }, go:'goals'},
    host:{t:'Authorization host', v:function(R){ return {iso:'In-house, ISO 8583 behind a gateway',gateway:'Gateway kept, cut over later',none:'No authorization stack yet'}[R.host] }, go:'host'},
    events:{t:'Event delivery', v:function(R){ return {webhooks:'Webhooks into your endpoint',mcp:'Agent subscription over MCP',poll:'Polling the API on a cursor'}[R.events] }, go:'events'},
    settle:{t:'Settlement delivery', v:function(R){ return {file:'Daily file to SFTP',api:'Settlement API and settlement.posted',both:'SFTP file, plus the API and event'}[R.settle] }, go:'settle'},
    disputes:{t:'Dispute integration', v:function(R){ return {api:'Case tool via the disputes API',portal:'Partner Portal, no build',email:'Email, as today'}[R.disputes] }, go:'disputes'},
    lang:{t:'Language and tooling', v:function(R){ return {node:'Node · agents over MCP',python:'Python · agents over MCP',java:'Java · agents over MCP',curl:'cURL and Postman',mcp:'Agents over MCP'}[R.lang].replace(' · agents over MCP',R.goals.indexOf('agents')>-1?' · agents over MCP':'') }, go:'lang'},
    first:{t:'First call', v:function(R){ return {mcp:'Your agent over MCP',sdk:({node:'The Node SDK',python:'The Python SDK',java:'The Java SDK'})[R.lang]||'The SDK',curl:'cURL',postman:'Postman'}[R.first] }, go:'s1'},
    runner:{t:'Certification runner', v:function(R){ return {host:'Your host, to cert.api.dgn.com',agent:'Your agent over MCP'}[R.runner] }, go:'s6'},
    token:{t:'Tokenization', v:function(R){ return {now:'In this certification',later:'After go-live'}[R.token] }, go:'goals'}
  };
  var ORDER=['goals','host','events','settle','disputes','lang','first','runner','token'];
  /* what she can type, and what the assistant does with it */
  /* reading her description: what she said, and what the assistant assumed where she didn't */
  function readNeeds(t){ var s=t.toLowerCase(), n={goals:[],how:{}}, said=function(k){ n.how[k]='said' }, assume=function(k){ n.how[k]='assumed' };
    if(/author|iso|host|approv/.test(s)) n.goals.push('auth'); if(/event|webhook|decision|real.?time|event bus/.test(s)) n.goals.push('events'); if(/settle|reconcil|ledger|sftp|wire/.test(s)) n.goals.push('settle'); if(/dispute|chargeback|evidence|case tool/.test(s)) n.goals.push('disputes'); if(/agent|mcp|claude|cursor|copilot/.test(s)) n.goals.push('agents'); if(/token/.test(s)&&!/(wait|later|after|no|without|skip)[^.]{0,30}token|token[^.]{0,30}(wait|later|after)/.test(s)) n.goals.push('token'); n.goals.length?said('goals'):assume('goals'); if(!n.goals.length) n.goals=['auth'];
    if(/iso|8583|host/.test(s)){ n.host='iso'; said('host') } else if(/gateway/.test(s)){ n.host='gateway'; said('host') } else if(/greenfield|nothing yet|no (auth|stack)/.test(s)){ n.host='none'; said('host') } else { n.host='iso'; assume('host') }
    if(/poll/.test(s)){ n.events='poll'; said('events') } else if(/webhook|event bus|endpoint|subscri/.test(s)){ n.events='webhooks'; said('events') } else { n.events=n.goals.indexOf('events')>-1?'webhooks':'poll'; assume('events') }
    var f=/sftp|\bfile\b/.test(s), a=/settlement api|settlement event|settlement\.posted|plus the (api|event)|and the (api|event)/.test(s);
    if(f&&a){ n.settle='both'; said('settle') } else if(f){ n.settle='file'; said('settle') } else if(a){ n.settle='api'; said('settle') } else { n.settle='file'; assume('settle') }
    if(/case tool|dispute.{0,20}api|jira|servicenow|zendesk/.test(s)){ n.disputes='api'; said('disputes') } else if(/partner portal|\bportal\b/.test(s)){ n.disputes='portal'; said('disputes') } else if(/email/.test(s)){ n.disputes='email'; said('disputes') } else { n.disputes=n.goals.indexOf('disputes')>-1?'api':'portal'; assume('disputes') }
    var L=/\bnode|javascript|typescript/.test(s)?'node':/python/.test(s)?'python':/\bjava\b|kotlin/.test(s)?'java':/curl|postman/.test(s)?'curl':null; if(L){ n.lang=L; said('lang') } else { n.lang='node'; assume('lang') }
    n.first=n.goals.indexOf('agents')>-1?'mcp':(n.lang==='curl'?'curl':'sdk'); n.how.first=n.goals.indexOf('agents')>-1?'said':'assumed';
    n.runner=/agent[^.]{0,60}(cert|cases)|run the cert/.test(s)?'agent':'host'; n.how.runner=n.runner==='agent'?'said':'assumed';
    n.token=n.goals.indexOf('token')>-1?'now':'later'; n.how.token=/token/.test(s)?'said':'assumed';
    return n }
  function hearGoals(t){ return readNeeds(t).goals }
  var INTENTS=[
    {re:/skip ahead|jump ahead|fast.?forward|move the clock|next move|what.{0,8}next move/, run:function(R){ return {skip:true} }},
    {re:/day one|long.?lead|what did you start|requests? out/, run:function(R){ return {next:'d0'} }},
    {re:/map the messages|mapping|iso 8583|scenario/, run:function(R){ return {next:'mapmsg'} }},
    {re:/back office|settlement file|reconcil|finance|leah/, run:function(R){ return {next:'office'} }},
    {re:/\bramp\b|pilot|cohort|cut.?over/, run:function(R){ return {next:'ramp'} }},
    {re:/\b(python|node|java)\b/, run:function(R,m){ var l=m[1]; return {set:{lang:l,first:'sdk'}, key:'lang', say:({node:'Node',python:'Python',java:'Java'})[l]+' it is. Every snippet from here has your values in it, and the first call uses the '+({node:'Node',python:'Python',java:'Java'})[l]+' SDK.'} }},
    {re:/\b(curl|postman)\b/, run:function(R,m){ return {set:{lang:'curl',first:m[1]}, key:'lang', say:'cURL and Postman, then: two calls, the token and the authorization, and a collection to fork.'} }},
    {re:/\b(poll|polling)\b/, run:function(R){ return {set:{events:'poll'}, key:'events', say:'Polling, then. No events step on the route; decisions arrive when you ask, which costs you whatever your interval is instead of under a second.'} }},
    {re:/webhook|endpoint/, run:function(R){ return {set:{events:'webhooks'}, key:'events', say:'Webhooks it is: an endpoint, a signing secret and retries for 72 hours at step 3, and four cases in certification.'} }},
    {re:/subscri/, run:function(R){ return {set:{events:'webhooks'}, key:'events', say:'Your agent can watch the sandbox stream while you build, but production events reach you by webhook or by polling; MCP is not a delivery path. I have kept webhooks on the route.'} }},
    {re:/sftp|\bfile\b/, run:function(R){ return {set:{settle:'file'}, key:'settle', say:'The settlement file, as your ledger expects. Three cases, and a dry run the night before go-live.'} }},
    {re:/settlement api|settle.*api|settlement.posted/, run:function(R){ return {set:{settle:'api'}, key:'settle', say:'The settlement API and the event: two cases, and the wire reference the moment it exists.'} }},
    {re:/\bemail\b/, run:function(R){ return {set:{disputes:'email'}, key:'disputes', say:'Email, as today. Nothing to build, and it keeps the $18 to $25 a case; the route leaves the door open.'} }},
    {re:/partner portal|\bportal\b/, run:function(R){ return {set:{disputes:'portal'}, key:'disputes', say:'The Partner Portal, so nothing to build; Dana\u2019s team works disputes there.'} }},
    {re:/case tool|dispute.*api/, run:function(R){ return {set:{disputes:'api'}, key:'disputes', say:'Into your case tool by API: three cases, and evidence upload becomes yours to wire.'} }},
    {re:/(no|not|without|skip|later|after).{0,12}token|token.{0,20}(later|after|skip|no)/, run:function(R){ return {set:{token:'later'}, key:'token', say:'Tokenization comes off the route; it can follow go-live without touching anything else.'} }},
    {re:/token/, run:function(R){ return {set:{token:'now'}, key:'token', say:'Tokenization goes on the route: eight more cases and about two weeks alongside the other tracks.'} }},
    {re:/what.{0,6}mcp|mcp.{0,10}(for|do)|why.{0,10}mcp|agent.{0,16}(auth|path)/, run:function(R){ return {say:'MCP is for building and operating: with a scoped key your agent can read the reference, send test cards, read logs, run certification cases and watch deliveries from your own tooling. It never carries the authorization path. That leg answers in 44 milliseconds over mutual TLS, and the network certifies the message, not the tool that sent it.', recs:['s1','why']} }},
    {re:/how long|weeks|when.{0,12}live|go.?live date|at risk/, run:function(R){ var rk=risk(R); return {say:'About '+weeksLeft(R)+' weeks to the first ramp step on May 14, with '+steps(R).filter(function(s){ return !R.done[s.k] }).length+' steps still to go. '+(rk.days>0?'It is at risk by '+rk.days+' days on '+R.long[rk.key].short+'.':'Nothing out with other people lands after the day it is needed, so May 14 holds.'), recs:['waiting','why']} }},
    {re:/^why\b|why these|why not/, run:function(R){ return {next:'why'} }},
    {re:/feasib|dana/, run:function(R){ return {next:'s2'} }},
    {re:/\bevents?\b/, run:function(R){ return {next:'s3'} }},
    {re:/certif|cases/, run:function(R){ return {next:'s6'} }},
    {re:/sandbox|first call|\bkey\b/, run:function(R){ return {next:'s1'} }},
    {re:/production|readiness|go.?live|go.?no.?go/, run:function(R){ return {next:'s7'} }},
    {re:/chain|tls|certificate|allowlist|connect/, run:function(R){ return {next:'s4'} }},
    {re:/config/, run:function(R){ return {next:'s5'} }}
  ];

  /* v2: eleven steps on two tracks; R.done is keyed by k */
  var STEPS=[
    {k:'d0',     t:'Day one: start the long-lead items',  who:'you',  track:'long'},
    {k:'s1',     t:'Sandbox and the first call',          who:'you'},
    {k:'agents', t:'Connect your agents',                 who:'you',  when:function(R){ return R.goals.indexOf('agents')>-1 }},
    {k:'mapmsg', t:'Map the authorization messages',      who:'you',  when:function(R){ return R.host==='iso' }},
    {k:'s3',     t:'Events',                              who:'you',  when:function(R){ return R.events!=='poll' }},
    {k:'office', t:'The back office',                     who:'both'},
    {k:'s4',     t:'Secure the connection',               who:'both'},
    {k:'s5',     t:'Configuration',                       who:'you'},
    {k:'s6',     t:'Certification, in rounds',            who:'both'},
    {k:'s7',     t:'Production readiness and go/no-go',   who:'both'},
    {k:'ramp',   t:'Ramp',                                who:'both'}
  ];
  function steps(R){ return STEPS.filter(function(s){ return !s.when||s.when(R) }).map(function(s,i){ return Object.assign({n:i+1},s) }) }
  function weeks(R){ return weeksLeft(R) }
  function cases(R){ var n=9; if(R.events!=='poll') n+=4; if(R.settle==='file'||R.settle==='both') n+=3; if(R.settle==='api'||R.settle==='both') n+=2; if(R.disputes==='api') n+=3; if(R.token==='now') n+=8; return n }
  function forkLabel(R,k){ return ({s1:{mcp:'your agent over MCP',curl:'cURL',sdk:({node:'Node SDK',python:'Python SDK',java:'Java SDK'})[R.lang]||'SDK',postman:'Postman'}[R.first],
    s3:{webhooks:'webhooks',mcp:'webhooks',poll:'polling'}[R.events],
    s5:{file:'settlement file',api:'settlement API',both:'file and API'}[R.settle]+' · disputes '+{api:'by API',portal:'in the portal',email:'by email'}[R.disputes],
    s6:{host:'run from your host',agent:'run by your agent'}[R.runner]+(R.token==='now'?' · tokenization':''),
    s7:R.events==='webhooks'?'production endpoint':'', s2:'', s4:'mutual TLS', ramp:'pilot · 10% · 50% · 100%'})[k]||'' }

  /* ── the integration, drawn: her systems on the left, the network's on the right, and what connects them.
     Every connection is one of her choices (go = where to change it); its state comes from the steps. ── */
  function map(R){ var agents=R.goals.indexOf('agents')>-1, how=function(k){ return R.how[k]||'said' };
    var right=['auth']; if(!agents) right.push('sandbox'); right.push('tokens','events','settle','disputes'); if(agents) right.push('sandbox');
    var row={}; right.forEach(function(k,i){ row[k]=i+1 });
    var N={auth:['Authorization','REST over mutual TLS · 44 ms'], tokens:['Network tokens',R.token==='now'?'token.updated · reissued cards keep working':'after go-live, when you want it'], events:['Events','six events · within a second'], settle:['Settlement','final 6:00 AM Eastern · wire reference'], disputes:['Disputes','$4.50 a case · the clock in the event'], sandbox:['Sandbox and certification','cert.api.dgn.com · mcp.dgn.com']};
    var SHORT={auth:'Authorization',tokens:'Tokens',events:'Events',settle:'Settlement',disputes:'Disputes',sandbox:'Sandbox'};
    var rightN=right.map(function(k){ return {k:k,row:row[k],t:N[k][0],s:N[k][1],short:SHORT[k]} }), L=[];
    L.push({k:'host',row:row.auth,t:{iso:'Authorization host',gateway:'Gateway',none:'New authorization service'}[R.host],s:{iso:'ISO 8583 on AWS · today',gateway:'kept for now, cut over later',none:'nothing yet'}[R.host],short:'Host',how:how('host')});
    L.push({k:'bus',row:row.events,t:R.events!=='poll'?'Event bus':'Poller',s:R.events!=='poll'?'your endpoint in front of it':'on a cursor, at your interval',short:R.events!=='poll'?'Bus':'Poller',how:how('events')});
    L.push({k:'ledger',row:row.settle,t:'Ledger',s:{file:'reconciles the daily file',api:'reads the API and the event',both:'the file, plus the API and event'}[R.settle],short:'Ledger',how:how('settle')});
    L.push({k:'cases',row:row.disputes,t:{api:'Case tool',portal:'Case team',email:'Inbox'}[R.disputes],s:{api:'through its own API',portal:'in the Partner Portal, nothing to build',email:'email, as today'}[R.disputes],short:{api:'Case tool',portal:'Case team',email:'Inbox'}[R.disputes],how:how('disputes')});
    if(agents) L.push({k:'agents',row:row.sandbox,t:'Claude Code · Cursor',s:'your agents',short:'Agents',how:how('lang')});
    var sdk=({node:'Node SDK',python:'Python SDK',java:'Java SDK'})[R.lang]||'SDK', E=[
      {from:'host',to:'auth',go:'host',how:how('host'),l:'REST over mutual TLS',s:{iso:'ISO 8583 mapping · two weeks, yours',gateway:'parallel run, then cut-over',none:'through the '+sdk}[R.host],steps:['mapmsg','s4','s7','ramp'],doneAt:'ramp',
        /* while the connection waits on other people: the wait line in the rail reads this */
        wait:function(){ if(R.done.s4) return null; var out=['allowlist','cert','firewall'].filter(function(k){ return longState(R,k)!=='landed' }); if(!out.length) return null; var raised=out.filter(function(k){ return longState(R,k)==='out' }); if(!raised.length) return {short:'five things to start today',text:'Nothing can connect until the allowlist, the chain and the firewall change exist, and each is someone else’s move with weeks of lead time. Day one raises all of them.'};
          var parts=out.map(function(k){ var L=R.long[k]; return L.short+' ('+L.who+', '+(longState(R,k)==='out'?'due '+fmt(L.due):'not raised')+')' }); var done=['allowlist','cert','firewall'].filter(function(k){ return longState(R,k)==='landed' }).map(function(k){ return R.long[k].short+' landed '+fmt(R.long[k].lands) });
          return {short:'waiting on '+(out.length>1?out.length+' moves':R.long[out[0]].who)+' · due '+fmt(R.long[out[out.length-1]].due), text:'Waiting on '+parts.join(', ')+'.'+(done.length?' Already landed: '+done.join(', ')+'.':'')+' The handshake is the same day they are all in.'} }},
      {from:'host',to:'tokens',go:'goals',how:how('token'),l:R.token==='now'?'token.updated':'after go-live',s:R.token==='now'?'eight cases alongside':'nothing to build now',steps:[],doneAt:R.token==='now'?'s6':null,deferred:R.token!=='now'},
      {from:'bus',to:'events',go:'events',how:how('events'),l:{webhooks:'webhooks',mcp:'webhooks',poll:'polled on a cursor'}[R.events],s:{webhooks:'signed · retried for 72 hours',mcp:'signed · retried for 72 hours',poll:'latency is your interval'}[R.events],steps:['s3'],doneAt:R.events==='poll'?'s5':'s3'},
      {from:'ledger',to:'settle',go:'settle',how:how('settle'),l:{file:'daily file over SFTP',api:'settlement API',both:'daily file · API and event'}[R.settle],s:{file:'three cases · Leah reconciles',api:'settlement.posted · two cases',both:'five cases · Leah reconciles'}[R.settle],steps:['office','s5'],doneAt:'office'},
      {from:'cases',to:'disputes',go:'disputes',how:how('disputes'),l:{api:'disputes API',portal:'worked in the portal',email:'by email'}[R.disputes],s:{api:'evidence upload · three cases',portal:'nothing to build',email:'$18 to $25 a case, as today'}[R.disputes],steps:['office','s5'],doneAt:R.disputes==='api'?'office':'s5'},
      {from:agents?'agents':'host',to:'sandbox',go:'lang',how:how('lang'),l:agents?'MCP':({sdk:sdk,curl:'cURL · Postman',postman:'Postman',mcp:'MCP'})[R.first]||sdk,s:agents?(R.runner==='agent'?'scenarios and cases':'scenarios, cards, logs'):'the first call, the scenarios, then the cases',steps:['s1','agents','mapmsg','s6'],doneAt:'s6'}
    ];
    /* what each connection means, for the note that opens when she taps it */
    var INFO={
      auth:{iso:'Your host sends authorizations to the network over REST with mutual TLS, in place of the gateway leg; the network answers in about 44 milliseconds. The mapping from your ISO 8583 messages is yours, about two weeks, and nothing else on the route waits for it. Secured when the allowlist, the chain and the firewall change have landed, certified by the core cases, ramped from May 14.',gateway:'You keep the gateway for now. The network path runs in parallel before cut-over, so the route carries a parallel-run step before production readiness.',none:'With no authorization stack yet, the SDK is the path: the client handles the token, retries and idempotency, and the route has no mapping work.'}[R.host],
      tokens:R.token==='now'?'Network tokens keep reissued cards working: token.updated arrives when a card is replaced and your stored credential keeps approving. Eight cases alongside certification and one more week.':'Network tokens keep reissued cards working through token.updated. Nothing on the route now; it can follow go-live as its own two-week track with eight cases.',
      events:{webhooks:'Six events reach your endpoint within a second of happening: every decision, each dispute with its clock, settlement with the wire reference, token updates, merchant risk, your certificate expiring. Signed with your secret, retried for 72 hours. Four certification cases; the production endpoint comes at readiness. Your agent can watch the sandbox stream while you build; production delivery is never over MCP.',mcp:'Six events reach your endpoint within a second of happening, signed and retried for 72 hours. Your agent can watch the sandbox stream while you build; production delivery is never over MCP.',poll:'You read events from the API on a cursor at your own interval, so there is no events step and no endpoint to protect. The cost is latency: a decision is as old as your interval.'}[R.events],
      settle:{file:'The daily settlement file lands on your SFTP drop after settlement is final, about 6:00 AM Eastern, in the layout your ledger reconciles today. Three cases, and a dry run the night before go-live.',api:'The settlement API and the settlement.posted event give you the same totals and the wire reference the moment they exist. Two cases.',both:'The file for the ledger, the API and settlement.posted for the morning: the same totals and the wire reference the moment they exist, and the file your ledger reconciles against. Five cases, and a dry run the night before go-live.'}[R.settle],
      disputes:{api:'Disputes land in your case tool through its API: the case, its clock, evidence upload and the outcome, at $4.50 a case through the network. Three certification cases; evidence upload is yours to wire.',portal:'Disputes are worked in the Partner Portal by Dana\u2019s team, so there is nothing to build and nothing to certify. $4.50 a case, the clock visible.',email:'Disputes keep arriving by email and get worked as today, at $18 to $25 a case through the gateway. Nothing to build; the door to the API stays open.'}[R.disputes],
      sandbox:agents?'Your agents connect to mcp.dgn.com with a scoped key of their own: the reference, test cards, logs, the 41 mapping scenarios, certification runs'+(R.runner==='agent'?', and they send the cases':'')+'. Never production, never the authorization path: the network certifies the message, not the tool that sent it.':'Your '+(({sdk:sdk,curl:'cURL and Postman',postman:'Postman'})[R.first]||sdk)+' makes the first call with your values filled in, your host runs the 41 mapping scenarios against the sandbox, and the same key runs the certification cases.'
    };
    E.forEach(function(e){ e.info=INFO[e.to] });
    return {left:L,right:rightN,edges:E} }

  /* ── the home: Getting started, before the route is drawn ── */
  var HOME={
    eyebrow:'Getting started · Brightline Bank · sandbox since March 10',
    h1:'Describe what you\u2019re connecting. I\u2019ll read it against the deal, draw the integration, and prepare <b>one step at a time</b>.',
    ask:'Describe our setup',
    ph:'Describe your setup and what you need, in your own words',
    /* what the deal and the technical review already told the network, so she needn't repeat it */
    known:'Already known from the deal: <b>in-house processing on AWS</b>, <b>ISO 8583</b> today, <b>daily settlement</b>, first ramp step <b>May 14</b>, your sandbox since <b>March 10</b>. Describe the rest: how you want events, settlement and disputes to reach you, what you build in, and what your agents should be able to do.'
  };

  /* ── choice turns: goals, then the five technical questions ── */
  var CHOICES={
    goals:{q:'What\u2019s in scope?', key:'goals', ack:function(R){ var m={auth:'authorizations in-house',events:'events as they happen',settle:'settlement in your ledger',disputes:'disputes where you work',agents:'your agents on the sandbox',token:'tokenization'}; var g=R.goals.map(function(k){ return m[k] }); return 'Got it: '+(g.length?g.join(', '):'nothing yet')+'. '+(R.goals.indexOf('agents')>-1?'For the agents that means the MCP server and a scoped key, never the authorization path. ':'')+(R.goals.indexOf('token')>-1?'Tokenization goes on the route now. ':'Tokenization stays off the route until you want it. ') }, multi:true, btn:'Redraw the route',
      say:'Pick what fits, or tell me in your words. Each one switches parts of the route on, and I’ll say which. Brightline’s deal suggests the first five; change any of them.',
      opts:[
        {k:'auth',     l:'Direct authorization path',             s:'REST over mutual TLS from your host, replacing the gateway leg.', on:'Authorization API, connectivity, the core certification cases'},
        {k:'events',   l:'Receive events as they happen',         s:'Decisions, disputes and settlement land in our systems within a second, not in tomorrow’s file.', on:'The events step and its four cases'},
        {k:'settle',   l:'Settlement delivery',                   s:'The daily file to SFTP, the settlement API, or both, with the wire reference.', on:'Settlement cases, a balancing owner'},
        {k:'disputes', l:'Dispute integration',                   s:'Cases, evidence upload and clocks through the disputes API into your case tool.', on:'Dispute API or the Partner Portal, dispute cases'},
        {k:'agents',   l:'Let our team’s agents operate the sandbox', s:'Engineers use Claude and Cursor; we want them to send test cards, read logs and run cases without a browser.', on:'The MCP server, a scoped agent key, the MCP branch on three steps'},
        {k:'token',    l:'Network tokenization',                  s:'token.updated keeps reissued cards working; card-on-file and wallets later.', on:'Eight more cases and a two-week track, now or after go-live'}
      ], next:'host'},
    host:{q:'What answers authorizations today?', key:'host', ack:function(R){ return {iso:'An ISO host, then. That\u2019s a two-week mapping on your side, and nothing else on the route waits for it.',gateway:'Keeping the gateway for now. I\u2019ll put a parallel run before cut-over on the route.',none:'Starting clean, so the SDK path and no mapping.'}[R.host] }, btn:'Next: events',
      say:'Your technical review said an in-house host on ISO 8583 through a gateway, so I’ve marked that. It sets the size of the build: the network speaks JSON over REST, and the mapping from your 1987-variant messages is a known two weeks.',
      opts:[{k:'iso', l:'In-house host on ISO 8583, behind a gateway', s:'Adds the message mapping guide and about two weeks'},{k:'gateway', l:'A gateway we’ll keep for now', s:'Adds a parallel-run step before cut-over'},{k:'none', l:'No authorization stack yet', s:'The SDK path; no mapping'}], next:'events'},
    events:{q:'How do you want to receive events?', key:'events', ack:function(R){ return {webhooks:'Webhooks it is: an endpoint, a signing secret and retries at step 3, and four cases in certification.',mcp:'Webhooks it is: an endpoint, a signing secret and retries, and four cases in certification. Your agent can watch the sandbox stream while you build.',poll:'Polling, then. No events step; I\u2019ll say what it costs in latency when we get there.'}[R.events] }, btn:'Next: settlement',
      say:'Six events carry everything that happens to you: every decision within a second, disputes with their clock, settlement with the wire reference, token updates, merchant risk, your certificate expiring. The question is how they reach you.',
      opts:[{k:'webhooks', l:'Webhooks into our endpoint or event bus', s:'An endpoint, a signing secret, retries for 72 hours'},{k:'poll', l:'Poll the API on a cursor', s:'No events step · latency is your interval'}], next:'settle'},
    settle:{q:'How should settlement reach you?', key:'settle', ack:function(R){ return {file:'The file, as your ledger expects. Three cases, and a dry run the night before go-live.',api:'The API and the event: two cases, and the wire reference the moment it exists.',both:'Both: the file for the ledger, the event for the morning. Five cases.'}[R.settle] }, btn:'Next: disputes',
      say:'Settlement is final about 6:00 AM Eastern. The file is what your ledger reconciles against today; the API and the settlement.posted event give you the same totals and the wire reference the moment they exist.',
      opts:[{k:'file', l:'Daily file to SFTP', s:'Three settlement cases · the dry-run night before go-live'},{k:'api', l:'Settlement API and settlement.posted', s:'Two cases · the wire reference within a second'},{k:'both', l:'SFTP file, plus the API and event', s:'Five cases · the file for the ledger, the event for the morning'}], next:'disputes'},
    disputes:{q:'Where will disputes be worked?', key:'disputes', ack:function(R){ return {api:'Into your case tool by API. Three cases, and evidence upload becomes yours to wire.',portal:'The Partner Portal, so nothing to build; Dana\u2019s team works them there.',email:'Email keeps the $18 to $25 a case. Nothing to build, and the door stays open.'}[R.disputes] }, btn:'Next: your tools',
      say:'Today they come by email and get worked in a spreadsheet, at $18 to $25 a case through the gateway. Through the network they cost $4.50 a case; where the work happens is yours to choose.',
      opts:[{k:'api', l:'Case tool via the disputes API', s:'Dispute endpoints and evidence upload · three cases'},{k:'portal', l:'The Partner Portal', s:'Nothing to build · Dana’s team works them there'},{k:'email', l:'Email, as today', s:'Nothing to build · the clock still runs · $18 to $25 a case'}], next:'lang'},
    lang:{q:'What does your team build in?', key:'lang', ack:function(R){ return {node:'Node it is. Every snippet from here has your values in it.',python:'Python it is. Every snippet from here has your values in it.',java:'Java it is. Every snippet from here has your values in it.',curl:'cURL and Postman: two calls, token then authorization, and a collection to fork.',mcp:'Your agents, then. The MCP server takes the first call, the sandbox and the cases; the authorization path stays on the API.'}[R.lang]+' Let me draw the route.' }, btn:'Draw my route',
      say:'This decides what every page shows you: a snippet in your language with your values in it, a Postman collection, or the one line that connects your agent. Pick the one you’ll reach for first; the others stay a click away.',
      opts:[{k:'node', l:'Node', s:'@dgn/node · the client refreshes the token for you'},{k:'python', l:'Python', s:'dgn on PyPI'},{k:'java', l:'Java', s:'com.dgn:network'},{k:'curl', l:'cURL and Postman', s:'Two calls: the token, then the authorization'},{k:'mcp', l:'Our agents over MCP', s:'mcp.dgn.com · scoped to read, send test cards, read logs and run cases · never the authorization path'}], next:'route'}
  };

  /* ── actions ── */
  var ACTS={
    key:{key:'key', step:'s1', t:'Issue your sandbox key', m:'Shown once · rotate any time · sandbox only', btn:'Review and issue',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Issue an API key', rows:[['Environment','Sandbox'],['Name','priya-dev'],['Scope','Authorizations, events, test cards, logs'],['Shown','Once, on the next screen']], note:'Keys are yours to rotate or expire from API keys. The preview key you used in March stops working in 30 days.', ok:'Issue the key'},
      approved:'Issued by you at 10:04 AM',
      receipt:{k:'Key issued · 10:04 AM', w:'sk_sandbox_7f3a… · copied', line:'<b>priya-dev</b> · sandbox · first use will show in Logs', fixed:'The key is shown once. Rotate it from API keys at any time.'},
      next:['first','s2','s3']},
    agentkey:{key:'agentkey', step:'s1', steps:['s1','agents'], t:'Issue a scoped key for your agent', m:'Read the reference · send test cards · read logs · run cases · <b>never production</b>', btn:'Review and issue',
      sheet:{eyebrow:'Confirm · Brightline Bank · Sandbox', h:'Issue an agent key', rows:[['Environment','Sandbox and certification'],['Name','brightline-agent'],['Scope','reference:read · cards:send · logs:read · cert:run'],['Not in scope','Production, keys, configuration'],['Connect','mcp.dgn.com with this key']], note:'An agent key can’t touch production or change configuration. Revoke it from API keys at any time; sessions end within a minute.', ok:'Issue the agent key'},
      approved:'Issued by you at 10:04 AM',
      receipt:{k:'Agent key issued · 10:04 AM', w:'brightline-agent · connected to mcp.dgn.com', prog:{to:100, dur:2200}, line:'<b>Your agent sent its first authorization</b> · approved · 00 · 48 ms · in Logs', fixed:'Revoke from API keys at any time.'},
      next:['first','s2','s3']},
    note:{key:'note', t:'Send the feasibility note to Dana', m:'From you · one sentence and what you ran · Dana’s Agreements page updates', btn:'Review and send',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Send a note', rows:[['To','Dana Iverson, VP of Partnerships'],['Says','Feasible. 217 sandbox calls, the reference read, the mapping is two weeks.'],['Then','Dana can sign; nothing else changes']], note:'The note sends when you confirm. You can recall it for ten minutes.', ok:'Send'},
      approved:'Sent by you at 10:07 AM',
      receipt:{k:'Sent · 10:07 AM', w:'Dana has your note', prog:{to:100, dur:600000}, line:'<b>Feasibility done</b> · Dana’s Agreements page shows it · the technical track opens at signature', cancel:'Recall', cancelDone:'Recalled', after:'Recall works for ten minutes.'},
      next:['s3','s4']},
    endpoint:{key:'endpoint', step:'s3', t:'Add the endpoint and send a test event', m:'https://staging.brightline.example/dgn/events · six events · signed', btn:'Review and add',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Add a webhook endpoint', rows:[['URL','https://staging.brightline.example/dgn/events'],['Events','All six'],['Signing secret','whsec_… shown once'],['Retries','6m · 12m · 1h · 6h · 24h · 48h, stop after 72h'],['Then','One test event, authorization.decisioned']], note:'The endpoint is staging only. The production one is added at readiness, with its own secret.', ok:'Add and send a test'},
      approved:'Added by you at 10:12 AM',
      receipt:{k:'Added · 10:12 AM', w:'Test event delivered: 200 in 180 ms', prog:{to:100, dur:1500}, line:'<b>evt_test_01</b> · authorization.decisioned · your handler verified the signature', fixed:'Deliveries, attempts and retries are in Webhooks from now on.'},
      next:['s4','local']},
    subscribe:{key:'subscribe', step:'s3', inline:true, t:'Subscribe your agent to the six events', m:'Over MCP · held while you build · no endpoint until production', btn:'Subscribe',
      approved:'On · by you at 10:12 AM',
      receipt:{k:'Subscribed · 10:12 AM', w:'Your agent receives all six events', line:'<b>First event in</b> · authorization.decisioned · your agent logged it', undo:'Unsubscribe', cancelDone:'Unsubscribed'},
      next:['s4']},
    forward:{key:'forward', inline:true, t:'Forward events to localhost:3000 while you build', m:'dgn listen · your staging secret · stops when you close it', btn:'Start forwarding',
      approved:'On · by you at 10:13 AM',
      receipt:{k:'Forwarding · 10:13 AM', w:'Events reach http://localhost:3000/dgn/events', line:'<b>dgn listen</b> · signed with your staging secret', undo:'Stop', cancelDone:'Stopped forwarding'},
      next:['s4']},
    chain:{key:'chain', step:'s4', t:'Upload the staging certificate chain', m:'brightline-staging.pem · 2 certificates · expires March 3, 2027', btn:'Review and upload',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Upload a certificate chain', rows:[['File','brightline-staging.pem'],['Certificates','Leaf, intermediate'],['Expires','March 3, 2027 · read from the leaf'],['Then','The network tries the handshake from 203.0.113.40']], note:'A chain can be replaced at any time; the previous one stays valid for an hour.', ok:'Upload'},
      approved:'Uploaded by you at 10:18 AM',
      receipt:{k:'Uploaded · 10:18 AM', w:'Handshake: 12 attempts failed in 4 minutes', prog:{to:100, dur:3200}, line:'<b>unable to get local issuer certificate</b> · from 203.0.113.40 · the chain ends one link early', fixed:'The network requires the full chain to the root. Most clients accept one link short; the network doesn’t.'},
      next:['fix']},
    chainfix:{key:'chainfix', t:'Upload the corrected chain, three certificates in order', m:'Leaf · intermediate · <b>root, which was missing</b> · the same leaf, so nothing else changes', btn:'Review and upload',
      sheet:{eyebrow:'Confirm · Brightline Bank · Staging', h:'Replace a certificate chain', rows:[['File','brightline-staging-full.pem'],['Certificates','Leaf, intermediate, root'],['Order','Leaf first, root last, as the network reads it'],['Then','Handshake retried from 203.0.113.40']], note:'Replaces the chain uploaded at 10:18. The leaf is unchanged.', ok:'Upload'},
      approved:'Uploaded by you at 10:21 AM',
      receipt:{k:'Uploaded · 10:21 AM', w:'Handshake complete · mutual TLS both ways', prog:{to:100, dur:1800}, line:'<b>3 minutes</b> from the first failure to the fix · certificate expiry March 3, 2027 recorded', fixed:'The staging chain is done. The production chain comes at readiness.'},
      next:['allow','s5']},
    allow:{key:'allow', step:'s4', inline:true, t:'Open the allowlist for 203.0.113.0/24', m:'Brightline’s staging range · staging only', btn:'Open it', say:'The last of the four. The range is the one your technical review gave; opening it is a setting of yours and takes effect at once. With it open, connectivity is done and the map says so.',
      approved:'Open · by you at 10:22 AM',
      receipt:{k:'Allowlisted · 10:22 AM', w:'203.0.113.0/24 · staging', line:'<b>Connectivity done</b> · endpoint, allowlist, chain, handshake', undo:'Close it', cancelDone:'Closed'},
      next:['s5']},
    config:{key:'config', step:'s5', t:'Confirm the configuration', m:'4 sections · 11 values · 2 still yours to set', btn:'Review and confirm',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Confirm your configuration', rows:[['Acceptance','BIN 601149, card present and not present, contactless'],['Settlement','Daily, next business day · account ····4471'],['Disputes','Routed by API to your case tool'],['Connection','staging.brightline.example · mutual TLS'],['Generates','Your certification cases']], note:'Confirming generates the cases. Changing a value later regenerates the ones it touches and says which.', ok:'Confirm'},
      approved:'Confirmed by you at 10:30 AM',
      receipt:{k:'Confirmed · 10:30 AM', w:'21 certification cases generated', prog:{to:100, dur:2600, count:{n:21}}, line:'<b id="rcA">0 of 21</b> cases · Authorization 9 · Events 4 · Settlement 5 · Disputes 3', fixed:'Cases regenerate if a value changes.'},
      next:['s6']},
    run:{key:'run', step:'s6', t:'Run the 21 cases from your host', m:'Against cert.api.dgn.com · each turns green as the network sees it', btn:'Start the run',
      sheet:{eyebrow:'Confirm · Brightline Bank · Certification', h:'Start a certification run', rows:[['Cases','21, from the configuration confirmed at 10:30'],['Sent by','Your host, to cert.api.dgn.com'],['Takes','About four minutes'],['Then','Failures show the request that failed and the fix']], note:'Runs are free and repeatable. Only the run in the booked window counts.', ok:'Start'},
      approved:'Run started by you at 10:34 AM',
      receipt:{k:'Run 1 · 10:34 AM', w:'18 of 21 passed · 3 failed on one rule', prog:{to:86, dur:3800, count:{n:18}}, line:'<b id="rcA">0 of 21</b> · SETL-03 and two fare-capping cases fail on rounding', fixed:'Failures open to the request that failed.'},
      next:['fail']},
    runAgent:{key:'runAgent', step:'s6', t:'Let your agent run the 21 cases', m:'Over MCP with the agent key · the trace shows what it sent', btn:'Start the run',
      sheet:{eyebrow:'Confirm · Brightline Bank · Certification', h:'Start a certification run', rows:[['Cases','21, from the configuration confirmed at 10:30'],['Sent by','brightline-agent, over mcp.dgn.com'],['Takes','About four minutes'],['Then','Failures show the request that failed and the fix']], note:'The agent sends the same requests your host would. Only a run in the booked window counts.', ok:'Start'},
      approved:'Run started by you at 10:34 AM',
      receipt:{k:'Run 1 · 10:34 AM', w:'18 of 21 passed · 3 failed on one rule', prog:{to:86, dur:3800, count:{n:18}}, line:'<b id="rcA">0 of 21</b> · SETL-03 and two fare-capping cases fail on rounding', fixed:'Failures open to the request that failed.'},
      next:['fail']},
    rounding:{key:'rounding', t:'Set rounding to half-even and rerun the three cases', m:'Configuration · Settlement · rounding · the network’s rule, not yours', btn:'Review and rerun',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Change a configuration value', rows:[['Section','Settlement'],['Value','Rounding: half-even (was half-up)'],['Regenerates','The three cases that failed, no others'],['Then','Rerun those three']], note:'The change applies to certification and production alike. One value, three cases.', ok:'Change and rerun'},
      approved:'Changed by you at 10:41 AM',
      receipt:{k:'Rerun · 10:41 AM', w:'21 of 21 passed', prog:{to:100, dur:2400, count:{n:21}}, line:'<b id="rcA">18 of 21</b> · clean run · ready for a window', fixed:'A clean run outside the window proves it; the window validates it.'},
      next:['window']},
    window:{key:'window', step:'s6', t:'Request the certification window, May 4 to 8', m:'Ana Okafor books it · validated end to end, settlement file included', btn:'Review and request', say:'A clean run outside the window proves it works; the window is where Ana validates it end to end, settlement file included. May 4 to 8 has both slots free and keeps go-live at May 14. The request is prepared; she confirms within a business day.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Request a certification window', rows:[['Week','May 4 to 8 · 2 of 2 slots free'],['Cases','21, clean at 10:41'],['Runs it','Ana Okafor'],['Validates','End to end, the settlement file included'],['Plan','Go-live holds at May 14']], note:'Ana confirms within a business day. You can withdraw the request until she does.', ok:'Request the window'},
      approved:'Requested by you at 10:44 AM',
      receipt:{k:'Requested · 10:44 AM', w:'May 4 to 8 · Ana Okafor', prog:{to:100, dur:600000}, line:'<b>Ana confirms within a business day</b> · go-live holds at May 14', cancel:'Withdraw', cancelDone:'Withdrawn · the week is free again', after:'Withdraw works until Ana confirms.'},
      next:['s7','tokennow']},
    prodkey:{key:'prodkey', t:'Issue the production key', m:'Shown once · separate from sandbox · activates with the network on May 14', btn:'Review and issue',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Issue an API key', rows:[['Environment','Production'],['Name','brightline-prod'],['Scope','Authorizations, events, settlement, disputes'],['Active','From activation, 6:00 AM May 14']], note:'Production keys are shown once and rotate with a seven-day overlap.', ok:'Issue the key'},
      approved:'Issued by you at 10:50 AM',
      receipt:{k:'Issued · 10:50 AM', w:'brightline-prod · inert until May 14', line:'<b>1 of 4</b> production objects', fixed:'Rotate from API keys with a seven-day overlap.'},
      next:['prodchain']},
    prodchain:{key:'prodchain', t:'Upload the production chain', m:'brightline-prod-full.pem · three certificates · expires April 2, 2027', btn:'Review and upload', say:'The production chain, full to the root this time; staging taught us that. The network tries the handshake from the production range as soon as it lands, and the expiry goes in your calendar with a reminder 30 days ahead.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Upload a certificate chain', rows:[['File','brightline-prod-full.pem'],['Certificates','Leaf, intermediate, root'],['Expires','April 2, 2027 · the network reminds you 30 days ahead'],['Then','Handshake from the production range']], note:'Full chain, as staging taught us.', ok:'Upload'},
      approved:'Uploaded by you at 10:52 AM',
      receipt:{k:'Uploaded · 10:52 AM', w:'Handshake complete · first try', line:'<b>2 of 4</b> production objects · expiry recorded', fixed:'The network will remind you on March 3, 2027.'},
      next:['prodendpoint','date']},
    prodendpoint:{key:'prodendpoint', t:'Add the production endpoint', m:'https://api.brightline.example/dgn/events · its own secret', btn:'Review and add', say:'The production endpoint gets a secret of its own, so staging and production can never verify each other’s events. It stays inert until activation; you can send it a test from Webhooks any time before the day.',
      sheet:{eyebrow:'Confirm · Brightline Bank · Production', h:'Add a webhook endpoint', rows:[['URL','https://api.brightline.example/dgn/events'],['Events','All six'],['Signing secret','New, shown once'],['Active','From activation']], note:'Separate secret from staging. Deliveries start at 6:00 AM on May 14.', ok:'Add'},
      approved:'Added by you at 10:54 AM',
      receipt:{k:'Added · 10:54 AM', w:'Production endpoint registered', line:'<b>3 of 4</b> production objects', fixed:'Test it from Webhooks any time before the day.'},
      next:['date']},
    date:{key:'date', step:'s7', t:'Confirm activation for May 14', m:'6:00 AM Eastern · Marcus is told · a dry run of the first file on May 12, with someone on call', btn:'Review and confirm', say:'The last object is the date. Confirming May 14 puts a dry run of the first settlement file on May 12 with you and Ana on call, tells Marcus and Dana, and puts the activation in the network’s change calendar. It can move until May 11.',
      sheet:{eyebrow:'Confirm · Discover Global Network', h:'Confirm an activation date', rows:[['Date','Thursday, May 14 · 6:00 AM Eastern'],['Dry run','May 12 · first settlement file · Priya and Ana on call'],['Told','Marcus Bell, Dana Iverson'],['Then','Live traffic the same day · first settlement May 15']], note:'The date can move until May 11. After that it is in the network’s change calendar.', ok:'Confirm May 14'},
      approved:'Confirmed by you at 10:56 AM',
      receipt:{k:'Confirmed · 10:56 AM', w:'Activation May 14, 6:00 AM', prog:{to:100, dur:600000}, line:'<b>4 of 4</b> production objects · dry run May 12 · Marcus and Dana told', cancel:'Move the date', cancelDone:'Date released · tell Marcus a new one', after:'Move it until May 11.'},
      next:['s8']},
    tokennow:{key:'tokennow', t:'Add tokenization to this certification', m:'8 more cases · two weeks alongside · wallets and card-on-file later', btn:'Review and add', say:'Tokenization means a card the issuer reissues keeps working for you without anyone re-entering it. It adds eight cases and about two weeks alongside the other tracks; added now it certifies with everything else, and if the run is clean by May 4 the go-live date holds. It can equally follow go-live.',
      sheet:{eyebrow:'Confirm · Brightline Bank', h:'Add a product to certification', rows:[['Product','Network tokenization'],['Cases','8 · token.updated, card-on-file, reissue'],['Time','Two weeks, alongside the other tracks'],['Go-live','Unchanged if the run is clean by May 4']], note:'It can be added after go-live instead; nothing else depends on it.', ok:'Add tokenization'},
      approved:'Added by you at 10:46 AM',
      receipt:{k:'Added · 10:46 AM', w:'29 cases now · 8 new, not yet run', line:'<b>Tokenization on the route</b> · two weeks alongside', undo:'Take it off', cancelDone:'Taken off · 21 cases'},
      next:['s7']}
  };

  /* helpers the step text uses */
  function lang(R){ return ({node:'Node',python:'Python',java:'Java',curl:'cURL',mcp:'your agent'})[R.lang] }
  function first(R){ return R.first||(R.lang==='mcp'?'mcp':R.lang==='curl'?'curl':'sdk') }
  var SNIP={
    curl:'# 1 · a token, good for the hour\ncurl -X POST https://sandbox.api.dgn.com/auth/oauth/v2/token \\\n  -u "$DGN_ID:$DGN_SECRET" -d "grant_type=client_credentials"\n\n# 2 · the call\ncurl https://sandbox.api.dgn.com/acceptance/v1/authorizations \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "X-DGN-Consumer-Secret: $DGN_CONSUMER_SECRET" \\\n  -d \'{ "amount": 5820, "currency": "USD", "merchant_id": "mch_brightline_test",\n        "pan_token": "tok_4040", "entry_mode": "contactless" }\'',
    node:'import { Network } from "@dgn/node";\n\nconst dgn = new Network({ clientId: process.env.DGN_ID, clientSecret: process.env.DGN_SECRET,\n  consumerSecret: process.env.DGN_CONSUMER_SECRET, env: "sandbox" });\n\nconst auth = await dgn.authorizations.create({\n  amount: 5820, currency: "USD", merchantId: "mch_brightline_test",\n  panToken: "tok_4040", entryMode: "contactless" });\n\nconsole.log(auth.decision, auth.responseCode); // approved 00',
    python:'from dgn import Network\n\ndgn = Network(client_id=os.environ["DGN_ID"], client_secret=os.environ["DGN_SECRET"],\n              consumer_secret=os.environ["DGN_CONSUMER_SECRET"], env="sandbox")\n\nauth = dgn.authorizations.create(amount=5820, currency="USD", merchant_id="mch_brightline_test",\n                                 pan_token="tok_4040", entry_mode="contactless")\nprint(auth.decision, auth.response_code)  # approved 00',
    java:'Network dgn = Network.builder().clientId(env("DGN_ID")).clientSecret(env("DGN_SECRET"))\n    .consumerSecret(env("DGN_CONSUMER_SECRET")).environment(Environment.SANDBOX).build();\n\nAuthorization auth = dgn.authorizations().create(AuthorizationRequest.builder()\n    .amount(5820L).currency("USD").merchantId("mch_brightline_test")\n    .panToken("tok_4040").entryMode(EntryMode.CONTACTLESS).build());\n\nSystem.out.println(auth.decision()); // APPROVED',
    postman:'Fork the collection into your workspace.\nEnvironments: sandbox, certification.\nVariables: DGN_ID, DGN_SECRET, DGN_CONSUMER_SECRET.\n\nRun: Authorizations › Create · contactless · tok_4040\n→ 200 · { "decision": "approved", "response_code": "00", "round_trip_ms": 48 }',
    mcp:'# connect your agent · Claude, Cursor or any MCP client\nmcp add dgn https://mcp.dgn.com --header "Authorization: Bearer $DGN_AGENT_KEY"\n\n# then, in your words\n> Send a contactless authorization for $58.20 with test card 4040 and show me the log line.\n\n# what the agent can do with this key\n  reference.search · cards.send · logs.query · cert.run · deliveries.list\n# what it can never do\n  anything in production · issue keys · change configuration'
  };

  /* ── the steps ── */
  var FLOWS={
    route:{ q:'Your route', step:0,
      trace:function(R){ var said=Object.keys(R.how).filter(function(k){ return R.how[k]==='said' }).length, ass=Object.keys(R.how).filter(function(k){ return R.how[k]==='assumed' }).length; return [['Reading what you wrote',said+' things said · '+ass+' assumed'],['Reading what the deal already settled','7 values · host, format, environments, rhythm'],['Drawing the route',steps(R).length+' steps · about '+weeks(R)+' weeks · '+cases(R)+' certification cases']] },
      read:function(R){ return 'Read your description, the deal, your technical review and your sandbox history · drew '+steps(R).length+' steps' },
      lead:function(R){ var L=window.OB.LABELS, ass=ORDER.filter(function(k){ return R.how[k]==='assumed'&&k!=='first'&&k!=='runner'&&k!=='goals' }).map(function(k){ return L[k].v(R).replace(/^[A-Z](?![A-Z])/,function(c){ return c.toLowerCase() }) });
        return 'I read your setup against the deal: '+steps(R).length+' steps on two tracks'+(ass.length?'. I assumed '+(ass.length>1?ass.slice(0,-1).join(', ')+' and '+ass[ass.length-1]:ass[0])+'; say so in the bar if that’s wrong':'')+'. Day one starts the five things other people hold, because connectivity decides <b>May 14</b>.' },
      blocks:['routemap'], recs:function(R){ return ['d0','why'] } },
    why:{ q:'Why these steps and not others?',
      trace:function(R){ return [['Comparing your route with the full roadmap','8 steps · '+(8-steps(R).length)+' skipped'],['Reading what each goal switched on',R.goals.length+' goals']] },
      read:'Read the roadmap against your goals', noToggle:true,
      lead:function(R){ return 'Each step is there because something you said needs it. Authorizations need connectivity and the core cases; events need their step'+(R.events==='poll'?', which polling switched off':'')+'; settlement and disputes only add cases; tokenization '+(R.token==='now'?'runs alongside':'waits until you want it')+'.' },
      recs:['s1'] },

    s1:{ q:'Start: the sandbox and your first call', step:1,
      trace:function(R){ return [['Reading your sandbox history','214 calls since March 10 · preview key'],['Preparing a key of your own','sandbox · scoped to what you build'],['Picking the first call for '+lang(R),first(R)==='mcp'?'your agent, over MCP':'the snippet with your values filled in']] },
      read:'Read your sandbox history and the deal’s identifiers', noToggle:true,
      lead:function(R){ return first(R)==='mcp'?'A scoped key for your agent, and the first call sent by it over MCP. The key reads the reference, sends test cards, reads logs and runs cases; never production.':'A key of your own, and the first call made the way you\u2019ll really make it, with your values filled in. Change the way of calling any time; the key is the same.' },
      choice:{key:'first', q:'How do you want to make the first call?', opts:function(R){ return [{k:'mcp', l:'Connect your agent (MCP)', s:'Claude, Cursor or any MCP client · scoped key'},{k:'sdk', l:(({node:'Node',python:'Python',java:'Java'})[R.lang]||'Node')+' SDK', s:'the client handles the token'},{k:'curl', l:'cURL', s:'two calls, token then authorization'},{k:'postman', l:'Postman', s:'fork the collection'}] }},
      blocks:function(R){ var f=first(R); return [{code:{title:f==='mcp'?'Connect your agent · mcp.dgn.com':f==='sdk'?lang(R)+' · @dgn client · sandbox':f==='curl'?'cURL · sandbox':'Postman · sandbox', text:SNIP[f==='sdk'?R.lang:f]||SNIP.node}}] },
      act:function(R){ return first(R)==='mcp'?'agentkey':'key' }, recs:function(R){ return first(R)==='mcp'?['scope']:['why'] } },
    first:{ q:'Show me what the first call did',
      trace:[['Reading the log','auth_7c21d0 · approved · 00 · 48 ms'],['Reading the request against the reference','5 fields · all as the reference says']],
      read:'Read one request and one response', noToggle:true,
      lead:'One authorization, approved, end to end in 48 milliseconds. The network has now seen your key, your shape and your card: step 1 done.',
      fig:{k:'The first call', big:'48 ms', d:'approved · response code <b>00</b> · tok_4040'},
      fig:{k:'The first call', big:'48 ms', d:'approved · response code <b>00</b> · tok_4040'},
      rows:{cols:['Field','Sent','Reference','Check'], items:[['amount','5820','integer, minor units','ok',true],['currency','USD','ISO 4217','ok',true],['merchant_id','mch_brightline_test','your test merchant','ok',true],['pan_token','tok_4040','a test card','ok',true],['entry_mode','contactless','enum','ok',true]], nocheck:true, tally:function(){ return '' }, done:'5 of 5 · 48 ms · approved'},
      recs:['s2','s3'] },

    s2:{ q:'Tell Dana it’s feasible', step:2,
      trace:[['Reading what you’ve done','217 calls · the reference read · events read'],['Drafting the note','one sentence and the evidence']],
      read:'Read your sandbox history and reading', noToggle:true,
      lead:'Nothing is committed by this; it lets Dana sign. Drafted from what you ran and read; change any of it.',
      draft:{title:'To Dana Iverson, drafted', words:'54 words', text:'Dana, it’s feasible. I’ve run 217 authorizations against the sandbox with a key of our own, read the authorization and event references, and the mapping from our ISO 8583 host is a known two weeks of work. Nothing in the specification blocks us. Go ahead and sign when you’re ready. Priya'},
      act:'note', recs:['first'] },

    s3:{ q:'Set up events', step:3,
      trace:function(R){ return [['Reading the six events','decision, dispute, settlement, token, risk, certificate'],['Preparing '+({webhooks:'an endpoint',mcp:'a subscription for your agent',poll:'nothing: you chose to poll'})[R.events],({webhooks:'staging · signed · retries for 72 hours',mcp:'held by your agent while you build',poll:'a cursor example instead'})[R.events]]] },
      read:'Read the event reference and your staging configuration', noToggle:true,
      lead:function(R){ return ({webhooks:'This staging endpoint receives all six events, signed; the production one comes at readiness. Add it and I\u2019ll send one test event to your handler.',mcp:'Your agent holds the subscription while you build and sees every event as it lands. The production endpoint comes at readiness.',poll:'You poll on a cursor, so there is no endpoint to add. The latency is your interval; here is the loop.'})[R.events] },
      choice:{key:'events', q:'How do you want to receive events?', opts:[{k:'webhooks', l:'Webhooks to our endpoint', s:'signed · retries for 72 hours'},{k:'mcp', l:'Subscribe from our agent (MCP)', s:'while you build'},{k:'poll', l:'Poll the API', s:'no events step'}]},
      blocks:function(R){ return R.events==='poll'?[{code:{title:'Polling · a cursor', text:'GET /acceptance/v1/authorizations?since=cursor_8f2a&limit=200\n→ 200 · { "data": [ … ], "next": "cursor_9b10" }\n\n# decisions arrive when you ask; the event would have arrived in under a second'}}]:[{rows:{cols:['Event','When','Carries'], items:[['authorization.decisioned','Within a second of the answer','decision, response code, round trip',true],['dispute.opened','When a cardholder disputes','reason code, your clock',true],['settlement.posted','About 6:00 AM Eastern','net, wire reference',true],['token.updated','When the issuer reissues','the token keeps working',true],['merchant.risk_changed','When behaviour moves','the merchant and the move',true],['certificate.expiring','30 days ahead','read from your handshake',true]], nocheck:true, tally:function(){ return '' }, done:'6 events · all on'}}] },
      act:function(R){ return ({webhooks:'endpoint',mcp:'subscribe',poll:null})[R.events] }, recs:function(R){ return R.events==='webhooks'?['local']:[] } },
    local:{ q:'Forward events to localhost while I build',
      trace:[['Reading your staging endpoint','staging.brightline.example · secret on file']],
      read:'', noToggle:true, nofold:true,
      lead:'The CLI forwards staging events to your laptop, signed with the same secret, so what you test is what production sends.',
      blocks:[{code:{title:'dgn listen', text:'dgn listen --forward http://localhost:3000/dgn/events --env staging\n# ▸ forwarding 6 events · signed with whsec_… · press q to stop'}}],
      act:'forward', recs:[] },

    s4:{ q:'Connect for real: chain and allowlist', step:4,
      trace:[['Reading connectivity for staging','endpoint registered · allowlist empty · no chain yet'],['Reading your staging certificate','brightline-staging.pem · expires March 3, 2027']],
      read:'Read your staging objects and the certificate you uploaded to the deal room', noToggle:true,
      lead:'Four things make the connection: endpoint, allowlist, your certificate chain, and a handshake both ways. Upload the chain and the network tries the handshake at once.',
      rows:{cols:['Object','State','Owner','Date'], items:[['Staging endpoint','Registered','You','today',true],['Allowlist 203.0.113.0/24','Not open','You','',false],['Certificate chain','Not uploaded','You','',false,true],['Handshake','Not tried','The network','',false]], nocheck:true, tally:function(){ return '' }, done:'1 of 4 · the chain is next'},
      act:'chain', recs:[] },
    fix:{ q:'Why did the handshake fail?',
      trace:[['Reading the twelve failures','all from 203.0.113.40 · one error'],['Matching the error','unable to get local issuer certificate · the chain ends at the intermediate'],['Reading what the network expects','leaf, intermediate, root · in that order']],
      read:'Read 12 handshakes and the chain you uploaded', noToggle:true,
      lead:'Every failure has the same cause: the chain stops at the intermediate and the network needs it to the root. Your leaf is fine; upload the full chain and it retries itself.',
      fig:{k:'Handshakes', big:'12 failed', d:'in four minutes · one cause · <b>the chain</b>'},
      fig:{k:'Handshakes', big:'12 failed', d:'in four minutes · one cause · <b>the chain</b>'},
      blocks:[{code:{title:'Expected chain · in order', text:'1  CN=staging.brightline.example      leaf          expires 2027-03-03   ✓ uploaded\n2  CN=Brightline Issuing CA 2          intermediate  expires 2029-01-15   ✓ uploaded\n3  CN=Brightline Root CA               root          expires 2034-06-01   ✗ missing\n\nerror: unable to get local issuer certificate (x509) · 12 × from 203.0.113.40'}}],
      act:'chainfix', recs:[] },

    s5:{ q:'Confirm the configuration', step:5,
      trace:function(R){ return [['Reading the four sections','Acceptance · Settlement · Disputes · Connection'],['Reading where each value came from','the agreement · your technical review · your sandbox run · your answers'],['Counting the cases this generates',cases(R)+' for your route']] },
      read:'Read the agreement, your technical review, your sandbox history and your answers', noToggle:true,
      lead:function(R){ return 'The deal and your answers filled most of this; two values are still yours. Confirming generates <b>'+cases(R)+' certification cases</b> for this route.' },
      rows:{cols:['Value','Set to','From','State'], items:[['BIN range','601149','the agreement','Set',true],['Card present and not present','Both · contactless','the agreement','Set',true],['Settlement rhythm','Daily, next business day','your technical review','Set',true],['Settlement account','····4471','the agreement','Set',true],['Rounding','half-up','your sandbox run','Yours to confirm',false,true],['Dispute routing','API to your case tool','your answer','Set',true],['Daily balancing owner','Not set','','Yours',false,true],['Connection','staging.brightline.example · mutual TLS','connectivity','Set',true]], nocheck:true, tally:function(){ return '' }, done:'9 of 11 set · 2 yours'},
      act:'config', recs:['cases'] },

    s6:{ q:'Run certification', step:6,
      trace:function(R){ return [['Reading the cases',cases(R)+' · '+(R.token==='now'?'6 groups':'5 groups')],['Preparing the run',R.runner==='agent'?'your agent sends them over MCP':'your host sends them to cert.api.dgn.com']] },
      read:'Read the generated cases and your certification credentials', noToggle:true,
      lead:function(R){ return 'The cases test your configuration and nothing generic. '+(R.runner==='agent'?'Your agent sends them over MCP with the key it has':'Your host sends them to cert.api.dgn.com')+'; a failure opens to the request, the diagnosis and the fix.' },
      choice:{key:'runner', q:'Who sends the cases?', opts:function(R){ return [{k:'host', l:'Our host', s:'to cert.api.dgn.com'},{k:'agent', l:'Our agent (MCP)', s:R.goals.indexOf('agents')>-1?'with the agent key':'needs an agent key first'}] }},
      blocks:function(R){ var g=[{l:'Authorization',s:'approvals, declines, reversals',v:9,vl:'9 cases',hot:true},{l:'Events',s:'the four events you receive',v:4,vl:'4 cases',when:R.events!=='poll'},{l:'Settlement',s:({file:'file, adjustments, totals',api:'API, event',both:'file, adjustments, totals, API, event'})[R.settle],v:({file:3,api:2,both:5})[R.settle],vl:({file:3,api:2,both:5})[R.settle]+' cases'},{l:'Disputes',s:'open, evidence, close',v:3,vl:'3 cases',when:R.disputes==='api'},{l:'Tokenization',s:'reissue, card on file',v:8,vl:'8 cases',when:R.token==='now'}].filter(function(x){ return x.when!==false }); return [{chart:{kind:'cells', title:'Your cases, by group', sub:cases(R)+' cases · generated from your configuration', rows:g}}] },
      act:function(R){ return R.runner==='agent'?'runAgent':'run' }, recs:[] },
    fail:{ q:'What failed?',
      trace:[['Reading the three failures','SETL-03 · FARE-01 · FARE-02 · one rule'],['Reading the failing request','amount 1,234.5 cents rounded up · the network rounds half-even'],['Reading your configuration','Settlement · rounding · half-up']],
      read:'Read three failed cases and the requests behind them', noToggle:true,
      lead:'One rule, not code: your host rounds half a cent up and the network settles half-even. Set rounding to half-even and the three cases regenerate; the other eighteen are untouched.',
      fig:{k:'Certification', big:'3 of 21', d:'one rule · settlement rounding · <b>1¢</b> apart'},
      fig:{k:'Certification', big:'3 of 21', d:'one rule · settlement rounding · <b>1¢</b> apart'},
      rows:{cols:['Case','Sent','Expected','Difference'], items:[['SETL-03 · reconciliation totals','$1,440,000.01','$1,440,000.00','1 cent',true,true],['FARE-01 · fare cap, daily','$12.35','$12.34','1 cent',true],['FARE-02 · fare cap, weekly','$61.75','$61.74','1 cent',true]], nocheck:true, tally:function(){ return '' }, done:'3 of 21 · one value'},
      act:'rounding', recs:[] },

    s7:{ q:'Get ready for production', step:7,
      trace:function(R){ return [['Reading your production objects','0 of '+(R.events==='webhooks'||R.events==='mcp'?4:3)+' · key, chain'+(R.events!=='poll'?', endpoint':'')+', date'],['Reading the calendar','May 14 holds · dry run May 12']] },
      read:'Read production readiness and the activation calendar', noToggle:true,
      lead:function(R){ return 'Production is '+(R.events!=='poll'?'four':'three')+' objects and a date, each prepared in turn. The date puts a dry run of the first settlement file on May 12, with you and Ana on call.' },
      rows:function(R){ return {cols:['Object','State','Owner','When'], items:[['Production key','Not issued','You','now',false,true],['Production chain','Not uploaded','You','after the key',false],['Production endpoint','Not added','You','after the chain',false,false,R.events==='poll'],['Activation date','May 14 proposed','Both','confirm',false]].filter(function(r){ return !r[6] }), nocheck:true, tally:function(){ return '' }, done:'0 of '+(R.events!=='poll'?4:3)} },
      act:'prodkey', recs:['s8'] },

    scope:{ q:'What can this key never do?',
      trace:[['Reading the agent key scopes','5 allowed · 3 never']], read:'Read the scopes of the agent key', noToggle:true,
      lead:'The key is for building and operating: the reference, test cards, logs, certification runs, deliveries. It can never touch production, issue keys or change configuration; the authorization path stays on the API, with mutual TLS.',
      rows:{cols:['Scope','Allowed','What it reaches'], items:[['reference.search','Yes','the specification, from your agent',true],['cards.send','Yes','test cards, sandbox only',true],['logs.query','Yes','sandbox and staging logs',true],['cert.run','Yes','the certification cases, repeatable',true],['deliveries.list','Yes','event deliveries and retries',true],['production.*','Never','nothing live is reachable with it',false,true],['keys.issue','Never','keys are issued here, by you',false],['config.write','Never','configuration is confirmed here, by you',false]], nocheck:true, tally:function(){ return '' }, done:'5 scopes · 3 never · revocable here at any time'},
      act:'agentkey', recs:[] },
    cases:{ q:'What are the cases?',
      trace:function(R){ return [['Reading the cases your configuration generates',cases(R)+' cases · '+(R.token==='now'?'5 groups':'4 groups')]] }, read:'Read the generated cases', noToggle:true,
      lead:function(R){ return 'Every case comes from a value you confirmed, so nothing generic is tested. Change a value later and only the cases it touches regenerate.' },
      blocks:function(R){ var g=[{l:'Authorization',s:'approvals, declines, reversals',v:9,vl:'9 cases',hot:true},{l:'Events',s:'the four events you receive',v:4,vl:'4 cases',when:R.events!=='poll'},{l:'Settlement',s:({file:'file, adjustments, totals',api:'API, event',both:'file, adjustments, totals, API, event'})[R.settle],v:({file:3,api:2,both:5})[R.settle],vl:({file:3,api:2,both:5})[R.settle]+' cases'},{l:'Disputes',s:'open, evidence, close',v:3,vl:'3 cases',when:R.disputes==='api'},{l:'Tokenization',s:'reissue, card on file',v:8,vl:'8 cases',when:R.token==='now'}].filter(function(x){ return x.when!==false }); return [{chart:{kind:'cells', title:'Your cases, by group', sub:cases(R)+' cases · generated from your configuration', rows:g}}] },
      act:'config', recs:[] },
    s8:{ q:'What happens on the morning', step:8,
      trace:[['Reading the activation plan','6:00 AM Eastern · May 14'],['Reading who is on','Priya · Ana Okafor · network operations, 24 hours']],
      read:'Read the activation plan', noToggle:true,
      lead:'At 6:00 AM the network switches Brightline Bank live; the first settlement posts the next morning at 6:02. From then this page is your Overview: what failed, what is slow, what is expiring, each with its action prepared.',
      fig:{k:'Activation', big:'May 14', d:'<b>6:00 AM</b> Eastern · you, Ana and network operations on'},
      fig:{k:'Activation', big:'May 14', d:'<b>6:00 AM</b> Eastern · you, Ana and network operations on'},
      rows:{cols:['When','What','Who'], items:[['May 12, 9:00 PM','Dry run of the first settlement file','You and Ana','',false],['May 14, 6:00 AM','Activation · production key and endpoint go live','The network','',false,true],['May 14, 6:00 to 7:00','First hour · requests, errors, deliveries by minute, here','You','',false],['May 15, 6:02 AM','First settlement posted · wire reference in settlement.posted','The network','',false]], nocheck:true, tally:function(){ return '' }, done:'The route ends here. The network takes it from there.'},
      recs:[] }
  };

  /* ── the return briefing: what moved while she was away. Built from state; the voice may be replaced by data-v2 (D.RET). ── */
  FLOWS.ret={ q:function(R){ return 'Since '+fmt(R.visited||today(R)) },
    trace:function(R){ var s=since(R), p=pending(R); return [['Reading what moved while you were away',s.length+' moved · '+p.length+' still to come'],['Re-drawing the route',steps(R).filter(function(x){ return !R.done[x.k] }).length+' steps left · first ramp step May 14']] },
    read:function(R){ return 'Read the moves since '+fmt(R.visited||today(R))+' and re-drew the route' }, noToggle:true,
    lead:function(R){ var s=since(R), p=pending(R), D=window.OB; if(D.RET&&D.RET.lead) return D.RET.lead(s.length, fmt(R.visited||today(R)), fmt(today(R)));
      if(!s.length) return 'Nothing landed while you were away'+(p.length?'; the next move is '+p[0].who+'’s on '+fmt(p[0].date):'')+'. The build track is yours whenever you are.';
      return (s.length===1?'One thing moved while you were away, and the route is re-drawn with it. ':s.length+' things moved while you were away, and the route is re-drawn with them. ')+(p.length?'The next move is '+p[0].who+'’s on '+fmt(p[0].date)+'.':'Nothing is out with other people now.') },
    rows:function(R){ var s=since(R), p=pending(R).slice(0,3), cap=function(t){ return t.charAt(0).toUpperCase()+t.slice(1) }; return {cols:['When','What','Whose'], items:s.map(function(e){ return [fmt(e.date),e.t,e.who,'',true,e.kind==='long'] }).concat(p.map(function(e){ return [fmt(e.date),cap(e.short),e.who+' · to come','',false] })), nocheck:true, tally:function(){ return '' }, done:s.length+' moved · '+p.length+' to come'} },
    recs:function(R){ var S=steps(R); for(var i=0;i<S.length;i++){ var k=S[i].k; if(R.done[k]) continue; var f=FLOWS[k], g=f&&f.gate?f.gate(R):null; if(!g) return [k] } return ['waiting'] } };

  return {SEAT:SEAT, NAV:NAV, HOME:HOME, LABELS:LABELS, ORDER:ORDER, INTENTS:INTENTS, hearGoals:hearGoals, readNeeds:readNeeds, DESC:DESC, CHOICES:CHOICES, FLOWS:FLOWS, ACTS:ACTS, STEPS:STEPS, steps:steps, weeks:weeks, weeksLeft:weeksLeft, cases:cases, forkLabel:forkLabel, map:map, DEFAULT_ROUTE:DEFAULT_ROUTE,
    lang:lang, first:first, SNIP:SNIP, fmt:fmt, fmtLong:fmtLong, addDays:addDays, daysBetween:daysBetween, today:today, dayN:dayN, longState:longState, landed:landed, events:events, pending:pending, nextMove:nextMove, applyClock:applyClock, since:since, risk:risk, FIRST_RAMP:FIRST_RAMP};
})();
