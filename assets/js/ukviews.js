/* Ukreate screen renderers. Every view builds from window.UK so the whole
   preview stays consistent. Returns HTML strings; ukapp.js mounts them. */
window.UKV = (function () {
  var D = window.UK;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); };
  var head = function (t, s) { return '<div class="ukPageHead"><h2>' + t + '</h2>' + (s ? '<p>' + s + '</p>' : '') + '</div>'; };
  var plat = { ig:'Instagram', tt:'TikTok', yt:'YouTube' };

  function stageBar(stage) {
    return '<ol class="ukStage">' + D.STAGES.map(function (s, i) {
      var cls = i < stage ? 'is-done' : i === stage ? 'is-now' : '';
      return '<li class="' + cls + '"><span class="ukStage_dot">' + (i < stage ? '&#10003;' : i + 1) + '</span><span class="ukStage_lb">' + s + '</span></li>';
    }).join('') + '</ol>';
  }

  /* ---------------- creator: find hotels (Pitch Pilot) ---------------- */
  function pitch(st) {
    var q = (st.q || '').toLowerCase();
    var list = D.hotels.filter(function (h) {
      return !q || (h.n + ' ' + h.loc).toLowerCase().indexOf(q) > -1;
    }).sort(function (a, b) { return b.score - a.score; });

    return head('Find hotels worth pitching',
      'Search a destination, see which properties are open to creators, and generate a pitch you can send today.') +
    '<div class="ukToolbar">' +
      '<label class="ukSearch"><span data-icon="search"></span>' +
      '<input type="search" placeholder="Try Alaska, Miami, Marrakesh" value="' + esc(st.q || '') + '" data-q aria-label="Search destinations"></label>' +
      '<span class="ukCount">' + list.length + ' properties</span></div>' +
    (list.length ? '<div class="ukCards">' + list.map(hotelCard).join('') + '</div>'
      : empty('No properties match that search', 'Try a city, a region or a country. Broader searches surface more properties.'));
  }

  function hotelCard(h) {
    return '<article class="ukCard">' +
      '<div class="ukCard_top"><div><h3 class="ukCard_t">' + esc(h.n) + '</h3><p class="ukCard_sub">' + esc(h.loc) + '</p></div>' +
      '<span class="ukScore' + (h.score >= 9 ? ' is-hot' : '') + '">' + h.score + '<em>/10</em></span></div>' +
      '<dl class="ukFacts">' +
        '<div><dt>Best season</dt><dd>' + h.season + '</dd></div>' +
        '<div><dt>Google rating</dt><dd>' + h.rating + ' (' + h.reviews + ')</dd></div>' +
      '</dl>' +
      '<p class="ukContact">' + (h.email
        ? '<span data-icon="chat"></span> ' + esc(h.email) + (h.verified ? ' <span class="ukVerified">verified</span>' : '')
        : '<span class="ukMuted">No public email. Use their contact form or DM.</span>') + '</p>' +
      '<p class="ukCard_lb">Content angles</p><div class="ukChips">' + h.angles.map(function (a) { return '<span class="ukChip">' + esc(a) + '</span>'; }).join('') + '</div>' +
      '<button class="ukBtn ukCard_cta" type="button" data-pitch="' + h.id + '">Generate pitch</button>' +
    '</article>';
  }

  function pitchOut(h) {
    var tones = [
      { n:'Direct and confident', tx:'Hi ' + h.n + ' team,\n\nI am a travel creator with an audience that plans trips around exactly the kind of stay you offer in ' + h.loc + '. I would like to propose a hosted stay in exchange for a set of video and photo content you keep and use however you like.\n\nI can work to your brief and deliver within ten days of checkout. Happy to send my media kit and recent hotel work.\n\nBest,\nRobert' },
      { n:'Value led',            tx:'Hello,\n\nQuick one. Your ' + h.season.toLowerCase() + ' season is the window where content earns the most, and right now most of what exists for ' + h.n + ' is guest phone footage.\n\nI produce hotel content that properties use across their own channels and booking pages. In exchange for a stay you get a full set of assets with usage rights included.\n\nWould it be worth a short call?\n\nRobert' },
      { n:'Storytelling',         tx:'Hi,\n\nI have been putting together a series on ' + h.loc + ' and ' + h.n + ' keeps coming up. The angle I keep returning to is "' + h.angles[0].toLowerCase() + '", which is a story your property tells better than anywhere else nearby.\n\nI would love to come and shoot it. Hosted stay in exchange for the full set of content, yours to keep.\n\nRobert' }
    ];
    return '<div class="ukPitch">' +
      '<div class="ukPitch_head"><div><h3 class="ukPanel_title">Pitch for ' + esc(h.n) + '</h3>' +
      '<p class="ukCard_sub">' + (h.email ? 'Send to ' + esc(h.email) : 'No public email, use the Instagram DM below') + '</p></div>' +
      '<button class="ukGhost" type="button" data-closepitch>Close</button></div>' +
      '<div class="ukTones">' + tones.map(function (t, i) {
        return '<button class="ukTone' + (i === 0 ? ' is-on' : '') + '" type="button" data-tone="' + i + '">' + t.n + '</button>';
      }).join('') + '</div>' +
      tones.map(function (t, i) {
        return '<div class="ukPitch_body" data-tonebody="' + i + '"' + (i ? ' hidden' : '') + '><pre>' + esc(t.tx) + '</pre>' +
          '<button class="ukBtn" type="button" data-copy="' + i + '">Copy this pitch</button></div>';
      }).join('') +
    '</div>';
  }

  /* ---------------- creator: browse campaigns ---------------- */
  function browse(st) {
    var f = st.cat || 'all';
    var list = D.campaigns.filter(function (k) { return k.status === 'live' && (f === 'all' || k.cat === f); });
    var cats = ['all'].concat(D.campaigns.filter(function (k) { return k.status === 'live'; })
      .map(function (k) { return k.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));

    return head('Campaigns open to you',
      'Hotels actively looking for creators right now. Applying takes one message and they reply inside the platform.') +
    '<div class="ukToolbar"><div class="ukFilters">' + cats.map(function (c) {
      return '<button class="ukFilter' + (c === f ? ' is-on' : '') + '" type="button" data-cat="' + esc(c) + '">' + (c === 'all' ? 'All categories' : esc(c)) + '</button>';
    }).join('') + '</div><span class="ukCount">' + list.length + ' open</span></div>' +
    (list.length ? '<div class="ukCards">' + list.map(campaignCard).join('') + '</div>'
      : empty('Nothing open in that category', 'Try another category. New campaigns are posted most weeks.'));
  }

  function campaignCard(k) {
    return '<article class="ukCard">' +
      '<div class="ukCard_top"><div><h3 class="ukCard_t">' + esc(k.t) + '</h3><p class="ukCard_sub">' + esc(k.prop) + ' &middot; ' + esc(k.loc) + '</p></div>' +
      '<span class="ukTag ukTag--' + (k.status === 'live' ? 'you' : k.status === 'pending' ? 'wait' : 'done') + '">' + k.status + '</span></div>' +
      '<dl class="ukFacts">' +
        '<div><dt>Dates</dt><dd>' + k.from.slice(0, 6) + ' to ' + k.to.slice(0, 6) + '</dd></div>' +
        '<div><dt>Audience</dt><dd>' + k.aud + '</dd></div>' +
        '<div><dt>Type</dt><dd>' + k.type + '</dd></div>' +
        '<div><dt>Includes</dt><dd>' + k.inc + '</dd></div>' +
      '</dl>' +
      '<p class="ukCard_lb">Deliverables</p><div class="ukChips">' + k.del.map(function (d) {
        return '<span class="ukChip">' + d.q + ' &times; ' + esc(d.t) + '</span>'; }).join('') + '</div>' +
      (D.applied[k.id]
        ? '<div class="ukApplied"><p class="ukApplied_t">Application sent</p>' +
          '<p class="ukApplied_s">The hotel replies inside Collaborations. You will see it under Applied.</p>' +
          '<button class="ukGhost ukCard_cta" type="button" data-openthread="' + D.applied[k.id] + '">View conversation</button></div>'
        : '<button class="ukBtn ukCard_cta" type="button" data-apply="' + k.id + '">Apply to this campaign</button>') +
    '</article>';
  }

  function applyForm(k) {
    var d = k.del.map(function (x) { return x.q + ' \u00d7 ' + x.t; }).join(', ');
    return '<div class="ukPitch ukApply">' +
      '<div class="ukPitch_head"><div><h3 class="ukPanel_title">Apply to ' + esc(k.t) + '</h3>' +
      '<p class="ukCard_sub">' + esc(k.prop) + ', ' + esc(k.loc) + '</p></div>' +
      '<button class="ukGhost" type="button" data-closeapply>Cancel</button></div>' +
      '<label class="ukField"><span class="ukField_l">Why you are a fit</span>' +
      '<textarea class="ukField_i" rows="4" data-applymsg>I would love to cover ' + esc(k.prop) +
      '. My audience plans trips around exactly this kind of stay, and I can deliver ' + esc(d) +
      ' within ten days of checkout.</textarea></label>' +
      '<label class="ukField"><span class="ukField_l">Dates that work for you</span>' +
      '<input class="ukField_i" data-applydates value="' + esc(k.from) + ' to ' + esc(k.to) + '"></label>' +
      '<p class="ukCard_lb">You are committing to</p><div class="ukChips">' + k.del.map(function (x) {
        return '<span class="ukChip">' + x.q + ' &times; ' + esc(x.t) + '</span>'; }).join('') + '</div>' +
      '<p class="ukLead">The hotel sees your profile, your numbers and this message.</p>' +
      '<button class="ukBtn" type="button" data-sendapply="' + k.id + '">Send application</button>' +
    '</div>';
  }

  /* ---------------- brand: your campaigns ---------------- */
  function myCampaigns(st) {
    var f = st.status || 'all';
    var list = D.campaigns.filter(function (k) { return f === 'all' || k.status === f; });
    return head('Your campaigns',
      'Every campaign you have posted, with the applications waiting on each one.') +
    '<div class="ukToolbar"><div class="ukFilters">' + ['all', 'live', 'pending', 'draft', 'closed'].map(function (s) {
      return '<button class="ukFilter' + (s === f ? ' is-on' : '') + '" type="button" data-status="' + s + '">' + (s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)) + '</button>';
    }).join('') + '</div><button class="ukBtn" type="button" data-newcamp>Create campaign</button></div>' +
    (list.length ? '<div class="ukCards">' + list.map(function (k) {
      return '<article class="ukCard">' +
        '<div class="ukCard_top"><div><h3 class="ukCard_t">' + esc(k.t) + '</h3><p class="ukCard_sub">' + esc(k.loc) + '</p></div>' +
        '<span class="ukTag ukTag--' + (k.status === 'live' ? 'you' : k.status === 'pending' ? 'wait' : 'done') + '">' + k.status + '</span></div>' +
        '<dl class="ukFacts">' +
          '<div><dt>Applications</dt><dd>' + k.apps + '</dd></div>' +
          '<div><dt>Dates</dt><dd>' + k.from.slice(0, 6) + ' to ' + k.to.slice(0, 6) + '</dd></div>' +
          '<div><dt>Type</dt><dd>' + k.type + '</dd></div>' +
          '<div><dt>Includes</dt><dd>' + k.inc + '</dd></div>' +
        '</dl>' +
        '<p class="ukCard_lb">Deliverables</p><div class="ukChips">' + k.del.map(function (d) {
          return '<span class="ukChip">' + d.q + ' &times; ' + esc(d.t) + '</span>'; }).join('') + '</div>' +
        '<button class="ukGhost ukCard_cta" type="button" data-goto="inbox">View ' + k.apps + ' applications</button>' +
      '</article>';
    }).join('') + '</div>' : empty('No campaigns with that status', 'Switch the filter, or create a campaign to start receiving applications.'));
  }

  /* ---------------- brand: create a campaign ---------------- */
  var CATS = ['Wellness & Fitness','Food & Beverage','Luxury & Lifestyle','Travel & Adventure',
              'Hotel & Resort UGC','Eco & Wellness','Sports & Outdoors','Entertainment'];
  var TYPES = ['Hosted experience','Hosted + creative fee','Paid creator campaign'];
  var INCS  = ['Room only','Room + meals','Full experience'];
  var AUDS  = ['<25K','25K-50K','50K-100K','100K-250K','250K-500K','1M+'];
  var DELS  = ['UGC Video','Photos','Instagram Reels','TikTok','Stories','Long-form content'];

  function chips(name, list, picked, multi) {
    return '<div class="ukChoice">' + list.map(function (v) {
      var on = multi ? (picked || []).indexOf(v) > -1 : picked === v;
      return '<button class="ukPick' + (on ? ' is-on' : '') + '" type="button" data-pick="' + name +
             '" data-val="' + esc(v) + '">' + esc(v) + '</button>';
    }).join('') + '</div>';
  }

  function newCampaign(st) {
    var f = st.form = st.form || { del: {}, cat:'', type:'', inc:'', aud:'' };
    var missing = [];
    if (!f.t) missing.push('a campaign name');
    if (!f.prop) missing.push('the property name');
    if (!f.loc) missing.push('a location');
    if (!f.cat) missing.push('a category');
    if (!f.type) missing.push('a campaign type');
    if (!f.inc) missing.push('what is included');
    if (!f.aud) missing.push('an audience size');
    if (!Object.keys(f.del).length) missing.push('at least one deliverable');
    if (!f.from || !f.to) missing.push('your dates');

    return '<button class="ukBack" type="button" data-goto="campaigns">&larr; Your campaigns</button>' +
      head('Host a creator', 'Post what you are offering and creators apply to you. Everything marked required has to be filled before it can go live.') +
      '<div class="ukGrid ukGrid--thread"><div>' +

      '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">The basics</h3></div>' +
        '<label class="ukField"><span class="ukField_l">Campaign name <em class="ukReq">required</em></span>' +
        '<input class="ukField_i" data-f="t" value="' + esc(f.t || '') + '" placeholder="Summer wellness week"></label>' +
        '<label class="ukField"><span class="ukField_l">Property name <em class="ukReq">required</em></span>' +
        '<input class="ukField_i" data-f="prop" value="' + esc(f.prop || '') + '" placeholder="The name guests book under"></label>' +
        '<label class="ukField"><span class="ukField_l">Location <em class="ukReq">required</em></span>' +
        '<input class="ukField_i" data-f="loc" value="' + esc(f.loc || '') + '" placeholder="Miami, Florida, United States"></label>' +
        '<p class="ukField_l">Category <em class="ukReq">required</em></p>' + chips('cat', CATS, f.cat) +
      '</div>' +

      '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Who you want</h3></div>' +
        '<p class="ukField_l">Audience size <em class="ukReq">required</em></p>' + chips('aud', AUDS, f.aud) +
        '<p class="ukField_l" style="margin-top:18px">Deliverables <em class="ukReq">required</em></p>' +
        '<div class="ukDels">' + DELS.map(function (d) {
          var q = f.del[d] || 0;
          return '<div class="ukDel' + (q ? ' is-on' : '') + '"><span class="ukDel_n">' + esc(d) + '</span>' +
            '<span class="ukStep"><button type="button" data-del="' + esc(d) + '" data-dir="-1" aria-label="Fewer">&minus;</button>' +
            '<b>' + q + '</b>' +
            '<button type="button" data-del="' + esc(d) + '" data-dir="1" aria-label="More">+</button></span></div>';
        }).join('') + '</div>' +
        '<label class="ukField" style="margin-top:18px"><span class="ukField_l">What you expect back</span>' +
        '<textarea class="ukField_i" rows="3" data-f="exp" placeholder="Lead with the rooftop at golden hour and include the spa.">' + esc(f.exp || '') + '</textarea></label>' +
      '</div>' +

      '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Terms and dates</h3></div>' +
        '<p class="ukField_l">Campaign type <em class="ukReq">required</em></p>' + chips('type', TYPES, f.type) +
        '<p class="ukField_l" style="margin-top:18px">What is included <em class="ukReq">required</em></p>' + chips('inc', INCS, f.inc) +
        '<div class="ukFacts" style="margin-top:18px">' +
          '<label class="ukField"><span class="ukField_l">Start date <em class="ukReq">required</em></span>' +
          '<input class="ukField_i" type="date" data-f="from" value="' + esc(f.from || '') + '"></label>' +
          '<label class="ukField"><span class="ukField_l">End date <em class="ukReq">required</em></span>' +
          '<input class="ukField_i" type="date" data-f="to" value="' + esc(f.to || '') + '"></label>' +
        '</div>' +
      '</div></div>' +

      '<div class="ukPanel ukSticky"><div class="ukPanel_head"><h3 class="ukPanel_title">Preview</h3></div>' +
        '<dl class="ukFacts ukFacts--stack">' +
          '<div><dt>Name</dt><dd>' + esc(f.t || 'Not set yet') + '</dd></div>' +
          '<div><dt>Property</dt><dd>' + esc(f.prop || 'Not set yet') + '</dd></div>' +
          '<div><dt>Location</dt><dd>' + esc(f.loc || 'Not set yet') + '</dd></div>' +
          '<div><dt>Type</dt><dd>' + esc(f.type || 'Not set yet') + '</dd></div>' +
          '<div><dt>Includes</dt><dd>' + esc(f.inc || 'Not set yet') + '</dd></div>' +
          '<div><dt>Audience</dt><dd>' + esc(f.aud || 'Not set yet') + '</dd></div>' +
        '</dl>' +
        '<p class="ukCard_lb">Deliverables</p><div class="ukChips">' +
          (Object.keys(f.del).length ? Object.keys(f.del).map(function (d) {
            return '<span class="ukChip">' + f.del[d] + ' &times; ' + esc(d) + '</span>'; }).join('')
            : '<span class="ukChip">None chosen yet</span>') + '</div>' +
        (missing.length
          ? '<p class="ukMissing">Still needed: ' + missing.join(', ') + '.</p>'
          : '<p class="ukLead">Ready to go live.</p>') +
        '<button class="ukBtn ukCard_cta" type="button" data-publish' + (missing.length ? ' disabled' : '') + '>Publish campaign</button>' +
      '</div></div>';
  }

  /* ---------------- brand: find creators ---------------- */
  function rolodex(st) {
    var q = (st.q || '').toLowerCase(), pf = st.plat || 'all', nf = st.niche || 'all';
    var list = D.creators.filter(function (c) {
      if (q && (c.n + ' ' + c.h + ' ' + c.loc).toLowerCase().indexOf(q) < 0) return false;
      if (pf !== 'all' && c.p.indexOf(pf) < 0) return false;
      if (nf !== 'all' && c.niche !== nf) return false;
      return true;
    });
    var niches = ['all'].concat(D.creators.map(function (c) { return c.niche; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));

    return head('Find creators',
      'The full network. Filter by platform, niche or audience, then contact anyone directly.') +
    '<div class="ukToolbar">' +
      '<label class="ukSearch"><span data-icon="search"></span>' +
      '<input type="search" placeholder="Search name, handle or city" value="' + esc(st.q || '') + '" data-q aria-label="Search creators"></label>' +
      '<span class="ukCount">' + list.length + ' of ' + D.creators.length + '</span></div>' +
    '<div class="ukToolbar"><div class="ukFilters">' +
      [['all','All platforms'],['ig','Instagram'],['tt','TikTok'],['yt','YouTube']].map(function (p) {
        return '<button class="ukFilter' + (p[0] === pf ? ' is-on' : '') + '" type="button" data-plat="' + p[0] + '">' + p[1] + '</button>'; }).join('') +
      '</div></div>' +
    '<div class="ukToolbar"><div class="ukFilters">' + niches.map(function (n) {
      return '<button class="ukFilter' + (n === nf ? ' is-on' : '') + '" type="button" data-niche="' + esc(n) + '">' + (n === 'all' ? 'All niches' : esc(n)) + '</button>'; }).join('') +
      '</div></div>' +
    (list.length ? '<div class="ukCards">' + list.map(function (c) {
      return '<article class="ukCard">' +
        '<div class="ukCard_top"><div class="ukWho"><span class="ukList_av">' + D.initials(c.n) + '</span>' +
        '<div><h3 class="ukCard_t">' + esc(c.n) + '</h3><p class="ukCard_sub">' + esc(c.h) + ' &middot; ' + esc(c.loc) + '</p></div></div></div>' +
        '<dl class="ukFacts">' +
          '<div><dt>Followers</dt><dd>' + D.fmt(c.f) + '</dd></div>' +
          '<div><dt>Rating</dt><dd>' + c.rating.toFixed(1) + ' from ' + c.jobs + ' jobs</dd></div>' +
          '<div><dt>Turnaround</dt><dd>' + c.turn + '</dd></div>' +
          '<div><dt>Fee</dt><dd>' + (c.rate ? '$' + c.rate : 'Hosted only') + '</dd></div>' +
        '</dl>' +
        '<p class="ukCard_body">' + esc(c.bio) + '</p>' +
        '<div class="ukChips">' + c.p.map(function (p) { return '<span class="ukChip">' + plat[p] + '</span>'; }).join('') +
        '<span class="ukChip">' + esc(c.niche) + '</span></div>' +
        '<button class="ukBtn ukCard_cta" type="button" data-contact="' + c.id + '">Contact ' + esc(c.n.split(' ')[0]) + '</button>' +
      '</article>';
    }).join('') + '</div>' : empty('No creators match those filters', 'Clear a filter or widen the platform to see more of the network.'));
  }

  /* ---------------- both: collaborations ---------------- */
  function inbox(st, role) {
    if (st.thread) return thread(st, role);
    var f = st.stageF == null ? 'all' : st.stageF;
    var list = D.threads.filter(function (t) { return f === 'all' || t.stage === +f; });
    return head('Collaborations',
      'Every conversation, and exactly whose turn it is. Filter by stage to see any step of the flow.') +
    '<div class="ukToolbar"><div class="ukFilters">' +
      '<button class="ukFilter' + (f === 'all' ? ' is-on' : '') + '" type="button" data-stage="all">All</button>' +
      D.STAGES.map(function (s, i) {
        var n = D.threads.filter(function (t) { return t.stage === i; }).length;
        return '<button class="ukFilter' + (String(f) === String(i) ? ' is-on' : '') + '" type="button" data-stage="' + i + '">' + s + (n ? ' (' + n + ')' : '') + '</button>';
      }).join('') + '</div></div>' +
    (list.length ? '<div class="ukPanel"><ul class="ukList ukList--rows">' + list.map(function (t) {
      var c = D.creator(t.who), k = D.campaign(t.camp);
      var who = role === 'brand' ? c.n : k.prop;
      var mine = role === 'brand' ? (t.stage === 0 || t.stage === 5) : (t.stage === 1 || t.stage === 3);
      return '<li data-thread="' + t.id + '" tabindex="0" role="button">' +
        '<span class="ukList_av">' + D.initials(who) + '</span>' +
        '<span class="ukList_body"><span class="ukList_name">' + esc(who) + (t.unread ? ' <em class="ukDot">' + t.unread + '</em>' : '') + '</span>' +
        '<span class="ukList_meta">' + esc(k.t) + ' &middot; ' + esc(t.msgs[t.msgs.length - 1].tx.slice(0, 62)) + '&hellip;</span></span>' +
        '<span class="ukWhen">' + t.when + '</span>' +
        '<span class="ukTag ukTag--' + (t.stage === 7 ? 'done' : mine ? 'you' : 'wait') + '">' + D.STAGES[t.stage] + '</span></li>';
    }).join('') + '</ul></div>' : empty('Nothing at that stage', 'Nothing is sitting at that stage right now. Pick another to see what is moving.'));
  }

  function thread(st, role) {
    var t = D.threads.filter(function (x) { return x.id === st.thread; })[0];
    var c = D.creator(t.who), k = D.campaign(t.camp);
    return '<button class="ukBack" type="button" data-back>&larr; All collaborations</button>' +
      '<div class="ukPageHead"><h2>' + esc(role === 'brand' ? c.n : k.prop) + '</h2><p>' + esc(k.t) + ' at ' + esc(k.prop) + ', ' + esc(k.loc) + '</p></div>' +
      '<div class="ukPanel">' + stageBar(t.stage) + '</div>' +
      '<div class="ukGrid ukGrid--thread">' +
        '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Conversation</h3></div>' +
          '<div class="ukMsgs">' + t.msgs.map(function (m) {
            return '<div class="ukMsg' + (m.by === 'me' ? ' is-me' : '') + '"><p class="ukMsg_tx">' + esc(m.tx).replace(/\n/g, '<br>') + '</p>' +
              '<p class="ukMsg_at">' + (m.by === 'me' ? 'You' : esc(c.n.split(' ')[0])) + ' &middot; ' + m.at + '</p></div>';
          }).join('') + '</div>' +
          '<div class="ukCompose"><textarea rows="3" placeholder="Write a reply" aria-label="Write a reply"></textarea>' +
          '<button class="ukBtn" type="button" data-send>Send reply</button></div>' +
        '</div>' +
        '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">' + (role === 'brand' ? 'The creator' : 'The campaign') + '</h3></div>' +
          (role === 'brand'
            ? '<dl class="ukFacts ukFacts--stack">' +
                '<div><dt>Handle</dt><dd>' + esc(c.h) + '</dd></div>' +
                '<div><dt>Followers</dt><dd>' + D.fmt(c.f) + '</dd></div>' +
                '<div><dt>Based in</dt><dd>' + esc(c.loc) + '</dd></div>' +
                '<div><dt>Rating</dt><dd>' + c.rating.toFixed(1) + ' from ' + c.jobs + ' jobs</dd></div>' +
                '<div><dt>Fee</dt><dd>' + (c.rate ? '$' + c.rate : 'Hosted only') + '</dd></div></dl>' +
              '<p class="ukCard_body">' + esc(c.bio) + '</p>'
            : '<dl class="ukFacts ukFacts--stack">' +
                '<div><dt>Property</dt><dd>' + esc(k.prop) + '</dd></div>' +
                '<div><dt>Dates</dt><dd>' + k.from + ' to ' + k.to + '</dd></div>' +
                '<div><dt>Type</dt><dd>' + k.type + '</dd></div>' +
                '<div><dt>Includes</dt><dd>' + k.inc + '</dd></div></dl>') +
          '<p class="ukCard_lb">Deliverables</p><div class="ukChips">' + k.del.map(function (d) {
            return '<span class="ukChip">' + d.q + ' &times; ' + esc(d.t) + '</span>'; }).join('') + '</div>' +
          (t.stage < 7 ? '<p class="ukLead">Next step in the flow</p><button class="ukBtn ukCard_cta" type="button" data-advance="' + t.id + '">' + nextAction(t.stage, role) + '</button>' : '') +
        '</div>' +
      '</div>';
  }

  function nextAction(stage, role) {
    var brand = ['Send an offer', 'Waiting on the creator', 'Confirm the dates', 'Send the brief', 'Mark the stay complete', 'Review the content', 'Approve and close', 'Complete'];
    var crea  = ['Waiting on the hotel', 'Accept the offer', 'Send your dates', 'Accept the brief', 'Confirm your arrival', 'Submit your content', 'Waiting on review', 'Complete'];
    return (role === 'brand' ? brand : crea)[stage];
  }

  /* ---------------- creator: academy ---------------- */
  function academy() {
    var done = D.academy.filter(function (l) { return l.done; }).length;
    var pct = Math.round(done / D.academy.length * 100);
    var mods = D.academy.map(function (l) { return l.mod; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    return head('Creator Academy',
      'The training that comes with Creator Pro. Work through it in order or jump to what you need.') +
      '<div class="ukPanel ukProgWrap"><div class="ukPanel_head"><h3 class="ukPanel_title">Your progress</h3>' +
      '<span class="ukCount">' + done + ' of ' + D.academy.length + ' complete</span></div>' +
      '<div class="ukProg"><span style="width:' + pct + '%"></span></div></div>' +
      mods.map(function (m) {
        return '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">' + esc(m) + '</h3></div>' +
          '<ul class="ukList">' + D.academy.filter(function (l) { return l.mod === m; }).map(function (l) {
            return '<li><span class="ukList_av' + (l.done ? ' is-done' : '') + '">' + (l.done ? '&#10003;' : '&#9654;') + '</span>' +
              '<span class="ukList_body"><span class="ukList_name">' + esc(l.t) + '</span><span class="ukList_meta">' + esc(l.d) + '</span></span>' +
              '<span class="ukWhen">' + l.len + '</span>' +
              '<button class="ukGhost" type="button">' + (l.done ? 'Rewatch' : 'Start') + '</button></li>';
          }).join('') + '</ul></div>';
      }).join('');
  }

  /* ---------------- profiles ---------------- */
  function profile(st, role) {
    if (role === 'brand') {
      return head('Property profile', 'What creators see when they open your property. This is the page your campaigns link back to.') +
        '<div class="ukGrid">' +
        '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Property details</h3></div>' +
          field('Property name', 'Miami Hotel') + field('Location', 'Miami, Florida, United States') +
          field('Property type', 'Resort') + field('Category', 'Wellness & Fitness') +
          fieldArea('About the property', 'A wellness led resort ten minutes from the water, built around a spa, two restaurants and a rooftop pool.') +
        '</div>' +
        '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">How creators see you</h3></div>' +
          '<dl class="ukFacts ukFacts--stack">' +
            '<div><dt>Campaigns posted</dt><dd>9</dd></div>' +
            '<div><dt>Creators hosted</dt><dd>9</dd></div>' +
            '<div><dt>Average reply time</dt><dd>2 days</dd></div>' +
            '<div><dt>Rating from creators</dt><dd>4.6 from 9 stays</dd></div></dl>' +
          '<p class="ukCard_body">Properties that reply within two days receive roughly three times the applications. Yours is currently above average.</p>' +
        '</div></div>';
    }
    return head('Your profile', 'This is what hotels see when you apply. Everything here is used to rank you in the creator network.') +
      '<div class="ukGrid">' +
      '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Public profile</h3></div>' +
        field('Display name', 'Robert Torres') + field('Instagram handle', '@roborobt') +
        field('Based in', 'Miami, Florida') + field('Niche', 'Luxury & Lifestyle') +
        fieldArea('Bio', 'Travel creator covering design led hotels and resorts. Content delivered within ten days of checkout, raw files always included.') +
      '</div>' +
      '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Your numbers</h3></div>' +
        '<dl class="ukFacts ukFacts--stack">' +
          '<div><dt>Instagram</dt><dd>48.2K followers</dd></div>' +
          '<div><dt>TikTok</dt><dd>112K followers</dd></div>' +
          '<div><dt>Average views</dt><dd>36K per post</dd></div>' +
          '<div><dt>Reply rate from hotels</dt><dd>38%</dd></div>' +
          '<div><dt>Stays completed</dt><dd>7</dd></div></dl>' +
        '<p class="ukCard_body">Verified numbers refresh weekly from your connected accounts.</p>' +
      '</div></div>';
  }

  function field(l, v) { return '<label class="ukField"><span class="ukField_l">' + l + '</span><input class="ukField_i" value="' + esc(v) + '"></label>'; }
  function fieldArea(l, v) { return '<label class="ukField"><span class="ukField_l">' + l + '</span><textarea class="ukField_i" rows="3">' + esc(v) + '</textarea></label>'; }

  /* ---------------- membership ---------------- */
  function plan(st, role) {
    var list = D.plans[role];
    return head(role === 'brand' ? 'Membership and billing' : 'Membership',
      role === 'brand'
        ? 'Posting campaigns is free. Access to the creator network is the paid tier.'
        : 'Creator Pro is what unlocks Pitch Pilot, the Academy and verified status.') +
      '<div class="ukCards ukCards--plans">' + list.map(function (p) {
        return '<article class="ukCard' + (p.cur ? ' is-current' : '') + '">' +
          (p.cur ? '<span class="ukCurrent">Your plan</span>' : '') +
          '<h3 class="ukCard_t">' + esc(p.n) + '</h3>' +
          '<p class="ukPrice">' + esc(p.p) + '<em>' + esc(p.per) + '</em></p>' +
          '<ul class="ukTicks">' + p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          (p.cur ? '<button class="ukGhost ukCard_cta" type="button">Manage plan</button>'
                 : '<button class="ukBtn ukCard_cta" type="button">Switch to ' + esc(p.n) + '</button>') +
        '</article>';
      }).join('') + '</div>' +
      (role === 'brand' ? '<div class="ukPanel"><div class="ukPanel_head"><h3 class="ukPanel_title">Billing</h3></div>' +
        '<ul class="ukList">' +
          '<li><span class="ukList_body"><span class="ukList_name">Hotel Access</span><span class="ukList_meta">Renews 12 August 2026</span></span><span class="ukWhen">$299.00</span></li>' +
          '<li><span class="ukList_body"><span class="ukList_name">Hotel Access</span><span class="ukList_meta">Paid 12 July 2026</span></span><span class="ukWhen">$299.00</span></li>' +
          '<li><span class="ukList_body"><span class="ukList_name">Hotel Access</span><span class="ukList_meta">Paid 12 June 2026</span></span><span class="ukWhen">$299.00</span></li>' +
        '</ul></div>' : '');
  }

  function empty(t, p) { return '<div class="ukPanel ukStub"><div class="ukEmpty"><p class="ukEmpty_t">' + t + '</p><p class="ukEmpty_p">' + p + '</p></div></div>'; }

  return {
    applyForm: applyForm,
    newCampaign: newCampaign,
    pitch: pitch, pitchOut: pitchOut, browse: browse, myCampaigns: myCampaigns,
    rolodex: rolodex, inbox: inbox, academy: academy, profile: profile, plan: plan, empty: empty
  };
})();
