/* Brightline Assist: the content. Everything here is invented and sits on the Brightline story's
   data spine (June 2, 2026). Figures that appear in more than one place agree with each other.
   Three seats, each with a briefing and the flows the assistant can run for them. */
window.BA = (function(){
  "use strict";

  var SEATS = {
    dana:  {k:'dana', n:'Dana Iverson',   r:'VP of Partnerships',        org:'Brightline Bank', portal:'Partner Portal',   state:'Live', av:'img/av-dana.webp',   needs:['Alerts',3],   ph:'Ask about payments, settlement, disputes or a merchant'},
    marcus:{k:'marcus', n:'Marcus Bell',  r:'Operations lead',           org:'Discover Global Network', portal:'Agent Portal', state:'', av:'img/av-marcus.webp', needs:['Your turn',5], ph:'Ask about a partner, a window or a case'},
    priya: {k:'priya', n:'Priya Raghavan', r:'Lead integration engineer', org:'Brightline Bank', portal:'Developer Portal', state:'Live', av:'img/av-priya.webp',  needs:['Alerts',1],   ph:'Ask about production, an event or an endpoint'}
  };

  /* the sidebars, as the portals have them. [key, label, count, icon] under a group. */
  var NAV = {
    dana: [
      ['', [['home','Overview',0,'overview']]],
      ['Run', [['reporting','Reporting',0,'reporting'],['transactions','Transactions',0,'transactions'],['merchants','Merchants',0,'storefront'],['settlement','Settlement and fees',0,'bank'],['disputes','Disputes',2,'scale'],['fraud','Fraud',0,'shield'],['alerts','Alerts',3,'bell']]],
      ['Grow', [['products','Products',0,'cube'],['notices','Notices',1,'megaphone'],['insights','Insights',0,'activity'],['add','Add a product',0,'plus']]],
      ['Account', [['integrations','Integrations',0,'plug'],['team','Team',0,'team'],['company','Company',0,'building'],['agreements','Agreements',0,'agreement'],['dgn','Your Discover team',0,'people']]]
    ],
    marcus: [
      ['Work', [['home','Your turn',5,'flag'],['alerts','Alerts',3,'bell'],['cases','Cases',5,'chat'],['inbound','Inbound',1,'onboarding']]],
      ['Book', [['partners','Partners',0,'book'],['brightline','Brightline Bank',0,'building'],['find','Find',0,'search'],['performance','Performance',0,'activity'],['transactions','Transactions',0,'transactions']]],
      ['Schedule', [['windows','Windows',0,'calendar'],['golives','Go-lives',0,'rocket']]],
      ['Network', [['compliance','Compliance',2,'badge'],['team','Your team',0,'team'],['report','Book report',0,'reporting']]]
    ],
    priya: [
      ['', [['home','Overview',0,'overview']]],
      ['Build', [['api','API reference',0,'docs'],['events','Event reference',0,'events'],['cards','Test cards',0,'card']]],
      ['Connect', [['keys','API keys',0,'keys'],['webhooks','Webhooks',0,'webhook'],['config','Configuration',0,'config']]],
      ['Launch', [['cert','Certification',0,'badge'],['golive','Go-live',0,'live']]],
      ['Monitor', [['logs','Logs',0,'terminal'],['alerts','Alerts',1,'bell'],['changelog','Changelog',0,'history']]],
      ['', [['support','Support',0,'lifebuoy']]]
    ]
  };

  /* series the charts draw */
  var CNP_CEDAR = [95.0,95.3,95.1,95.4,95.2,95.0,95.3,95.2,95.4,95.1,95.3,95.2,95.1,93.8];
  var DAYS14 = ['May 20','May 21','May 22','May 23','May 24','May 25','May 26','May 27','May 28','May 29','May 30','May 31','June 1','June 2'];
  var P99 = [168,172,480,455,190,176,164,160,158,162,166,170,172,168,166,164,162,160,158,160,164,166,170,168];
  var HOURS = ['12 AM','1','2','3','4','5','6','7','8','9','10','11','12 PM','1','2','3','4','5','6','7','8','9','10','11'];

  /* ── the briefings: what the assistant wrote about today, per seat ── */
  var HOME = {
    dana: {
      eyebrow:'Your briefing · Tuesday, June 2 · 9:40 AM',
      h1:'Yesterday settled <b>$1.44M</b> on 48,211 authorizations. One dispute needs your evidence by June 11, and one approval drop is already in hand.',
      figs:[['$1,440,000','Settled, June 2','posted 6:02 AM · wire FW-20260602-8888'],['48,211','Authorizations, yesterday','96.8% approved'],['90.9%','Card not present, yesterday','<span class="gn-status is-bad">down 1.4 points</span> on the seven-day rate'],['2','Disputes need a response','nearest June 11, 9 days']],
      lead:{lab:'Disputes', num:'9 days', numTone:'', say:'until evidence is due on dsp_41e, the <b>$310.00</b> Cedar Books charge disputed as card-not-present fraud. The record already holds a receipt, tracking to the billing address and two customer emails: enough to counter.',
        rows:[['Receipt or invoice','On file'],['Shipping with tracking','On file'],['Customer communication','On file'],['Signed delivery confirmation','Not on file, optional']],
        btn:'Prepare the counter', flow:'dispute'},
      cards:[
        {lab:'Card not present', num:'0.4%', say:'of your volume has scored as riskier than it is since Monday night. Cedar Books moved to a new gateway that sends the wrong e-commerce indicator. Marcus Bell has had it since 6:20 AM; the gateway is on a call at 11:00.', flow:'cnp'},
        {lab:'Notices', num:'August 15', say:'is the acknowledgement date for Release 26.2, which shortens the dispute response window from 30 to 20 days on September 1.', flow:'release'}
      ],
      offers:['cnp','dispute','release'],
      dos:['Export yesterday’s transactions','Invite someone']
    },
    marcus: {
      eyebrow:'Your briefing · Tuesday, June 2 · 9:40 AM',
      h1:'Five things are yours today. The nearest is Brightline Bank’s gateway call at <b>11:00</b>. Two partners are behind their plans by <b>35 days</b> between them.',
      figs:[['5','Your turn','nearest 11:00 AM'],['3','Waiting on a partner','longest 6 days, Marlow & Third'],['2 of 3','Behind plan, before go-live','35 days lost'],['1','Review due','Northbank Payments, Q2']],
      lead:{lab:'Halcyon Acquiring', num:'21 days', say:'behind at the certification window, and the move is the network’s. Grace Lindqvist asked for a window on May 5 and none is booked. June 1 to 5 has one of two slots free; booking it lands Halcyon on June 11.',
        rows:[['Configuration confirmed','April 30'],['Window requested','May 5'],['Target go-live','May 21, now June 11'],['June 1 to 5','1 slot free']],
        btn:'Book the window', flow:'waiting'},
      cards:[
        {lab:'Marlow & Third', num:'Day 6 of 10', say:'on the settlement account letter, their move. Devin Marlow asked yesterday which format the network accepts, and nobody has answered. After day 10 the plan moves.', flow:'waiting'},
        {lab:'Verrill Commerce', num:'4 days', say:'to decide a waiver. Verrill asks to keep a 24-hour incident notice window under Participation rules v9 until March 31, 2027. Requested June 1.', flow:'waiver'}
      ],
      offers:['waiting','waiver'],
      dos:['Start Northbank’s review','Message Grace Lindqvist']
    },
    priya: {
      eyebrow:'Your briefing · Tuesday, June 2 · 9:40 AM',
      h1:'Production answered <b>48,211</b> authorizations yesterday at a median of 44 ms. One delivery is failing, and one hour was slow.',
      figs:[['48,211','Requests, yesterday','production'],['1,543','Errors','3.2% · all 4xx'],['44 ms','p50 latency','p99 210 ms'],['48,402','Webhook deliveries','<span class="gn-status is-bad">1 failing</span>']],
      lead:{lab:'Latency', num:'480 ms', say:'p99 between 2:00 and 3:00 AM, against 168 ms the hour before. The network answered 146 authorizations under stand-in in that window, within your rules. p50 held at 52 ms and nothing failed.',
        rows:[['2:00 to 3:00 AM','p99 480 ms · 89 under stand-in'],['3:00 to 4:00 AM','p99 455 ms · 57 under stand-in'],['4:00 AM onward','p99 190 ms · 0'],['Errors in the window','0']],
        btn:'What happened?', flow:'slow'},
      cards:[
        {lab:'Deliveries', num:'3 attempts', say:'on evt_89f5b9, an authorization.decisioned event from June 1, 11:52 AM. Your endpoint returned 503 each time. The next retry is 12:20 PM; retries stop on June 4.', flow:'delivery'},
        {lab:'Certificates', num:'April 2, 2027', say:'is when the production certificate expires, read off your handshake. The network reminds you 30 days ahead. Nothing to do now.', flow:null}
      ],
      offers:['slow','delivery'],
      dos:['Create a key','Open deliveries']
    }
  };

  /* ── the flows. A flow is a question, the work in the open, what was read, a finding, the argument,
     the composed blocks, what the assistant prepared, and the question it proposes next. ── */
  var FLOWS = {

    cnp: {
      q:'Why did card-not-present approvals fall?',
      trace:[['Reading card-not-present approvals, fourteen days','90.9% · down 1.4 points'],
             ['Comparing each merchant with its own seven-day rate','1 of 6 moved'],
             ['Matching the move to a change in the record','Cedar Books · gateway · June 1'],
             ['Checking the alert','In hand · Marcus Bell']],
      read:'Read fourteen days of approvals, six merchants and one alert · as of 9:40 AM',
      query:'approvals   where channel = card_not_present and day in last 14 group by merchant\nmerchants   where partner = brightline compare rate(1d) with rate(7d)\nrecord      where object = merchant and field = gateway and changed >= 2026-06-01\nalerts      where partner = brightline and status = in_hand',
      find:'One merchant moved it.',
      say:'Cedar Books changed gateway on June 1 and its card-not-present approval fell from <b>95.2%</b> to <b>93.8%</b>. The new gateway sends the wrong e-commerce indicator, so its transactions score as riskier than they are. The other five merchants are level. It is <b>0.4%</b> of your volume, and Marcus Bell has had it since 6:20 AM.',
      blocks:[
        {t:'twoup', fig:['90.9%','Card not present, yesterday','down 1.4 points on the seven-day rate · 91.8% median of participants like you'],
          chart:{kind:'line', title:'Cedar Books, card-not-present approval', sub:'Fourteen days · gateway changed June 1', values:CNP_CEDAR, labels:DAYS14, fmt:function(v){return v.toFixed(1)+'%'}, min:92, max:96, mark:12, markLabel:'Gateway changed'}},
        {t:'table', cols:['Merchant','Card not present','Yesterday','Seven days','Gateway'], num:[1,2,3],
          rows:[['Cedar Books','97%','93.8%','95.2%','<span class="gn-status is-warn">Changed June 1</span>'],['Halcyon Home','88%','95.9%','95.8%','Direct'],['Northgate Cycles','73%','92.8%','92.9%','Direct'],['Fern & Co','64%','97.2%','97.1%','Direct'],['Marlow Goods','41%','96.4%','96.3%','Direct'],['Tallow & Wick','12%','96.0%','96.1%','Direct']], hot:0},
        {t:'alert', title:'Card-not-present approvals fell 1.4 points', when:'June 2, 6:12 AM · Acceptance', status:['In hand','is-good'],
          steps:[['6:12 AM','Noticed the drop against fourteen days of your baseline'],['6:14 AM','Isolated it to one merchant and one gateway'],['6:20 AM','Assigned Marcus Bell'],['11:00 AM','Marcus has the gateway on a call']],
          close:'Nothing is yours to do. Marcus will confirm the fix here.'}
      ],
      acts:[{kind:'inline', t:'Watch Cedar Books', d:'Hear here and by email when its card-not-present rate is back above 95%.', btn:'Watch', done:'Watching Cedar Books. You’ll hear when its rate is back above 95%.', undone:'Watch removed.'}],
      next:'cnpTx'
    },

    cnpTx: {
      q:'Which Cedar Books transactions were declined yesterday?',
      trace:[['Filtering yesterday’s card-not-present declines','5 declines'],
             ['Checking each decline code against your retry rule','2 retry tomorrow']],
      read:'Read five declines and your acceptance settings · as of 9:41 AM', steps:'2 steps', noToggle:true,
      find:'Three of the five were at Cedar Books.',
      say:'Two were code 51, insufficient funds, and your rule retries those once after 24 hours, so they run again tomorrow morning. One was code 05, do not honor, which is never retried. The gateway’s indicator did not cause these three: the issuer declined them on the account, and it would have either way.',
      blocks:[
        {t:'table', cols:['Time','Merchant','Amount','Code','Retry'], num:[2],
          rows:[['9:14 AM','Cedar Books','$41.20','51 · Insufficient funds','Tomorrow, 9:14 AM'],['9:52 AM','Cedar Books','$22.60','05 · Do not honor','<span class="gn-status is-quiet">Never</span>'],['10:31 AM','Cedar Books','$68.90','51 · Insufficient funds','Tomorrow, 10:31 AM'],['11:08 AM','Halcyon Home','$412.00','05 · Do not honor','<span class="gn-status is-quiet">Never</span>'],['8:47 AM','Marlow Goods','$98.00','51 · Insufficient funds','Tomorrow, 8:47 AM']],
          foot:'5 of 1,543 declines yesterday were card not present'}
      ],
      next:'dispute'
    },

    dispute: {
      q:'Prepare the counter for the Cedar Books dispute',
      trace:[['Reading dsp_41e','$310.00 · fraud, card not present · due June 11'],
             ['Reading the transaction, auth_6e02a1','May 22, 9:41 PM · postal code matched'],
             ['Checking the evidence template on file','Physical goods, shipped'],
             ['Gathering what the record holds','3 of 4 items']],
      read:'Read one case, one transaction, the evidence template and Cedar Books’ delivery record · as of 9:41 AM',
      query:'disputes    where id = dsp_41e\npayments    where id = auth_6e02a1 include avs, token, capture, settlement\nsettings    where partner = brightline and key = evidence_template\nevidence    where merchant = mch_cedar and order = auth_6e02a1',
      find:'You can counter this, and the draft is ready.',
      say:'The cardholder says the purchase was not theirs. The record holds a receipt, shipping with tracking to the billing address, delivered May 26, and two emails from the customer after delivery. AVS matched the postal code, and the same card was used at Cedar Books twice before without a dispute. A signed delivery confirmation is the one item the template asks for that is not on file, and it is optional. Nothing is sent until you approve it.',
      blocks:[
        {t:'doc', items:[['Case','dsp_41e'],['Reason','4837 · Fraud, card not present'],['Amount','$310.00'],['Transaction','auth_6e02a1 · May 22, 9:41 PM'],['Stage','Chargeback'],['Respond by','June 11 · 9 days']]},
        {t:'checks', title:'Evidence, against the template for physical goods, shipped', rows:[
          ['Receipt or invoice','Order 4471-0522, Cedar Books, May 22','On file','is-good'],
          ['Shipping documentation with tracking','1Z 84A 221 · delivered May 26 to the billing address','On file','is-good'],
          ['Customer communication','Two emails from the cardholder, May 27 and May 29','On file','is-good'],
          ['Signed delivery confirmation','Not requested by the carrier','Not on file','is-quiet']]},
        {t:'draft', title:'Statement, drafted', words:'84 words', text:'The cardholder placed order 4471-0522 on May 22 at 9:41 PM for $310.00. The billing postal code matched. The order shipped May 23 by UPS, tracking 1Z 84A 221, and was delivered May 26 to the billing address. On May 27 and May 29 the cardholder emailed Cedar Books about the order from the address on the account. The same card was used at Cedar Books on April 3 and May 9 without dispute. We ask that the chargeback be reversed.'}
      ],
      acts:[{kind:'sheet', t:'Counter dsp_41e with three items of evidence', d:'<b>$310.00</b> · Cedar Books · due June 11', btn:'Review and submit',
        sheet:{eyebrow:'Confirm · Brightline Bank', h:'Submit a counter', big:'$310.00',
          rows:[['Case','dsp_41e · Cedar Books'],['Evidence','Receipt, shipping with tracking, customer communication'],['Statement','84 words, as drafted'],['If lost','Dispute fee $4.50 applies']],
          note:'A counter can’t be withdrawn once submitted. The issuer decides within 45 days.', ok:'Submit counter'},
        receipt:{k:'Counter submitted · 9:52 AM', w:'dsp_41e is under review', rows:['Decision by July 17','You’ll hear here and by email'], fixed:'Submitted counters can’t be withdrawn.'},
        approved:'Submitted by you at 9:52 AM'}],
      next:'release'
    },

    release: {
      q:'Does Release 26.2 apply to us?',
      trace:[['Reading Release 26.2','Effective September 1 · acknowledge by August 15'],
             ['Reading your dispute set-up','Routing, reminders, template, auto-accept'],
             ['Checking your response times, last 90 days','Median 11 days'],
             ['Checking Priya’s integration','dispute.opened · within a second']],
      read:'Read one release, four settings, 61 closed cases and one webhook endpoint · as of 9:43 AM',
      query:'releases    where id = r262 include clauses\nsettings    where partner = brightline and product = disputes\ndisputes    where partner = brightline and closed in last 90 days measure response_days\nwebhooks    where partner = brightline and event = dispute.opened',
      find:'It applies to every dispute from September 1, and you already meet it.',
      say:'The response window shortens from 30 to 20 days on all six merchants, card present and card not present. Your median response over the last 90 days is <b>11 days</b>, and dispute.opened reaches your case inbox within a second, so nothing in Priya’s integration changes. One setting was built for the 30-day window: your reminders at 7, 3 and 1 day before the deadline. At 20 days the first reminder lands on day 13, which is late for a counter that needs shipping documents. The acknowledgement is due <b>August 15</b>.',
      blocks:[
        {t:'figs', items:[['11 days','Median response','61 cases closed in 90 days'],['3','Open cases','2 need a response'],['20 days','Window from September 1','30 days today']]},
        {t:'table', cols:['Clause','Today','From September 1','Brightline Bank'], num:[],
          rows:[['Response window','30 days','20 days','Median 11 days'],['Applies to','—','All disputes, all channels','6 merchants, 3 open cases'],['Routing','Case inbox and webhook','Unchanged','dispute.opened within a second'],['Deadline reminders','7, 3 and 1 day before','Set by you','<span class="gn-status is-warn" id="remState">Built for 30 days</span>'],['Acknowledgement','—','By August 15','<span class="gn-status is-warn" id="ackState">Not yet</span>']]}
      ],
      acts:[
        {kind:'inline', t:'Move reminders to 5, 3 and 1 day', d:'Before each deadline, to the dispute contact and the case inbox. Applies from the next case.', btn:'Apply', done:'Reminders now go at 5, 3 and 1 day.', undone:'Reminders back to 7, 3 and 1 day.', effect:{id:'remState', on:['5, 3 and 1 day','is-good'], off:['Built for 30 days','is-warn']}},
        {kind:'sheet', t:'Acknowledge Release 26.2 for Brightline Bank', d:'Records that Brightline Bank has read the release and accepts September 1 · signed as Dana Iverson', btn:'Review and acknowledge',
          sheet:{eyebrow:'Confirm · Brightline Bank', h:'Acknowledge Release 26.2', big:'20 days',
            rows:[['Release','26.2 · dispute response window'],['Effective','September 1, 2026'],['Signed as','Dana Iverson, VP of Partnerships'],['Visible to','Marcus Bell and the network’s compliance record']],
            note:'An acknowledgement is recorded against this version and can’t be withdrawn. If Brightline can’t meet a clause, request a waiver instead.', ok:'Acknowledge'},
          receipt:{k:'Acknowledged · 9:55 AM', w:'Release 26.2 is on Brightline Bank’s record', rows:['Dispute response window: 20 days from September 1','The notice has left your list'], fixed:'Recorded against version 26.2.'},
          approved:'Acknowledged by you at 9:55 AM', effect:{id:'ackState', on:['Acknowledged June 2','is-good']}}
      ],
      next:null
    },

    waiting: {
      q:'Who is waiting on us?',
      trace:[['Reading the book','8 partners · 3 before go-live'],
             ['Checking whose move each open item is','2 of 9 are the network’s'],
             ['Reading the certification calendar','June 1 to 5 · 1 slot free'],
             ['Reading open cases','1 unowned · 1 day']],
      read:'Read eight plans, nine open items, the certification calendar and five cases · as of 9:40 AM',
      query:'plans       where stage < live measure days_behind, next_step, whose_move\nitems       where status = open group by whose_move\nwindows     where week >= 2026-06-01 measure capacity, booked\ncases       where owner is null or waiting_on = network',
      find:'Two things wait on the network. Everything else waits on a partner, or on you.',
      say:'Halcyon Acquiring asked for a certification window on May 5 and none is booked; its plan has slipped <b>21 days</b> and June 1 to 5 has a slot. Devin Marlow asked yesterday which bank-letter format the network accepts, and the case has no owner. Five items are yours and in hand, the nearest at 11:00. Two are a partner’s move: Marlow’s letter itself, and Tallgrass’s three rounding cases.',
      blocks:[
        {t:'table', cols:['Partner','Waiting for','Since','Whose move'], num:[],
          rows:[['Halcyon Acquiring','Certification window','May 5 · 28 days','<span class="gn-status is-warn">The network · not booked</span>'],
                ['Marlow & Third','An answer on bank-letter format, case_1182','June 1 · 1 day','<span class="gn-status is-warn">The network · no owner</span>'],
                ['Brightline Bank','Gateway fix, card not present','June 2, 6:20 AM','You · call at 11:00'],
                ['Ostrand Financial','Review of the token program request','June 2, 8:05 AM','You · due tomorrow'],
                ['Verrill Commerce','Reply on the re-certification window, case_1174','May 29 · <span class="gn-status is-bad">3 days overdue</span>','You'],
                ['Verrill Commerce','Waiver decision, wv_107','June 1','You · due in 4 days'],
                ['Northbank Payments','Quarterly review, Q2','May 30','You · due in 28 days'],
                ['Marlow & Third','Settlement account letter','March 30 · <span class="gn-status is-bad">6 days overdue</span>','Marlow & Third'],
                ['Tallgrass Payments','A clean certification run, 3 cases','June 1','Tallgrass Payments']], hot:[0,1]},
        {t:'cal', weeks:[['May 25 to 29',[['Verrill Commerce, re-certification','12 cases']],0],['June 1 to 5',[['Tallgrass Payments','31 cases']],1],['June 8 to 12',[],2]], cap:2}
      ],
      acts:[
        {kind:'sheet', t:'Book Halcyon Acquiring into June 1 to 5', d:'Ana Okafor runs it · Grace Lindqvist is notified · go-live moves to June 11', btn:'Review and book',
          sheet:{eyebrow:'Confirm · Discover Global Network', h:'Book a certification window', big:'June 1 to 5',
            rows:[['Partner','Halcyon Acquiring'],['Cases','From the configuration confirmed April 30'],['Runs it','Ana Okafor'],['Notified','Grace Lindqvist, COO'],['Plan','Go-live moves from May 21 to June 11']],
            note:'Booking takes the week’s last slot. Halcyon’s plan and Grace Lindqvist’s calendar update when you confirm.', ok:'Book the window'},
          receipt:{k:'Booked · 9:48 AM', w:'Halcyon Acquiring, June 1 to 5', rows:['Grace Lindqvist notified','Plan now lands June 11'], undo:'Undo releases the slot and tells Grace.', undoDone:'Booking released. Grace Lindqvist told.'},
          approved:'Booked by you at 9:48 AM', effect:{id:'calJune',on:['Halcyon Acquiring','booked']}},
        {kind:'sheet', t:'Reply to Devin Marlow and take the case', d:'case_1182 · drafted from the answer the team gives for bank letters', btn:'Review and send',
          quote:'A signed letter on the bank’s paper, or the bank’s own portal confirmation exported as a PDF with the account name and number visible. Either is accepted.',
          sheet:{eyebrow:'Confirm · Discover Global Network', h:'Send a reply', big:'',
            rows:[['To','Devin Marlow, Founder, Marlow & Third'],['Case','case_1182 · you become the owner'],['Reply','A signed letter on the bank’s paper, or the bank’s own portal confirmation exported as a PDF with the account name and number visible. Either is accepted.'],['Also','The settlement-account step carries the formats from now on']],
            note:'The reply goes by email and to the case thread. It can’t be recalled.', ok:'Send reply'},
          receipt:{k:'Sent · 9:49 AM', w:'case_1182 is yours', rows:['Devin Marlow has the accepted formats','The case clock is paused while Marlow holds it'], fixed:'Sent replies can’t be recalled.'},
          approved:'Sent by you at 9:49 AM'}
      ],
      next:'waiver'
    },

    waiver: {
      q:'Have we granted a waiver like Verrill’s before?',
      trace:[['Reading wv_107','Incident notice window · until March 31, 2027'],
             ['Reading the waivers on file','3 · none on this clause'],
             ['Reading the policy','Up to 6 months'],
             ['Reading Verrill’s record','Live since October 30 · no incidents']],
      read:'Read one request, three waivers, one policy clause and Verrill’s record · as of 9:50 AM',
      query:'waivers     where id = wv_107\nwaivers     where release = v9 or clause in (inc12, dsp20)\npolicy      where release = v9 and clause = inc12 measure max_term\npartners    where id = verrill measure incidents(12m), live_since, desk_hours',
      find:'Nothing on this clause yet. The nearest precedent is Northbank’s, and it fits.',
      say:'Northbank Payments’ dispute-window waiver was approved on May 20 for twelve months on an operational constraint: a processor whose evidence cycle runs 25 days. Verrill asks on the same grounds, a desk staffed twelve hours a day, for a term inside the six-month limit. Cedarline’s request on the dispute window was declined in April because the reason was tooling being replaced, which the clause already allows a year for. Verrill has had no incidents since going live on October 30. The decision is yours; a draft is ready either way.',
      blocks:[
        {t:'table', cols:['Waiver','Partner','Clause','Reason','Term','Decision'], num:[],
          rows:[['wv_107','Verrill Commerce','Incident notice window','Desk staffed twelve hours a day','Until March 31, 2027','<span class="gn-status is-warn">Requested June 1</span>'],
                ['wv_104','Northbank Payments','Dispute response window','Processor evidence cycle runs 25 days','Until June 30, 2027','<span class="gn-status is-good">Approved</span> May 20 · Marcus Bell'],
                ['wv_102','Cedarline','Dispute response window','Issuer-side tooling being replaced','Until December 31, 2026','<span class="gn-status is-bad">Declined</span> April 3 · Marcus Bell']], hot:0},
        {t:'doc', items:[['Clause','Incident notice window · 24 to 12 hours from January 1, 2027'],['Term asked','Until March 31, 2027 · 3 months'],['Limit','Up to 6 months'],['Verrill’s desk','7 AM to 7 PM ET, staffed'],['Incidents, 12 months','None'],['Live since','October 30, 2025']]}
      ],
      acts:[{kind:'sheet', t:'Approve wv_107 until March 31, 2027', d:'On condition the twelve-hour desk schedule stays on file · the reasoning is recorded where Verrill reads it', btn:'Review and decide',
        sheet:{eyebrow:'Confirm · Discover Global Network', h:'Decide a waiver', big:'Until March 31, 2027',
          rows:[['Partner','Verrill Commerce'],['Clause','Incident notice window stays 24 hours'],['Condition','Desk schedule on file; review before expiry'],['Precedent','wv_104, Northbank Payments'],['Visible to','Ana Verrill and the compliance record']],
          note:'A decision is recorded against the request and both sides read the reasoning. To change it later, open the waiver.', ok:'Approve', alt:'Decline'},
        receipt:{k:'Approved · 9:52 AM', w:'wv_107 · Verrill Commerce keeps a 24-hour window until March 31, 2027', rows:['Ana Verrill notified','Reviewed before expiry'], fixed:'To change it, open the waiver.'},
        receiptAlt:{k:'Declined · 9:52 AM', w:'wv_107 · Verrill Commerce moves to the 12-hour window on January 1', rows:['Ana Verrill notified with the reasoning','Verrill may ask again with a desk schedule'], fixed:'To change it, open the waiver.'},
        approved:'Decided by you at 9:52 AM'}],
      next:null
    },

    slow: {
      q:'What happened between 2 and 3 AM?',
      trace:[['Reading yesterday’s production log by hour','24 hours · p99 by hour'],
             ['Matching the rise to an issuer','One issuer · 2:00 to 3:10 AM'],
             ['Counting authorizations answered under stand-in','146'],
             ['Checking errors and p50 in the window','0 errors · p50 52 ms']],
      read:'Read 48,211 production requests, your stand-in rules and one issuer’s answer times · as of 9:40 AM',
      query:'log         where env = production and day = 2026-06-01 group by hour measure p50, p99, errors\nanswers     where hour in (02, 03) group by issuer measure p99\nlog         where decision_source = stand_in and hour in (02, 03)\nsettings    where partner = brightline and key = stand_in',
      find:'One issuer slowed. Nothing is yours to do.',
      say:'Between 2:00 and 3:10 AM one issuer’s answers ran past your timeout, and p99 reached <b>480 ms</b>. The network answered <b>146</b> authorizations under stand-in in that window, within your rules: card present, under $250. p50 held at 52 ms, no request failed, and the issuer’s answers were back under 60 ms by 3:10. The two stand-in answers over $200 are listed below.',
      blocks:[
        {t:'chart', chart:{kind:'bars', title:'p99 by hour, yesterday', sub:'Production · milliseconds', values:P99, labels:HOURS, fmt:function(v){return Math.round(v)+' ms'}, highlight:[2,3]}},
        {t:'figs', items:[['146','Answered under stand-in','2:00 to 3:10 AM'],['52 ms','p50 in the window','44 ms for the day'],['0','Errors in the window','1,543 for the day, all 4xx']]},
        {t:'table', cols:['Time','Authorization','Merchant','Amount','Answer','Source'], num:[3,4],
          rows:[['2:41 AM','auth_71a9f0','Halcyon Home','$238.00','483 ms','Stand-in'],['2:58 AM','auth_71a9f4','Marlow Goods','$214.50','471 ms','Stand-in']], foot:'144 more under $200, all approved within your rules'}
      ],
      next:'delivery'
    },

    delivery: {
      q:'Is the failing delivery related?',
      trace:[['Reading evt_89f5b9','authorization.decisioned · June 1, 11:52 AM'],
             ['Reading your endpoint’s answers','503 · 3 attempts'],
             ['Checking the other deliveries that day','48,401 · 200 first time']],
      read:'Read one event, three attempts and a day of deliveries · as of 9:41 AM', steps:'3 steps', noToggle:true,
      find:'No. Your endpoint returned 503 three times for one event, nine hours before the slow hour.',
      say:'evt_89f5b9 is an authorization.decisioned event from June 1, 11:52 AM. Your endpoint at api.brightline.example/dgn/events answered 503 at 11:52, 11:58 and 12:10, and every other delivery that day returned 200 first time, so the endpoint was briefly unavailable rather than wrong. The network retries at 12:20 PM today and stops after three days, on June 4. A retry now is safe: the event carries its idempotency key, and your handler has accepted 48,401 like it.',
      blocks:[
        {t:'doc', items:[['Event','evt_89f5b9'],['Type','authorization.decisioned'],['Endpoint','api.brightline.example/dgn/events'],['Idempotency','Event id in the header'],['Next retry','June 2, 12:20 PM'],['Stops','June 4, 11:52 AM']]},
        {t:'table', id:'attempts', cols:['Attempt','Time','Response','Took'], num:[3],
          rows:[['1','June 1, 11:52 AM','<span class="gn-status is-bad">503</span>','30 s · timeout'],['2','June 1, 11:58 AM','<span class="gn-status is-bad">503</span>','30 s · timeout'],['3','June 1, 12:10 PM','<span class="gn-status is-bad">503</span>','30 s · timeout']]}
      ],
      acts:[{kind:'inline', t:'Retry evt_89f5b9 now', d:'Delivers the event again with the same idempotency key.', btn:'Retry now', done:'Delivered. 200 in 212 ms.', once:true,
        effect:{row:'attempts', add:['4','June 2, 9:41 AM','<span class="gn-status is-good">200</span>','212 ms']}}],
      next:null
    }
  };

  return {SEATS:SEATS, NAV:NAV, HOME:HOME, FLOWS:FLOWS};
})();
