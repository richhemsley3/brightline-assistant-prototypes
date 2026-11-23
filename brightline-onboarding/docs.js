/* Brightline Onboarding: the reference pages the reading pane opens. Six pages, each written against Priya's route.
   refs maps a turn to the pages it draws on; the first is the one the turn is about. Everything is invented. */
window.OB_DOCS=(function(){
  "use strict";
  var pages={
    auth:{ crumbs:['API reference','Authorizations','Response fields'], title:'The authorization response',
      intro:'Every authorization returns a decision in about 44 milliseconds over REST with mutual TLS. Your host reads three fields to answer the terminal and settle correctly.',
      here:'Your three mapping misses returned the amount asked. On a partial approval the network expects the approved amount, which is <code>amount_authorized</code> on the response, not <code>amount</code> on the request.',
      table:{cols:['Field','Type','What to do with it'], rows:[
        ['<code>decision</code>','approved · declined · partial','Answer the terminal; on partial, read the approved amount'],
        ['<code>amount_authorized</code>','integer, minor units','Settle for this, never for the amount asked'],
        ['<code>response_code</code>','two digits','00 approved, 05 declined, 10 partial, 91 issuer unavailable'],
        ['<code>round_trip_ms</code>','integer','Log it; the ramp threshold is 120 at p99']]},
      walkTitle:'Walkthrough · handle a partial approval',
      walk:['Read <code>decision</code>. On <code>partial</code>, take <code>amount_authorized</code> as the approved amount.','Map it to ISO 8583 field 4 on the response to your terminal, and keep the asked amount in field 95 so the terminal can prompt for the balance.','Settle for <code>amount_authorized</code>. The clearing record must not exceed it; the network rejects the line otherwise.'],
      code:'<span class="c">// after the response lands</span>\nconst approved =\n  auth.decision === "partial"\n    ? auth.amountAuthorized  <span class="c">// 4000</span>\n    : auth.amount;\n\niso.set(4, approved);      <span class="c">// DE4</span>\niso.set(95, auth.amount);  <span class="c">// DE95</span>',
      call:'Partial approvals are mandatory for fuel, prepaid and transit merchants. Three of your certification cases exercise them.' },
    events:{ crumbs:['Event reference','Delivery'], title:'Events, signatures and retries',
      intro:'Six events reach your endpoint within a second of happening, each signed with your endpoint’s secret. Your handler verifies the signature, answers 200 fast, and does the work after.',
      here:'Your staging endpoint receives all six events. The production endpoint gets a secret of its own at readiness, so staging and production can never verify each other’s events.',
      table:{cols:['Event','When','Carries'], rows:[
        ['<code>authorization.decisioned</code>','within a second of the answer','decision, response code, round trip'],
        ['<code>dispute.opened</code>','when a cardholder disputes','reason code, your clock'],
        ['<code>settlement.posted</code>','about 6:00 AM Eastern','net, wire reference'],
        ['<code>certificate.expiring</code>','30 days ahead','read from your handshake']]},
      walkTitle:'Walkthrough · verify a delivery',
      walk:['Read the <code>DGN-Signature</code> header: a timestamp and an HMAC of the raw body.','Compute the HMAC with your signing secret over <code>timestamp.body</code> and compare in constant time.','Reject anything older than five minutes, answer 200, then process. A non-200 is retried at 6m, 12m, 1h, 6h, 24h and 48h.'],
      code:'const [t, sig] = parse(req.headers["dgn-signature"]);\nconst mac = hmac(secret, t + "." + rawBody);\nif (!safeEqual(mac, sig) || age(t) > 300) {\n  return res.status(400).end();\n}\nres.status(200).end();   <span class="c">// then do the work</span>',
      call:'Four of your certification cases check delivery, signature and retries.' },
    mtls:{ crumbs:['Connect','Connectivity'], title:'Mutual TLS and the chain',
      intro:'Your host and the network each prove who they are before an authorization moves. Your side presents a certificate chain from your CA; the network checks it against the root and the allowlist.',
      here:'The handshake can only run once three things exist: the allowlist for 203.0.113.0/24, the chain from Brightline Issuing CA 2, and your network team’s firewall change.',
      table:{cols:['What the handshake checks','Where it comes from','If it fails'], rows:[
        ['Your source address','the allowlist, from Marcus','connection refused'],
        ['Your leaf certificate','your CA, from the signing request','bad certificate'],
        ['The chain to the root','leaf, intermediate, root, in order','unable to get local issuer certificate'],
        ['Expiry','read on the first handshake','reminder 30 days ahead']]},
      walkTitle:'Walkthrough · connectivity, end to end',
      walk:['Send the signing request to your CA and the allowlist request to the network on day one; both take one to two weeks.','When the chain arrives, put it in order: leaf first, root last. Most clients accept one link short; the network does not.','Upload it, add the staging endpoint, and the network tries the handshake from your range at once.'],
      code:'1  CN=staging.brightline.example   leaf\n2  CN=Brightline Issuing CA 2       intermediate\n3  CN=Brightline Root CA            root\n\n<span class="c"># check before you upload</span>\nopenssl verify -CAfile root.pem -untrusted int.pem leaf.pem',
      call:'Production uses its own chain, full to the root, uploaded at readiness.' },
    cases:{ crumbs:['Certification','Cases'], title:'Certification cases and rounds',
      intro:'The cases come from the configuration you confirm, so nothing generic is tested. You run them as often as you like; a round you submit goes to Ana Okafor for review.',
      here:'Round 1 failed three cases on one rule: your host rounds half a cent up and the network settles half-even. One configuration value fixes all three.',
      table:{cols:['Group','Cases','What it proves'], rows:[
        ['Authorization','9','approvals, declines, reversals'],
        ['Events','4','delivery, signature, retries'],
        ['Settlement','5','file, totals, the wire reference'],
        ['Disputes','3','open, evidence, close']]},
      walkTitle:'Walkthrough · from run to sign-off',
      walk:['Run the cases from your host or your agent; failures open to the request that failed.','Fix and rerun until the run is clean, then submit the round. Ana reviews within three business days.','Answer her comments, run round 2, and confirm the window, Apr 20 to 24, where she validates end to end.'],
      code:'<span class="c"># the rounding rule the network applies</span>\n1,234.5 cents  →  1,234   <span class="c">half-even</span>\n1,235.5 cents  →  1,236',
      call:'Changing a configuration value later regenerates only the cases it touches.' },
    settle:{ crumbs:['Settlement','The daily file'], title:'The settlement file and reconciliation',
      intro:'Settlement is final about 6:00 AM Eastern. The daily file lands on your SFTP drop in the layout your ledger reads, and <code>settlement.posted</code> carries the same totals with the wire reference.',
      here:'Leah Park signs the reconciliation checklist before certification. During the ramp, each step waits for the first file after it to reconcile.',
      table:{cols:['File field','Ledger entry','Check'], rows:[
        ['<code>net_amount</code>','settlement receivable','equals the sum of lines'],
        ['<code>interchange</code>','fee expense','by card product'],
        ['<code>wire_reference</code>','cash in transit','matches the bank statement'],
        ['<code>file_timestamp</code>','posting date','UTC, not local time']]},
      walkTitle:'Walkthrough · reconcile the first file',
      walk:['Sum the lines and compare with <code>net_amount</code> in the trailer.','Match the wire reference against the bank statement the same morning.','Post by the file timestamp in UTC; local time puts the file on the wrong day.'],
      code:'HDR 2026-05-15T10:00:00Z  BRIGHTLINE\nLIN 4471 5820 USD contactless\nLIN 4472 1299 USD ecommerce\nTRL net 1,440,000.00  wire WR-88213',
      call:'Ana’s second comment in round 1 was a local-time header. The network reads UTC.' },
    ramp:{ crumbs:['Launch','The ramp'], title:'The ramp, thresholds and reroute',
      intro:'Traffic moves from the gateway to the network in steps: one merchant, then 10%, 50% and 100%. Each step waits for the next morning’s settlement file to reconcile, and the gateway stays as the fallback.',
      here:'The pilot is Marlow & Third from 6:00 AM on May 14. Reroute to the gateway is always on screen during the ramp.',
      table:{cols:['Measure','Threshold','If it is crossed'], rows:[
        ['Approval rate','within 0.5 points of the gateway','reroute prepared'],
        ['Round trip, p99','under 120 ms','reroute prepared'],
        ['Delivery acknowledgement','under 2 s','reroute prepared'],
        ['First file','reconciles','the next step waits']]},
      walkTitle:'Walkthrough · one ramp step',
      walk:['Route the cohort from 6:00 AM and watch the four measures against the gateway’s baseline.','The next morning, confirm the first file reconciled at 6:14 AM.','Approve the next step, or reroute: traffic is back on the gateway within a minute and the step can be retried.'],
      code:'pilot   May 14   Marlow & Third\n10%     May 18\n50%     May 21\n100%    May 26   hypercare to Jun 9\nretire  Sep 23   the gateway',
      call:'The gateway is retired 120 days after 100%, once late refunds and disputes have cleared.' }
  };
  var refs={
    route:['mtls','auth'], why:['mtls'], d0:['mtls'], leadtimes:['mtls'], waiting:['mtls'], wait_conn:['mtls'],
    s1:['auth'], first:['auth'], agents:['auth'], scope:['auth'], mapmsg:['auth'], mismatch:['auth'],
    s3:['events'], local:['events'],
    office:['settle'], ledger:['settle'], wait_fin:['settle'],
    s4:['mtls'], mtls:['mtls'], fix:['mtls'],
    s5:['cases'], cases:['cases'], s6:['cases'], fail:['cases'], review:['cases','settle'], wait_ana:['cases'],
    s7:['ramp'], morning:['ramp'], wait_prod:['ramp'],
    ramp:['ramp'], thresholds:['ramp'], wait_file:['ramp','settle'], operate:['ramp']
  };
  return {pages:pages, refs:refs};
})();
